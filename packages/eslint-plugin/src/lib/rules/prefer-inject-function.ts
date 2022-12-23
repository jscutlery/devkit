import { ESLintUtils } from '@typescript-eslint/utils';
import { parse } from 'path';

import { getDocsUrl } from '../utils/docs';

export const enum MessageIds {
  PreferInjectFunction = 'prefer-inject-function',
}

export const RULE_NAME = parse(__filename).name;

const createRule = ESLintUtils.RuleCreator(getDocsUrl);

export default createRule<[], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer inject function over constructor injection.',
      recommended: 'error',
    },
    schema: [],
    messages: {
      [MessageIds.PreferInjectFunction]:
        'Prefer inject function from "@angular/core" module over constructor injection.',
    },
  },
  defaultOptions: [],
  create(context) {
    let isAngularComponent = false;

    return {
      Decorator(node) {
        if (node.expression.type === 'CallExpression' && node.expression.callee.type === 'Identifier') {
          // 1. check if it's an Angular component
          if (node.expression.callee.name === 'Component') {
            isAngularComponent = true;
          }
        }
      },
      MethodDefinition(node) {
        if (!isAngularComponent) return;

        // 2. check if it has a constructor
        if (node.key.type === 'Identifier' && node.key.name === 'constructor') {
          // 3. check if the constructor has parameters
          if (node.value.type === 'FunctionExpression' && node.value.params.length > 0) {
            context.report({
              node,
              messageId: MessageIds.PreferInjectFunction,
            });
          }
        }

      }
    };
  },
});
