import { mount } from '@jscutlery/cypress-mount';
import { CounterComponent } from './../fixtures/counter.component';

describe(CounterComponent.name, () => {
  const getIncrementButton = () => cy.get('[data-role=increment]');
  const getDecrementButton = () => cy.get('[data-role=decrement]');
  const getValueEl = () => cy.get('[data-role=value]');

  beforeEach(() => {
    mount(CounterComponent);
  });

  it('should increment counter', () => {
    getIncrementButton().click();
    getValueEl().should('have.text', '1');
  });

  it('should decrement counter', () => {
    getDecrementButton().click();
    getValueEl().should('have.text', '-1');
  });
});
