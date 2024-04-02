use swc_core::ecma::ast::{ClassProp, Expr, Ident, Lit, ObjectLit};

use crate::component_property_visitor::angular_prop_decorator::AngularPropDecorator;
use crate::component_property_visitor::angular_prop_parser::{AngularProp, AngularPropParser};
use crate::component_property_visitor::ast_parsing::{get_prop_value, parse_angular_prop};
use crate::component_property_visitor::input_prop_parser::InputProp;

#[derive(Default)]
pub struct ModelPropParser {}

impl AngularPropParser for ModelPropParser {
    fn parse_prop(&self, class: &Ident, class_prop: &ClassProp) -> Option<ModelProp> {
        let angular_prop_info = match parse_angular_prop(class_prop, "model") {
            Some(value) => value,
            None => return None,
        };

        let options_arg = if angular_prop_info.required {
            angular_prop_info.args.first()
        } else {
            angular_prop_info.args.get(1)
        };
        let options = options_arg.and_then(|arg| arg.expr.as_object()).cloned();

        Some(ModelProp {
            class: class.clone(),
            name: angular_prop_info.name,
            required: angular_prop_info.required,
            options,
        })
    }
}

pub struct ModelProp {
    pub class: Ident,
    pub name: String,
    pub required: bool,
    pub options: Option<ObjectLit>,
}

impl AngularProp for ModelProp {
    fn to_decorators(self) -> Vec<AngularPropDecorator> {
        let input_prop = InputProp {
            class: self.class.clone(),
            name: self.name.clone(),
            required: self.required,
            options: self.options.clone(),
        };

        let alias_expr = self
            .options
            .clone()
            .and_then(|options| get_prop_value(&options, "alias"));

        let output_name = match alias_expr {
            Some(Expr::Lit(Lit::Str(alias))) => alias.value.to_string(),
            _ => self.name.clone(),
        };
        let output_name = format!("{}Change", output_name);

        let output_decorator = AngularPropDecorator {
            class_ident: self.class,
            decorator_name: "Output".into(),
            decorator_args: vec![Expr::Lit(Lit::Str(output_name.into())).into()],
            property_name: self.name,
        };

        let mut decorators = input_prop.to_decorators();
        decorators.push(output_decorator);

        decorators
    }
}
