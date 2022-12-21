import { parse, resolve } from 'path';
import { realpathSync } from 'fs';
import { ESLintUtils } from '@typescript-eslint/utils';
import { ExportNamedDeclaration } from '@typescript-eslint/types/dist/generated/ast-spec';
import { getDocsUrl } from '../utils/docs';

export const enum MessageIds {
  NoUseOfExportAll = 'no-use-of-export-all',
  MaxPublicExports = 'max-public-exports',
}

export type Options = {
  entry: string;
  max: number;
  noExportAll: boolean;
}[];

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
          entry: {
            type: 'string',
          },
          max: {
            type: 'integer',
            default: 10,
          },
          noExportAll: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [],
  create(context) {
    let publicExportCount = 0;

    const { entry, max, noExportAll } = context.options[0];
    const entryPath = getFilePath(entry);

    return {
      ExportAllDeclaration(node) {
        if (context.getFilename() === entryPath && noExportAll) {
          context.report({
            node,
            messageId: MessageIds.NoUseOfExportAll,
          });
        }
      },
      ExportNamedDeclaration(node) {
        if (context.getFilename() === entryPath && isPublic(node)) {
          publicExportCount += node.specifiers.length;
        }
      },
      'Program:exit'(node) {
        if (context.getFilename() === entryPath && publicExportCount > max) {
          context.report({
            node,
            messageId: MessageIds.MaxPublicExports,
            data: {
              entryPath,
              max,
              publicExportCount,
            },
          });
        }
      },
    };
  },
});

function getFilePath(filePath: string): string {
  return realpathSync(resolve(process.cwd(), filePath));
}

function isPublic(node: ExportNamedDeclaration): boolean {
  return node.specifiers.length > 0;
}
