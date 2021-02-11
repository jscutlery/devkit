import { mountStory } from '@jscutlery/cypress-mount';
import { Basic, WithName } from '../fixtures/hello.stories';

/**
 * @see {@link https://github.com/ComponentDriven/csf }
 */
describe('mountStory', () => {
  it('should handle Component Story Format', () => {
    mountStory(Basic);
    cy.contains('Hello');
  });

  it('should handle Component Story Format with args', () => {
    mountStory(WithName);
    cy.contains('Hello JSCutlery');
  });
});
