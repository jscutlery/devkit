use serde_json::Value;
use swc_core::ecma::{
    ast::Program,
    visit::{as_folder, FoldWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

use crate::component_decorator_visitor::{
    ComponentDecoratorVisitor, ComponentDecoratorVisitorOptions,
};
use crate::component_property_visitor::ComponentPropertyVisitor;

mod component_decorator_visitor;
mod component_property_visitor;

#[cfg(test)]
mod component_decorator_visitor_test;
mod import_declaration;
#[cfg(test)]
mod testing;

#[plugin_transform]
pub fn process_transform(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    let config: Option<Value> = metadata.get_transform_plugin_config().map(|config_str| {
        serde_json::from_str(config_str.as_str())
            .expect("Invalid @jscutlery/swc-angular-plugin config")
    });

    let import_styles = config
        .as_ref()
        .and_then(|value| value["importStyles"].as_bool())
        .unwrap_or_default();

    let style_inline_suffix = config
        .as_ref()
        .and_then(|value| value["styleInlineSuffix"].as_bool())
        .unwrap_or_default();

    let template_raw_suffix = config
        .as_ref()
        .and_then(|value| value["templateRawSuffix"].as_bool())
        .unwrap_or_default();

    program
        .fold_with(&mut as_folder(ComponentDecoratorVisitor::new(
            ComponentDecoratorVisitorOptions {
                import_styles,
                style_inline_suffix,
                template_raw_suffix,
            },
        )))
        .fold_with(&mut as_folder(ComponentPropertyVisitor::default()))
}
