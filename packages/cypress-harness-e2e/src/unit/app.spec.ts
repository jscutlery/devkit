import { Component } from '@angular/core';
import { initEnv, mount } from 'cypress-angular-unit-test';

@Component({
  template: '<input>'
})
export class TestComponent{}


describe('cypress-harness', () => {
  beforeEach(() => {
    initEnv(TestComponent);
    mount(TestComponent);
  });

  it('should set input value', () => {
    cy.get('input').type('test');
    cy.get('input').should('have.value', 'test');
  });
});
