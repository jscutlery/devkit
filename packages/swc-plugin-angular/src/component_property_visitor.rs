use std::collections::HashMap;

use indoc::formatdoc;
use swc_core::ecma::{
    ast::Str,
    visit::{VisitMut, VisitMutWith},
};
use swc_core::ecma::ast::{CallExpr, Ident, Prop};
use swc_core::ecma::ast::Lit::Str as LitStr;
use swc_core::ecma::visit::{Visit, VisitWith};
use swc_ecma_utils::{ExprExt, ExprFactory, IsDirective};
use swc_ecma_utils::swc_ecma_ast::{Expr, Stmt};

#[derive(Default)]
pub struct ComponentPropertyVisitor {
    component_inputs: HashMap<Ident, Vec<InputInfo>>,
    current_component: Option<Ident>,
}

struct InputInfo {
    name: String,
    alias: Option<String>,
    required: bool,
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

    fn visit_mut_class_prop(&mut self, node: &mut swc_core::ecma::ast::ClassProp) {
        let current_component = match &self.current_component {
            Some(current_component) => current_component,
            None => return,
        };

        let key_ident = match node.key.as_ident() {
            Some(key_ident) => key_ident,
            None => return,
        };

        let call = match node
            .value
            .as_mut()
            .and_then(|v| v.as_expr().as_call())
        {
            Some(call) => call,
            None => return,
        };

        /* Parse input. */
        let mut input_visitor = InputVisitor::default();
        call.visit_with(&mut input_visitor);
        self.component_inputs
            .entry(current_component.clone())
            .or_default()
            .push(InputInfo {
                name: key_ident.sym.to_string(),
                alias: input_visitor.alias,
                required: input_visitor.required,
            });
    }

    /**
     * Visit module items and flush input decorators after class declaration.
     * `class MyCmp {}` -> `class MyCmp {} _ts_decorate(...);`
     */
    fn visit_mut_module_items(&mut self, items: &mut Vec<swc_core::ecma::ast::ModuleItem>) {
        let mut new_items = Vec::with_capacity(items.len());
        for mut item in items.drain(..) {
            let class_ident = self.try_get_class_ident(item.as_ref());
            item.visit_mut_with(self);
            new_items.push(item);
            for statement in self.try_flush_input_decorators(class_ident) {
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
            let class_ident = self.try_get_class_ident(Some(&stmt));
            stmt.visit_mut_with(self);
            new_stmts.push(stmt);
            new_stmts.extend(self.try_flush_input_decorators(class_ident));
        }
        *stmts = new_stmts;
    }
}

impl ComponentPropertyVisitor {
    fn try_flush_input_decorators(&mut self, class_ident: Option<Ident>) -> Vec<Stmt> {
        let component = match class_ident {
            Some(class_ident) => class_ident,
            None => return vec![],
        };

        let mut input_infos = match self.component_inputs.remove(&component) {
            Some(input_infos) => input_infos,
            None => return vec![],
        };

        let mut stmts: Vec<Stmt> = Vec::with_capacity(input_infos.len());
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

            stmts.push(Str {
                span: Default::default(),
                value: "".into(),
                raw: Some(raw.as_str().into()),
            }.into_stmt());
        }

        stmts
    }

    fn try_get_class_ident(&self, stmt: Option<&Stmt>) -> Option<Ident> {
        return stmt.and_then(|stmt| stmt.as_decl()).and_then(|decl| decl.as_class()).map(|class| class.ident.clone());
    }
}

#[derive(Default)]
struct InputVisitor {
    alias: Option<String>,
    required: bool,
}

impl Visit for InputVisitor {
    fn visit_call_expr(&mut self, call: &CallExpr) {
        let callee = match call.callee.as_expr()
        {
            Some(value_expr) => value_expr,
            None => return,
        };

        self.required = match callee.as_expr() {
            /* false if `input()`. */
            Expr::Ident(ident) if ident.sym.eq("input") => false,
            /* true if `input.required(). */
            Expr::Member(member) => {
                member.obj.as_ident().map_or(false, |i| i.sym.eq("input"))
                    && member.prop.clone().ident().map_or(false, |i| i.sym.eq("required"))
            }
            _ => return,
        };

        /* Options are either the first or second parameter depending on whether
         * the input is required.
         * e.g. input.required({alias: '...'}) or input(default, {alias: '...'}) */
        if let Some(options) = if self.required { call.args.first() } else { call.args.get(1) } {
            options.visit_children_with(self);
        }
    }

    fn visit_prop(&mut self, prop: &Prop) {
        let key_value = match prop.as_key_value() {
            Some(key_value) => key_value,
            None => return,
        };

        if let Some(true) = key_value.key.as_ident().map(|key| key.sym.eq("alias")) {
            if let Some(LitStr(str)) = key_value.value.as_lit() {
                self.alias = Some(str.value.as_str().to_string());
            }
        }
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
            "# });
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
            "# });
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
            "# });
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
                    nonAliasedInput = input({
                        alias: 'this_is_a_default_value_not_an_alias'
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
                    nonAliasedInput = input({
                        alias: 'this_is_a_default_value_not_an_alias'
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
                _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true,
                    alias: undefined,
                    required: false
                })
            ], MyCmp.prototype, "nonAliasedInput");
            }
            "# });
    }

    #[ignore]
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
                require("@angular/core").Output("myOutput")
            ], MyCmp.prototype, "myOutput");
            "# });
    }

    #[ignore]
    #[test]
    fn test_output_alias() {
        test_visitor(
            ComponentPropertyVisitor::default(),
            indoc! {
            r#"class MyCmp {
                myOutput = output({alias: 'myOutputAlias'});
            }"# },
            indoc! {
            r#"class MyCmp {
                myOutput = output({alias: 'myOutputAlias'});
            }
            _ts_decorate([
                require("@angular/core").Output("myOutputAlias")
            ], MyCmp.prototype, "myOutput");
            "# });
    }
}
