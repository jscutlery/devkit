import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';
import webpackPreprocessor from '@cypress/webpack-batteries-included-preprocessor';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    setupNodeEvents(on) {
      on('file:preprocessor', webpackPreprocessor({
        typescript: require.resolve('typescript')
      }));
    }
  }
});
