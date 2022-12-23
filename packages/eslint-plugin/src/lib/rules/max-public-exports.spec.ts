import { configureRule } from '../utils/rule';
import rule, { Options, RULE_NAME } from './max-public-exports';

describe(RULE_NAME, () => {
  const runRule = configureRule<Options>(RULE_NAME, rule);

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
