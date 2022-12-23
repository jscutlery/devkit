import { TSESLint } from '@typescript-eslint/utils';
import maxPublicExports from './max-public-exports';
import preferInline from './prefer-inline';

export const rules: Record<string, TSESLint.RuleModule<string, unknown[]>> = {
  'max-public-exports': maxPublicExports,
  'prefer-inline': preferInline,
};
