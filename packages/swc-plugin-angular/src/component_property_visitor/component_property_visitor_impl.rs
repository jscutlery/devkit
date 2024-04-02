use std::collections::HashMap;

use crate::component_property_visitor::angular_prop_parser::{AngularProp, AngularPropParser};
use indoc::formatdoc;
use swc_core::ecma::ast::Ident;
use swc_core::ecma::{
    ast::Str,
    visit::{VisitMut, VisitMutWith},
};
use swc_ecma_utils::swc_ecma_ast::Stmt;
use swc_ecma_utils::{ExprFactory, IsDirective};

use crate::component_property_visitor::input_prop_parser::{InputProp, InputPropParser};
use crate::component_property_visitor::model_prop_parser::ModelPropParser;
use crate::component_property_visitor::output_prop_parser::{OutputProp, OutputPropParser};
use crate::component_property_visitor::view_child_prop_parser::{
    ViewChildProp, ViewChildPropParser,
};

#[derive(Default)]
pub struct ComponentPropertyVisitor {
    component_inputs: HashMap<Ident, Vec<InputProp>>,
    component_outputs: HashMap<Ident, Vec<OutputProp>>,
    component_view_child: HashMap<Ident, Vec<ViewChildProp>>, // Naming? I don't want to name it view_children as it refers to another thing.
    current_component: Option<Ident>,
}

impl VisitMut for ComponentPropertyVisitor {
    fn visit_mut_class_decl(&mut self, node: &mut swc_core::ecma::ast::ClassDecl) {
        /* This is not ideal as we are overwriting the `current_component` when
         * we meet another one, but it's fine as long as we don't want to handle nested
         * Angular components (i.e. a component declared in another component's methods.). */
        self.current_component = Some(node.ident.clone());
        node.visit_mut_children_with(self);
        self.current_component = None;
    }

    fn visit_mut_class_prop(&mut self, class_prop: &mut swc_core::ecma::ast::ClassProp) {
        let current_component = match &self.current_component {
            Some(current_component) => current_component,
            None => return,
        };

        /* Parse input. */
        if let Some(input_info) = InputPropParser::default().get_input_info(class_prop) {
            self.component_inputs
                .entry(current_component.clone())
                .or_default()
                .push(input_info);
        }

        /* Parse output. */
        if let Some(output_info) = OutputPropParser::default().get_output_info(class_prop) {
            self.component_outputs
                .entry(current_component.clone())
                .or_default()
                .push(output_info);
        }

        /* Parse model. */
        if let Some(model_info) = ModelPropParser::default().get_model_info(class_prop) {
            self.component_inputs
                .entry(current_component.clone())
                .or_default()
                .push(InputProp {
                    name: model_info.name.clone(),
                    required: model_info.required,
                    alias: model_info.alias.clone(),
                });
            let output_alias = if let Some(alias) = model_info.alias {
                alias
            } else {
                model_info.name.clone()
            };
            let output_alias = format!("{}Change", output_alias);
            self.component_outputs
                .entry(current_component.clone())
                .or_default()
                .push(OutputProp {
                    name: model_info.name,
                    alias: Some(output_alias),
                });
        }

        /* Parse viewChild. */
        if let Some(view_child_info) =
            ViewChildPropParser::default().parse_prop(current_component, class_prop)
        {
            self.component_view_child
                .entry(current_component.clone())
                .or_default()
                .push(view_child_info);
        }
    }

    /**
     * Visit module items and flush input decorators after class declaration.
     * `class MyCmp {}` -> `class MyCmp {} _ts_decorate(...);`
     */
    fn visit_mut_module_items(&mut self, items: &mut Vec<swc_core::ecma::ast::ModuleItem>) {
        let mut new_items = Vec::with_capacity(items.len());
        for mut item in items.drain(..) {
            item.visit_mut_with(self);

            let decorators = self.drain_component_decorators(item.as_ref());

            new_items.push(item);
            for statement in decorators {
                new_items.push(statement.into());
            }
        }
        *items = new_items;
    }

    /**
     * Visit statements and flush input decorators after inline class declaration.
     * `function f() { class MyCmp {} }` -> `function f() { class MyCmp {} _ts_decorate(...); }`
     */
    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let mut new_stmts = Vec::with_capacity(stmts.len());
        for mut stmt in stmts.drain(..) {
            stmt.visit_mut_with(self);

            let decorators = self.drain_component_decorators(Some(&stmt));

            new_stmts.push(stmt);
            new_stmts.extend(decorators);
        }
        *stmts = new_stmts;
    }
}

