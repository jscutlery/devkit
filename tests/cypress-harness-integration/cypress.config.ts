import { defineConfig } from 'cypress';
import { nxComponentTestingPreset } from '@nrwl/angular/plugins/component-testing';

export default defineConfig({
  component: nxComponentTestingPreset(__filename),
  viewportWidth: 960,
  viewportHeight: 540,
});
