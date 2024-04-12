import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      setupFiles: ['src/test-setup-vitest.ts'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/demo',
        provider: 'v8'
      }
    }
  })
);
