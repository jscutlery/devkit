const { withNx } = require('@nx/rollup/with-nx');

// These options were migrated by @nx/rollup:convert-to-inferred from project.json
const options = {
  project: './package.json',
  outputPath: '../../dist/packages/operators',
  main: './src/index.ts',
  tsConfig: './tsconfig.lib.json',
  format: ['cjs', 'esm'],
  assets: [
    {
      glob: 'LICENSE',
      input: '.',
      output: '.',
    },
    {
      glob: '*.md',
      input: 'packages/operators',
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
