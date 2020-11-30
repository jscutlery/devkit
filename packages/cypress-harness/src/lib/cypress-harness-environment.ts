import { HarnessEnvironment, TestElement } from '@angular/cdk/testing';
import { CypressElement } from './cypress-element';

export class CypressHarnessEnvironment extends HarnessEnvironment<JQuery<HTMLElement>> {
  private _body: JQuery<HTMLElement>;

  constructor(
    rawRootElement: JQuery<HTMLElement>,
    { body }: { body: JQuery<HTMLElement> }
  ) {
    super(rawRootElement);
    this._body = body;
  }

  forceStabilize(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  waitForTasksOutsideAngular(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  protected getDocumentRoot(): JQuery<HTMLElement> {
    return this._body;
  }

  protected createTestElement(element: JQuery<HTMLElement>): TestElement {
    return new CypressElement(element);
  }

  protected createEnvironment(
    element: JQuery<HTMLElement>
  ): HarnessEnvironment<JQuery<HTMLElement>> {
    return new CypressHarnessEnvironment(element, { body: this._body });
  }

  protected async getAllRawElements(
    selector: string
  ): Promise<JQuery<HTMLElement>[]> {
    return this.rawRootElement
      .find(selector)
      .toArray()
      .map((el) => Cypress.$(el));
  }
}
