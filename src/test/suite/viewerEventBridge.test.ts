import * as assert from "assert";
import { createViewerEventBridge } from "../../presentation/webview/editor/viewerEventBridge";

const messageEvent = (data: unknown): MessageEvent =>
  ({ data }) as MessageEvent;

suite("Viewer event bridge", () => {
  test("dispatches valid messages to callbacks in registration order", () => {
    const bridge = createViewerEventBridge();
    const calls: string[] = [];
    const data = { absolutePath: "/root/job" };

    bridge.addCallback("revealUnit", (type, receivedData) => {
      calls.push(`first:${type}:${receivedData === data}`);
    });
    bridge.addCallback("revealUnit", (type, receivedData) => {
      calls.push(`second:${type}:${receivedData === data}`);
    });

    bridge.dispatch(messageEvent({ type: "revealUnit", data }));
    bridge.dispatch(messageEvent({ type: "unknown", data }));

    assert.deepStrictEqual(calls, [
      "first:revealUnit:true",
      "second:revealUnit:true",
    ]);
  });

  test("ignores messages without object data or a string type", () => {
    const bridge = createViewerEventBridge();
    let callCount = 0;
    bridge.addCallback("changeDocument", () => {
      callCount += 1;
    });

    bridge.dispatch(messageEvent(undefined));
    bridge.dispatch(messageEvent("changeDocument"));
    bridge.dispatch(messageEvent({ type: 1, data: {} }));

    assert.strictEqual(callCount, 0);
  });

  test("removes only the matching callback", () => {
    const bridge = createViewerEventBridge();
    const calls: string[] = [];
    const removed = () => {
      calls.push("removed");
    };
    const retained = () => {
      calls.push("retained");
    };

    bridge.addCallback("resource", removed);
    bridge.addCallback("resource", retained);
    bridge.removeCallback("resource", removed);
    bridge.removeCallback("missing", removed);
    bridge.dispatch(messageEvent({ type: "resource", data: {} }));

    assert.deepStrictEqual(calls, ["retained"]);
  });
});
