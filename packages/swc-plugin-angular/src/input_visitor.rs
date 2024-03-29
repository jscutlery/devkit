use swc_core::ecma::ast::{CallExpr, ClassProp, Expr, Prop};
use swc_core::ecma::ast::Lit::Str as LitStr;
use swc_core::ecma::visit::{Visit, VisitWith};
use swc_ecma_utils::ExprExt;

#[derive(Default)]
pub struct InputVisitor {
    input_info: Option<InputInfo>,
}

impl InputVisitor {
    pub(crate) fn get_input_info(&mut self, class_prop: &ClassProp) -> Option<InputInfo> {
        let key_ident = match class_prop.key.as_ident() {
            Some(key_ident) => key_ident,
            None => return None,
        };
        let input_name = key_ident.sym.to_string();

        let call = match class_prop
            .value
            .as_ref()
            .and_then(|v| v.as_expr().as_call())
        {
            Some(call) => call,
            None => return None,
        };

        call.visit_with(self);

        if let Some(input_info) = &mut self.input_info {
            input_info.name = input_name;
        }

        self.input_info.take()
    }
}

impl Visit for InputVisitor {
    fn visit_call_expr(&mut self, call: &CallExpr) {
        let callee = match call.callee.as_expr()
        {
            Some(value_expr) => value_expr,
            None => return,
        };

        let required = match callee.as_expr() {
            /* false if `input()`. */
            Expr::Ident(ident) if ident.sym.eq("input") => false,
            /* true if `input.required(). */
            Expr::Member(member) => {
                member.obj.as_ident().map_or(false, |i| i.sym.eq("input"))
                    && member.prop.clone().ident().map_or(false, |i| i.sym.eq("required"))
            }
            _ => return,
        };

        self.input_info = Some(InputInfo { required, ..Default::default() });

        /* Options are either the first or second parameter depending on whether
         * the input is required.
         * e.g. input.required({alias: '...'}) or input(default, {alias: '...'}) */
        if let Some(options) = if required { call.args.first() } else { call.args.get(1) } {
            options.visit_children_with(self);
        }
    }

    fn visit_prop(&mut self, prop: &Prop) {
        let input_info = match &mut self.input_info {
            Some(input_info) => input_info,
            None => return,
        };

        let key_value = match prop.as_key_value() {
            Some(key_value) => key_value,
            None => return,
        };

        if let Some(true) = key_value.key.as_ident().map(|key| key.sym.eq("alias")) {
            if let Some(LitStr(str)) = key_value.value.as_lit() {
                input_info.alias = Some(str.value.as_str().to_string());
            }
        }
    }
}

#[derive(Default)]
pub struct InputInfo {
    pub name: String,
    pub alias: Option<String>,
    pub required: bool,
}
