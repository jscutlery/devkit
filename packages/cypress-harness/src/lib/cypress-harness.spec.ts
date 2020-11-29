import { cypressHarness } from './cypress-harness';

describe('cypressHarness', () => {
  it('should work', () => {
    expect(cypressHarness()).toEqual('cypress-harness');
  });
});
