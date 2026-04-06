import * as assert from "assert";
import * as vscode from "vscode";
import { MyExtension } from "../../extension/MyExtension";
import { createViewerSubscriptions } from
  "../../extension/bootstrap/viewerWiring";

suite("Viewer wiring", () => {
  test("creates viewer subscriptions for both table and flow viewers", () => {
    const extension = MyExtension.init(
      { subscriptions: [] } as unknown as vscode.ExtensionContext,
      {
        trackEvent() {},
        dispose() {},
      },
    );

    const subscriptions = createViewerSubscriptions(extension);

    assert.strictEqual(subscriptions.length, 4);
    subscriptions.forEach((subscription) => {
      assert.strictEqual(typeof subscription.dispose, "function");
      subscription.dispose();
    });
  });
});
