import * as assert from "assert";
import { createEditorAdapterSubscriptions } from "../../extension/bootstrap/editorAdapterWiring";

suite("Editor adapter wiring", () => {
  test("creates diagnostics and hover subscriptions", () => {
    const subscriptions = createEditorAdapterSubscriptions();

    assert.strictEqual(subscriptions.length, 2);
    subscriptions.forEach((subscription) => {
      assert.strictEqual(typeof subscription.dispose, "function");
      subscription.dispose();
    });
  });
});
