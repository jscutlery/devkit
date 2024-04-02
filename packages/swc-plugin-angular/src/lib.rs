use swc_core::ecma::{
    ast::Program,
    visit::{as_folder, FoldWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

use crate::component_decorator_visitor::ComponentDecoratorVisitor;
use crate::component_property_visitor::ComponentPropertyVisitor;

mod component_decorator_visitor;
mod component_property_visitor;
mod input_prop_parser;
mod model_prop_parser;
mod output_prop_parser;
mod utils;
mod view_child_prop_parser;

#[cfg(test)]
mod testing;

#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    program
        .fold_with(&mut as_folder(ComponentDecoratorVisitor::default()))
        .fold_with(&mut as_folder(ComponentPropertyVisitor::default()))
}
