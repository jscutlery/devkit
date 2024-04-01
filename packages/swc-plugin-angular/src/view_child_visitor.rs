use swc_core::ecma::ast::{ClassProp, Expr, ExprOrSpread, Lit};

use crate::utils::get_angular_prop;

#[derive(Default)]
pub struct ViewChildVisitor {
    view_child_info: Option<ViewChildInfo>,
}

impl ViewChildVisitor {
    pub(crate) fn get_view_child_info(&mut self, class_prop: &ClassProp) -> Option<ViewChildInfo> {
        let angular_prop = match get_angular_prop(class_prop, "viewChild") {
            Some(value) => value,
            None => return None,
        };

        let locator = match angular_prop.args.get(0) {
            Some(ExprOrSpread { expr, .. }) => {
                let expr_ref = expr.as_ref();
                if let Expr::Lit(Lit::Str(str)) = expr_ref {
                    str.value.to_string()
                } else {
                    return None;
                }
            }
            _ => return None,
        };

        self.view_child_info = ViewChildInfo {
            name: angular_prop.name,
            required: angular_prop.required,
            locator,
        }
        .into();

        self.view_child_info.take()
    }
}

#[derive(Default)]
pub struct ViewChildInfo {
    pub name: String,
    pub required: bool,
    pub locator: String, // TODO: should handle type: ProviderToken<LocatorT> https://angular.io/api/core/ViewChildFunction#properties
}
