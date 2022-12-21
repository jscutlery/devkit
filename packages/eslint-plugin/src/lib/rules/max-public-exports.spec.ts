import { TSESLint } from '@typescript-eslint/utils';
import { readFileSync } from 'fs';
import * as path from 'path';
import rule, { Options, MessageIds } from './max-public-exports';

const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
});

const valid: TSESLint.RunTests<MessageIds, Options>['valid'] = [
  {
    code: readFileSync(path.resolve(__dirname, '../tests/export.ts'), { encoding: 'utf-8' }),
    filename: path.resolve(__dirname, '../tests/too-many-exports.ts'),
    options: [
      {
        entry: path.resolve(__dirname, '../tests/export.ts'),
        max: 10,
        noExportAll: true,
      },
    ],
  },
];

const invalid: TSESLint.RunTests<MessageIds, Options>['invalid'] = [
  {
    code: readFileSync(path.resolve(__dirname, '../tests/too-many-exports.ts'), { encoding: 'utf-8' }),
    filename: path.resolve(__dirname, '../tests/too-many-exports.ts'),
    options: [
      {
        entry: path.resolve(__dirname, '../tests/too-many-exports.ts'),
        max: 3,
        noExportAll: true,
      },
    ],
    errors: [
      {
        messageId: MessageIds.MaxPublicExports,
        data: { entryPath: path.resolve(__dirname, '../tests/too-many-exports.ts'), max: 3, publicExportCount: 13 },
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
