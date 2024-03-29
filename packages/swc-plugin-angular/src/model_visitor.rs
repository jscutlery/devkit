use swc_core::ecma::ast::{CallExpr, ClassProp, Expr, Prop};
use swc_core::ecma::visit::{Visit, VisitWith};
use swc_ecma_utils::ExprExt;

use crate::utils::{get_prop_name_and_call, get_prop_value_as_string};

#[derive(Default)]
pub struct ModelVisitor {
    model_info: Option<ModelInfo>,
}

impl ModelVisitor {
    pub(crate) fn get_model_info(&mut self, class_prop: &ClassProp) -> Option<ModelInfo> {
        let (name, call) = match get_prop_name_and_call(class_prop) {
            Some(value) => value,
            None => return None,
        };

        call.visit_with(self);

        if let Some(model_info) = &mut self.model_info {
            model_info.name = name;
        }

        self.model_info.take()
    }
}

impl Visit for ModelVisitor {
    fn visit_call_expr(&mut self, call: &CallExpr) {
        let callee = match call.callee.as_expr()
        {
            Some(value_expr) => value_expr,
            None => return,
        };

        let required = match callee.as_expr() {
            /* false if `model()`. */
            Expr::Ident(ident) if ident.sym.eq("model") => false,
            /* true if `model.required(). */
            Expr::Member(member) if member.obj.as_ident().map_or(false, |i| i.sym.eq("model")) => {
                member.prop.clone().ident().map_or(false, |i| i.sym.eq("required"))
            }
            _ => return,
        };

        self.model_info = Some(ModelInfo { required, ..Default::default() });

        /* Options are either the first or second parameter depending on whether
         * the model is required.
         * e.g. model.required({alias: '...'}) or model(default, {alias: '...'}) */
        if let Some(options) = if required { call.args.first() } else { call.args.get(1) } {
            options.visit_children_with(self);
        }
    }

    fn visit_prop(&mut self, prop: &Prop) {
        let model_info = match &mut self.model_info {
            Some(model_info) => model_info,
            None => return,
        };

        model_info.alias = get_prop_value_as_string(prop, "alias".to_string());
    }
}

#[derive(Default)]
pub struct ModelInfo {
    pub name: String,
    pub alias: Option<String>,
    pub required: bool,
}
