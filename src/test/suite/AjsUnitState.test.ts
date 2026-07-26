import * as assert from "assert";
import {
  resolveAjsGroupType,
  resolveAjsUnitDepth,
  resolveAjsUnitHasSchedule,
  resolveAjsUnitHasWaitedFor,
  resolveAjsUnitIsRecovery,
  resolveAjsUnitIsRootJobnet,
  resolveAjsUnitLayout,
} from "../../domain/models/ajs/AjsUnitState";

suite("AJS unit state", () => {
  test("derives group and hierarchy state", () => {
    assert.strictEqual(resolveAjsGroupType(undefined), undefined);
    assert.strictEqual(resolveAjsGroupType("x"), undefined);
    assert.strictEqual(resolveAjsGroupType("n"), "n");
    assert.strictEqual(resolveAjsGroupType("p"), "p");
    assert.strictEqual(resolveAjsUnitDepth("/jobnet"), 0);
    assert.strictEqual(resolveAjsUnitDepth("/jobnet/job-a/step"), 2);
    assert.strictEqual(resolveAjsUnitIsRootJobnet(undefined), true);
    assert.strictEqual(resolveAjsUnitIsRootJobnet("g"), true);
    assert.strictEqual(resolveAjsUnitIsRootJobnet("n"), false);
  });

  test("derives recovery state", () => {
    assert.strictEqual(resolveAjsUnitIsRecovery("g"), undefined);
    assert.strictEqual(resolveAjsUnitIsRecovery("rc"), undefined);
    assert.strictEqual(resolveAjsUnitIsRecovery("rj"), true);
    assert.strictEqual(resolveAjsUnitIsRecovery("j"), false);
    assert.strictEqual(resolveAjsUnitIsRecovery("rm"), false);
  });

  test("derives layout, schedule, and wait state", () => {
    assert.deepStrictEqual(
      resolveAjsUnitLayout("job-a", ["job-a,j,+240+144", "job-b,qj,+400+144"]),
      { h: 240, v: 144 },
    );
    assert.deepStrictEqual(resolveAjsUnitLayout("missing", []), { h: 0, v: 0 });
    assert.strictEqual(resolveAjsUnitHasSchedule([]), false);
    assert.strictEqual(resolveAjsUnitHasSchedule(["1,ud"]), false);
    assert.strictEqual(resolveAjsUnitHasSchedule(["en"]), true);
    assert.strictEqual(resolveAjsUnitHasWaitedFor(undefined), false);
    assert.strictEqual(resolveAjsUnitHasWaitedFor([""]), false);
    assert.strictEqual(resolveAjsUnitHasWaitedFor(["job-a"]), true);
  });
});
