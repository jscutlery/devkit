use std::ops::Deref;

use swc_core::{common::SyntaxContext, ecma::ast::{
    ClassProp, Expr, ExprOrSpread, Ident, KeyValueProp, Lit, ObjectLit, Prop, PropName,
    PropOrSpread,
}};
use swc_ecma_utils::ExprExt;

/**
 * Return the property name and the function call expression or None
 * if the property is not a function call.
 */
pub fn parse_angular_prop<'prop>(
    class_prop: &'prop ClassProp,
    function_name: &str,
) -> Option<AngularPropInfo<'prop>> {
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
            if member
                .obj
                .as_ident()
                .map_or(false, |i| i.sym.eq(&function_name))
                && member
                    .prop
                    .clone()
                    .ident()
                    .map_or(false, |i| i.sym.eq("required")) =>
        {
            true
        }
        _ => return None,
    };

    let angular_prop = AngularPropInfo {
        name: key_ident.sym.to_string(),
        required,
        args: &call.args,
    };

    Some(angular_prop)
}

pub struct AngularPropInfo<'lifetime> {
    pub name: String,
    pub required: bool,
    pub args: &'lifetime Vec<ExprOrSpread>,
}

pub fn get_prop_value(options: &ObjectLit, key: &str) -> Option<Expr> {
    for prop in &options.props {
        let key_value = match prop.as_prop().and_then(|prop| prop.as_key_value()) {
            Some(key_value) => key_value,
            None => return None,
        };

        if let Some(true) = key_value.key.as_ident().map(|k| k.sym.eq(key)) {
            return Some(key_value.value.deref().clone());
        }
    }

    None
}

pub fn set_option(options: &mut ObjectLit, key: &str, value: bool) {
    options.props.push(PropOrSpread::Prop(
        Prop::KeyValue(KeyValueProp {
            key: PropName::Ident(Ident::new(key.into(), Default::default(), SyntaxContext::default()).into()),
            value: Expr::Lit(Lit::Bool(value.into())).into(),
        })
        .into(),
    ));
}
