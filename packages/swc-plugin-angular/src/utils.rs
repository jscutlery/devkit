use swc_core::ecma::ast::{CallExpr, ClassProp};
use swc_ecma_utils::ExprExt;

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
