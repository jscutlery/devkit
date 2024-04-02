use crate::component_property_visitor::angular_prop_decorator::AngularPropDecorator;

pub(crate) trait AngularProp {
    /* Some props like `model()` require multiple decorators: `Input()` + `Output()`.
     * That is why we need a vector. */
    fn to_decorators(self) -> Vec<AngularPropDecorator>;
}
