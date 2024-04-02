use swc_core::ecma::ast::{
    ClassProp, Expr, Ident, KeyValueProp, Lit, ObjectLit, Prop, PropName, PropOrSpread,
};

use crate::component_property_visitor::angular_prop_decorator::AngularPropDecorator;
use crate::component_property_visitor::angular_prop_parser::{AngularProp, AngularPropParser};
use crate::component_property_visitor::ast_parsing::parse_angular_prop;

#[derive(Default)]
pub struct InputPropParser {}

impl AngularPropParser for InputPropParser {
    fn parse_prop(&self, class: &Ident, class_prop: &ClassProp) -> Option<InputProp> {
        let angular_prop_info = match parse_angular_prop(class_prop, "input") {
            Some(value) => value,
            None => return None,
        };

        let options_arg = if angular_prop_info.required {
            angular_prop_info.args.first()
        } else {
            angular_prop_info.args.get(1)
        };

        let options = options_arg.and_then(|arg| arg.expr.as_object()).cloned();

        Some(InputProp {
            class: class.clone(),
            name: angular_prop_info.name,
            required: angular_prop_info.required,
            options,
        })
    }
}

pub struct InputProp {
    pub class: Ident,
    pub name: String,
    pub required: bool,
    pub options: Option<ObjectLit>,
}

impl AngularProp for InputProp {
    fn to_decorators(self) -> Vec<AngularPropDecorator> {
        let mut decorator_options = self.options.unwrap_or_else(|| ObjectLit {
            span: Default::default(),
            props: vec![],
        });

        decorator_options.props.push(PropOrSpread::Prop(
            Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(Ident::new("isSignal".into(), Default::default())),
                value: Expr::Lit(Lit::Bool(true.into())).into(),
            })
            .into(),
        ));

        if self.required {
            decorator_options
                .props
                .push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(Ident::new("required".into(), Default::default())),
                    value: Expr::Lit(Lit::Bool(true.into())).into(),
                }))));
        }

        vec![AngularPropDecorator {
            class_ident: self.class,
            decorator_name: "Input".into(),
            decorator_args: vec![Expr::Object(decorator_options).into()],
            property_name: self.name,
        }]
    }
}
