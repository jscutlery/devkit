use swc_core::ecma::ast::{
    CallExpr, Callee, Expr, ExprOrSpread, ExprStmt, Ident, MemberExpr, MemberProp, Str,
};
use swc_ecma_utils::swc_ecma_ast::{ArrayLit, Lit, Stmt};

pub const ANGULAR_CORE_SYMBOL: &str = "_jsc_angular_core";

pub struct AngularPropDecorator {
    pub class_ident: Ident,
    pub decorator_name: String,
    pub decorator_args: Vec<ExprOrSpread>,
    pub property_name: String,
}

impl From<AngularPropDecorator> for Stmt {
    /**
     * Create the AST for an Angular prop decorator call using `_ts_decorate`.
     */
    fn from(decorator_info: AngularPropDecorator) -> Self {
        /* `require("@angular/core").{decorator_name}({decorator_args})` */
        let decorator_call = Expr::Call(CallExpr {
            callee: Callee::Expr(
                Expr::Member(MemberExpr {
                    obj: Expr::Ident(Ident {
                        sym: ANGULAR_CORE_SYMBOL.into(),
                        span: Default::default(),
                        optional: Default::default(),
                    })
                    .into(),
                    prop: MemberProp::Ident(create_ident(&decorator_info.decorator_name)),
                    span: Default::default(),
                })
                .into(),
            ),
            args: decorator_info.decorator_args,
            span: Default::default(),
            type_args: Default::default(),
        });

        /* `_ts_decorate(decorator, {class_ident}.prototype, "{property_name}")` */
        let decorate_call = Expr::Call(CallExpr {
            callee: create_callee("_ts_decorate"),
            args: vec![
                ExprOrSpread {
                    expr: Expr::Array(ArrayLit {
                        elems: vec![Some(ExprOrSpread {
                            expr: decorator_call.into(),
                            spread: Default::default(),
                        })],
                        span: Default::default(),
                    })
                    .into(),
                    spread: Default::default(),
                },
                ExprOrSpread {
                    expr: Expr::Member(MemberExpr {
                        obj: Expr::Ident(decorator_info.class_ident).into(),
                        prop: MemberProp::Ident(create_ident("prototype")),
                        span: Default::default(),
                    })
                    .into(),
                    spread: Default::default(),
                },
                ExprOrSpread {
                    expr: Expr::Lit(Lit::Str(Str {
                        value: decorator_info.property_name.into(),
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
