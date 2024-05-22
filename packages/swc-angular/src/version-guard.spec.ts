import { afterEach, expect, test, vi } from 'vitest';
import { FileSystem } from './utils';
import { join } from 'node:path';

/**
 * Using an old version of `@swc/core` will simply crash with the following error:
 * `RuntimeError: out of bounds memory`
 *
 * In order to mitigate this issue, we log an error and exit when the version is not compatible.
 *
 * Cf. https://swc.rs/docs/plugin/selecting-swc-core
 * Cf. https://github.com/jscutlery/devkit/issues/319
 */

test.each([
  [' <1.4.0', { version: '1.3.107' }],
  ['>=1.6.0', { version: '1.6.0' }],
])(
  'should throw an error when module is imported and version is %s',
  async (_, { version }) => {
    setUp();

    vi.doMock('@swc/core', () => ({
      version,
    }));

    await import('./index');

    expect(console.error).toHaveBeenCalledOnce();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        `@swc/core version ${version} is incompatible with @jscutlery/swc-angular`,
      ),
    );
    expect(process.exit).toHaveBeenCalledOnce();
    expect(process.exit).toHaveBeenCalledWith(1);
  },
);

test('should not throw an error when module is imported and version is ~1.4.0', async () => {
  setUp();

  vi.doMock('@swc/core', () => ({
    version: '1.4.0',
  }));

  await import('./index');

  expect(console.error).not.toHaveBeenCalledOnce();
  expect(process.exit).not.toHaveBeenCalledOnce();
});

test('should fallback to package.json if version is not available (this happens on stackblitz)', async () => {
  const { fileSystem } = setUp();

  vi.doMock('@swc/core', () => ({
    version: undefined,
  }));
  fileSystem.setJsonFile('node_modules/@swc/core/package.json', {
    version: '1.4.0',
  });

  await import('./index');

  expect(console.error).not.toHaveBeenCalledOnce();
  expect(process.exit).not.toHaveBeenCalledOnce();
});

test('should throw an error if version from package.json is not compatible', async () => {
  const { fileSystem } = setUp();

  vi.doMock('@swc/core', () => ({
    version: undefined,
  }));
  fileSystem.setJsonFile('node_modules/@swc/core/package.json', {
    version: '1.3.0',
  });

  await import('./index');

  expect(console.error).toHaveBeenCalledWith(
    expect.stringContaining(
      `@swc/core version 1.3.0 is incompatible with @jscutlery/swc-angular`,
    ),
  );
});

function setUp() {
  const fileSystem = new FileSystemFake();
  vi.resetModules();
  vi.doMock('./utils', () => ({
    fileSystem,
  }));
  vi.spyOn(console, 'error').mockReturnValue();
  vi.spyOn(process, 'exit').mockReturnValue(undefined as never);
  return { fileSystem };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

class FileSystemFake implements FileSystem {
  #jsonFiles = new Map<string, any>();
  #workspaceRoot = join(__dirname, '../../..');

  readJsonFile(path: string) {
    return this.#jsonFiles.get(path);
  }

  /**
   * Set the content of a JSON file using the workspace root as the base path.
   */
  setJsonFile(path: string, content: any) {
    this.#jsonFiles.set(join(this.#workspaceRoot, path), content);
  }
}
