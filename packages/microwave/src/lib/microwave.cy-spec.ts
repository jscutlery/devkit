import { Component, Injectable, Input, Output } from '@angular/core';
import { destroy, mount } from '@jscutlery/cypress-angular/mount';
import { delay, finalize, map } from 'rxjs';
import { Microwave, watch } from './microwave';

/**
 * A service to detect when watch is unsubscribed from.
 */
@Injectable()
class Snitch {
  finalized = false;
}

@Microwave()
@Component({
  selector: 'jscutlery-meal',
  template: `<div data-role="meal-name">{{ capitalizedMeal }}</div>
    <button data-role="meh" (click)="evaluation = 'meh'">😋</button>
    <button data-role="delicious" (click)="evaluation = 'delicious'">
      😒
    </button>`,
})
class GreetingsComponent {
  @Input() meal?: string = undefined;
  @Output() evaluationChange = watch(this, 'evaluation');

  capitalizedMeal: string = undefined;

  evaluation?: string = undefined;

  constructor(snitch: Snitch) {
    watch(this, 'meal')
      .pipe(
        finalize(() => (snitch.finalized = true)),
        delay(10),
        map((meal) => meal?.toUpperCase())
      )
      .subscribe((capitalizedMeal) => (this.capitalizedMeal = capitalizedMeal));
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

  it('should emit evaluationChange output on initialization', () => {
    const { evaluationChangeStub } = setUp();

    cy.wrap(evaluationChangeStub).should('be.calledOnceWith', undefined);
  });

  it('should emit evaluationChange output on click', () => {
    const { clickEvaluation, evaluationChangeStub } = setUp();

    cy.wrap(evaluationChangeStub).invoke('reset');

    clickEvaluation('delicious');

    cy.wrap(evaluationChangeStub).should('be.calledOnceWith', 'delicious');
  });

  it('should unsubscribe on destroy', () => {
    const { snitch } = setUp();

    destroy();

    cy.wrap(snitch).its('finalized').should('equal', true);
  });

  function setUp() {
    const evaluationChangeStub = cy.stub();
    const snitch = new Snitch();

    mount(GreetingsComponent, {
      providers: [
        {
          provide: Snitch,
          useValue: snitch,
        },
      ],
      outputs: {
        evaluationChange: evaluationChangeStub,
      },
    });

    function getComponent() {
      return cy
        .get('jscutlery-meal')
        .then((el) => globalThis.ng.getComponent(el.get(0)));
    }

    return {
      evaluationChangeStub,
      snitch,
      clickEvaluation(evaluation: 'delicious' | 'meh') {
        return cy.get(`[data-role=${evaluation}]`).click();
      },
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
