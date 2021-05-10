import { startAngularDevServer } from './start-angular-dev-server';

describe(startAngularDevServer.name, () => {
  describe('with default config', () => {
    // beforeEach(() => {
    // @todo mock startDevServer return value with {port: 4300}
    // @todo mock AngularWebpackPlugin
    // })

    // afterEach(() => {
    //   reset mocks
    // })

    xit(`should call startDevServer with the right webpack options`, async () => {
      // @todo type options as DevServerOptions & config as PluginConfigOptions
      // await startAngularDevServer({ config, options });
      // @todo check startDevServer was called with
      // expect(resolvedConfig).toEqual({
      //   expect.objectContaining{
      //     port: 4300
      //   }
      // })
      // expect(startDevServer).toBeCalledTimes(1);
      // expect(startDevServer).toBeCalledWith({
      //   webpackConfig: {
      //     devtool: false,
      //     plugins: [expect.any(AngularCompilerPlugin)],
      //     resolve: {
      //       extensions: ['.js', '.ts'],
      //     },
      //     module: {
      //       rules: [
      //         {
      //           test: /\.ts$/,
      //           loader: '@ngtools/webpack',
      //         },
      //         {
      //           test: /\.css$/,
      //           loader: 'raw-loader',
      //         },
      //         {
      //           test: /\.scss$/,
      //           use: ['raw-loader', 'sass-loader'],
      //         },
      //       ],
      //     },
      //   },
      // });
    });

    xit('should create angular compiler with the right options', async () => {
      // expect(mockAngularCompilerPlugin).toBeCalledTimes(1);
      // expect(mockAngularCompilerPlugin).toBeCalledWith({
      //   directTemplateLoading: true,
      //   forkTypeChecker: true,
      //   sourceMap: false,
      //   tsConfigPath: '/packages/lib-e2e/tsconfig.e2e.json',
      // });
    });
  });

  describe('with custom webpack config', () => {
    it.todo('should merge with resolved webpack config');
  });
});
