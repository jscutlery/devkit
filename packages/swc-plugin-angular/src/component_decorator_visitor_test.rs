use indoc::indoc;

use crate::testing::test_visitor;

use super::ComponentDecoratorVisitor;

#[test]
fn test_replace_urls() {
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
        r#"class MyCmp {
            }
            MyCmp = _ts_decorate([
                Component({
                    selector: 'app-hello',
                    styles: [],
                    template: require("./hello.component.html")
                })
            ], MyCmp);
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
                    templateUrl: './hello.component.html'
                })
            ], MyCmp);"# },
        indoc! {
        r#"class MyCmp {
            }
            MyCmp = _ts_decorate([
                Component({
                    selector: 'app-hello',
                    styles: [],
                    template: require("./hello.component.html")
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
                    styleUrls: ['./style.css'],
                    templateUrl: './hello.component.html'
                }),
                MyDecorator({
                    templateUrl: './this-is-an-unrelated-template-url.html'
                })
            ], MyCmp);"# },
        indoc! {
        r#"const something = {
                templateUrl: './this-is-an-unrelated-template-url.html'
            };
            class MyCmp {
            }
            MyCmp = _ts_decorate([
                Component({
                    selector: 'app-hello',
                    styles: [],
                    template: require("./hello.component.html")
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
        r#"class MyCmp {
            }
            MyCmp = _ts_decorate([
                Component({
                    selector: 'app-hello',
                    template: require("./hello.component.html")
                })
            ], MyCmp);
            "# },
    );
}
