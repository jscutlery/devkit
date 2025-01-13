use swc_core::ecma::ast::{ClassProp, Expr, ExprOrSpread, Ident, ObjectLit};

use crate::component_property_visitor::angular_prop_decorator::AngularPropDecorator;
use crate::component_property_visitor::angular_prop_parser::{AngularProp, AngularPropParser};
use crate::component_property_visitor::utils::{parse_angular_prop, set_option, AngularPropInfo};

#[derive(Default)]
pub struct QueryPropParser {}

impl AngularPropParser for QueryPropParser {
    fn parse_prop(&self, class: &Ident, class_prop: &ClassProp) -> Option<Box<dyn AngularProp>> {
        let (query_type, angular_prop_info) = Self::parse_query_prop_info(class_prop)?;
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

        Some(Box::new(QueryChildProp {
            query_type,
            class: class.clone(),
            name: angular_prop_info.name,
            required: angular_prop_info.required,
            locator,
            options,
        }))
    }
}

impl QueryPropParser {
    fn parse_query_prop_info(class_prop: &ClassProp) -> Option<(QueryType, AngularPropInfo)> {
        /* `viewChild` & `viewChildren` are probably more frequently used so let's
         * try to parse them first. */
        if let Some(prop_info) = parse_angular_prop(class_prop, "viewChild") {
            return Some((QueryType::ViewChild, prop_info));
        }

        if let Some(prop_info) = parse_angular_prop(class_prop, "viewChildren") {
            return Some((QueryType::ViewChildren, prop_info));
        }

        if let Some(prop_info) = parse_angular_prop(class_prop, "contentChild") {
            return Some((QueryType::ContentChild, prop_info));
        }

        if let Some(prop_info) = parse_angular_prop(class_prop, "contentChildren") {
            return Some((QueryType::ContentChildren, prop_info));
        }

        None
    }
}

enum QueryType {
    ContentChild,
    ContentChildren,
    ViewChild,
    ViewChildren,
}

pub struct QueryChildProp {
    query_type: QueryType,
    class: Ident,
    name: String,
    required: bool,
    locator: ExprOrSpread,
    options: Option<ObjectLit>,
}

impl AngularProp for QueryChildProp {
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

        let decorator_name = match self.query_type {
            QueryType::ContentChild => "ContentChild",
            QueryType::ContentChildren => "ContentChildren",
            QueryType::ViewChild => "ViewChild",
            QueryType::ViewChildren => "ViewChildren",
        };

        vec![AngularPropDecorator {
            class_ident: self.class.clone(),
            decorator_name: decorator_name.into(),
            decorator_args: vec![self.locator.clone(), Expr::Object(options).into()],
            property_name: self.name.clone(),
        }]
    }
}
