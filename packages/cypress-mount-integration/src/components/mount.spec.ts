import { setupAndMount } from '@jscutlery/cypress-mount';

import {
  HelloDIComponent,
  HelloDIModule,
} from '../fixtures/dependency-injection.component';

describe('mount', () => {
  it('should handle dependency injection', () => {
    setupAndMount(HelloDIComponent, {
      imports: [HelloDIModule],
    });
    cy.contains('JSCutlery');
  });
});
