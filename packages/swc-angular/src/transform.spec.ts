import { transform } from '@swc/core';
import { swcAngularPreset } from '@jscutlery/swc-angular';
import { describe, expect, it } from 'vitest';

describe('swc-angular', () => {
  /**
   * Cf. https://github.com/jscutlery/devkit/issues/376
   * Cf. https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier
   */
  it("provides an option to disable TypeScript's `useDefineForClassFields` and fix uninitialized property inheritance override issue", async () => {
    const { code } = await transform(
      `class MyClass {
  myUninitializedField;

  constructor() {
    this.myUninitializedField = 'initialized';
  }
}
      `,
      swcAngularPreset({ useDefineForClassFields: false }),
    );

    /* Make sure class field is not there. */
    expect(code).toBe(
      `class MyClass {
    constructor(){
        this.myUninitializedField = 'initialized';
    }
}
`,
    );
  });
});
