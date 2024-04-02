use std::ops::Deref;

use swc_core::ecma::ast::{ClassProp, Expr, Ident, ObjectLit};

use crate::component_property_visitor::angular_prop_decorator::AngularPropDecorator;
use crate::component_property_visitor::angular_prop_parser::{AngularProp, AngularPropParser};
use crate::component_property_visitor::ast_parsing::parse_angular_prop;

#[derive(Default)]
pub struct OutputPropParser {}

impl AngularPropParser for OutputPropParser {
    fn parse_prop(&self, class: &Ident, class_prop: &ClassProp) -> Option<OutputProp> {
        let angular_prop_info = match parse_angular_prop(class_prop, "output") {
            Some(value) => value,
            None => return None,
        };

        let options = angular_prop_info
            .args
            .first()
            .and_then(|arg| arg.expr.as_object())
            /* We have to clone the options anyway so let's do it here.
             * That's because they have to be kept in memory by the parent visitor until
             * the end of the visit in order to add the decorator statement. */
            .cloned();

        Some(OutputProp {
            class: class.clone(),
            name: angular_prop_info.name,
            options,
        })
    }
}

pub struct OutputProp {
    pub class: Ident,
    pub name: String,
    pub options: Option<ObjectLit>,
}

impl AngularProp for OutputProp {
    fn to_decorators(self) -> Vec<AngularPropDecorator> {
        let alias = self
            .options
            .and_then(|options| get_prop_value(&options, "alias"));

        /* Add alias to decorator if alias exists: e.g. `@Output(alias)`. */
        let decorator_args = match alias {
            Some(alias) => vec![alias.into()],
            _ => vec![],
        };

        vec![AngularPropDecorator {
            class_ident: self.class,
            decorator_name: "Output".into(),
            decorator_args,
            property_name: self.name,
        }]
    }
}

fn get_prop_value(options: &ObjectLit, key: &str) -> Option<Expr> {
    for prop in &options.props {
        let key_value = match prop.as_prop().and_then(|prop| prop.as_key_value()) {
            Some(key_value) => key_value,
            None => return None,
        };

        if let Some(true) = key_value.key.as_ident().map(|k| k.sym.eq(key)) {
            return Some(key_value.value.deref().clone());
        }
    }

    None
}
