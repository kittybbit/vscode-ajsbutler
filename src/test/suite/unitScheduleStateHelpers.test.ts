import * as assert from "assert";
import { resolveHasSchedule } from "../../domain/models/units/unitScheduleStateHelpers";

suite("Unit schedule state helpers", () => {
  test("resolves whether a jobnet has any effective schedule", () => {
    assert.strictEqual(resolveHasSchedule([]), false);
    assert.strictEqual(resolveHasSchedule(["ud"]), false);
    assert.strictEqual(resolveHasSchedule(["1,ud"]), false);
    assert.strictEqual(resolveHasSchedule(["en"]), true);
    assert.strictEqual(resolveHasSchedule(["1,en"]), true);
  });
});
