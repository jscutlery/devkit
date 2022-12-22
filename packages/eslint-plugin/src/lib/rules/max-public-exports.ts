import { parse } from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { ExportNamedDeclaration } from '@typescript-eslint/types/dist/generated/ast-spec';
import { getDocsUrl } from '../utils/docs';

export const enum MessageIds {
  NoUseOfExportAll = 'no-use-of-export-all',
  MaxPublicExports = 'max-public-exports',
}

export type Options = [{
  max: number;
  noExportAll: boolean;
}];

const createRule = ESLintUtils.RuleCreator(getDocsUrl);

export default createRule<Options, MessageIds>({
  name: parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: 'error',
      description:
        'Enforces a maximum number of public exports in a specified entry file.',
    },
    messages: {
      [MessageIds.NoUseOfExportAll]:
        'Use of "export *" is not allowed. Consider using named exports instead.',
      [MessageIds.MaxPublicExports]:
        'There are too many public exports in the entry file {{entryPath}}. Consider breaking them up into separate modules (maximum allowed: {{max}}, counted: {{publicExportCount}}).',
    },
    schema: [
      {
        type: 'object',
        properties: {
          max: {
            type: 'integer',
          },
          noExportAll: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ max: 10, noExportAll: true }],
  create(context) {
    let publicExportCount = 0;

    const { max, noExportAll } = context.options[0];

    return {
      ExportAllDeclaration(node) {
        if (noExportAll) {
          context.report({
            node,
            messageId: MessageIds.NoUseOfExportAll,
          });
        }
      },
      ExportNamedDeclaration(node) {
        if (hasPublicExports(node)) {
          publicExportCount += node.specifiers.length;
        }
      },
      'Program:exit'(node) {
        if (publicExportCount > max) {
          context.report({
            node,
            messageId: MessageIds.MaxPublicExports,
            data: {
              max,
              publicExportCount,
            },
          });
        }
      },
    };
  },
});

function hasPublicExports(node: ExportNamedDeclaration): boolean {
  return node.specifiers.length > 0;
}
