use swc_core::ecma::ast::{ClassProp, Expr, Ident, ObjectLit};

use crate::component_property_visitor::angular_prop_decorator::AngularPropDecorator;
use crate::component_property_visitor::angular_prop_parser::{AngularProp, AngularPropParser};
use crate::component_property_visitor::utils::{parse_angular_prop, set_option};

#[derive(Default)]
pub struct InputPropParser {}

impl AngularPropParser for InputPropParser {
    fn parse_prop(&self, class: &Ident, class_prop: &ClassProp) -> Option<Box<dyn AngularProp>> {
        let angular_prop_info = parse_angular_prop(class_prop, "input")?;

        let options_arg = if angular_prop_info.required {
            angular_prop_info.args.first()
        } else {
            angular_prop_info.args.get(1)
        };

        let options = options_arg.and_then(|arg| arg.expr.as_object()).cloned();

        Some(Box::new(InputProp {
            class: class.clone(),
            name: angular_prop_info.name,
            required: angular_prop_info.required,
            options,
        }))
    }
}

pub struct InputProp {
    pub class: Ident,
    pub name: String,
    pub required: bool,
    pub options: Option<ObjectLit>,
}

impl AngularProp for InputProp {
    fn to_decorators(&self) -> Vec<AngularPropDecorator> {
        let mut options = self.options.clone().unwrap_or_else(|| ObjectLit {
            span: Default::default(),
            props: vec![],
        });

        set_option(&mut options, "isSignal", true);

        if self.required {
            set_option(&mut options, "required", true);
        }

        vec![AngularPropDecorator {
            class_ident: self.class.clone(),
            decorator_name: "Input".into(),
            decorator_args: vec![Expr::Object(options).into()],
            property_name: self.name.clone(),
        }]
    }
}
