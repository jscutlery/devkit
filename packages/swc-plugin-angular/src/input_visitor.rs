use swc_core::{
    atoms::Atom,
    ecma::{
        ast::Str,
        visit::{VisitMut, VisitMutWith},
    },
};
use swc_ecma_utils::swc_ecma_ast::Expr;
use swc_ecma_utils::{ExprExt, ExprFactory};

#[derive(Default)]
pub struct InputVisitor {
    inputs: Vec<InputInfo>,
    current_component: Atom,
}

struct InputInfo {
    component: Atom,
    name: Atom,
    required: bool,
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

        let value_expr = match node
            .value
            .as_ref()
            .and_then(|v| v.as_expr().as_call())
            .and_then(|c| c.callee.as_expr())
        {
            Some(value_expr) => value_expr,
            None => return,
        };

        match *value_expr.clone() {
            Expr::Ident(ident) if ident.sym.eq("input") => {
                self.inputs.push(InputInfo {
                    component: self.current_component.clone(),
                    name: key_ident.sym.clone(),
                    required: false,
                });
            }
            Expr::Member(member) => {
                if member.obj.as_ident().map_or(false, |i| i.sym.eq("input"))
                    && member.prop.ident().map_or(false, |i| i.sym.eq("required"))
                {
                    self.inputs.push(InputInfo {
                        component: self.current_component.clone(),
                        name: key_ident.sym.clone(),
                        required: true,
                    });
                }
            }
            _ => (),
        }
    }

    fn visit_mut_module(&mut self, module: &mut swc_core::ecma::ast::Module) {
        module.visit_mut_children_with(self);

        for input_info in &self.inputs {
            let component = input_info.component.as_str();
            let input_name = input_info.name.as_str();
            let required_str = if input_info.required {
                r#",
        required: true"#
            } else {
                ""
            };
            let raw = Str {
                span: Default::default(),
                value: "".into(),
                raw: Some(
                    format!(
                        r#"_ts_decorate([
    require("@angular/core").Input({{
        isSignal: true{required_str}
    }})
], {component}.prototype, "{input_name}")"#
                    )
                    .into(),
                ),
            };
            module.body.push(raw.into_stmt().into());
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_core::ecma::{transforms::testing::test_inline, visit::as_folder};
    use swc_ecma_parser::{Syntax, TsConfig};

    use super::InputVisitor;

    test_inline!(
        Syntax::Typescript(TsConfig::default()),
        |_| as_folder(InputVisitor::default()),
        decorate_input,
        r#"
        class MyCmp {
          myInput = input();
          anotherProperty = 'hello';
        }
        "#,
        r#"
        class MyCmp {
          myInput = input();
          anotherProperty = 'hello';
        }
        _ts_decorate([require("@angular/core").Input({isSignal: true})], MyCmp.prototype, "myInput");
        "#
    );

    test_inline!(
        Syntax::Typescript(TsConfig::default()),
        |_| as_folder(InputVisitor::default()),
        decorate_input_required,
        r#"
        class MyCmp {
          myInput = input.required();
          anotherProperty = 'hello';
        }
        "#,
        r#"
        class MyCmp {
          myInput = input.required();
          anotherProperty = 'hello';
        }
        _ts_decorate([
            require("@angular/core").Input({isSignal: true, required: true})
        ], MyCmp.prototype, "myInput");
        "#
    );
}
