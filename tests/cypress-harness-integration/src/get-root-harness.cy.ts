import { ComponentHarness } from '@angular/cdk/testing';
import { Component } from '@angular/core';
import { getRootHarness } from '@jscutlery/cypress-harness';

@Component({
  standalone: true,
  selector: 'jc-tested',
  template: '<input>'
})
export class TestedComponent {
}

export class TestedHarness extends ComponentHarness {
  static hostSelector = 'jc-tested';

  private _getInput = this.locatorFor('input');

  async setValue(value: string) {
    return (await this._getInput()).setInputValue(value);
  }

  async getValue(): Promise<string> {
    return (await this._getInput()).getProperty('value');
  }
}

describe(getRootHarness.name, () => {
  it('should setInputValue', () => {
    cy.mount(TestedComponent);
    getRootHarness(TestedHarness).invoke('setValue', 'test');
    getRootHarness(TestedHarness).invoke('getValue').should('equal', 'test');
  });
});
