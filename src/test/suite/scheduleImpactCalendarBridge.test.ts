import * as assert from "assert";
import {
  createScheduleImpactCalendarBridge,
  type ScheduleImpactCalendarMessageTarget,
  type ScheduleImpactCalendarPostMessagePort,
} from "../../presentation/webview/editor/scheduleImpactCalendarBridge";
import {
  createScheduleImpactCalendarFailureMessage,
  createScheduleImpactCalendarSessionMessage,
} from "../../presentation/vscode/webview/scheduleImpactCalendarTransport";

type MessageListener = (event: MessageEvent) => void;

const createTarget = () => {
  const listeners = new Set<MessageListener>();
  let added = 0;
  let removed = 0;
  return {
    target: {
      addEventListener: (_type: "message", listener: MessageListener) => {
        added += 1;
        listeners.add(listener);
      },
      removeEventListener: (_type: "message", listener: MessageListener) => {
        removed += 1;
        listeners.delete(listener);
      },
    } satisfies ScheduleImpactCalendarMessageTarget,
    dispatch: (data: unknown) => {
      listeners.forEach((listener) => listener({ data } as MessageEvent));
    },
    get added() {
      return added;
    },
    get removed() {
      return removed;
    },
  };
};

const createPort = () => {
  const messages: unknown[] = [];
  return {
    port: {
      postMessage: (message: unknown) => messages.push(message),
    } satisfies ScheduleImpactCalendarPostMessagePort,
    messages,
  };
};

suite("Schedule impact calendar bridge", () => {
  test("numbers requests and filters responses by session and freshness", () => {
    const target = createTarget();
    const port = createPort();
    const bridge = createScheduleImpactCalendarBridge(
      "calendar-1",
      port.port,
      target.target,
    );
    const received: unknown[] = [];
    bridge.onMessage((message) => received.push(message));

    assert.strictEqual(bridge.sendReady(), 1);
    assert.strictEqual(bridge.sendRefresh(), 2);
    assert.deepStrictEqual(
      port.messages.map(
        (message) => (message as { type: string; requestId: number }).requestId,
      ),
      [1, 2],
    );

    const session = createScheduleImpactCalendarSessionMessage(
      "calendar-1",
      1,
      {} as never,
    );
    target.dispatch({
      type: "__proto__",
      sessionId: "calendar-1",
      requestId: 1,
      ok: true,
      payload: {},
      error: null,
    });
    target.dispatch({
      type: "valueOf",
      sessionId: "calendar-1",
      requestId: 1,
      ok: true,
      payload: {},
      error: null,
    });
    target.dispatch(session);
    target.dispatch({ ...session, sessionId: "other-session" });
    target.dispatch(session);
    target.dispatch(
      createScheduleImpactCalendarFailureMessage("calendar-1", 2, {
        code: "host-disposed",
        detail: null,
      }),
    );

    assert.deepStrictEqual(received, [
      session,
      {
        type: "failure",
        sessionId: "calendar-1",
        requestId: 2,
        ok: false,
        payload: null,
        error: { code: "host-disposed", detail: null },
      },
    ]);
    assert.strictEqual(target.added, 1);
  });

  test("unsubscribes and disposes the listener and request sender once", () => {
    const target = createTarget();
    const port = createPort();
    const bridge = createScheduleImpactCalendarBridge(
      "calendar-2",
      port.port,
      target.target,
    );
    let received = 0;
    const unsubscribe = bridge.onMessage(() => {
      received += 1;
    });
    const message = createScheduleImpactCalendarSessionMessage(
      "calendar-2",
      1,
      {} as never,
    );

    target.dispatch(message);
    unsubscribe();
    target.dispatch({ ...message, requestId: 2 });
    assert.strictEqual(received, 1);

    bridge.dispose();
    bridge.dispose();
    target.dispatch({ ...message, requestId: 3 });
    assert.strictEqual(target.removed, 1);
    assert.strictEqual(bridge.sendReady(), 0);
    assert.strictEqual(bridge.sendRefresh(), 0);
    assert.strictEqual(port.messages.length, 0);
    assert.strictEqual(bridge.onMessage(() => undefined)(), undefined);
  });
});
