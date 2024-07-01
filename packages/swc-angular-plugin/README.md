# ⚡️ Angular SWC Plugin 🦀

## What is this?

[SWC (Speedy Web Compiler)](https://swc.rs) is a lightning-fast JavaScript/TypeScript compiler, but it doesn't support
Angular even when using JIT _(Just-In-Time)_ compilation because Angular requires some additional transformations:

- `Component.templateUrl` => `Component.template`
- `Component.styleUrls` & `Component.styleUrl` => `Component.styles`
- Additional metadata for `input()`, `output()`, `viewChild()`, etc...

That is when this plugin comes in. It is a SWC plugin that adds support for Angular.

_Note that this plugin is not a replacement for the Angular compiler, and it won't work without the JIT compiler.
This means that while it is suitable for testing, it shouldn't be used to build production applications._

## Try it now with your Jest tests

Cf. [`@jscutlery/swc-angular`](../swc-angular/README.md)

## Config

```ts
[
  '@jscutlery/swc-angular-plugin',
  {
    // this plugin removes styles by default, enable this to transform style urls to style imports
    importStyles?: boolean,
    // add ?inline suffix to style imports for vite support
    styleInlineSuffix?: boolean,
    // add ?raw suffix to template imports for vite support
    templateRawSuffix?: boolean,
  }
]
```
