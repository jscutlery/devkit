import { getPreprocessorConfig } from '@jscutlery/cypress-harness/preprocessor-config';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname, {
      webServerCommands: { default: 'npx nx run sandbox:serve' },
    }),
    ...getPreprocessorConfig(),
    // The removed @nx/cypress:cypress executor took the base URL from the
    // `sandbox:serve` dev server; the inferred e2e target does not.
    baseUrl: 'http://localhost:4200',
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
  },
});
