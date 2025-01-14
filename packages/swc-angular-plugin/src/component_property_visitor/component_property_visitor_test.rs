use crate::component_property_visitor::ComponentPropertyVisitor;
use crate::testing::test_visitor;
use indoc::indoc;

#[test]
fn test_input() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
          myInput = input();
          anotherProperty = 'hello';
        }
        MyCmp = _ts_decorate([], MyCmp);
        "# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            myInput = input();
            anotherProperty = 'hello';
        }
        _ts_decorate([
            _jsc_angular_core.Input({
                isSignal: true
            })
        ], MyCmp.prototype, "myInput");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_input_required() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            myInput = input.required();
        }
        MyCmp = _ts_decorate([], MyCmp);
        "# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            myInput = input.required();
        }
        _ts_decorate([
            _jsc_angular_core.Input({
                isSignal: true,
                required: true
            })
        ], MyCmp.prototype, "myInput");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_input_alias() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            aliasedInput = input(undefined, {
                alias: 'myInputAlias'
            });
            nonAliasedInput = input({
                alias: 'this_is_a_default_value_not_an_alias'
            });
        }
        MyCmp = _ts_decorate([], MyCmp);
        "# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            aliasedInput = input(undefined, {
                alias: 'myInputAlias'
            });
            nonAliasedInput = input({
                alias: 'this_is_a_default_value_not_an_alias'
            });
        }
        _ts_decorate([
            _jsc_angular_core.Input({
                alias: 'myInputAlias',
                isSignal: true
            })
        ], MyCmp.prototype, "aliasedInput");
        _ts_decorate([
            _jsc_angular_core.Input({
                isSignal: true
            })
        ], MyCmp.prototype, "nonAliasedInput");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_input_required_alias() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            myInput = input.required({
                alias: 'myInputAlias'
            });
        }
        MyCmp = _ts_decorate([], MyCmp);
        "# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            myInput = input.required({
                alias: 'myInputAlias'
            });
        }
        _ts_decorate([
            _jsc_angular_core.Input({
                alias: 'myInputAlias',
                isSignal: true,
                required: true
            })
        ], MyCmp.prototype, "myInput");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_input_inline() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"function f() {
            class MyCmp {
                aliasedInput = input(undefined, {
                    alias: 'myInputAlias'
                });
                someMethod() {
                    console.log('another statement');
                    class AnotherInlineClass {}
                }
            }
        }
        MyCmp = _ts_decorate([], MyCmp);
        "# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        function f() {
            class MyCmp {
                aliasedInput = input(undefined, {
                    alias: 'myInputAlias'
                });
                someMethod() {
                    console.log('another statement');
                    class AnotherInlineClass {
                    }
                }
            }
            _ts_decorate([
                _jsc_angular_core.Input({
                    alias: 'myInputAlias',
                    isSignal: true
                })
            ], MyCmp.prototype, "aliasedInput");
        }
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_output() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            myOutput = output();
            anotherProperty = 'hello';
        }
        MyCmp = _ts_decorate([], MyCmp);
        "# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            myOutput = output();
            anotherProperty = 'hello';
        }
        _ts_decorate([
            _jsc_angular_core.Output()
        ], MyCmp.prototype, "myOutput");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_output_alias() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            myOutput = output({
                alias: 'myOutputAlias'
            });
        }
        MyCmp = _ts_decorate([], MyCmp);
        "# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            myOutput = output({
                alias: 'myOutputAlias'
            });
        }
        _ts_decorate([
            _jsc_angular_core.Output('myOutputAlias')
        ], MyCmp.prototype, "myOutput");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_output_from_observable() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            myOutput = outputFromObservable(source$);
        }
        MyCmp = _ts_decorate([], MyCmp);
        "# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            myOutput = outputFromObservable(source$);
        }
        _ts_decorate([
            _jsc_angular_core.Output()
        ], MyCmp.prototype, "myOutput");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_output_from_observable_with_alias() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            myOutput = outputFromObservable(source$, {
                alias: 'myOutputAlias'
            });
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            myOutput = outputFromObservable(source$, {
                alias: 'myOutputAlias'
            });
        }
        _ts_decorate([
            _jsc_angular_core.Output('myOutputAlias')
        ], MyCmp.prototype, "myOutput");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_model() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            myModel = model();
            anotherProperty = 'hello';
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            myModel = model();
            anotherProperty = 'hello';
        }
        _ts_decorate([
            _jsc_angular_core.Input({
                isSignal: true
            })
        ], MyCmp.prototype, "myModel");
        _ts_decorate([
            _jsc_angular_core.Output("myModelChange")
        ], MyCmp.prototype, "myModel");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_model_alias() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            myModel = model(null, {
                alias: 'myModelAlias'
            });
            nonAliasedModel = model({
                alias: 'this_is_a_default_value_not_an_alias'
            });
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            myModel = model(null, {
                alias: 'myModelAlias'
            });
            nonAliasedModel = model({
                alias: 'this_is_a_default_value_not_an_alias'
            });
        }
        _ts_decorate([
            _jsc_angular_core.Input({
                alias: 'myModelAlias',
                isSignal: true
            })
        ], MyCmp.prototype, "myModel");
        _ts_decorate([
            _jsc_angular_core.Output("myModelAliasChange")
        ], MyCmp.prototype, "myModel");
        _ts_decorate([
            _jsc_angular_core.Input({
                isSignal: true
            })
        ], MyCmp.prototype, "nonAliasedModel");
        _ts_decorate([
            _jsc_angular_core.Output("nonAliasedModelChange")
        ], MyCmp.prototype, "nonAliasedModel");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_model_required() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            myModel = model.required();
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            myModel = model.required();
        }
        _ts_decorate([
            _jsc_angular_core.Input({
                isSignal: true,
                required: true
            })
        ], MyCmp.prototype, "myModel");
        _ts_decorate([
            _jsc_angular_core.Output("myModelChange")
        ], MyCmp.prototype, "myModel");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_model_required_alias() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            myModel = model.required({
                alias: 'myModelAlias'
            });
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            myModel = model.required({
                alias: 'myModelAlias'
            });
        }
        _ts_decorate([
            _jsc_angular_core.Input({
                alias: 'myModelAlias',
                isSignal: true,
                required: true
            })
        ], MyCmp.prototype, "myModel");
        _ts_decorate([
            _jsc_angular_core.Output("myModelAliasChange")
        ], MyCmp.prototype, "myModel");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_view_child() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            titleEl = viewChild('title');
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            titleEl = viewChild('title');
        }
        _ts_decorate([
            _jsc_angular_core.ViewChild('title', {
                isSignal: true
            })
        ], MyCmp.prototype, "titleEl");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_view_child_with_options() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            titleEl = viewChild('title', {read: ElementRef});
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            titleEl = viewChild('title', {
                read: ElementRef
            });
        }
        _ts_decorate([
            _jsc_angular_core.ViewChild('title', {
                read: ElementRef,
                isSignal: true
            })
        ], MyCmp.prototype, "titleEl");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_view_child_required() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            titleEl = viewChild.required('title');
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            titleEl = viewChild.required('title');
        }
        _ts_decorate([
            _jsc_angular_core.ViewChild('title', {
                isSignal: true,
                required: true
            })
        ], MyCmp.prototype, "titleEl");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_view_child_required_with_options() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            titleEl = viewChild.required('title', {
                read: ElementRef
            });
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            titleEl = viewChild.required('title', {
                read: ElementRef
            });
        }
        _ts_decorate([
            _jsc_angular_core.ViewChild('title', {
                read: ElementRef,
                isSignal: true,
                required: true
            })
        ], MyCmp.prototype, "titleEl");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_view_child_component_ref() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            myComp = viewChild(MyComponent);
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            myComp = viewChild(MyComponent);
        }
        _ts_decorate([
            _jsc_angular_core.ViewChild(MyComponent, {
                isSignal: true
            })
        ], MyCmp.prototype, "myComp");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_view_child_component_ref_with_read() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            myComp = viewChild(MyComponent, { read: MyComponent });
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            myComp = viewChild(MyComponent, {
                read: MyComponent
            });
        }
        _ts_decorate([
            _jsc_angular_core.ViewChild(MyComponent, {
                read: MyComponent,
                isSignal: true
            })
        ], MyCmp.prototype, "myComp");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_view_children_with_options() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            itemEls = viewChildren('item', {
                read: ElementRef
            });
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            itemEls = viewChildren('item', {
                read: ElementRef
            });
        }
        _ts_decorate([
            _jsc_angular_core.ViewChildren('item', {
                read: ElementRef,
                isSignal: true
            })
        ], MyCmp.prototype, "itemEls");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_content_child_required_with_options() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            titleEl = contentChild.required('title', {
                descendants: true,
                read: ElementRef
            });
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            titleEl = contentChild.required('title', {
                descendants: true,
                read: ElementRef
            });
        }
        _ts_decorate([
            _jsc_angular_core.ContentChild('title', {
                descendants: true,
                read: ElementRef,
                isSignal: true,
                required: true
            })
        ], MyCmp.prototype, "titleEl");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_content_children_with_options() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            itemEls = contentChildren('item', {
                read: ElementRef
            });
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        class MyCmp {
            itemEls = contentChildren('item', {
                read: ElementRef
            });
        }
        _ts_decorate([
            _jsc_angular_core.ContentChildren('item', {
                read: ElementRef,
                isSignal: true
            })
        ], MyCmp.prototype, "itemEls");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_exported_class() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"export class MyCmp {
            myInput = input();
        }
        MyCmp = _ts_decorate([], MyCmp);"# },
        indoc! {
        r#"import * as _jsc_angular_core from "@angular/core";
        export class MyCmp {
            myInput = input();
        }
        _ts_decorate([
            _jsc_angular_core.Input({
                isSignal: true
            })
        ], MyCmp.prototype, "myInput");
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
fn test_do_not_add_angular_core_if_not_necessary() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r"class MyCmp {
        }
        MyCmp = _ts_decorate([], MyCmp);
        " },
        indoc! {
        r#"class MyCmp {
        }
        MyCmp = _ts_decorate([], MyCmp);
        "# },
    );
}

#[test]
/* Angular libraries are already partially compiled (i.e. decorators are removed,
 * and the classes are already decorated properly) so we don't need to transform them.
 *
 * It would probably be more thorough to collect classes that are decorated during a visitor
 * and then only transform those classes, but the quick workaround is to simply check
 * if `_ts_decorate` is used.
 *
 * Cf. https://github.com/jscutlery/devkit/issues/677 */
fn test_do_not_transform_if_file_already_partially_compiled() {
    test_visitor(
        ComponentPropertyVisitor::default(),
        indoc! {
        r#"class MyCmp {
            myInput = input();
        }
        "# },
        indoc! {
        r#"class MyCmp {
            myInput = input();
        }
        "# },
    );
}
