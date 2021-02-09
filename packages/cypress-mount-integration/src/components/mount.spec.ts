import {
  HelloTemplateUrlComponent,
  HelloTemplateUrlModule,
} from './../fixtures/hello-template-url.component';
import { setupAndMount } from '@jscutlery/cypress-mount';

import {
  HelloDIComponent,
  HelloDIModule,
} from '../fixtures/hello-dependency-injection.component';
import {
  HelloStyleUrlsComponent,
  HelloStyleUrlsModule,
} from '../fixtures/hello-style-urls.component';

describe('@jscutlery/cypress-mount', () => {
  it('should handle dependency injection', () => {
    setupAndMount(HelloDIComponent, {
      imports: [HelloDIModule],
    });
    cy.contains('JSCutlery');
  });

  it('should handle templateUrl', () => {
    setupAndMount(HelloTemplateUrlComponent, {
      imports: [HelloTemplateUrlModule],
    });
    cy.contains('JSCutlery');
  });

  it('should handle styleUrls', () => {
    setupAndMount(HelloStyleUrlsComponent, {
      imports: [HelloStyleUrlsModule],
    });
    cy.get('h1').should('have.css', 'color', 'rgb(255, 0, 0)');
  });
});
