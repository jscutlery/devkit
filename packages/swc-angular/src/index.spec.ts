import { afterEach, expect, test, vi } from 'vitest';

/**
 * Using an old version of `@swc/core` will simply crash with the following error:
 * `RuntimeError: out of bounds memory`
 *
 * In order to mitigate this issue, we throw an explicit error when the version is not compatible.
 *
 * Cf. https://swc.rs/docs/plugin/selecting-swc-core
 * Cf. https://github.com/jscutlery/devkit/issues/319
 */

test.each([
  [' <1.4.0', { version: '1.3.107' }],
  ['>=1.5.0', { version: '1.5.0' }],
])(
  'should throw an error when module is imported and version is %s',
  async (_, { version }) => {
    setUp();

    vi.doMock('@swc/core', () => ({
      version,
    }));

    await import('./index');

    expect(console.warn).toHaveBeenCalledOnce();
    expect(console.warn).toHaveBeenCalledWith(
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

  expect(console.warn).not.toHaveBeenCalledOnce();
  expect(process.exit).not.toHaveBeenCalledOnce();
});

function setUp() {
  vi.resetModules();
  vi.spyOn(console, 'warn').mockReturnValue();
  vi.spyOn(process, 'exit').mockReturnValue(undefined as never);
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});
