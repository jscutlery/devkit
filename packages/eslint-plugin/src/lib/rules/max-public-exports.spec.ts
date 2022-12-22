import { TSESLint } from '@typescript-eslint/utils';
import * as path from 'path';
import rule, { Options, MessageIds } from './max-public-exports';

const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
});

const valid: TSESLint.RunTests<MessageIds, Options>['valid'] = [
  {
    code: `export { A } from './a';`,
    options: [
      {
        max: 10,
        noExportAll: true,
      },
    ],
  },
];

const invalid: TSESLint.RunTests<MessageIds, Options>['invalid'] = [
  {
    code: `
    export { A, B, C, D, E, F, G, H, I, J, K, L, M } from './a';
    export * from './a';`,
    options: [
      {
        max: 3,
        noExportAll: true,
      },
    ],
    errors: [
      {
        messageId: MessageIds.MaxPublicExports,
        data: {
          max: 3,
          publicExportCount: 13,
        },
      },
      {
        messageId: MessageIds.NoUseOfExportAll,
      },
    ],
  },
];

ruleTester.run(path.parse(__filename).name, rule, {
  valid,
  invalid,
});
