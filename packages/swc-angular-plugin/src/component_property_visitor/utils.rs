use std::ops::Deref;

use swc_core::{common::SyntaxContext, ecma::ast::{
    Callee, ClassProp, Expr, ExprOrSpread, Ident, KeyValueProp, Lit, ObjectLit, Prop, PropName,
    PropOrSpread,
}};

/**
 * Return the property name and the function call expression or None
 * if the property is not a function call.
 */
pub fn parse_angular_prop<'prop>(
    class_prop: &'prop ClassProp,
    function_name: &str,
) -> Option<AngularPropInfo<'prop>> {
    let key_ident = class_prop.key.as_ident()?;

    let call = match class_prop.value.as_ref()?.as_ref() {
        Expr::Call(call) => call,
        _ => return None,
    };

    let callee = match &call.callee {
        Callee::Expr(expr) => expr.as_ref(),
        _ => return None,
    };

    let required = match callee {
        /* e.g. false if `input()`. */
        Expr::Ident(ident) if ident.sym.eq(&function_name) => false,
        /* e.g. true if `input.required(). */
        Expr::Member(member)
            if member
                .obj
                .as_ident()
                .is_none_or(|i| i.sym.eq(&function_name))
                && member
                    .prop
                    .clone()
                    .ident()
                    .is_none_or(|i| i.sym.eq("required")) =>
        {
            true
        }
        _ => return None,
    };

    let angular_prop = AngularPropInfo {
        name: key_ident.sym.as_str().to_string(),
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
        let key_value = prop.as_prop().and_then(|prop| prop.as_key_value())?;

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
