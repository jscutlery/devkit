use std::ops::Deref;

use swc_core::ecma::ast::{ArrayLit, Expr, Ident, Lit, ModuleItem, PropName};
use swc_core::ecma::visit::{VisitMut, VisitMutWith};

use crate::import_declaration::{ImportDeclaration, ImportDeclarationSpecifier};

#[derive(Default)]
pub struct ComponentDecoratorVisitor {
    is_in_component_call: bool,
    is_in_decorator: bool,
    imports: Vec<ImportDeclaration>,
    unique_id: i32,
    options: ComponentDecoratorVisitorOptions,
}

impl ComponentDecoratorVisitor {
    pub fn new(options: ComponentDecoratorVisitorOptions) -> Self {
        Self {
            options,
            ..Default::default()
        }
    }
}

#[derive(Default)]
pub struct ComponentDecoratorVisitorOptions {
    pub template_raw_suffix: bool,
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

            let mut template_path = match &node.value.deref() {
                Expr::Lit(Lit::Str(str)) => str.value.to_string(),
                _ => return,
            };

            /* In some cases, the templateUrl value might not start with "./" causing the
             * import/require call to fail, to be fully backward compatible we need to append "./"*/
            if !template_path.starts_with("./") {
                template_path = format!("./{template_path}");
            };

            /* Add ?raw suffix for vite support when option is enabled. */
            if self.options.template_raw_suffix {
                template_path = format!("{template_path}?raw");
            }

            let template_var_name = self.generate_var_name("template");

            self.imports.push(ImportDeclaration {
                specifier: ImportDeclarationSpecifier::Default(template_var_name.clone()),
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
