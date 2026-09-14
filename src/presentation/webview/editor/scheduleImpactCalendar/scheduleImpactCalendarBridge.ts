import {
  createScheduleImpactCalendarReadyRequest,
  createScheduleImpactCalendarRefreshRequest,
  parseScheduleImpactCalendarHostMessage,
  type ScheduleImpactCalendarHostMessage,
} from "../../../vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarTransport";

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

type ScheduleImpactCalendarListener = (
  message: ScheduleImpactCalendarHostMessage,
) => void;

type BridgeState = {
  nextRequestId: number;
  latestResponseId: number;
  disposed: boolean;
  listeners: Set<ScheduleImpactCalendarListener>;
};

const createBridgeState = (): BridgeState => ({
  nextRequestId: 1,
  latestResponseId: 0,
  disposed: false,
  listeners: new Set(),
});

const createRequest = (
  sessionId: string,
  requestId: number,
  type: "ready" | "refresh",
) =>
  type === "ready"
    ? createScheduleImpactCalendarReadyRequest(sessionId, requestId)
    : createScheduleImpactCalendarRefreshRequest(sessionId, requestId);

type SendRequestContext = Readonly<{
  state: BridgeState;
  sessionId: string;
  vscodeApi: ScheduleImpactCalendarPostMessagePort;
}>;

const sendRequest = (
  context: SendRequestContext,
  type: "ready" | "refresh",
): number => {
  if (context.state.disposed) return 0;
  const requestId = context.state.nextRequestId++;
  context.vscodeApi.postMessage(
    createRequest(context.sessionId, requestId, type),
  );
  return requestId;
};

const isResponseWithRequestId = (
  message: ScheduleImpactCalendarHostMessage,
): message is
  | Extract<ScheduleImpactCalendarHostMessage, { type: "session" }>
  | Extract<ScheduleImpactCalendarHostMessage, { type: "failure" }> =>
  (message.type === "session" || message.type === "failure") &&
  message.requestId !== null;

const updateResponseCursor = (
  state: BridgeState,
  message: ScheduleImpactCalendarHostMessage,
): void => {
  if (isResponseWithRequestId(message)) {
    state.latestResponseId = message.requestId;
  }
};

const acceptHostMessage = (
  state: BridgeState,
  sessionId: string,
  event: MessageEvent,
): ScheduleImpactCalendarHostMessage | undefined => {
  const message = parseScheduleImpactCalendarHostMessage(event.data, {
    expectedSessionId: sessionId,
    minimumRequestId: state.latestResponseId,
  });
  if (message) updateResponseCursor(state, message);
  return message;
};

const notifyListeners = (
  state: BridgeState,
  message: ScheduleImpactCalendarHostMessage,
): void => {
  state.listeners.forEach((listener) => listener(message));
};

const dispatchHostMessage = (
  state: BridgeState,
  sessionId: string,
  event: MessageEvent,
): void => {
  const message = acceptHostMessage(state, sessionId, event);
  if (message) notifyListeners(state, message);
};

const createMessageHandler =
  (state: BridgeState, sessionId: string): ((event: MessageEvent) => void) =>
  (event) => {
    if (state.disposed) return;
    dispatchHostMessage(state, sessionId, event);
  };

const subscribe = (
  state: BridgeState,
  listener: ScheduleImpactCalendarListener,
): (() => void) => {
  if (state.disposed) return () => undefined;
  state.listeners.add(listener);
  return () => state.listeners.delete(listener);
};

const disposeBridge = (
  state: BridgeState,
  target: ScheduleImpactCalendarMessageTarget,
  handler: (event: MessageEvent) => void,
): void => {
  if (state.disposed) return;
  state.disposed = true;
  state.listeners.clear();
  target.removeEventListener("message", handler);
};

export const createScheduleImpactCalendarBridge = (
  sessionId: string,
  vscodeApi: ScheduleImpactCalendarPostMessagePort = window.vscode,
  target: ScheduleImpactCalendarMessageTarget = window,
): ScheduleImpactCalendarBridge => {
  const state = createBridgeState();
  const handler = createMessageHandler(state, sessionId);
  const sendContext: SendRequestContext = { state, sessionId, vscodeApi };
  target.addEventListener("message", handler);

  return {
    sessionId,
    sendReady: () => sendRequest(sendContext, "ready"),
    sendRefresh: () => sendRequest(sendContext, "refresh"),
    onMessage: (listener) => subscribe(state, listener),
    dispose: () => disposeBridge(state, target, handler),
  };
};
