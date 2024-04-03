use swc_core::ecma::ast::{ClassProp, Expr, ExprOrSpread, Ident, ObjectLit};

use crate::component_property_visitor::angular_prop_decorator::AngularPropDecorator;
use crate::component_property_visitor::angular_prop_parser::{AngularProp, AngularPropParser};
use crate::component_property_visitor::utils::{parse_angular_prop, set_option};

#[derive(Default)]
pub struct ViewChildPropParser {}

impl AngularPropParser for ViewChildPropParser {
    fn parse_prop(&self, class: &Ident, class_prop: &ClassProp) -> Option<Box<dyn AngularProp>> {
        let angular_prop_info = match parse_angular_prop(class_prop, "viewChild") {
            Some(value) => value,
            None => return None,
        };

        /* Locator is mandatory so the property is invalid if it's missing. */
        let locator = match angular_prop_info.args.first() {
            Some(locator) => locator.clone(),
            None => return None,
        };

        let options = angular_prop_info
            .args
            .get(1)
            .and_then(|arg| arg.expr.as_object())
            /* We have to clone the options anyway so let's do it here.
             * That's because they have to be kept in memory by the parent visitor until
             * the end of the visit in order to add the decorator statement. */
            .cloned();

        Some(Box::new(ViewChildProp {
            class: class.clone(),
            name: angular_prop_info.name,
            required: angular_prop_info.required,
            locator,
            options,
        }))
    }
}

pub(crate) struct ViewChildProp {
    class: Ident,
    name: String,
    required: bool,
    locator: ExprOrSpread,
    options: Option<ObjectLit>,
}

impl AngularProp for ViewChildProp {
    fn to_decorators(&self) -> Vec<AngularPropDecorator> {
        /* Add options object if missing. */
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
            decorator_name: "ViewChild".to_string(),
            decorator_args: vec![self.locator.clone(), Expr::Object(options).into()],
            property_name: self.name.clone(),
        }]
    }
}
