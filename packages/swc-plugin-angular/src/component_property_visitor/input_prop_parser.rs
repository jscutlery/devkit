use swc_core::ecma::ast::{ClassProp, Prop};
use swc_core::ecma::visit::Visit;

use crate::utils::{get_angular_prop, get_prop_value_as_string, visit_functional_api_options};

#[derive(Default)]
pub struct InputPropParser {
    input_info: Option<InputProp>,
}

impl InputPropParser {
    pub(crate) fn get_input_info(&mut self, class_prop: &ClassProp) -> Option<InputProp> {
        let angular_prop = match get_angular_prop(class_prop, "input") {
            Some(value) => value,
            None => return None,
        };

        self.input_info = InputProp {
            name: angular_prop.name,
            required: angular_prop.required,
            ..Default::default()
        }
        .into();

        visit_functional_api_options(self, angular_prop.required, angular_prop.args);

        self.input_info.take()
    }
}

impl Visit for InputPropParser {
    fn visit_prop(&mut self, prop: &Prop) {
        let input_info = match &mut self.input_info {
            Some(input_info) => input_info,
            None => return,
        };

        input_info.alias = get_prop_value_as_string(prop, "alias");
    }
}

#[derive(Default)]
pub struct InputProp {
    pub name: String,
    pub alias: Option<String>,
    pub required: bool,
}
