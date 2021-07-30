import { MatInputHarness } from '@angular/material/input/testing';
import { getAllHarnesses } from '@jscutlery/cypress-harness';

describe('cypress-harness-sandbox', () => {
  beforeEach(() => cy.visit('/'));

  it('should get all input harnesses', () => {
    getAllHarnesses(MatInputHarness).then((inputs) => {
      expect(inputs.length).to.eq(2);
      expect(inputs[0]).to.instanceOf(MatInputHarness);
      expect(inputs[1]).to.instanceOf(MatInputHarness);
    });
  });
});
