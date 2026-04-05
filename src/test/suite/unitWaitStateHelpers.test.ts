import * as assert from "assert";
import { resolveHasWaitedFor } from "../../domain/models/units/unitWaitStateHelpers";

suite("Unit wait state helpers", () => {
  test("resolves whether a unit waits for any predecessor end", () => {
    assert.strictEqual(resolveHasWaitedFor(undefined), false);
    assert.strictEqual(resolveHasWaitedFor([]), false);
    assert.strictEqual(resolveHasWaitedFor([""]), false);
    assert.strictEqual(resolveHasWaitedFor(["job1"]), true);
    assert.strictEqual(
      resolveHasWaitedFor([{ unitName: "job1" }] as never[]),
      true,
    );
  });
});
