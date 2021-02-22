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

  it('should add global styles', () => {
    mountStory(Basic, {
      styles: [`body { color: red }`],
    });
    cy.get('h1').should('have.css', 'color', 'rgb(255, 0, 0)');
  });
});
