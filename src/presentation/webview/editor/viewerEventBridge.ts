export const createViewerEventBridge = (): Window["EventBridge"] => {
  const bridge: Window["EventBridge"] = {
    callbacks: {},
    dispatch: (event) => {
      if (!event.data || typeof event.data !== "object") {
        return;
      }

      const type = event.data.type;
      if (typeof type !== "string") {
        return;
      }

      const callbacks = bridge.callbacks[type];
      callbacks?.forEach((callback) => {
        callback(type, event.data.data);
      });
    },
    addCallback: (type, callback) => {
      const callbacks = bridge.callbacks[type] ?? [];
      callbacks.push(callback);
      bridge.callbacks[type] = callbacks;
    },
    removeCallback: (type, callback) => {
      const callbacks = bridge.callbacks[type];
      if (!callbacks) {
        return;
      }

      bridge.callbacks[type] = callbacks.filter((item) => item !== callback);
    },
  };

  return bridge;
};
