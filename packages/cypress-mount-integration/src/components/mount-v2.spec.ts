import { mountV2 } from '@jscutlery/cypress-mount';
import { HelloDIComponent } from '../fixtures/hello-dependency-injection.component';
import { HelloComponent } from '../fixtures/hello.component';
import { AppInfo } from './../fixtures/hello-dependency-injection.component';
import { HelloScssComponent } from './../fixtures/hello-scss.component';
import { HelloStyleUrlsComponent } from './../fixtures/hello-style-urls.component';
import { HelloTemplateUrlComponent } from './../fixtures/hello-template-url.component';

describe('mountV2', () => {
  it('should handle dependency injection', () => {
    mountV2(HelloDIComponent);
    cy.contains('JSCutlery');
  });

  it('should handle providers', () => {
    mountV2(HelloDIComponent, {
      providers: [
        {
          provide: AppInfo,
          useValue: { title: '💉' },
        },
      ],
    });
    cy.contains('💉');
  });

  it('should handle inputs', () => {
    mountV2(HelloComponent, {
      inputs: {
        name: '🚀',
      },
    });
    cy.contains('🚀');
  });

  it('should handle global styles', () => {
    mountV2(HelloComponent, {
      styles: [`body { color: red }`],
    });
    cy.get('h1').should('have.css', 'color', 'rgb(255, 0, 0)');
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  xit('🚧 should render template', () => {});

  it('should handle templateUrl', () => {
    mountV2(HelloTemplateUrlComponent);
    cy.contains('JSCutlery');
  });

  it('should handle styleUrls', () => {
    mountV2(HelloStyleUrlsComponent);
    cy.get('h1').should('have.css', 'color', 'rgb(255, 0, 0)');
  });

  it('should handle scss', () => {
    mountV2(HelloScssComponent);
    cy.get('h1').should('have.css', 'color', 'rgb(255, 0, 0)');
  });
});
