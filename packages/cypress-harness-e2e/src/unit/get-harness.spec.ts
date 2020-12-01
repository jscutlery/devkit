import { ComponentHarness } from '@angular/cdk/testing';
import { Component } from '@angular/core';
import { getRootHarness } from '@jscutlery/cypress-harness';
import { initEnv, mount } from 'cypress-angular-unit-test';

@Component({
  selector: 'jc-tested',
  template: '<input>'
})
export class TestedComponent{}

export class TestedHarness extends ComponentHarness {
  static hostSelector = 'jc-tested'

  private _getInput = this.locatorFor('input');

  async setValue(value: string) {
    return (await this._getInput()).setInputValue(value);
  }
}


describe('cypress-harness', () => {
  beforeEach(() => {
    initEnv(TestedComponent);
    mount(TestedComponent);
  });

  it('should setInputValue', () => {
    getRootHarness(TestedHarness).invoke('setValue', 'test')
    cy.get('input').should('have.value', 'test');
  });
});
