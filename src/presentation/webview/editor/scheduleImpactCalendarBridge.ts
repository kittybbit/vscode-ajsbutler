import {
  createScheduleImpactCalendarReadyRequest,
  createScheduleImpactCalendarRefreshRequest,
  parseScheduleImpactCalendarHostMessage,
  type ScheduleImpactCalendarHostMessage,
} from "../../vscode/webview/scheduleImpactCalendarTransport";

export type ScheduleImpactCalendarPostMessagePort = Readonly<{
  postMessage(message: unknown): void;
}>;

export type ScheduleImpactCalendarMessageTarget = Readonly<{
  addEventListener(
    type: "message",
    listener: (event: MessageEvent) => void,
  ): void;
  removeEventListener(
    type: "message",
    listener: (event: MessageEvent) => void,
  ): void;
}>;

export type ScheduleImpactCalendarBridge = Readonly<{
  sessionId: string;
  sendReady(): number;
  sendRefresh(): number;
  onMessage(
    listener: (message: ScheduleImpactCalendarHostMessage) => void,
  ): () => void;
  dispose(): void;
}>;

export const createScheduleImpactCalendarBridge = (
  sessionId: string,
  vscodeApi: ScheduleImpactCalendarPostMessagePort = window.vscode,
  target: ScheduleImpactCalendarMessageTarget = window,
): ScheduleImpactCalendarBridge => {
  let nextRequestId = 1;
  let latestResponseId = 0;
  let disposed = false;
  const listeners = new Set<
    (message: ScheduleImpactCalendarHostMessage) => void
  >();

  const send = (type: "ready" | "refresh"): number => {
    if (disposed) return 0;
    const requestId = nextRequestId++;
    const message =
      type === "ready"
        ? createScheduleImpactCalendarReadyRequest(sessionId, requestId)
        : createScheduleImpactCalendarRefreshRequest(sessionId, requestId);
    vscodeApi.postMessage(message);
    return requestId;
  };

  const onWindowMessage = (event: MessageEvent): void => {
    if (disposed) return;
    const message = parseScheduleImpactCalendarHostMessage(event.data, {
      expectedSessionId: sessionId,
      minimumRequestId: latestResponseId,
    });
    if (!message) return;
    if (message.type === "session" || message.type === "failure") {
      if (message.requestId !== null) latestResponseId = message.requestId;
    }
    listeners.forEach((listener) => listener(message));
  };
  target.addEventListener("message", onWindowMessage);

  return {
    sessionId,
    sendReady: () => send("ready"),
    sendRefresh: () => send("refresh"),
    onMessage: (listener) => {
      if (disposed) return () => undefined;
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispose: () => {
      if (disposed) return;
      disposed = true;
      listeners.clear();
      target.removeEventListener("message", onWindowMessage);
    },
  };
};
