use swc_core::ecma::ast::{ClassProp, Prop};
use swc_core::ecma::visit::{Visit, VisitWith};

use crate::component_property_visitor::ast_parsing::{
    get_prop_value_as_string, parse_angular_prop,
};

#[derive(Default)]
pub struct OutputPropParser {
    output_info: Option<OutputProp>,
}

impl OutputPropParser {
    pub(crate) fn get_output_info(&mut self, class_prop: &ClassProp) -> Option<OutputProp> {
        let angular_prop = match parse_angular_prop(class_prop, "output") {
            Some(value) => value,
            None => return None,
        };

        self.output_info = OutputProp {
            name: angular_prop.name,
            ..Default::default()
        }
        .into();

        if let Some(options) = angular_prop.args.first() {
            options.visit_children_with(self);
        }

        self.output_info.take()
    }
}

impl Visit for OutputPropParser {
    fn visit_prop(&mut self, prop: &Prop) {
        let output_info = match &mut self.output_info {
            Some(output_info) => output_info,
            None => return,
        };

        output_info.alias = get_prop_value_as_string(prop, "alias");
    }
}

#[derive(Default)]
pub struct OutputProp {
    pub name: String,
    pub alias: Option<String>,
}
