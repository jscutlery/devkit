use swc_core::ecma::{
    ast::Program,
    visit::{as_folder, FoldWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};
use component_decorator_visitor::ComponentDecoratorVisitor;

mod component_decorator_visitor;
mod input_visitor;

#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    let visitor = ComponentDecoratorVisitor::default();
    program.fold_with(&mut as_folder(visitor))
}
