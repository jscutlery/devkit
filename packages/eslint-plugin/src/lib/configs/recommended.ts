import { TSESLint } from '@typescript-eslint/utils';

export default {
  parser: '@typescript-eslint/parser',
  plugins: ['@jscutlery'],
  rules: {
    '@jscutlery/max-public-exports': 'error',
  },
} as TSESLint.Linter.Config;
