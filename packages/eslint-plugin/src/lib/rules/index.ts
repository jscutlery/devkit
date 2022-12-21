import { TSESLint } from '@typescript-eslint/utils';
import maxPublicExports from './max-public-exports';

export const rules: Record<string, TSESLint.RuleModule<string, unknown[]>> = {
  'max-public-exports': maxPublicExports,
};
