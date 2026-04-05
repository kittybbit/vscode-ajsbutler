import * as assert from "assert";
import { resolveIsRecovery } from "../../domain/models/units/unitTypeHelpers";

suite("Unit type helpers", () => {
  test("resolves recovery capability from unit type", () => {
    assert.strictEqual(resolveIsRecovery("g"), undefined);
    assert.strictEqual(resolveIsRecovery("mg"), undefined);
    assert.strictEqual(resolveIsRecovery("rc"), undefined);
    assert.strictEqual(resolveIsRecovery("mn"), undefined);
    assert.strictEqual(resolveIsRecovery("nc"), undefined);

    assert.strictEqual(resolveIsRecovery("rj"), true);
    assert.strictEqual(resolveIsRecovery("rp"), true);
    assert.strictEqual(resolveIsRecovery("rcj"), true);

    assert.strictEqual(resolveIsRecovery("j"), false);
    assert.strictEqual(resolveIsRecovery("n"), false);
    assert.strictEqual(resolveIsRecovery("rm"), false);
  });
});
