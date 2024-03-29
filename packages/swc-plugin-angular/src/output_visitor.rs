use swc_core::ecma::ast::{CallExpr, ClassProp, Prop};
use swc_core::ecma::ast::Lit::Str as LitStr;
use swc_core::ecma::visit::{Visit, VisitWith};

use crate::utils::get_prop_name_and_call;

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

        let key_value = match prop.as_key_value() {
            Some(key_value) => key_value,
            None => return,
        };

        if let Some(true) = key_value.key.as_ident().map(|key| key.sym.eq("alias")) {
            if let Some(LitStr(str)) = key_value.value.as_lit() {
                output_info.alias = Some(str.value.as_str().to_string());
            }
        }
    }
}

#[derive(Default)]
pub struct OutputInfo {
    pub name: String,
    pub alias: Option<String>,
}
