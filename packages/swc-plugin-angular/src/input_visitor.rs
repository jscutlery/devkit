use swc_core::ecma::ast::{ClassProp, Prop};
use swc_core::ecma::visit::{Visit, VisitWith};

use crate::utils::{get_angular_prop, get_prop_value_as_string};

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

        /* Options are either the first or second parameter depending on whether
         * the input is required.
         * e.g. input.required({alias: '...'}) or input(initialValue, {alias: '...'}) */
        if let Some(options) = if angular_prop.required { angular_prop.args.first() } else { angular_prop.args.get(1) } {
            options.visit_children_with(self);
        }

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
