import { TSESLint } from '@typescript-eslint/utils';
import rule, { RULE_NAME } from './max-public-exports';
import * as parser from '@typescript-eslint/parser';

describe(RULE_NAME, () => {
  it('should pass', () => {
    const result = runRule(`export { A } from './a';`, 'foo.ts', {
      max: 3,
      noExportAll: true,
    });
    expect(result.length).toBe(0);
  });

  it('should fail', () => {
    const result = runRule(
      `
    export { A, B, C, D, E, F, G, H, I, J, K, L, M } from './a';
    export * from './a';`,
      'foo.ts',
      {
        max: 3,
        noExportAll: true,
      }
    );
    expect(result.length).toBe(2);
    expect(result[0].messageId).toBe('max-public-exports');
    expect(result[1].messageId).toBe('no-use-of-export-all');
  });
});

const linter = new TSESLint.Linter();

function runRule(content: string, contentPath: string, ruleArguments: any) {
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
