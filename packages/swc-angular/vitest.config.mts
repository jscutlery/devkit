import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'node',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/packages/swc-angular',
        provider: 'v8'
      },
      typecheck: {
        enabled: true,
        tsconfig: './tsconfig.spec.json'
      }
    }
  })
);
