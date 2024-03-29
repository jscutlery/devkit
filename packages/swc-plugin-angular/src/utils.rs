use swc_core::ecma::ast::{CallExpr, ClassProp, Prop};
use swc_core::ecma::ast::Lit::Str;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::swc_ecma_ast::Lit;

/**
 * Return the property name and the function call expression or None
 * if the property is not a function call.
 */
pub fn get_prop_name_and_call(class_prop: &ClassProp) -> Option<(String, &CallExpr)> {
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

    Some((key_ident.sym.to_string(), call))
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
