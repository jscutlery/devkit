import { mountV2, mountStory, setupAndMount } from '@jscutlery/cypress-mount';
import {
  HelloDIComponent,
  HelloDIModule,
} from '../fixtures/hello-dependency-injection.component';
import {
  HelloScssComponent,
  HelloScssModule,
} from '../fixtures/hello-scss.component';
import {
  HelloStyleUrlsComponent,
  HelloStyleUrlsModule,
} from '../fixtures/hello-style-urls.component';
import { Basic, WithName } from '../fixtures/hello.stories';
import {
  HelloTemplateUrlComponent,
  HelloTemplateUrlModule,
} from './../fixtures/hello-template-url.component';

describe('setupAndMount', () => {
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

  it('should handle scss', () => {
    setupAndMount(HelloScssComponent, {
      imports: [HelloScssModule],
    });
    cy.get('h1').should('have.css', 'color', 'rgb(255, 0, 0)');
  });
});

describe('mountV2', () => {
  xit('🚧 should handle dependency injection', () => {
    mountV2(HelloDIComponent, {
      imports: [HelloDIModule],
    });
    cy.contains('JSCutlery');
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  xit('🚧 should handle providers', () => {});

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  xit('🚧 should handle inputs', () => {});

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  xit('🚧 should handle global styles', () => {});

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  xit('🚧 should handle templateUrl', () => {});

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  xit('🚧 should handle styleUrls', () => {});

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  xit('🚧 should handle scss', () => {});
});

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
