const { withNx } = require('@nx/rollup/with-nx');

// These options were migrated by @nx/rollup:convert-to-inferred from project.json
const options = {
  project: './package.json',
  outputPath: '../../dist/packages/playwright-ct-angular',
  main: './src/index.ts',
  tsConfig: './tsconfig.lib.json',
  compiler: 'tsc',
  format: ['cjs', 'esm'],
  external: ['@babel/core', 'playwright'],
  generateExportsField: true,
  additionalEntryPoints: ['./src/hooks.ts', './src/transform-angular.ts'],
  assets: [
    {
      glob: 'cli.js',
      input: 'packages/playwright-ct-angular/src',
      output: '.',
    },
    {
      glob: 'register-source.mjs',
      input: 'packages/playwright-ct-angular/src',
      output: '.',
    },
    {
      glob: 'LICENSE',
      input: '.',
      output: '.',
    },
    {
      glob: 'README.md',
      input: 'packages/playwright-ct-angular',
      output: '.',
    },
  ],
};

const config = withNx(options, {
  // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
  // e.g.
  // output: { sourcemap: true },
});

module.exports = config;
