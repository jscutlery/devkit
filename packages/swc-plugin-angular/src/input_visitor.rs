use swc_core::ecma::ast::{ClassProp, Prop};
use swc_core::ecma::visit::Visit;

use crate::utils::{get_angular_prop, get_prop_value_as_string, visit_input_or_model_options};

#[derive(Default)]
pub struct InputVisitor {
    input_info: Option<InputInfo>,
}

impl InputVisitor {
    pub(crate) fn get_input_info(&mut self, class_prop: &ClassProp) -> Option<InputInfo> {
        let angular_prop = match get_angular_prop(class_prop, "input".into()) {
            Some(value) => value,
            None => return None,
        };

        self.input_info = InputInfo {
            name: angular_prop.name,
            required: angular_prop.required,
            ..Default::default()
        }.into();

        visit_input_or_model_options(self, angular_prop.required, angular_prop.args);

        self.input_info.take()
    }
}

impl Visit for InputVisitor {
    fn visit_prop(&mut self, prop: &Prop) {
        let input_info = match &mut self.input_info {
            Some(input_info) => input_info,
            None => return,
        };

        input_info.alias = get_prop_value_as_string(prop, "alias".to_string());
    }
}

#[derive(Default)]
pub struct InputInfo {
    pub name: String,
    pub alias: Option<String>,
    pub required: bool,
}
