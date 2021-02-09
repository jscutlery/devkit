import { mountV2 } from '@jscutlery/cypress-mount';
import {
  HelloDIComponent,
  HelloDIModule,
} from '../fixtures/hello-dependency-injection.component';

describe('setupAndMount', () => {
  describe('mountV2', () => {
    it('🚧 should handle dependency injection', () => {
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
});
