import * as assert from "assert";
import { resolveFlowViewerShortcut } from "../../presentation/webview/editor/ajsFlow/flowViewerShortcuts";

suite("Flow Viewer Shortcuts", () => {
  test("resolves D and L without modifiers regardless of case", () => {
    assert.strictEqual(resolveFlowViewerShortcut({ key: "d" }), "detail");
    assert.strictEqual(resolveFlowViewerShortcut({ key: "D" }), "detail");
    assert.strictEqual(resolveFlowViewerShortcut({ key: "l" }), "selector");
    assert.strictEqual(resolveFlowViewerShortcut({ key: "L" }), "selector");
  });

  test("rejects modified or unrelated keys", () => {
    for (const modifier of [
      "altKey",
      "ctrlKey",
      "metaKey",
      "shiftKey",
    ] as const) {
      assert.strictEqual(
        resolveFlowViewerShortcut({ key: "d", [modifier]: true }),
        undefined,
      );
    }
    assert.strictEqual(resolveFlowViewerShortcut({ key: "r" }), undefined);
    assert.strictEqual(
      resolveFlowViewerShortcut({ key: "toString" }),
      undefined,
    );
  });
});
