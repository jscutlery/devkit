use swc_core::ecma::ast::{
    Callee, CallExpr, Expr, ExprOrSpread, ExprStmt, Ident, MemberExpr, MemberProp, Str,
};
use swc_ecma_utils::swc_ecma_ast::{Lit, Stmt};

pub struct DecoratorInfo {
    pub class_ident: Ident,
    pub decorator_name: String,
    pub property_name: String,
}

/**
 * Create the AST for a decorator call using `_ts_decorate`.
 */
#[deprecated(note="🚧 work in progress")]
pub fn create_decorate_expr(decorator_info: &DecoratorInfo) -> Stmt {
    /* `require("@angular/core")` */
    let angular_core = Expr::Call(CallExpr {
        callee: create_callee("require"),
        args: vec![ExprOrSpread {
            spread: None,
            expr: Expr::Lit(Lit::Str(Str {
                value: "@angular/core".into(),
                raw: Default::default(),
                span: Default::default(),
            }))
            .into(),
        }],
        span: Default::default(),
        type_args: Default::default(),
    });

    /* `require("@angular/core").{decorator_name}()` */
    let decorator_call = Expr::Call(CallExpr {
        callee: Callee::Expr(
            Expr::Member(MemberExpr {
                obj: angular_core.into(),
                prop: MemberProp::Ident(create_ident(&decorator_info.decorator_name)),
                span: Default::default(),
            })
            .into(),
        ),
        args: vec![],
        span: Default::default(),
        type_args: Default::default(),
    });

    /* `_ts_decorate(decorator, {class_ident}.prototype, "{property_name}")` */
    let decorate_call = Expr::Call(CallExpr {
        callee: create_callee("_ts_decorate"),
        args: vec![
            ExprOrSpread {
                expr: decorator_call.into(),
                spread: Default::default(),
            },
            ExprOrSpread {
                expr: Expr::Member(MemberExpr {
                    obj: Expr::Ident(decorator_info.class_ident.clone()).into(),
                    prop: MemberProp::Ident(create_ident("prototype")),
                    span: Default::default(),
                })
                .into(),
                spread: Default::default(),
            },
            ExprOrSpread {
                expr: Expr::Lit(Lit::Str(Str {
                    value: decorator_info.property_name.clone().into(),
                    span: Default::default(),
                    raw: Default::default(),
                }))
                .into(),
                spread: Default::default(),
            },
        ],
        span: Default::default(),
        type_args: Default::default(),
    });

    Stmt::Expr(ExprStmt {
        expr: decorate_call.into(),
        span: Default::default(),
    })
}

fn create_callee(ident: &str) -> Callee {
    Callee::Expr(Expr::Ident(create_ident(ident)).into())
}

fn create_ident(ident: &str) -> Ident {
    Ident {
        sym: ident.into(),
        span: Default::default(),
        optional: Default::default(),
    }
}
