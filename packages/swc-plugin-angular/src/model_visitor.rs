use swc_core::ecma::ast::{ClassProp, Prop};
use swc_core::ecma::visit::Visit;

use crate::utils::{get_angular_prop, get_prop_value_as_string, visit_input_or_model_options};

#[derive(Default)]
pub struct ModelVisitor {
    model_info: Option<ModelInfo>,
}

impl ModelVisitor {
    pub(crate) fn get_model_info(&mut self, class_prop: &ClassProp) -> Option<ModelInfo> {
        let angular_prop = match get_angular_prop(class_prop, "model".into()) {
            Some(value) => value,
            None => return None,
        };

        self.model_info = ModelInfo {
            name: angular_prop.name,
            required: angular_prop.required,
            ..Default::default()
        }.into();

        visit_input_or_model_options(self, angular_prop.required, angular_prop.args);

        self.model_info.take()
    }
}

impl Visit for ModelVisitor {
    fn visit_prop(&mut self, prop: &Prop) {
        let model_info = match &mut self.model_info {
            Some(model_info) => model_info,
            None => return,
        };

        model_info.alias = get_prop_value_as_string(prop, "alias".to_string());
    }
}

#[derive(Default)]
pub struct ModelInfo {
    pub name: String,
    pub alias: Option<String>,
    pub required: bool,
}
