use swc_core::ecma::visit::VisitMut;

#[derive(Default)]
pub struct InputVisitor {
}

impl VisitMut for InputVisitor {

}


#[cfg(test)]
mod tests {
    use swc_core::ecma::{transforms::testing::test_inline, visit::as_folder};
    use swc_ecma_parser::{Syntax, TsConfig};

    use super::InputVisitor;

    test_inline!(
        ignore,
        Syntax::Typescript(TsConfig::default()),
        |_| as_folder(InputVisitor::default()),
        decorate_input,
        r#"
        class MyCmp {
          myInput = input();
        }
        "#,
        r#"
        class MyCmp {
          myInput = input();
        }
        _ts_decorate([
          Input({isSignal: true})
        ], MyCmp.prototype, "myInput");
        "#
    );

}
