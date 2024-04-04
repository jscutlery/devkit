use crate::component_decorator_visitor::ComponentDecoratorVisitorOptions;
use indoc::indoc;

use crate::testing::test_visitor;

use super::ComponentDecoratorVisitor;

#[test]
fn test_replace_template_url() {
    test_visitor(
        ComponentDecoratorVisitor::default(),
        indoc! {
        r#"class MyCmp {}
        MyCmp = _ts_decorate([
            Component({
                selector: 'app-hello',
                styleUrls: ['./style.css'],
                templateUrl: './hello.component.html'
            })
        ], MyCmp);"# },
        indoc! {
        r#"import _jsc_template_0 from "./hello.component.html";
        class MyCmp {
        }
        MyCmp = _ts_decorate([
            Component({
                selector: 'app-hello',
                styles: [],
                template: _jsc_template_0
            })
        ], MyCmp);
        "# },
    );
}

#[test]
fn test_replace_multiple_template_urls() {
    test_visitor(
        ComponentDecoratorVisitor::default(),
        indoc! {
        r#"class MyCmp0 {
        }
        MyCmp0 = _ts_decorate([
            Component({
                selector: 'app-hello',
                templateUrl: './hello-0.component.html'
            })
        ], MyCmp0);
        class MyCmp1 {
        }
        MyCmp1 = _ts_decorate([
            Component({
                selector: 'app-hello',
                templateUrl: './hello-1.component.html'
            })
        ], MyCmp1);"# },
        indoc! {
        r#"import _jsc_template_0 from "./hello-0.component.html";
        import _jsc_template_1 from "./hello-1.component.html";
        class MyCmp0 {
        }
        MyCmp0 = _ts_decorate([
            Component({
                selector: 'app-hello',
                template: _jsc_template_0
            })
        ], MyCmp0);
        class MyCmp1 {
        }
        MyCmp1 = _ts_decorate([
            Component({
                selector: 'app-hello',
                template: _jsc_template_1
            })
        ], MyCmp1);
        "# },
    );
}

#[test]
fn test_replace_style_url() {
    test_visitor(
        ComponentDecoratorVisitor::default(),
        indoc! {
        r#"class MyCmp {}
            MyCmp = _ts_decorate([
                Component({
                    selector: 'app-hello',
                    styleUrl: './style.css',
                    template: 'something'
                })
            ], MyCmp);"# },
        indoc! {
        r#"class MyCmp {
            }
            MyCmp = _ts_decorate([
                Component({
                    selector: 'app-hello',
                    styles: [],
                    template: 'something'
                })
            ], MyCmp);
            "# },
    );
}

#[test]
fn test_replace_urls_in_component_decorator_only() {
    test_visitor(
        ComponentDecoratorVisitor::default(),
        indoc! {
        r#"const something = {
            templateUrl: './this-is-an-unrelated-template-url.html'
        };
        class MyCmp {}
        MyCmp = _ts_decorate([
            Component({
                selector: 'app-hello',
                templateUrl: './hello.component.html'
            }),
            MyDecorator({
                templateUrl: './this-is-an-unrelated-template-url.html'
            })
        ], MyCmp);"# },
        indoc! {
        r#"import _jsc_template_0 from "./hello.component.html";
        const something = {
            templateUrl: './this-is-an-unrelated-template-url.html'
        };
        class MyCmp {
        }
        MyCmp = _ts_decorate([
            Component({
                selector: 'app-hello',
                template: _jsc_template_0
            }),
            MyDecorator({
                templateUrl: './this-is-an-unrelated-template-url.html'
            })
        ], MyCmp);
        "# },
    );
}

#[test]
fn test_append_relative_path_to_template_url() {
    test_visitor(
        ComponentDecoratorVisitor::default(),
        indoc! {
        r#"class MyCmp {}
        MyCmp = _ts_decorate([
            Component({
                selector: 'app-hello',
                templateUrl: 'hello.component.html'
            })
        ], MyCmp);"# },
        indoc! {
        r#"
        import _jsc_template_0 from "./hello.component.html";
        class MyCmp {
        }
        MyCmp = _ts_decorate([
            Component({
                selector: 'app-hello',
                template: _jsc_template_0
            })
        ], MyCmp);
        "# },
    );
}

#[ignore]
#[test]
fn test_add_raw_query_to_template_import() {
    test_visitor(
        ComponentDecoratorVisitor::new(ComponentDecoratorVisitorOptions {
            template_raw_suffix: true,
        }),
        indoc! {
        r#"class MyCmp {}
        MyCmp = _ts_decorate([
            Component({
                selector: 'app-hello',
                styleUrls: ['./style.css'],
                templateUrl: './hello.component.html'
            })
        ], MyCmp);"# },
        indoc! {
        r#"import _jsc_template_0 from "./hello.component.html?raw";
        class MyCmp {
        }
        MyCmp = _ts_decorate([
            Component({
                selector: 'app-hello',
                styles: [],
                template: _jsc_template_0
            })
        ], MyCmp);
        "# },
    );
}
