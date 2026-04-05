import * as assert from "assert";
import { resolveIsRootJobnet } from "../../domain/models/units/unitJobnetStateHelpers";

suite("Unit jobnet state helpers", () => {
  test("resolves whether a jobnet is the root jobnet from its parent type", () => {
    assert.strictEqual(resolveIsRootJobnet(undefined), true);
    assert.strictEqual(resolveIsRootJobnet("g"), true);
    assert.strictEqual(resolveIsRootJobnet("j"), true);
    assert.strictEqual(resolveIsRootJobnet("n"), false);
  });
});
