import * as assert from "assert";
import * as vscode from "vscode";
import { MyExtension } from "../../extension/MyExtension";
import { createExtensionSubscriptions } from "../../extension/bootstrap/extensionSubscriptions";

suite("Extension subscriptions", () => {
  test("creates diagnostics, hover, and viewer subscriptions", () => {
    const extension = MyExtension.init(
      { subscriptions: [] } as unknown as vscode.ExtensionContext,
      {
        trackEvent() {},
        dispose() {},
      },
    );

    const subscriptions = createExtensionSubscriptions(extension);

    assert.strictEqual(subscriptions.length, 6);
    subscriptions.forEach((subscription) => {
      assert.strictEqual(typeof subscription.dispose, "function");
      subscription.dispose();
    });
  });
});
