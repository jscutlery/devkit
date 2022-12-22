import * as parser from '@typescript-eslint/parser';
import { TSESLint } from '@typescript-eslint/utils';
import rule, { Options, RULE_NAME } from './max-public-exports';

describe(RULE_NAME, () => {
  it('should allow few public exports when max is set', () => {
    const result = runRule(`export { A, B, C } from './a';`, 'foo.ts', {
      max: 3,
    });

    expect(result).toEqual([]);
  });

  it('should reject too many public exports when max is set', () => {
    const result = runRule(`export { A, B, C, D } from './a';`, 'foo.ts', {
      max: 3,
    });

    expect(result).toEqual([
      expect.objectContaining({
        messageId: 'max-public-exports',
      }),
    ]);
  });

  it('should allow explicit exports when noExportAll is set to true', () => {
    const result = runRule(`export { A } from './a';`, 'foo.ts', {
      noExportAll: true,
    });
    expect(result).toEqual([]);
  });

  it('should reject barrel exports when noExportAll is set to true', () => {
    const result = runRule(`export * from './a';`, 'foo.ts', {
      noExportAll: true,
    });

    expect(result).toEqual([
      expect.objectContaining({
        messageId: 'no-use-of-export-all',
      }),
    ]);
  });
});

const linter = new TSESLint.Linter();

function runRule(
  content: string,
  contentPath: string,
  ruleArguments: Options[0]
) {
  const config = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2018 as const,
      sourceType: 'module' as const,
    },
    rules: {
      [RULE_NAME]: ['error', ruleArguments],
    },
  };
  linter.defineParser('@typescript-eslint/parser', parser as any);
  linter.defineRule(RULE_NAME, rule);

  return linter.verify(content, config as any, contentPath);
}
