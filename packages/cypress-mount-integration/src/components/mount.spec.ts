import {
  HelloTemplateUrlComponent,
  HelloTemplateUrlModule,
} from './../fixtures/hello-template-url.component';
import { setupAndMount } from '@jscutlery/cypress-mount';

import {
  HelloDIComponent,
  HelloDIModule,
} from '../fixtures/hello-dependency-injection.component';

describe('@jscutlery/cypress-mount', () => {
  it('should handle dependency injection', () => {
    setupAndMount(HelloDIComponent, {
      imports: [HelloDIModule],
    });
    cy.contains('JSCutlery');
  });

  it('should handle template url', () => {
    setupAndMount(HelloTemplateUrlComponent, {
      imports: [HelloTemplateUrlModule],
    });
    cy.contains('JSCutlery');
  });
});
