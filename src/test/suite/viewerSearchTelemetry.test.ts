import * as assert from "assert";
import { postViewerSearchEvent } from "../../presentation/webview/editor/shared/viewerSearchTelemetry";
import { assertPlainJsonValue } from "../support/plainJson";

suite("Viewer search telemetry", () => {
  test("posts only the committed viewer feature", () => {
    const previousWindow = Object.getOwnPropertyDescriptor(
      globalThis,
      "window",
    );
    const messages: unknown[] = [];
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        vscode: { postMessage: (message: unknown) => messages.push(message) },
      },
    });

    try {
      postViewerSearchEvent("flow");
      assert.deepStrictEqual(messages, [
        { type: "search", data: { feature: "flow" } },
      ]);
      assertPlainJsonValue(messages[0]);
    } finally {
      if (previousWindow) {
        Object.defineProperty(globalThis, "window", previousWindow);
      } else {
        delete (globalThis as Record<string, unknown>).window;
      }
    }
  });
});
