use swc_core::ecma::ast::{ClassProp, ExprOrSpread};

use crate::utils::get_angular_prop;

#[derive(Default)]
pub struct ViewChildVisitor {
}

impl ViewChildVisitor {
    pub(crate) fn get_view_child_info(&mut self, class_prop: &ClassProp) -> Option<ViewChildInfo> {
        let angular_prop = match get_angular_prop(class_prop, "viewChild") {
            Some(value) => value,
            None => return None,
        };

        Some(ViewChildInfo {
            name: angular_prop.name,
            required: angular_prop.required,
            /* We have to clone the args anyway so let's do it here.
             * That's because they have to be kept in memory by the parent visitor until
             * the end of the visit in order to add the decorator statement. */
            args: angular_prop.args.clone(),
        })
    }
}

#[derive(Default)]
pub struct ViewChildInfo {
    pub name: String,
    pub required: bool,
    pub args: Vec<ExprOrSpread>,
}
