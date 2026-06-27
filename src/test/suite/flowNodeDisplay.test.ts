import * as assert from "assert";
import { getFlowNodeHeaderItemKinds } from "../../presentation/webview/editor/ajsFlow/nodes/AjsNode";
import {
  resolveFlowNodeHeaderTone,
  resolveFlowNodeStatuses,
  shouldRenderNodeComment,
} from "../../presentation/webview/editor/ajsFlow/nodes/flowNodeDisplay";
import { getJobNetHeaderActionKinds } from "../../presentation/webview/editor/ajsFlow/nodes/JobNetNode";

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

  test("places jobnet open-scope before nested expand in the header", () => {
    assert.deepStrictEqual(
      getJobNetHeaderActionKinds({
        canExpandNested: true,
        isCurrent: false,
      }),
      ["openScope", "toggleNested"],
    );
    assert.deepStrictEqual(
      getJobNetHeaderActionKinds({
        canExpandNested: false,
        isCurrent: false,
      }),
      ["openScope"],
    );
    assert.deepStrictEqual(
      getJobNetHeaderActionKinds({
        canExpandNested: true,
        isCurrent: true,
      }),
      [],
    );
  });

  test("keeps status indicators in the header before node actions", () => {
    assert.deepStrictEqual(
      getFlowNodeHeaderItemKinds(
        {
          hasSchedule: true,
          hasWaitedFor: true,
          isRootJobnet: true,
        },
        true,
      ),
      ["rootBadge", "schedule", "waitedFor", "action"],
    );
    assert.deepStrictEqual(
      getFlowNodeHeaderItemKinds(
        {
          hasSchedule: false,
          hasWaitedFor: false,
          isRootJobnet: false,
        },
        false,
      ),
      [],
    );
  });
});
