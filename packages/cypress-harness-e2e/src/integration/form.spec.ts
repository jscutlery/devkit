import { MatInputHarness } from '@angular/material/input/testing';
import { getAllHarnesses } from '@jscutlery/cypress-harness';

describe('cypress-harness-sandbox', () => {
  beforeEach(() => cy.visit('/'));

  it('should get all input harnesses', async () => {
    const inputs = await getAllHarnesses(MatInputHarness);
    expect(inputs.length).to.eq(2);
    expect(inputs[0]).to.instanceOf(MatInputHarness);
    expect(inputs[1]).to.instanceOf(MatInputHarness);
  });
});
