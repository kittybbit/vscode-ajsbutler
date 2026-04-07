import * as assert from "assert";
import { createExtensionSubscriptions } from "../../extension/bootstrap/extensionSubscriptions";
import { MyExtension } from "../../extension/MyExtension";
import * as vscode from "vscode";

suite("Extension subscriptions", () => {
  test("creates diagnostics and hover subscriptions", () => {
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
