use component_decorator_visitor::ComponentDecoratorVisitor;
use input_visitor::InputVisitor;
use swc_core::ecma::{
    ast::Program,
    visit::{as_folder, FoldWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

mod component_decorator_visitor;
mod input_visitor;

#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    let component_decorator_visitor = ComponentDecoratorVisitor::default();
    let input_visitor = InputVisitor::default();
    program
        .fold_with(&mut as_folder(component_decorator_visitor))
        .fold_with(&mut as_folder(input_visitor))
}
