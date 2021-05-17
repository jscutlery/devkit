import { Component } from '@angular/core';
import { mount } from '@jscutlery/cypress-angular/mount';

@Component({
  template: `<h1>👋 Hello!</h1>`,
})
export class GreetingsComponent {}

describe('greetings', () => {
  it('should say hello', () => {
    mount(GreetingsComponent);
    cy.get('h1').contains('👋 Hello!');
  });
});
