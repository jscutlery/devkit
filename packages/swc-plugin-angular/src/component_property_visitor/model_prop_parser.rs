use swc_core::ecma::ast::{ClassProp, Prop};
use swc_core::ecma::visit::Visit;

use crate::component_property_visitor::ast_parsing::{
    get_angular_prop, get_prop_value_as_string, visit_functional_api_options,
};

#[derive(Default)]
pub struct ModelPropParser {
    model_info: Option<ModelInfo>,
}

impl ModelPropParser {
    pub(crate) fn get_model_info(&mut self, class_prop: &ClassProp) -> Option<ModelInfo> {
        let angular_prop = match get_angular_prop(class_prop, "model") {
            Some(value) => value,
            None => return None,
        };

        self.model_info = ModelInfo {
            name: angular_prop.name,
            required: angular_prop.required,
            ..Default::default()
        }
        .into();

        visit_functional_api_options(self, angular_prop.required, angular_prop.args);

        self.model_info.take()
    }
}

impl Visit for ModelPropParser {
    fn visit_prop(&mut self, prop: &Prop) {
        let model_info = match &mut self.model_info {
            Some(model_info) => model_info,
            None => return,
        };

        model_info.alias = get_prop_value_as_string(prop, "alias");
    }
}

#[derive(Default)]
pub struct ModelInfo {
    pub name: String,
    pub alias: Option<String>,
    pub required: bool,
}
