import * as assert from "assert";
import { resolveUnitDepth } from "../../domain/models/units/unitDepthHelpers";

suite("Unit depth helpers", () => {
  test("resolves unit depth from absolute path", () => {
    assert.strictEqual(resolveUnitDepth("/"), 0);
    assert.strictEqual(resolveUnitDepth("/jobnet"), 0);
    assert.strictEqual(resolveUnitDepth("/jobnet/job-a"), 1);
    assert.strictEqual(resolveUnitDepth("/jobnet/job-a/step"), 2);
  });
});
