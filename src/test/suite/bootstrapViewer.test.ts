import * as assert from "assert";
import React from "react";
import { cleanup } from "@testing-library/react";
import { bootstrapViewer } from "../../presentation/webview/editor/bootstrapViewer";

type VsCodeApi = { postMessage: (value: unknown) => void };
type GlobalValue = {
  descriptor: PropertyDescriptor | undefined;
};

const installVsCodeApi = (
  postMessage: (value: unknown) => void,
): GlobalValue => {
  const global = globalThis as unknown as Record<string, unknown>;
  const descriptor = Object.getOwnPropertyDescriptor(
    global,
    "acquireVsCodeApi",
  );
  Object.defineProperty(global, "acquireVsCodeApi", {
    configurable: true,
    writable: true,
    value: () => ({ postMessage }) satisfies VsCodeApi,
  });
  return { descriptor };
};

const restoreVsCodeApi = ({ descriptor }: GlobalValue): void => {
  const global = globalThis as unknown as Record<string, unknown>;
  if (descriptor) Object.defineProperty(global, "acquireVsCodeApi", descriptor);
  else Reflect.deleteProperty(global, "acquireVsCodeApi");
};

const nextTask = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 0));

suite("Viewer bootstrap", () => {
  let originalBody: string;
  let api: GlobalValue;

  setup(() => {
    originalBody = document.body.innerHTML;
  });

  teardown(() => {
    cleanup();
    document.body.innerHTML = originalBody;
    restoreVsCodeApi(api);
  });

  test("acknowledges a missing root without exception details", () => {
    const messages: unknown[] = [];
    api = installVsCodeApi((message) => messages.push(message));

    bootstrapViewer(() => React.createElement("div"));

    assert.deepStrictEqual(messages, [{ type: "display", data: "failed" }]);
  });

  test("acknowledges a render failure without exposing its error", async () => {
    const messages: unknown[] = [];
    const sentinel = "private-render-error-detail";
    api = installVsCodeApi((message) => messages.push(message));
    document.body.innerHTML = '<div id="root"></div>';
    const ThrowingViewer = (): React.ReactElement => {
      throw new Error(sentinel);
    };

    bootstrapViewer(ThrowingViewer);
    await nextTask();
    assert.deepStrictEqual(messages, [{ type: "display", data: "failed" }]);
    assert.strictEqual(JSON.stringify(messages).includes(sentinel), false);
  });
});
