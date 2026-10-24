import { defineConfig } from 'cypress';
import { nxComponentTestingPreset } from '@nx/angular/plugins/component-testing';
export default defineConfig({
  component: {
    ...nxComponentTestingPreset(__filename, {
      buildTarget: 'cypress-harness-wide:component-test-build',
    }),
    // Cypress 14+ defaults justInTimeCompile to true (webpack only), which can
    // intermittently run 0 tests in CI. Remove this line to opt back in.
    justInTimeCompile: false,
  },
  viewportWidth: 960,
  viewportHeight: 540,
  // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
  // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
  injectDocumentDomain: true,
});
