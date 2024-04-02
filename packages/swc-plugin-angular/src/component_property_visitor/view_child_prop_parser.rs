use swc_core::ecma::ast::{
    ClassProp, Expr, ExprOrSpread, Ident, KeyValueProp, Lit, ObjectLit, Prop, PropName,
    PropOrSpread,
};
use swc_ecma_utils::swc_ecma_ast::Stmt;

use crate::component_property_visitor::angular_prop_decorator::AngularPropDecorator;
use crate::component_property_visitor::ast_parsing::parse_angular_prop;

#[derive(Default)]
pub struct ViewChildPropParser {}

impl ViewChildPropParser {
    pub(crate) fn parse_prop(
        &mut self,
        class: &Ident,
        class_prop: &ClassProp,
    ) -> Option<ViewChildProp> {
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

        Some(ViewChildProp {
            class: class.clone(),
            name: angular_prop_info.name,
            required: angular_prop_info.required,
            locator,
            options,
        })
    }
}

pub(crate) struct ViewChildProp {
    class: Ident,
    name: String,
    required: bool,
    locator: ExprOrSpread,
    options: Option<ObjectLit>,
}

impl From<ViewChildProp> for Stmt {
    fn from(prop: ViewChildProp) -> Self {
        /* Add options object if missing. */
        let mut options = prop.options.unwrap_or_else(|| ObjectLit {
            span: Default::default(),
            props: vec![],
        });

        options.props.push(PropOrSpread::Prop(
            Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(Ident::new("isSignal".into(), Default::default())),
                value: Expr::Lit(Lit::Bool(true.into())).into(),
            })
            .into(),
        ));

        if prop.required {
            options
                .props
                .push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(Ident::new("required".into(), Default::default())),
                    value: Expr::Lit(Lit::Bool(true.into())).into(),
                }))))
        }

        AngularPropDecorator {
            class_ident: prop.class.clone(),
            decorator_name: "ViewChild".to_string(),
            decorator_args: vec![prop.locator, Expr::Object(options.clone()).into()],
            property_name: prop.name,
        }
        .into()
    }
}
