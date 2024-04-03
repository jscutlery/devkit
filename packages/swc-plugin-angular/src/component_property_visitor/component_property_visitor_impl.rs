use std::collections::HashMap;

use swc_core::ecma::ast::Ident;
use swc_core::ecma::visit::{VisitMut, VisitMutWith};
use swc_ecma_utils::swc_ecma_ast::Stmt;
use swc_ecma_utils::IsDirective;

use crate::component_property_visitor::angular_prop_parser::{AngularProp, AngularPropParser};
use crate::component_property_visitor::input_prop_parser::InputPropParser;
use crate::component_property_visitor::model_prop_parser::ModelPropParser;
use crate::component_property_visitor::output_prop_parser::OutputPropParser;
use crate::component_property_visitor::query_prop_parser::QueryPropParser;

pub struct ComponentPropertyVisitor {
    prop_parsers: Vec<Box<dyn AngularPropParser>>,
    component_props: HashMap<Ident, Vec<Box<dyn AngularProp>>>,
    current_component: Option<Ident>,
}

impl Default for ComponentPropertyVisitor {
    fn default() -> Self {
        Self {
            component_props: HashMap::new(),
            current_component: None,
            prop_parsers: vec![
                Box::<InputPropParser>::default(),
                Box::<OutputPropParser>::default(),
                Box::<ModelPropParser>::default(),
                Box::<QueryPropParser>::default(),
            ],
        }
    }
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

        for prop_parser in self.prop_parsers.iter() {
            if let Some(prop) = prop_parser.parse_prop(current_component, class_prop) {
                let component_props = self
                    .component_props
                    .entry(current_component.clone())
                    .or_default();

                component_props.push(prop);
            }
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

        let mut props = self.component_props.remove(component).unwrap_or_default();

        let mut stmts: Vec<Stmt> = Vec::with_capacity(props.len());
        for prop in props.drain(..) {
            for decorator in prop.to_decorators() {
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
