import {
  parseViewerHostMessage,
  type ViewerHostMessage,
  type ViewerHostMessageType,
} from "../viewerHostMessages";

type ViewerEventCallbacks = Window["EventBridge"]["callbacks"];

const dispatchViewerEventPayload = (
  callbacksByType: ViewerEventCallbacks,
  payload: ViewerHostMessage,
): void => {
  callbacksByType[payload.type]?.forEach((callback) => {
    callback(payload.type, payload.data);
  });
};

const appendViewerEventCallback = (
  callbacksByType: ViewerEventCallbacks,
  type: ViewerHostMessageType,
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
  type: ViewerHostMessageType,
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
      const payload = parseViewerHostMessage(event.data);
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
