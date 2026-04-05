import * as assert from "assert";
import {
  resolveGroupType,
  resolveGroupWeekState,
  resolveIsPlanning,
} from "../../domain/models/units/unitGroupStateHelpers";

suite("Unit group state helpers", () => {
  test("resolves supported group types", () => {
    assert.strictEqual(resolveGroupType(undefined), undefined);
    assert.strictEqual(resolveGroupType("x"), undefined);
    assert.strictEqual(resolveGroupType("n"), "n");
    assert.strictEqual(resolveGroupType("p"), "p");
  });

  test("resolves whether a group is planning-oriented", () => {
    assert.strictEqual(resolveIsPlanning(undefined), false);
    assert.strictEqual(resolveIsPlanning("n"), false);
    assert.strictEqual(resolveIsPlanning("p"), true);
  });

  test("resolves group week state from open and close calendars", () => {
    assert.strictEqual(
      resolveGroupWeekState(undefined, undefined, "mo"),
      undefined,
    );
    assert.strictEqual(
      resolveGroupWeekState([{ mo: true }], undefined, "mo"),
      true,
    );
    assert.strictEqual(
      resolveGroupWeekState(undefined, [{ mo: true }], "mo"),
      false,
    );
    assert.strictEqual(
      resolveGroupWeekState([{ tu: true }], [{ mo: true }], "mo"),
      false,
    );
    assert.strictEqual(
      resolveGroupWeekState([{ mo: true }], [{ mo: true }], "mo"),
      true,
    );
  });
});
