import * as assert from "assert";
import { findParameterHover } from "../../application/editor-feedback/findParameterHover";

suite("Find Parameter Hover", () => {
  test("returns syntax information for parameter symbols", () => {
    const hover = findParameterHover("ty", "en");

    assert.ok(hover);
    assert.strictEqual(hover?.symbol, "ty");
    assert.ok(hover?.syntax.length);
  });

  test("returns undefined for non-parameter words", () => {
    const hover = findParameterHover("not-a-param", "en");

    assert.strictEqual(hover, undefined);
  });
});
