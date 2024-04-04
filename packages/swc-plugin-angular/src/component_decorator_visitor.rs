use std::ops::Deref;

use swc_core::ecma::ast::{
    ArrayLit, Expr, Ident, ImportDefaultSpecifier, Lit, ModuleDecl, ModuleItem, PropName, Str,
};
use swc_core::ecma::visit::{VisitMut, VisitMutWith};
use swc_ecma_utils::swc_ecma_ast::ImportDecl;

#[derive(Default)]
pub struct ComponentDecoratorVisitor {
    is_in_component_call: bool,
    is_in_decorator: bool,
    imports: Vec<ImportInfo>,
    unique_id: i32,
}

struct ImportInfo {
    specifier: String,
    source: String,
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

            let template_path = match &node.value.deref() {
                Expr::Lit(Lit::Str(str)) => str.value.to_string(),
                _ => return,
            };

            /* In some cases, the templateUrl value might not start with "./" causing the
             * import/require call to fail, to be fully backward compatible we need to append "./"*/
            let template_path = if template_path.starts_with("./") {
                template_path.to_string()
            } else {
                format!("./{}", template_path)
            };

            let template_var_name = self.generate_var_name("template");

            self.imports.push(ImportInfo {
                specifier: template_var_name.clone(),
                source: template_path.clone(),
            });

            node.value = Expr::Ident(Ident {
                sym: template_var_name.into(),
                span: Default::default(),
                optional: Default::default(),
            })
            .into();
        }
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let mut new_items = Vec::with_capacity(items.len());

        /* Parse and modify all items. */
        for mut item in items.drain(..) {
            item.visit_mut_with(self);
            new_items.push(item);
        }

        /* Prepend all imports. */
        new_items.splice(0..0, self.imports.drain(..).map(Into::into));

        *items = new_items;
    }
}

impl ComponentDecoratorVisitor {
    fn generate_var_name(&mut self, name: &str) -> String {
        let unique_id = self.unique_id;
        self.unique_id += 1;
        format!("_jsc_{name}_{unique_id}")
    }
}

impl From<ImportInfo> for ModuleItem {
    fn from(import: ImportInfo) -> Self {
        ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
            span: Default::default(),
            specifiers: vec![ImportDefaultSpecifier {
                span: Default::default(),
                local: Ident {
                    span: Default::default(),
                    sym: import.specifier.into(),
                    optional: false,
                },
            }
            .into()],
            src: Str {
                value: import.source.into(),
                span: Default::default(),
                raw: Default::default(),
            }
            .into(),
            type_only: Default::default(),
            with: Default::default(),
            phase: Default::default(),
        }))
    }
}
