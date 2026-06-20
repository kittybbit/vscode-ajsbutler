import * as assert from "assert";
import { reduceFlowFocusModeEnabled } from "../../presentation/webview/editor/ajsFlow/useFlowFocusModeState";

suite("Flow Focus Mode State", () => {
  test("cannot toggle without a selection", () => {
    assert.strictEqual(
      reduceFlowFocusModeEnabled(true, {
        type: "toggle",
        canEnable: false,
      }),
      false,
    );
  });

  test("toggles and resets focus mode", () => {
    const enabled = reduceFlowFocusModeEnabled(false, {
      type: "toggle",
      canEnable: true,
    });
    assert.strictEqual(enabled, true);
    assert.strictEqual(
      reduceFlowFocusModeEnabled(enabled, {
        type: "toggle",
        canEnable: true,
      }),
      false,
    );
    assert.strictEqual(
      reduceFlowFocusModeEnabled(enabled, { type: "reset" }),
      false,
    );
  });
});
