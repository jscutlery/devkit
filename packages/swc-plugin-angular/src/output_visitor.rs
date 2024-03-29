use swc_core::ecma::ast::{CallExpr, ClassProp, Prop};
use swc_core::ecma::visit::{Visit, VisitWith};

use crate::utils::{get_prop_name_and_call, get_prop_value_as_string};

#[derive(Default)]
pub struct OutputVisitor {
    output_info: Option<OutputInfo>,
}

impl OutputVisitor {
    pub(crate) fn get_output_info(&mut self, class_prop: &ClassProp) -> Option<OutputInfo> {
        let (input_name, call) = match get_prop_name_and_call(class_prop) {
            Some(value) => value,
            None => return None,
        };

        call.visit_with(self);

        if let Some(output_info) = &mut self.output_info {
            output_info.name = input_name;
        }

        self.output_info.take()
    }
}

impl Visit for OutputVisitor {
    fn visit_call_expr(&mut self, call: &CallExpr) {
        if !call.callee.as_expr()
            .and_then(|expr| expr.as_ident())
            .map_or(false, |ident| ident.sym.eq("output")) {
            return;
        }

        self.output_info = Some(OutputInfo::default());

        if let Some(options) = call.args.first() {
            options.visit_children_with(self);
        }
    }

    fn visit_prop(&mut self, prop: &Prop) {
        let output_info = match &mut self.output_info {
            Some(output_info) => output_info,
            None => return,
        };

        output_info.alias = get_prop_value_as_string(prop, "alias".to_string());
    }
}

#[derive(Default)]
pub struct OutputInfo {
    pub name: String,
    pub alias: Option<String>,
}
