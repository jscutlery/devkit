import { configureRule } from "../utils/rule";
import rule, { MessageIds, RULE_NAME } from "./prefer-inline";

describe(RULE_NAME, () => {
  const runRule = configureRule(RULE_NAME, rule);

  it('should return an error if the styles are not inline', () => {
    const result = runRule(`@Component({ stylesUrl: 'foo.css' }) class MyComponent {}`, 'foo.ts');

    expect(result).toEqual([
      expect.objectContaining({
        messageId: MessageIds.PreferInlineStyles,
      }),
    ]);
  });

  it('should throw an error if the template is not inline', () => {
    const result = runRule(`@Component({ templateUrl: 'foo.html' }) class MyComponent {}`, 'foo.ts');

    expect(result).toEqual([
      expect.objectContaining({
        messageId: MessageIds.PreferInlineTemplate,
      }),
    ]);
  });
});
