import { Component, Input, Output } from '@angular/core';
import { mount } from '@jscutlery/cypress-angular/mount';
import { delay, map } from 'rxjs';
import { Microwave, watch } from './microwave';

@Microwave()
@Component({
  selector: 'jscutlery-meal',
  template: `<div data-role="meal-name">{{ capitalizedMeal }}</div>
    <button (click)="evaluation = 'meh'">😋</button>
    <button (click)="evaluation = 'delicious'">😒</button>`,
})
class GreetingsComponent {
  @Input() meal?: string = undefined;
  @Output() evaluationChange = watch(this, 'evaluation');

  capitalizedMeal: string = undefined;

  evaluation?: string = undefined;

  constructor() {
    watch(this, 'meal')
      .pipe(
        delay(10),
        map((meal) => meal?.toUpperCase())
      )
      .subscribe((capitalizedMeal) => {
        return (this.capitalizedMeal = capitalizedMeal);
      });
  }
}

describe('Microwave', () => {
  it('should trigger change detection on property change', () => {
    const { getMealEl, setInput } = setUp();

    setInput('meal', 'Burger');

    getMealEl().contains('BURGER');

    setInput('meal', 'Babaganoush');

    getMealEl().contains('BABAGANOUSH');
  });

  xit('🚧 should trigger evaluationChange output');

  xit('🚧 should unsubscribe on destroy');

  function setUp() {
    mount(GreetingsComponent);

    function getComponent() {
      return cy
        .get('jscutlery-meal')
        .then((el) => globalThis.ng.getComponent(el.get(0)));
    }

    return {
      setInput<K extends keyof GreetingsComponent = keyof GreetingsComponent>(
        property: keyof GreetingsComponent,
        value: GreetingsComponent[K]
      ) {
        return getComponent().then((cmp) => (cmp[property] = value));
      },
      getMealEl() {
        return cy.get('[data-role=meal-name]');
      },
    };
  }
});
