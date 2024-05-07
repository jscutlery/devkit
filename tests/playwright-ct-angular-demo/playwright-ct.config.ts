import { defineConfig, devices } from '@jscutlery/playwright-ct-angular';
import { swcAngularUnpluginOptions } from '@jscutlery/swc-angular';
import { env } from 'process';
import swc from 'unplugin-swc';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config = defineConfig({
  testDir: 'src',
  testMatch: /pw\.tsx?/,
  snapshotDir: './__snapshots__',
  /* Maximum time one test can run for. */
  timeout: 5_000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!env.CI,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    testIdAttribute: 'data-role',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Port to use for Playwright component endpoint. */
    ctPort: 3100,

    ctViteConfig: {
      plugins: [swc.vite(swcAngularUnpluginOptions())],
      resolve: {
        /* @angular/material is using "style" as a Custom Conditional export to expose prebuilt styles etc... */
        conditions: ['style'],
      },
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
});

export default config;
