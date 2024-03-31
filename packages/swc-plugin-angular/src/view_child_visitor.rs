use swc_core::ecma::ast::{ClassProp, Prop, Str};
use swc_core::ecma::visit::Visit;

use crate::utils::{get_angular_prop, visit_functional_api_options};

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

        self.view_child_info = ViewChildInfo {
            name: angular_prop.name,
            required: angular_prop.required,
            ..Default::default()
        }
        .into();

        visit_functional_api_options(self, angular_prop.required, angular_prop.args);

        self.view_child_info.take()
    }
}

impl Visit for ViewChildVisitor {
  fn visit_prop(&mut self, _prop: &Prop) {
    let input_info = match &mut self.view_child_info {
      Some(view_child_info) => view_child_info,
      None => return,
    };

    // TODO: handle locator: class Component { myElement = viewChild('locator'); }
    input_info.locator = String::from("title");
  }
}

#[derive(Default)]
pub struct ViewChildInfo {
    pub name: String,
    pub required: bool,
    pub locator: String, // TODO: should handle type: string | ProviderToken<LocatorT> https://angular.io/api/core/ViewChildFunction#properties
}
