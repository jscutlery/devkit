use indoc::formatdoc;
use swc_core::{
    atoms::Atom,
    ecma::{
        ast::Str,
        visit::{VisitMut, VisitMutWith},
    },
};
use swc_core::ecma::ast::Lit::Str as LitStr;
use swc_core::ecma::ast::Prop;
use swc_core::ecma::visit::{Visit, VisitWith};
use swc_ecma_utils::{ExprExt, ExprFactory};
use swc_ecma_utils::swc_ecma_ast::Expr;

#[derive(Default)]
pub struct InputVisitor {
    inputs: Vec<InputInfo>,
    current_component: Atom,
}

impl VisitMut for InputVisitor {
    fn visit_mut_class_decl(&mut self, node: &mut swc_core::ecma::ast::ClassDecl) {
        self.current_component = node.ident.sym.clone();
        node.visit_mut_children_with(self);
    }

    fn visit_mut_class_prop(&mut self, node: &mut swc_core::ecma::ast::ClassProp) {
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

        let callee = match call.callee.as_expr()
        {
            Some(value_expr) => value_expr,
            None => return,
        };

        let required = match callee.as_expr() {
            /* false if `input()`. */
            Expr::Ident(ident) if ident.sym.eq("input") => false,
            /* true if `input.required(). */
            Expr::Member(member) => {
                member.obj.as_ident().map_or(false, |i| i.sym.eq("input"))
                    && member.prop.clone().ident().map_or(false, |i| i.sym.eq("required"))
            }
            _ => return,
        };

        /* Parse input options. */
        let mut input_options_visitor = InputOptionsVisitor::default();

        /* Options are either the first or second parameter depending depending on whether
         * the input is required.
         * e.g. input.required({alias: '...'}) or input(default, {alias: '...'}) */
        if let Some(options) = if required { call.args.first() } else { call.args.get(1) } {
            options.visit_children_with(&mut input_options_visitor);
        }

        self.inputs.push(InputInfo {
            component: self.current_component.clone(),
            name: key_ident.sym.clone(),
            alias: input_options_visitor.alias,
            required,
        });
    }

    fn visit_mut_module(&mut self, module: &mut swc_core::ecma::ast::Module) {
        module.visit_mut_children_with(self);

        for input_info in &self.inputs {
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
                component = input_info.component,
                name = input_info.name,
                required = input_info.required
            };

            module.body.push(Str {
                span: Default::default(),
                value: "".into(),
                raw: Some(raw.as_str().into()),
            }.into_stmt().into());
        }
    }
}

struct InputInfo {
    component: Atom,
    name: Atom,
    alias: Option<String>,
    required: bool,
}

#[derive(Default)]
struct InputOptionsVisitor {
    alias: Option<String>,
}

impl Visit for InputOptionsVisitor {
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

    use super::InputVisitor;

    #[test]
    fn test_input() {
        test_visitor(
            InputVisitor::default(),
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
            InputVisitor::default(),
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
            InputVisitor::default(),
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
}
