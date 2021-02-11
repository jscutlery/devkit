import { mount } from '@jscutlery/cypress-mount';
import { HelloDIComponent } from '../fixtures/hello-dependency-injection.component';
import { HelloComponent } from '../fixtures/hello.component';
import { AppInfo } from './../fixtures/hello-dependency-injection.component';
import { HelloScssComponent } from './../fixtures/hello-scss.component';
import { HelloStyleUrlsComponent } from './../fixtures/hello-style-urls.component';
import { HelloTemplateUrlComponent } from './../fixtures/hello-template-url.component';

describe('mount', () => {
  it('should handle dependency injection', () => {
    mount(HelloDIComponent);
    cy.contains('JSCutlery');
  });

  it('should handle providers', () => {
    mount(HelloDIComponent, {
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
    mount(HelloComponent, {
      inputs: {
        name: '🚀',
      },
    });
    cy.contains('🚀');
  });

  it('should handle global styles', () => {
    mount(HelloComponent, {
      styles: [`body { color: red }`],
    });
    cy.get('h1').should('have.css', 'color', 'rgb(255, 0, 0)');
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  xit('🚧 should render template', () => {});

  it('should handle templateUrl', () => {
    mount(HelloTemplateUrlComponent);
    cy.contains('JSCutlery');
  });

  it('should handle styleUrls', () => {
    mount(HelloStyleUrlsComponent);
    cy.get('h1').should('have.css', 'color', 'rgb(255, 0, 0)');
  });

  it('should handle scss', () => {
    mount(HelloScssComponent);
    cy.get('h1').should('have.css', 'color', 'rgb(255, 0, 0)');
  });
});
