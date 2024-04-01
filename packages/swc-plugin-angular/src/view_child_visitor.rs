use swc_core::ecma::{ast::{ClassProp, Expr, ExprOrSpread, Lit, Prop}, visit::Visit};

use crate::utils::{get_angular_prop, get_prop_value_as_string, visit_functional_api_options};

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

        let locator = match angular_prop.args.first() {
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
            ..Default::default()
        }
        .into();

        visit_functional_api_options(self, angular_prop.required, angular_prop.args);

        self.view_child_info.take()
    }
}

impl Visit for ViewChildVisitor {
  fn visit_prop(&mut self, prop: &Prop) {
      let view_child_info = match &mut self.view_child_info {
          Some(view_child_info) => view_child_info,
          None => return,
      };


      // TODO: not working, view_child_info.read is always None.
      view_child_info.read = get_prop_value_as_string(prop, "read");
  }
}

#[derive(Default)]
pub struct ViewChildInfo {
    pub name: String,
    pub required: bool,
    pub locator: String, // TODO: should handle type: ProviderToken<LocatorT> https://angular.io/api/core/ViewChildFunction#properties
    pub read: Option<String>,
}
