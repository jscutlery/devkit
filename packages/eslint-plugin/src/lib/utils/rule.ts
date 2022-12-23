/* eslint-disable @typescript-eslint/no-explicit-any */
import * as parser from '@typescript-eslint/parser';
import { TSESLint } from '@typescript-eslint/utils';

const linter = new TSESLint.Linter();

export function configureRule<TOptions extends readonly unknown[] = []>(
  name: string,
  rule: TSESLint.RuleModule<string, TOptions>
) {
  return function runRule(
    content: string,
    contentPath: string,
    args: TOptions[0] = []
  ) {
    const config = {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2018 as const,
        sourceType: 'module' as const,
      },
      rules: {
        [name]: ['error', args],
      },
    };
    linter.defineParser('@typescript-eslint/parser', parser as any);
    linter.defineRule(name, rule);

    return linter.verify(content, config as any, contentPath);
  };
}
