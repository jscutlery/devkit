use swc_core::ecma::{
    ast::Program,
    visit::{as_folder, FoldWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

use component_decorator_visitor::ComponentDecoratorVisitor;
use input_visitor::InputVisitor;

mod component_decorator_visitor;
mod input_visitor;

#[cfg(test)]
mod testing;

#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    program
        .fold_with(&mut as_folder(ComponentDecoratorVisitor::default()))
        .fold_with(&mut as_folder(InputVisitor::default()))
}
