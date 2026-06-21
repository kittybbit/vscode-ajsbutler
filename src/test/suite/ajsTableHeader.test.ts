import * as assert from "assert";
import { formatUnitCountLabel } from "../../presentation/webview/editor/ajsTable/Header";

suite("AJS Table Header", () => {
  test("formats visible and total unit counts", () => {
    assert.strictEqual(formatUnitCountLabel(0, 0), "0 / 0 units");
    assert.strictEqual(formatUnitCountLabel(12, 45), "12 / 45 units");
    assert.strictEqual(formatUnitCountLabel(45, 45), "45 / 45 units");
  });
});
