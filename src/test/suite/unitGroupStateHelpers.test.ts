import * as assert from "assert";
import {
  resolveGroupType,
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
});
