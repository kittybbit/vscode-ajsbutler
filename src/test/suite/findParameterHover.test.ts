import * as assert from "assert";
import { createFindParameterHover } from "../../application/editor-feedback/findParameterHover";

suite("Find Parameter Hover", () => {
  test("returns syntax information from the injected lookup", () => {
    const requests: Array<{ symbol: string; language: string }> = [];
    const findParameterHover = createFindParameterHover({
      findSyntax: (symbol, language) => {
        requests.push({ symbol, language });
        return "ty={j|g}";
      },
    });
    const hover = findParameterHover("ty", "en");

    assert.deepStrictEqual(hover, { symbol: "ty", syntax: "ty={j|g}" });
    assert.deepStrictEqual(requests, [{ symbol: "ty", language: "en" }]);
  });

  test("returns undefined for non-parameter words without consulting lookup", () => {
    let lookupCalled = false;
    const findParameterHover = createFindParameterHover({
      findSyntax: () => {
        lookupCalled = true;
        return "unexpected";
      },
    });
    const hover = findParameterHover("not-a-param", "en");

    assert.strictEqual(hover, undefined);
    assert.strictEqual(lookupCalled, false);
  });

  test("returns undefined when a recognized symbol has no syntax resource", () => {
    const findParameterHover = createFindParameterHover({
      findSyntax: () => undefined,
    });

    assert.strictEqual(findParameterHover("ty", "en"), undefined);
  });
});
