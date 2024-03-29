use swc_core::ecma::ast::{ClassProp, Expr, ExprOrSpread, Prop};
use swc_core::ecma::ast::Lit::Str;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::swc_ecma_ast::Lit;

/**
 * Return the property name and the function call expression or None
 * if the property is not a function call.
 */
pub fn get_angular_prop(class_prop: &ClassProp, function_name: String) -> Option<AngularProp> {
    let key_ident = match class_prop.key.as_ident() {
        Some(key_ident) => key_ident,
        None => return None,
    };

    let call = match class_prop
        .value
        .as_ref()
        .and_then(|v| v.as_expr().as_call())
    {
        Some(call) => call,
        None => return None,
    };

    let callee = match call.callee.as_expr() {
        Some(value_expr) => value_expr,
        None => return None,
    };

    let required = match callee.as_expr() {
        /* e.g. false if `input()`. */
        Expr::Ident(ident) if ident.sym.eq(&function_name) => false,
        /* e.g. true if `input.required(). */
        Expr::Member(member)
        if member.obj.as_ident().map_or(false, |i| i.sym.eq(&function_name))
            && member.prop.clone().ident().map_or(false, |i| i.sym.eq("required")) => {
            true
        }
        _ => return None,
    };

    let angular_prop = AngularProp {
        name: key_ident.sym.to_string(),
        required,
        args: &call.args,
    };

    Some(angular_prop)
}

pub struct AngularProp<'lifetime> {
    pub name: String,
    pub required: bool,
    pub args: &'lifetime Vec<ExprOrSpread>,
}

pub fn get_prop_value_as_string(prop: &Prop, key: String) -> Option<String> {
    if let Some(Str(value)) = get_prop_value(prop, key) {
        return Some(value.value.as_str().to_string());
    }

    None
}

pub fn get_prop_value(prop: &Prop, key: String) -> Option<&Lit> {
    let key_value = match prop.as_key_value() {
        Some(key_value) => key_value,
        None => return None,
    };

    if key_value.key.as_ident()
        .map_or(false, |key_ident| key_ident.sym.eq(key.as_str())) {
        return key_value.value.as_lit();
    }

    None
}
