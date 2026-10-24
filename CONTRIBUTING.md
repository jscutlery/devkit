# Contributing to @jscutlery/devkit

Thank you for your contribution 🤗!

## Guidelines

- Commits follow the [Angular commit convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
- Features and bug fixes should be covered by test cases
- Features should be documented in the README

## Building and testing the library

```sh
# install dependencies
pnpm install

# run the tests
pnpm test

# build the library
pnpm build
```

## Using `pnpm link` or `npm link`

In order to use the library locally on another project, build it, then link the built package from your project:

```sh
pnpm link {path-to-devkit}/dist/packages/{package-name}
# or, with npm
npm link {path-to-devkit}/dist/packages/{package-name}
```
