import * as assert from "assert";
import { shouldRenderNodeComment } from "../../ui-component/editor/ajsFlow/nodes/flowNodeDisplay";

suite("flow node display", () => {
  test("does not render duplicate comments matching the label", () => {
    assert.strictEqual(
      shouldRenderNodeComment("branch_beta", "branch_beta"),
      false,
    );
  });

  test("renders distinct comments", () => {
    assert.strictEqual(shouldRenderNodeComment("branch_beta", "comment"), true);
  });

  test("does not render empty comments", () => {
    assert.strictEqual(
      shouldRenderNodeComment("branch_beta", undefined),
      false,
    );
  });
});
