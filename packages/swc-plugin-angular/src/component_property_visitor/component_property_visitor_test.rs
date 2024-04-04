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
            }"# },
        indoc! {
        r#"class MyCmp {
                myInput = input();
                anotherProperty = 'hello';
            }
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true
                })
            ], MyCmp.prototype, "myInput");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                myInput = input.required();
            }
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true,
                    required: true
                })
            ], MyCmp.prototype, "myInput");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                aliasedInput = input(undefined, {
                    alias: 'myInputAlias'
                });
                nonAliasedInput = input({
                    alias: 'this_is_a_default_value_not_an_alias'
                });
            }
            _ts_decorate([
                require("@angular/core").Input({
                    alias: 'myInputAlias',
                    isSignal: true
                })
            ], MyCmp.prototype, "aliasedInput");
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true
                })
            ], MyCmp.prototype, "nonAliasedInput");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                myInput = input.required({
                    alias: 'myInputAlias'
                });
            }
            _ts_decorate([
                require("@angular/core").Input({
                    alias: 'myInputAlias',
                    isSignal: true,
                    required: true
                })
            ], MyCmp.prototype, "myInput");
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
            }"# },
        indoc! {
        r#"function f() {
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
                    require("@angular/core").Input({
                        alias: 'myInputAlias',
                        isSignal: true
                    })
                ], MyCmp.prototype, "aliasedInput");
            }
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
            }"# },
        indoc! {
        r#"class MyCmp {
                myOutput = output();
                anotherProperty = 'hello';
            }
            _ts_decorate([
                require("@angular/core").Output()
            ], MyCmp.prototype, "myOutput");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                myOutput = output({
                    alias: 'myOutputAlias'
                });
            }
            _ts_decorate([
                require("@angular/core").Output('myOutputAlias')
            ], MyCmp.prototype, "myOutput");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                myOutput = outputFromObservable(source$);
            }
            _ts_decorate([
                require("@angular/core").Output()
            ], MyCmp.prototype, "myOutput");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                myOutput = outputFromObservable(source$, {
                    alias: 'myOutputAlias'
                });
            }
            _ts_decorate([
                require("@angular/core").Output('myOutputAlias')
            ], MyCmp.prototype, "myOutput");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                myModel = model();
                anotherProperty = 'hello';
            }
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true
                })
            ], MyCmp.prototype, "myModel");
            _ts_decorate([
                require("@angular/core").Output("myModelChange")
            ], MyCmp.prototype, "myModel");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                myModel = model(null, {
                    alias: 'myModelAlias'
                });
                nonAliasedModel = model({
                    alias: 'this_is_a_default_value_not_an_alias'
                });
            }
            _ts_decorate([
                require("@angular/core").Input({
                    alias: 'myModelAlias',
                    isSignal: true
                })
            ], MyCmp.prototype, "myModel");
            _ts_decorate([
                require("@angular/core").Output("myModelAliasChange")
            ], MyCmp.prototype, "myModel");
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true
                })
            ], MyCmp.prototype, "nonAliasedModel");
            _ts_decorate([
                require("@angular/core").Output("nonAliasedModelChange")
            ], MyCmp.prototype, "nonAliasedModel");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                myModel = model.required();
            }
            _ts_decorate([
                require("@angular/core").Input({
                    isSignal: true,
                    required: true
                })
            ], MyCmp.prototype, "myModel");
            _ts_decorate([
                require("@angular/core").Output("myModelChange")
            ], MyCmp.prototype, "myModel");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                myModel = model.required({
                    alias: 'myModelAlias'
                });
            }
            _ts_decorate([
                require("@angular/core").Input({
                    alias: 'myModelAlias',
                    isSignal: true,
                    required: true
                })
            ], MyCmp.prototype, "myModel");
            _ts_decorate([
                require("@angular/core").Output("myModelAliasChange")
            ], MyCmp.prototype, "myModel");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                titleEl = viewChild('title');
            }
            _ts_decorate([
                require("@angular/core").ViewChild('title', {
                    isSignal: true
                })
            ], MyCmp.prototype, "titleEl");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                titleEl = viewChild('title', {
                    read: ElementRef
                });
            }
            _ts_decorate([
                require("@angular/core").ViewChild('title', {
                    read: ElementRef,
                    isSignal: true
                })
            ], MyCmp.prototype, "titleEl");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                titleEl = viewChild.required('title');
            }
            _ts_decorate([
                require("@angular/core").ViewChild('title', {
                    isSignal: true,
                    required: true
                })
            ], MyCmp.prototype, "titleEl");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                titleEl = viewChild.required('title', {
                    read: ElementRef
                });
            }
            _ts_decorate([
                require("@angular/core").ViewChild('title', {
                    read: ElementRef,
                    isSignal: true,
                    required: true
                })
            ], MyCmp.prototype, "titleEl");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                myComp = viewChild(MyComponent);
            }
            _ts_decorate([
                require("@angular/core").ViewChild(MyComponent, {
                    isSignal: true
                })
            ], MyCmp.prototype, "myComp");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                myComp = viewChild(MyComponent, {
                    read: MyComponent
                });
            }
            _ts_decorate([
                require("@angular/core").ViewChild(MyComponent, {
                    read: MyComponent,
                    isSignal: true
                })
            ], MyCmp.prototype, "myComp");
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
            }"# },
        indoc! {
        r#"class MyCmp {
                itemEls = viewChildren('item', {
                    read: ElementRef
                });
            }
            _ts_decorate([
                require("@angular/core").ViewChildren('item', {
                    read: ElementRef,
                    isSignal: true
                })
            ], MyCmp.prototype, "itemEls");
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
        }"# },
        indoc! {
        r#"class MyCmp {
            titleEl = contentChild.required('title', {
                descendants: true,
                read: ElementRef
            });
        }
        _ts_decorate([
            require("@angular/core").ContentChild('title', {
                descendants: true,
                read: ElementRef,
                isSignal: true,
                required: true
            })
        ], MyCmp.prototype, "titleEl");
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
        }"# },
        indoc! {
        r#"class MyCmp {
            itemEls = contentChildren('item', {
                read: ElementRef
            });
        }
        _ts_decorate([
            require("@angular/core").ContentChildren('item', {
                read: ElementRef,
                isSignal: true
            })
        ], MyCmp.prototype, "itemEls");
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
        }"# },
        indoc! {
        r#"export class MyCmp {
            myInput = input();
        }
        _ts_decorate([
            require("@angular/core").Input({
                isSignal: true
            })
        ], MyCmp.prototype, "myInput");
        "# },
    );
}