impl ComponentPropertyVisitor {
    fn drain_component_decorators(&mut self, statement: Option<&Stmt>) -> Vec<Stmt> {
        let component = match self.try_get_class_ident(statement) {
            Some(class_ident) => class_ident,
            None => return vec![],
        };

        let mut input_infos = self.component_inputs.remove(component).unwrap_or_default();
        let mut output_infos = self.component_outputs.remove(component).unwrap_or_default();
        let mut view_child_props = self
            .component_view_child
            .remove(component)
            .unwrap_or_default();

        let mut stmts: Vec<Stmt> =
            Vec::with_capacity(input_infos.len() + output_infos.len() + view_child_props.len());
        for input_info in input_infos.drain(..) {
            let alias = match &input_info.alias {
                Some(alias) => format!(r#""{alias}""#),
                None => "undefined".to_string(),
            };

            let raw = formatdoc! {
                r#"_ts_decorate([
                    require("@angular/core").Input({{
                        isSignal: true,
                        alias: {alias},
                        required: {required}
                    }})
                ], {component}.prototype, "{name}")"#,
                alias = alias,
                component = component.sym.to_string(),
                name = input_info.name,
                required = input_info.required
            };

            stmts.push(
                Str {
                    span: Default::default(),
                    value: "".into(),
                    raw: Some(raw.as_str().into()),
                }
                .into_stmt(),
            );
        }

        for output_info in output_infos.drain(..) {
            let alias = match &output_info.alias {
                Some(alias) => format!(r#""{alias}""#),
                None => "".into(),
            };

            let raw = formatdoc! {
                r#"_ts_decorate([
                    require("@angular/core").Output({alias})
                ], {component}.prototype, "{name}")"#,
                alias = alias,
                component = component.sym.to_string(),
                name = output_info.name,
            };

            stmts.push(
                Str {
                    span: Default::default(),
                    value: "".into(),
                    raw: Some(raw.as_str().into()),
                }
                .into_stmt(),
            );
        }

        for view_child_prop in view_child_props.drain(..) {
            for decorator in view_child_prop.to_decorators() {
                stmts.push(decorator.into());
            }
        }

        stmts
    }

    fn try_get_class_ident<'statement>(
        &self,
        stmt: Option<&'statement Stmt>,
    ) -> Option<&'statement Ident> {
        return stmt
            .and_then(|stmt| stmt.as_decl())
            .and_then(|decl| decl.as_class())
            .map(|class| &class.ident);
    }
}

#[cfg(test)]
mod tests {
    use indoc::indoc;

    use crate::testing::test_visitor;

    use super::ComponentPropertyVisitor;

