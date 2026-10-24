const { withNx } = require('@nx/rollup/with-nx');

// These options were migrated by @nx/rollup:convert-to-inferred from project.json
const options = {
  outputPath: '../../dist/packages/swc-angular',
  main: './src/index.ts',
  tsConfig: './tsconfig.lib.json',
  assets: [
    {
      glob: 'LICENSE',
      input: '.',
      output: '.',
    },
    {
      glob: '*.md',
      input: 'packages/swc-angular',
      output: '.',
    },
  ],
  project: './package.json',
  compiler: 'swc',
  format: ['cjs', 'esm'],
};

const config = withNx(options, {
  // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
  // e.g.
  // output: { sourcemap: true },
});

module.exports = config;
