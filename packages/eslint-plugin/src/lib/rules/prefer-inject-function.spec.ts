import { configureRule } from '../utils/rule';
import rule, { MessageIds, RULE_NAME } from './prefer-inject-function';

describe(RULE_NAME, () => {
  const runRule = configureRule(RULE_NAME, rule);

  it('should not return an error if no arguments are passed to the constructor', () => {
    const result = runRule(
      `
      class MyComponent {
        constructor() {}
      }
    `,
      'foo.ts'
    );

    expect(result).toEqual([]);
  });

  it('should not return an error if class is not decorated with @Component()', () => {
    const result = runRule(
      `
      class MyComponent {
        constructor(private foo: Foo) {}
      }
    `,
      'foo.ts'
    );

    expect(result).toEqual([]);
  });

  it('should return an error if dependencies are injected through constructors', () => {
    const result = runRule(
      `
      @Component()
      class MyComponent {
        constructor(private foo: Foo) {}
      }
    `,
      'foo.ts'
    );

    expect(result).toEqual([
      expect.objectContaining({
        messageId: MessageIds.PreferInjectFunction,
      }),
    ]);
  });

  it('should support readonly', () => {
    const result = runRule(
      `
      @Component()
      class MyComponent {
        constructor(private readonly foo: Foo) {}
      }
    `,
      'foo.ts'
    );

    expect(result).toEqual([
      expect.objectContaining({
        messageId: MessageIds.PreferInjectFunction,
      }),
    ]);
  });
});
