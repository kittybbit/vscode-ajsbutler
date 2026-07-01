import * as assert from "assert";
import { mergeUnitIds } from "../../presentation/webview/editor/shared/UnitTreeSelector";

suite("Unit Tree Selector", () => {
  test("merges required unit ids without changing an already complete set", () => {
    const current = new Set(["/root", "/root/jobnet"]);
    const next = mergeUnitIds(current, ["/root", undefined, "/root/jobnet"]);

    assert.strictEqual(next, current);
    assert.deepStrictEqual([...next], ["/root", "/root/jobnet"]);
  });

  test("appends only missing required unit ids", () => {
    const next = mergeUnitIds(new Set(["/root"]), [
      "/root/jobnet",
      undefined,
      "/root/jobnet/job",
    ]);

    assert.deepStrictEqual(
      [...next],
      ["/root", "/root/jobnet", "/root/jobnet/job"],
    );
  });
});