    #[test]
    fn test_input() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
              myInput = input();
              anotherProperty = 'hello';
            }"# },
            indoc! {
            r#"class MyCmp {
                myInput = input();
                anotherProperty = 'hello';
            }
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true,
                    alias: undefined,
                    required: false
                })
            ], MyCmp.prototype, "myInput");
            "# },
        );
    }

    #[test]
    fn test_input_required() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
                myInput = input.required();
            }"# },
            indoc! {
            r#"class MyCmp {
                myInput = input.required();
            }
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true,
                    alias: undefined,
                    required: true
                })
            ], MyCmp.prototype, "myInput");
            "# },
        );
    }

    #[test]
    fn test_input_alias() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
                aliasedInput = input(undefined, {
                    alias: 'myInputAlias'
                });
                nonAliasedInput = input({
                    alias: 'this_is_a_default_value_not_an_alias'
                });
            }"# },
            indoc! {
            r#"class MyCmp {
                aliasedInput = input(undefined, {
                    alias: 'myInputAlias'
                });
                nonAliasedInput = input({
                    alias: 'this_is_a_default_value_not_an_alias'
                });
            }
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true,
                    alias: "myInputAlias",
                    required: false
                })
            ], MyCmp.prototype, "aliasedInput");
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true,
                    alias: undefined,
                    required: false
                })
            ], MyCmp.prototype, "nonAliasedInput");
            "# },
        );
    }

    #[test]
    fn test_input_required_alias() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
                myInput = input.required({
                    alias: 'myInputAlias'
                });
            }"# },
            indoc! {
            r#"class MyCmp {
                myInput = input.required({
                    alias: 'myInputAlias'
                });
            }
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true,
                    alias: "myInputAlias",
                    required: true
                })
            ], MyCmp.prototype, "myInput");
            "# },
        );
    }

    #[test]
    fn test_input_inline() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"function f() {
                class MyCmp {
                    aliasedInput = input(undefined, {
                        alias: 'myInputAlias'
                    });
                    someMethod() {
                        console.log('another statement');
                        class AnotherInlineClass {}
                    }
                }
            }"# },
            indoc! {
            r#"function f() {
                class MyCmp {
                    aliasedInput = input(undefined, {
                        alias: 'myInputAlias'
                    });
                    someMethod() {
                        console.log('another statement');
                        class AnotherInlineClass {
                        }
                    }
                }
                _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true,
                    alias: "myInputAlias",
                    required: false
                })
            ], MyCmp.prototype, "aliasedInput");
            }
            "# },
        );
    }

    #[test]
    fn test_output() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
                myOutput = output();
                anotherProperty = 'hello';
            }"# },
            indoc! {
            r#"class MyCmp {
                myOutput = output();
                anotherProperty = 'hello';
            }
            _ts_decorate([
                require("@angular/core").Output()
            ], MyCmp.prototype, "myOutput");
            "# },
        );
    }

    #[test]
    fn test_output_alias() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
                myOutput = output({
                    alias: 'myOutputAlias'
                });
            }"# },
            indoc! {
            r#"class MyCmp {
                myOutput = output({
                    alias: 'myOutputAlias'
                });
            }
            _ts_decorate([
                require("@angular/core").Output("myOutputAlias")
            ], MyCmp.prototype, "myOutput");
            "# },
        );
    }

    #[test]
    fn test_model() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
                myModel = model();
                anotherProperty = 'hello';
            }"# },
            indoc! {
            r#"class MyCmp {
                myModel = model();
                anotherProperty = 'hello';
            }
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true,
                    alias: undefined,
                    required: false
                })
            ], MyCmp.prototype, "myModel");
            _ts_decorate([
                require("@angular/core").Output("myModelChange")
            ], MyCmp.prototype, "myModel");
            "# },
        );
    }

    #[test]
    fn test_model_alias() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
                myModel = model(null, {
                    alias: 'myModelAlias'
                });
                nonAliasedModel = model({
                    alias: 'this_is_a_default_value_not_an_alias'
                });
            }"# },
            indoc! {
            r#"class MyCmp {
                myModel = model(null, {
                    alias: 'myModelAlias'
                });
                nonAliasedModel = model({
                    alias: 'this_is_a_default_value_not_an_alias'
                });
            }
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true,
                    alias: "myModelAlias",
                    required: false
                })
            ], MyCmp.prototype, "myModel");
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true,
                    alias: undefined,
                    required: false
                })
            ], MyCmp.prototype, "nonAliasedModel");
            _ts_decorate([
                require("@angular/core").Output("myModelAliasChange")
            ], MyCmp.prototype, "myModel");
            _ts_decorate([
                require("@angular/core").Output("nonAliasedModelChange")
            ], MyCmp.prototype, "nonAliasedModel");
            "# },
        );
    }

    #[test]
    fn test_model_required() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
                myModel = model.required();
            }"# },
            indoc! {
            r#"class MyCmp {
                myModel = model.required();
            }
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true,
                    alias: undefined,
                    required: true
                })
            ], MyCmp.prototype, "myModel");
            _ts_decorate([
                require("@angular/core").Output("myModelChange")
            ], MyCmp.prototype, "myModel");
            "# },
        );
    }

    #[test]
    fn test_model_required_alias() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
                myModel = model.required({
                    alias: 'myModelAlias'
                });
            }"# },
            indoc! {
            r#"class MyCmp {
                myModel = model.required({
                    alias: 'myModelAlias'
                });
            }
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true,
                    alias: "myModelAlias",
                    required: true
                })
            ], MyCmp.prototype, "myModel");
            _ts_decorate([
                require("@angular/core").Output("myModelAliasChange")
            ], MyCmp.prototype, "myModel");
            "# },
        );
    }

    #[test]
    fn test_view_child() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
                titleEl = viewChild('title');
            }"# },
            indoc! {
            r#"class MyCmp {
                titleEl = viewChild('title');
            }
            _ts_decorate([
                require("@angular/core").ViewChild('title', {
                    isSignal: true
                })
            ], MyCmp.prototype, "titleEl");
            "# },
        );
    }

    #[test]
    fn test_view_child_with_options() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
                titleEl = viewChild('title', {read: ElementRef});
            }"# },
            indoc! {
            r#"class MyCmp {
                titleEl = viewChild('title', {
                    read: ElementRef
                });
            }
            _ts_decorate([
                require("@angular/core").ViewChild('title', {
                    read: ElementRef,
                    isSignal: true
                })
            ], MyCmp.prototype, "titleEl");
            "# },
        );
    }

    #[test]
    fn test_view_child_required() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
                titleEl = viewChild.required('title');
            }"# },
            indoc! {
            r#"class MyCmp {
                titleEl = viewChild.required('title');
            }
            _ts_decorate([
                require("@angular/core").ViewChild('title', {
                    isSignal: true,
                    required: true
                })
            ], MyCmp.prototype, "titleEl");
            "# },
        );
    }

    #[test]
    fn test_view_child_required_with_options() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
                titleEl = viewChild.required('title', {
                    read: ElementRef
                });
            }"# },
            indoc! {
            r#"class MyCmp {
                titleEl = viewChild.required('title', {
                    read: ElementRef
                });
            }
            _ts_decorate([
                require("@angular/core").ViewChild('title', {
                    read: ElementRef,
                    isSignal: true,
                    required: true
                })
            ], MyCmp.prototype, "titleEl");
            "# },
        );
    }
}
