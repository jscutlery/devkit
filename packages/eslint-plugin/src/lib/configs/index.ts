import { TSESLint } from '@typescript-eslint/utils';
import recommended from './recommended';

export const configs: Record<string, TSESLint.Linter.Config> = {
  recommended,
};
