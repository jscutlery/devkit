import {
  angularPreprocessor,
  FilePreprocessor,
  FileEvent,
} from './angular-preprocessor';
import * as webpackPreprocessor from '@cypress/webpack-preprocessor';
import { AngularCompilerPlugin } from '@ngtools/webpack';

jest.mock('@cypress/webpack-preprocessor');
jest.mock('@ngtools/webpack');

const mockWebpackPreprocessor = webpackPreprocessor as jest.MockedFunction<
  typeof webpackPreprocessor
>;
const mockAngularCompilerPlugin = AngularCompilerPlugin as jest.MockedClass<
  typeof AngularCompilerPlugin
>;

describe('preprocessor', () => {
  let preprocessor: FilePreprocessor;

  beforeEach(() => {
    const webpackFilePreprocessor = jest.fn().mockResolvedValue('OUTPUT_PATH');
    mockWebpackPreprocessor.mockReturnValue(webpackFilePreprocessor);
  });

  afterEach(() => {
    mockAngularCompilerPlugin.mockReset();
    mockWebpackPreprocessor.mockReset();
  });

  describe('with default config', () => {
    beforeEach(() => {
      preprocessor = angularPreprocessor({
        env: {
          tsConfig: '/packages/lib-e2e/tsconfig.e2e.json',
        },
      });
    });

    it('should return webpack config', async () => {
      /* Preprocessor should wrap preprocessor returned by webpack preprocessor. */
      await preprocessor({} as FileEvent);

      expect(webpackPreprocessor).toBeCalledTimes(1);
      expect(webpackPreprocessor).toBeCalledWith({
        webpackOptions: {
          plugins: [expect.any(AngularCompilerPlugin)],
          resolve: {
            extensions: ['.js', '.ts'],
          },
          module: {
            rules: [
              {
                test: /\.ts$/,
                loader: '@ngtools/webpack',
              },
              {
                test: /\.css$/,
                loader: 'raw-loader',
              },
              {
                test: /\.scss$/,
                use: ['raw-loader', 'sass-loader'],
              },
            ],
          },
        },
      });
    });

    it('should create angular compiler with the right options', async () => {
      await preprocessor({} as FileEvent);

      expect(mockAngularCompilerPlugin).toBeCalledTimes(1);
      expect(mockAngularCompilerPlugin).toBeCalledWith({
        directTemplateLoading: true,
        sourceMap: true,
        tsConfigPath: '/packages/lib-e2e/tsconfig.e2e.json',
      });
    });

    /**
     * `@cypress/webpack-preprocessor` is creating a new webpack instance for each file.
     * Cf. {@link https://github.com/cypress-io/cypress/blob/5e05495abc4c7c5b95eebff90d9c763db7fe726d/npm/webpack-preprocessor/index.ts#L227}
     * This causes caching issues with `AngularCompilerPlugin` that for some reason ends up emitting
     * the same output even when files change.
     * This is the reason why we want a new plugin intsance for each call.
     */
    it('should create a new instance of AngularCompilerPlugin for each file', async () => {
      await preprocessor({} as FileEvent);
      await preprocessor({} as FileEvent);

      expect(mockAngularCompilerPlugin).toBeCalledTimes(2);
    });
  });

  describe('with custom angular compiler options', () => {
    beforeEach(() => {
      preprocessor = angularPreprocessor(
        {
          env: {
            tsConfig: '/packages/lib-e2e/tsconfig.e2e.json',
          },
        },
        {
          angularCompilerOptions: {
            directTemplateLoading: false,
          },
        }
      );
    });

    it('should extend angular compiler options', async () => {
      await preprocessor({} as FileEvent);

      expect(mockAngularCompilerPlugin).toBeCalledTimes(1);
      expect(mockAngularCompilerPlugin).toBeCalledWith(
        expect.objectContaining({
          directTemplateLoading: false,
          sourceMap: true,
        })
      );
    });
  });
});
