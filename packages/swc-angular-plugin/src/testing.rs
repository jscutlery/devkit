use ::testing::diff;
use ansi_term::Color;
use indoc::formatdoc;
use swc_core::ecma::parser::{Syntax, TsSyntax};
use swc_core::ecma::transforms::testing::Tester;
use swc_core::ecma::visit::{visit_mut_pass, VisitMut};

/// This is a helper function for testing the visitor.
/// We use it instead of the `test_inline!` macro because we are injecting raw code
/// and the expected result is transformed by `test_inline!` macro so there are cases
/// where we can't use it as we can't totally control the expected result.
/// The typical example is when we add a decorator call in the middle of a function
/// with no indentation.
pub fn test_visitor<V>(visitor: V, input: &str, expected: &str) where V: VisitMut {
    let syntax = Syntax::Typescript(TsSyntax::default());
    let transform = visit_mut_pass(visitor);
    let actual = Tester::run(|tester| {
        let result = tester.apply_transform(transform, "input.js", syntax, Some(true), input)?;
        Ok(tester.print(&result, &Default::default()))
    });

    if actual != expected {
        panic!(
            "{}",
            formatdoc! {
                r#"assertion failed: `(actual == expected)`
                ====ACTUAL====
                {actual}
                ===EXPECTED===
                {expected}
                =====DIFF=====
                {diff}
                ==============
                "#,
                actual = Color::Red.paint(actual.clone()),
                expected = Color::Green.paint(expected),
                diff = diff(&actual, expected),
            }
        );
    }
}

