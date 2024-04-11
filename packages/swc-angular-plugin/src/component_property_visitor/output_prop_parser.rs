use swc_core::ecma::ast::{ClassProp, Ident, ObjectLit};

use crate::component_property_visitor::angular_prop_decorator::AngularPropDecorator;
use crate::component_property_visitor::angular_prop_parser::{AngularProp, AngularPropParser};
use crate::component_property_visitor::utils::{get_prop_value, parse_angular_prop};

#[derive(Default)]
pub struct OutputPropParser {}

impl AngularPropParser for OutputPropParser {
    fn parse_prop(&self, class: &Ident, class_prop: &ClassProp) -> Option<Box<dyn AngularProp>> {
        let (name, options) = match Self::parse_output_prop_info(class_prop) {
            Some(result) => result,
            None => return None,
        };

        Some(Box::new(OutputProp {
            class: class.clone(),
            name,
            options,
        }))
    }
}

impl OutputPropParser {
    fn parse_output_prop_info(class_prop: &ClassProp) -> Option<(String, Option<ObjectLit>)> {
        if let Some(angular_prop_info) = parse_angular_prop(class_prop, "output") {
            return Some((
                angular_prop_info.name,
                angular_prop_info
                    .args
                    .first()
                    .and_then(|arg| arg.expr.as_object())
                    /* We have to clone the options anyway so let's do it here.
                     * That's because they have to be kept in memory by the parent visitor until
                     * the end of the visit in order to add the decorator statement. */
                    .cloned(),
            ));
        }

        if let Some(angular_prop_info) = parse_angular_prop(class_prop, "outputFromObservable") {
            return Some((
                angular_prop_info.name,
                angular_prop_info
                    .args
                    .get(1)
                    .and_then(|arg| arg.expr.as_object())
                    .cloned(),
            ));
        }

        None
    }
}

pub struct OutputProp {
    pub class: Ident,
    pub name: String,
    pub options: Option<ObjectLit>,
}

impl AngularProp for OutputProp {
    fn to_decorators(&self) -> Vec<AngularPropDecorator> {
        let alias = self
            .options
            .as_ref()
            .and_then(|options| get_prop_value(options, "alias"));

        /* Add alias to decorator if alias exists: e.g. `@Output(alias)`. */
        let decorator_args = match alias {
            Some(alias) => vec![alias.into()],
            _ => vec![],
        };

        vec![AngularPropDecorator {
            class_ident: self.class.clone(),
            decorator_name: "Output".into(),
            decorator_args,
            property_name: self.name.clone(),
        }]
    }
}
