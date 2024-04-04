use swc_core::ecma::ast::{
    Ident, ImportDecl, ImportDefaultSpecifier, ImportStarAsSpecifier, ModuleDecl, ModuleItem, Str,
};

pub struct ImportDeclaration {
    pub specifier: ImportDeclarationSpecifier,
    pub source: String,
}

pub enum ImportDeclarationSpecifier {
    Default(String),
    StarAs(String),
}

impl From<ImportDeclaration> for ModuleItem {
    fn from(import: ImportDeclaration) -> Self {
        let specifier = match import.specifier {
            ImportDeclarationSpecifier::Default(symbol) => ImportDefaultSpecifier {
                span: Default::default(),
                local: Ident {
                    span: Default::default(),
                    sym: symbol.into(),
                    optional: false,
                },
            }
            .into(),
            ImportDeclarationSpecifier::StarAs(symbol) => ImportStarAsSpecifier {
                span: Default::default(),
                local: Ident {
                    span: Default::default(),
                    sym: symbol.into(),
                    optional: false,
                },
            }
            .into(),
        };

        ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
            span: Default::default(),
            specifiers: vec![specifier],
            src: Str {
                value: import.source.into(),
                span: Default::default(),
                raw: Default::default(),
            }
            .into(),
            type_only: Default::default(),
            with: Default::default(),
            phase: Default::default(),
        }))
    }
}
