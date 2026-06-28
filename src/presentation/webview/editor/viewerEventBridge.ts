type ViewerEventCallbacks = Window["EventBridge"]["callbacks"];
type ViewerEventCallback = ViewerEventCallbacks[string][number];

type ViewerEventPayload = {
  type: string;
  data: object;
};

type ViewerEventPayloadCandidate = {
  type?: unknown;
  data?: unknown;
};

const isViewerEventPayloadCandidate = (
  value: unknown,
): value is ViewerEventPayloadCandidate =>
  Boolean(value) && typeof value === "object";

const toViewerEventPayload = (
  payload: ViewerEventPayloadCandidate,
): ViewerEventPayload | undefined =>
  typeof payload.type === "string"
    ? { type: payload.type, data: payload.data as object }
    : undefined;

const resolveViewerEventPayload = (
  event: MessageEvent,
): ViewerEventPayload | undefined =>
  isViewerEventPayloadCandidate(event.data)
    ? toViewerEventPayload(event.data)
    : undefined;

const dispatchViewerEventPayload = (
  callbacksByType: ViewerEventCallbacks,
  payload: ViewerEventPayload,
): void => {
  callbacksByType[payload.type]?.forEach((callback) => {
    callback(payload.type, payload.data);
  });
};

const appendViewerEventCallback = (
  callbacksByType: ViewerEventCallbacks,
  type: string,
  callback: ViewerEventCallback,
): void => {
  const callbacks = callbacksByType[type];
  if (callbacks) {
    callbacks.push(callback);
    return;
  }

  callbacksByType[type] = [callback];
};

const removeCallbackFromList = (
  callbacks: ViewerEventCallback[],
  callback: ViewerEventCallback,
): ViewerEventCallback[] => {
  return callbacks.filter((item) => item !== callback);
};

const removeViewerEventCallback = (
  callbacksByType: ViewerEventCallbacks,
  type: string,
  callback: ViewerEventCallback,
): void => {
  const callbacks = callbacksByType[type];
  if (callbacks) {
    callbacksByType[type] = removeCallbackFromList(callbacks, callback);
  }
};

export const createViewerEventBridge = (): Window["EventBridge"] => {
  const callbacks: ViewerEventCallbacks = {};
  const bridge: Window["EventBridge"] = {
    callbacks,
    dispatch: (event) => {
      const payload = resolveViewerEventPayload(event);
      if (payload) {
        dispatchViewerEventPayload(callbacks, payload);
      }
    },
    addCallback: (type, callback) => {
      appendViewerEventCallback(callbacks, type, callback);
    },
    removeCallback: (type, callback) => {
      removeViewerEventCallback(callbacks, type, callback);
    },
  };

  return bridge;
};
