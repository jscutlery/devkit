import * as keyCodes from '@angular/cdk/keycodes';
import { ElementDimensions, ModifierKeys, TestElement, TestKey, TextOptions } from '@angular/cdk/testing';

const keyMap = {
  [TestKey.BACKSPACE]: { keyCode: keyCodes.BACKSPACE, key: 'Backspace' },
  [TestKey.TAB]: { keyCode: keyCodes.TAB, key: 'Tab' },
  [TestKey.ENTER]: { keyCode: keyCodes.ENTER, key: 'Enter' },
  [TestKey.SHIFT]: { keyCode: keyCodes.SHIFT, key: 'Shift' },
  [TestKey.CONTROL]: { keyCode: keyCodes.CONTROL, key: 'Control' },
  [TestKey.ALT]: { keyCode: keyCodes.ALT, key: 'Alt' },
  [TestKey.ESCAPE]: { keyCode: keyCodes.ESCAPE, key: 'Escape' },
  [TestKey.PAGE_UP]: { keyCode: keyCodes.PAGE_UP, key: 'PageUp' },
  [TestKey.PAGE_DOWN]: { keyCode: keyCodes.PAGE_DOWN, key: 'PageDown' },
  [TestKey.END]: { keyCode: keyCodes.END, key: 'End' },
  [TestKey.HOME]: { keyCode: keyCodes.HOME, key: 'Home' },
  [TestKey.LEFT_ARROW]: { keyCode: keyCodes.LEFT_ARROW, key: 'ArrowLeft' },
  [TestKey.UP_ARROW]: { keyCode: keyCodes.UP_ARROW, key: 'ArrowUp' },
  [TestKey.RIGHT_ARROW]: { keyCode: keyCodes.RIGHT_ARROW, key: 'ArrowRight' },
  [TestKey.DOWN_ARROW]: { keyCode: keyCodes.DOWN_ARROW, key: 'ArrowDown' },
  [TestKey.INSERT]: { keyCode: keyCodes.INSERT, key: 'Insert' },
  [TestKey.DELETE]: { keyCode: keyCodes.DELETE, key: 'Delete' },
  [TestKey.F1]: { keyCode: keyCodes.F1, key: 'F1' },
  [TestKey.F2]: { keyCode: keyCodes.F2, key: 'F2' },
  [TestKey.F3]: { keyCode: keyCodes.F3, key: 'F3' },
  [TestKey.F4]: { keyCode: keyCodes.F4, key: 'F4' },
  [TestKey.F5]: { keyCode: keyCodes.F5, key: 'F5' },
  [TestKey.F6]: { keyCode: keyCodes.F6, key: 'F6' },
  [TestKey.F7]: { keyCode: keyCodes.F7, key: 'F7' },
  [TestKey.F8]: { keyCode: keyCodes.F8, key: 'F8' },
  [TestKey.F9]: { keyCode: keyCodes.F9, key: 'F9' },
  [TestKey.F10]: { keyCode: keyCodes.F10, key: 'F10' },
  [TestKey.F11]: { keyCode: keyCodes.F11, key: 'F11' },
  [TestKey.F12]: { keyCode: keyCodes.F12, key: 'F12' },
  [TestKey.META]: { keyCode: keyCodes.META, key: 'Meta' }
};

export class CypressElement implements TestElement {
  constructor(readonly element: JQuery<HTMLElement>) {
  }

  blur(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async clear(): Promise<void> {
    this.element.val(null);
  }

  click(): Promise<void>;
  click(location: 'center'): Promise<void>;
  click(relativeX: number, relativeY: number): Promise<void>;
  async click(relativeX?: any, relativeY?: any): Promise<void> {
    this.element.trigger('click');
  }

  rightClick?(relativeX: number, relativeY: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  focus(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getCssValue(property: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  hover(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  mouseAway(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  sendKeys(...keys: (string | TestKey)[]): Promise<void>;
  sendKeys(
    modifiers: ModifierKeys,
    ...keys: (string | TestKey)[]
  ): Promise<void>;
  async sendKeys(modifiersOrKeys?: any, ...keys: any[]): Promise<void> {
    if (typeof modifiersOrKeys === 'string') {
      this.element.val(modifiersOrKeys);
      this.dispatchEvent('input');
      return;
    }

    for (const key of keys) {
      const evt = new KeyboardEvent('keydown', {
        altKey: modifiersOrKeys.alt,
        key,
        ...keyMap[key]
      });
      this.element.get(0).dispatchEvent(evt);
    }
  }

  async text(options?: TextOptions): Promise<string> {
    return this.element.text().trim();
  }

  async getAttribute(name: string): Promise<string> {
    return this.element.attr(name);
  }

  async hasClass(name: string): Promise<boolean> {
    return this.element.hasClass(name);
  }

  getDimensions(): Promise<ElementDimensions> {
    throw new Error('Method not implemented.');
  }

  async getProperty(name: string) {
    return this.element.prop(name);
  }

  async matchesSelector(selector: string): Promise<boolean> {
    return this.element.is(selector);
  }

  isFocused(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async setInputValue?(value: string): Promise<void> {
    this.element.val(value)
  }

  selectOptions?(...optionIndexes: number[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async dispatchEvent?(name: string): Promise<void> {
    this.element.trigger(name);
  }
}
