use swc_core::{
    atoms::Atom,
    ecma::visit::{VisitMut, VisitMutWith},
};

#[derive(Default)]
pub struct InputVisitor {
    inputs: Vec<InputInfo>,
    current_component: Atom,
}

struct InputInfo {
    component: Atom,
    name: Atom,
}

impl VisitMut for InputVisitor {
    fn visit_mut_class_decl(&mut self, node: &mut swc_core::ecma::ast::ClassDecl) {
        println!("ClassDecl: {:?}", node.ident.sym);
        self.current_component = node.ident.sym.clone();
        node.visit_mut_children_with(self);
    }

    fn visit_mut_class_prop(&mut self, node: &mut swc_core::ecma::ast::ClassProp) {
        if let Some(key) = node.key.as_ident() {
            if let Some(ident) = node
                .value
                .as_ref()
                .and_then(|v| v.as_call())
                .and_then(|c| c.callee.as_expr())
                .and_then(|e| e.as_ident())
            {
                if ident.sym.eq("input") {
                    self.inputs.push(InputInfo {
                        component: self.current_component.clone(),
                        name: key.sym.clone(),
                    });
                }
            }
        }
    }

    fn visit_mut_module(&mut self, module: &mut swc_core::ecma::ast::Module) {
        module.visit_mut_children_with(self);
    }
}

#[cfg(test)]
mod tests {
    use swc_core::ecma::{transforms::testing::test_inline, visit::as_folder};
    use swc_ecma_parser::{Syntax, TsConfig};

    use super::InputVisitor;

    test_inline!(
        ignore,
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
        _ts_decorate([
          Input({isSignal: true})
        ], MyCmp.prototype, "myInput");
        "#
    );
}
