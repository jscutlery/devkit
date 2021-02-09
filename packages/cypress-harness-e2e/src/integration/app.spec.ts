import { ComponentHarness } from '@angular/cdk/testing';
import { getHarness } from '@jscutlery/cypress-harness';

export class TitleHarness extends ComponentHarness {
  static hostSelector = 'jc-sandbox-title';

  async text() {
    return (await this.host()).text();
  }
}

describe('cypress-harness-sandbox', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getHarness(TitleHarness).invoke('text').should('equal', `🚀 Let's test!`);
  });
});
