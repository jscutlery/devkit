import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('cypress-angular e2e', () => {
  it('should create cypress-angular', async (done) => {
    const plugin = uniq('cypress-angular');
    ensureNxProject(
      '@test-utils/cypress-angular',
      'dist/packages/cypress-angular'
    );
    await runNxCommandAsync(
      `generate @test-utils/cypress-angular:cypress-angular ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('cypress-angular');
      ensureNxProject(
        '@test-utils/cypress-angular',
        'dist/packages/cypress-angular'
      );
      await runNxCommandAsync(
        `generate @test-utils/cypress-angular:cypress-angular ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('cypress-angular');
      ensureNxProject(
        '@test-utils/cypress-angular',
        'dist/packages/cypress-angular'
      );
      await runNxCommandAsync(
        `generate @test-utils/cypress-angular:cypress-angular ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
