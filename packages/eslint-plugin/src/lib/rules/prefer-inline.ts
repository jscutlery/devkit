import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import { parse } from 'path';

import { getDocsUrl } from '../utils/docs';

export const enum MessageIds {
  PreferInlineStyles = 'prefer-inline-styles',
  PreferInlineTemplate = 'prefer-inline-template',
}

export const RULE_NAME = parse(__filename).name;

const createRule = ESLintUtils.RuleCreator(getDocsUrl);

export default createRule<[], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer inline styles and templates in Angular components.',
      recommended: 'error',
    },
    schema: [],
    messages: {
      [MessageIds.PreferInlineStyles]:
        'Prefer inline styles in Angular components.',
      [MessageIds.PreferInlineTemplate]:
        'Prefer inline template in Angular components.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Decorator(node: TSESTree.Decorator) {
        // check if the decorator is an Angular component decorator
        if (node.expression.type === 'CallExpression' && node.expression.callee.type === 'Identifier') {

          if (node.expression.callee.name === 'Component') {
            // check if the component has a stylesUrl property
            if (node.expression.arguments[0].type === 'ObjectExpression') {
              const stylesUrlProperty = node.expression.arguments[0].properties.find(
                (property) => property.type === 'Property' && property.key.type === 'Identifier' && property.key.name === 'stylesUrl',
              );

              if (stylesUrlProperty) {
                context.report({
                  node: stylesUrlProperty,
                  messageId: MessageIds.PreferInlineStyles,
                });
              }
            }

            // check if the component has a templateUrl property
            if (node.expression.arguments[0].type === 'ObjectExpression') {
              const templateUrlProperty = node.expression.arguments[0].properties.find(
                (property) => property.type === 'Property' && property.key.type === 'Identifier' && property.key.name === 'templateUrl',
              );

              if (templateUrlProperty) {
                context.report({
                  node: templateUrlProperty,
                  messageId: MessageIds.PreferInlineTemplate,
                });
              }
            }
          }
        }
      },
    };
  },
});
