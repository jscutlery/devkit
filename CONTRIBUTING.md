# Contributing to @jscutlery/devkit

Thank you for your contribution 🤗!

## Guidelines

- Commits follow the [Angular commit convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
- Features and bug fixes should be covered by test cases
- Features should be documented in the README

## Building and testing the library

```sh
# install dependencies
yarn install

# run the tests
yarn test

# build the library
yarn build
```

## Using `npm link` or `yarn link`

In order to use the library locally on another project, you can use the `npm`|`yarn` link feature.

1. Head to the built package and inform npm|yarn about it:

```sh
cd dist/packages/{package-name}
yarn link # or npm link
```

2. Go to your project and link the package:

```sh
yarn link @jscutlery/{package-name} # or npm link @jscutlery/{package-name}
```
