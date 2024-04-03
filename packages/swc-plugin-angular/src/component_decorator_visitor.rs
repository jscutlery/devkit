use swc_core::atoms::Atom;
use swc_core::ecma::ast::{ArrayLit, CallExpr, Expr, ExprOrSpread, Ident, Lit, PropName, Str};
use swc_core::ecma::visit::{VisitMut, VisitMutWith};
use swc_ecma_utils::ExprFactory;

#[derive(Default)]
pub struct ComponentDecoratorVisitor {
    is_in_component_call: bool,
    is_in_decorator: bool,
}

impl VisitMut for ComponentDecoratorVisitor {
    fn visit_mut_call_expr(&mut self, node: &mut swc_core::ecma::ast::CallExpr) {
        /* Locate `_ts_decorate`. */
        if let Some(ident) = node.callee.as_expr().and_then(|e| e.as_ident()) {
            if ident.sym.eq("_ts_decorate") {
                self.is_in_decorator = true;
                node.visit_mut_children_with(self);
                self.is_in_decorator = false;
                return;
            }
        }

        /* Locate `Component` function call inside `_ts_decorate`. */
        if self.is_in_decorator {
            if let Some(ident) = node.callee.as_expr().and_then(|e| e.as_ident()) {
                if ident.sym.eq("Component") {
                    self.is_in_component_call = true;
                    node.visit_mut_children_with(self);
                    self.is_in_component_call = false;
                    return;
                }
            }
        }

        node.visit_mut_children_with(self);
    }

    fn visit_mut_key_value_prop(&mut self, node: &mut swc_core::ecma::ast::KeyValueProp) {
        if !self.is_in_component_call {
            return;
        }

        /* Ignore non-string keys if people start getting crazy and adding
         * numeric keys in `@Component` 😅. */
        let key = node.key.clone();
        let key = match key.as_ident() {
            Some(key) => key,
            _ => return,
        };

        if key.sym.eq("styleUrl") {
            node.key = PropName::Ident(Ident {
                sym: "styles".into(),
                span: Default::default(),
                optional: false,
            });
            node.value = Expr::Array(ArrayLit {
                span: Default::default(),
                elems: vec![],
            })
            .into();
        }

        if key.sym.eq("styleUrls") {
            node.key = PropName::Ident(Ident {
                sym: "styles".into(),
                span: Default::default(),
                optional: false,
            });
            node.value = Expr::Array(ArrayLit {
                span: Default::default(),
                elems: vec![],
            })
            .into();
        }

        if key.sym.eq("templateUrl") {
            node.key = PropName::Ident(Ident {
                sym: "template".into(),
                span: Default::default(),
                optional: false,
            });

            let value = match &*node.value {
                Expr::Lit(Lit::Str(s)) => s.value.as_ref(),
                _ => panic!("templateUrl value is not a string"),
            };

            node.value = Expr::Call(CallExpr {
                span: Default::default(),
                callee: Expr::Ident(Ident {
                    sym: "require".into(),
                    span: Default::default(),
                    optional: false,
                })
                .as_callee(),
                args: vec![ExprOrSpread {
                    spread: None,
                    expr: Lit::Str(Str {
                        span: Default::default(),
                        /* In some cases, the templateUrl value might not start with "./" causing the require call to fail,
                         * to be fully backward compatible we need to append "./" */
                        value: if value.starts_with("./") {
                            value.into()
                        } else {
                            Atom::from(format!("./{}", value))
                        },
                        raw: None,
                    })
                    .into(),
                }],
                type_args: None,
            })
            .into();
        }
    }
}
