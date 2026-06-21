import * as assert from "assert";
import {
  resolveFlowNodeStatuses,
  resolveFlowNodeHeaderTone,
  shouldRenderNodeComment,
} from "../../presentation/webview/editor/ajsFlow/nodes/flowNodeDisplay";

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

  test("keeps static status indicators separate and ordered", () => {
    assert.deepStrictEqual(
      resolveFlowNodeStatuses({
        hasSchedule: true,
        hasWaitedFor: true,
      }),
      ["schedule", "waitedFor"],
    );
    assert.deepStrictEqual(
      resolveFlowNodeStatuses({
        hasSchedule: false,
        hasWaitedFor: false,
      }),
      [],
    );
  });

  test("assigns a stable distinct header tone to every node kind", () => {
    assert.deepStrictEqual(
      ["job", "jobnet", "jobgroup", "condition"].map((kind) =>
        resolveFlowNodeHeaderTone(
          kind as "job" | "jobnet" | "jobgroup" | "condition",
        ),
      ),
      ["neutral", "primary", "warning", "info"],
    );
  });
});
