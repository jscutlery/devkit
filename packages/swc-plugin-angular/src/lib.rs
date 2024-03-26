use swc_core::ecma::{
    ast::{ArrayLit, CallExpr, Expr, ExprOrSpread, Ident, Lit, Program, PropName, Str},
    visit::{as_folder, FoldWith, VisitMut, VisitMutWith },
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};
use swc_ecma_utils::ExprFactory;

#[derive(Default)]
pub struct AngularTransformVisitor {
    is_in_component_call: bool,
    is_in_decorator: bool
}

impl VisitMut for AngularTransformVisitor {

    fn visit_mut_decorator(&mut self, node: &mut swc_core::ecma::ast::Decorator) {
        /* Locate `@Component()` decorator. */
        self.is_in_decorator = true;
        node.visit_mut_children_with(self);
        self.is_in_decorator = false;
    }

    fn visit_mut_call_expr(&mut self, node: &mut swc_core::ecma::ast::CallExpr) {
        /* Locate `_ts_decorate`. */
        if let Some(ident) = node.callee.as_expr().and_then(|e| e.as_ident()) {
            if ident.sym.eq("_ts_decorate") {
                self.is_in_decorator = true;
                node.visit_mut_children_with(self);
                self.is_in_decorator = false;
                return
            }
        }

        /* Locate `Component` function call inside `_ts_decorate`. */
        if self.is_in_decorator {
            if let Some(ident) = node.callee.as_expr().and_then(|e| e.as_ident()) {
                if ident.sym.eq("Component") {
                    self.is_in_component_call = true;
                    node.visit_mut_children_with(self);
                    self.is_in_component_call = false;
                    return
                }
            }
        }

        node.visit_mut_children_with(self);
    }

    fn visit_mut_key_value_prop(&mut self, node: &mut swc_core::ecma::ast::KeyValueProp) {
        if !self.is_in_component_call {
            return
        }

        /* Ignore non-string keys if people start getting crazy and adding
         * numeric keys in `@Component` 😅. */
        let key = node.key.clone();
        let key = match key.as_ident() {
            Some(key) => key,
            _ => return
        };

        if key.sym.eq("styleUrl") {
            node.key = PropName::Ident(Ident {
                sym: "styles".into(),
                span: Default::default(),
                optional: false,
            });
            node.value = Expr::Array(ArrayLit { span: Default::default(), elems: vec![] }).into();
        }

        if key.sym.eq("styleUrls") {
            node.key = PropName::Ident(Ident {
                sym: "styles".into(),
                span: Default::default(),
                optional: false,
            });
            node.value = Expr::Array(ArrayLit { span: Default::default(), elems: vec![] }).into();
        }

        if key.sym.eq("templateUrl") {
            node.key = PropName::Ident(Ident {
                sym: "template".into(),
                span: Default::default(),
                optional: false,
            });

            let value = match &*node.value {
                Expr::Lit(Lit::Str(s)) => s.value.as_ref(),
                _ => panic!("templateUrl value is not a string")
            };

            node.value = Expr::Call(CallExpr {
                span: Default::default(),
                callee: Expr::Ident(Ident {
                    sym: "require".into(),
                    span: Default::default(),
                    optional: false,
                }).as_callee(),
                args: vec![ExprOrSpread {
                    spread: None,
                    expr: Lit::Str(Str {
                        span: Default::default(),
                        value: value.into(),
                        raw: None,
                    }).into(),
                }],
                type_args: None,
            }).into();

        }
    }
}

#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    let visitor = AngularTransformVisitor::default();
    program.fold_with(&mut as_folder(visitor))
}

#[cfg(test)]
mod tests {

    use super::*;
    use swc_core::ecma::{transforms::testing::test_inline, visit::as_folder};
    use swc_ecma_parser::{Syntax, TsConfig};

    test_inline!(
        Syntax::Typescript(TsConfig {
            decorators: true,
            ..Default::default()
        }),
        |_| as_folder(AngularTransformVisitor::default()),
        replace_urls,
        // Input codes
        r#"
        @Component({
            selector: 'app-hello',
            styleUrls: ['./style.css'],
            templateUrl: './hello.component.html'
        })
        class MyCmp {}"#,
        // Output codes after transformed with plugin
        r#"
        @Component({
            selector: 'app-hello',
            styles: [],
            template: require("./hello.component.html")
        })
        class MyCmp {}"#
    );

    test_inline!(
        Syntax::Typescript(TsConfig {
            decorators: true,
            ..Default::default()
        }),
        |_| as_folder(AngularTransformVisitor::default()),
        replace_style_url,
        // Input codes
        r#"
        @Component({
            selector: 'app-hello',
            styleUrl: './style.css',
            templateUrl: './hello.component.html'
        })
        class MyCmp {}"#,
        // Output codes after transformed with plugin
        r#"
        @Component({
            selector: 'app-hello',
            styles: [],
            template: require("./hello.component.html")
        })
        class MyCmp {}"#
    );

    test_inline!(
        Syntax::Typescript(TsConfig {
            decorators: true,
            ..Default::default()
        }),
        |_| as_folder(AngularTransformVisitor::default()),
        replace_urls_in_component_decorator_only,
        // Input codes
        r#"
        const something = {templateUrl: './this-is-an-unrelated-template-url.html'};
        @Component({
            selector: 'app-hello',
            styleUrls: ['./style.css'],
            templateUrl: './hello.component.html',
        })
        @MyDecorator({
            templateUrl: './this-is-an-unrelated-template-url.html'
        })
        class MyCmp {}"#,
        // Output codes after transformed with plugin
        r#"
        const something = {templateUrl: './this-is-an-unrelated-template-url.html'};
        @Component({
            selector: 'app-hello',
            styles: [],
            template: require("./hello.component.html")
        })
        @MyDecorator({
            templateUrl: './this-is-an-unrelated-template-url.html'
        })
        class MyCmp {}"#
    );

    /* Actually, SWC transforms decorators before running the plugin.
     * That is why we have to handle the case where decorators are already transformed
     * to `_ts_decorate` function calls. */
    test_inline!(
        Syntax::Typescript(TsConfig {
            decorators: true,
            ..Default::default()
        }),
        |_| as_folder(AngularTransformVisitor::default()),
        replace_urls_in_ts_decorate,
        // Input codes
        r#"
        function MyCmp () {}
        MyCmp = _ts_decorate([
            Component({
                selector: 'app-hello',
                styleUrls: ['./style.css'],
                templateUrl: './hello.component.html'
            })
        ], MyCmp);"#,
        r#"
        function MyCmp () {}
        MyCmp = _ts_decorate([
            Component({
                selector: 'app-hello',
                styles: [],
                template: require("./hello.component.html")
            })
        ], MyCmp);"#
    );
}
