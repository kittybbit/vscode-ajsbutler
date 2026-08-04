import * as assert from "assert";
import { postViewerSearchEvent } from "../../presentation/webview/editor/shared/viewerSearchTelemetry";
import { assertPlainJsonValue } from "../support/plainJson";

const captureViewerSearchMessages = (run: () => void): unknown[] => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const messages: unknown[] = [];

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      vscode: {
        postMessage: (message: unknown) => messages.push(message),
      },
    },
  });

  try {
    run();
    return messages;
  } finally {
    if (previousWindow) {
      Object.defineProperty(globalThis, "window", previousWindow);
    } else {
      delete (globalThis as Record<string, unknown>).window;
    }
  }
};

suite("Viewer search telemetry", () => {
  test("posts bucketed flow search metadata without the query", () => {
    const query = "/root/private-job-name";
    const messages = captureViewerSearchMessages(() =>
      postViewerSearchEvent({
        action: "submitted",
        durationMs: 120,
        query,
        resultCount: 12,
        scope: "current_flow_scope",
        surface: "flow",
      }),
    );

    assert.deepStrictEqual(messages, [
      {
        type: "search",
        data: {
          action: "submitted",
          durationBucket: "100_499ms",
          mode: "partial",
          queryLengthBucket: "10_99",
          result: "matched",
          resultCountBucket: "10_99",
          scope: "current_flow_scope",
          surface: "flow",
        },
      },
    ]);
    assertPlainJsonValue(messages[0]);
    assert.strictEqual(JSON.stringify(messages[0]).includes(query), false);
  });

  test("posts cleared table searches with stable empty-result metadata", () => {
    const messages = captureViewerSearchMessages(() =>
      postViewerSearchEvent({
        action: "cleared",
        query: "",
        resultCount: 0,
        scope: "visible_rows",
        surface: "table",
      }),
    );

    assert.deepStrictEqual(messages, [
      {
        type: "search",
        data: {
          action: "cleared",
          mode: "partial",
          queryLengthBucket: "0",
          result: "cleared",
          resultCountBucket: "0",
          scope: "visible_rows",
          surface: "table",
        },
      },
    ]);
  });
});
