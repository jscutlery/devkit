import { AppInfo } from './../fixtures/hello-dependency-injection.component';
import { mountV2 } from '@jscutlery/cypress-mount';
import { HelloDIComponent } from '../fixtures/hello-dependency-injection.component';

describe('setupAndMount', () => {
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
            useValue: { title: '🏴‍☠️' },
          },
        ],
      });
      cy.contains('🏴‍☠️');
    });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    xit('🚧 should handle inputs', () => {});

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    xit('🚧 should handle global styles', () => {});

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    xit('🚧 should render template', () => {});

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    xit('🚧 should handle templateUrl', () => {});

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    xit('🚧 should handle styleUrls', () => {});

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    xit('🚧 should handle scss', () => {});
  });
});
