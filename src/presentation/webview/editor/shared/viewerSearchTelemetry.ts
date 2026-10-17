import { createViewerSearchRequest } from "../../viewerRequestMessages";

export const postViewerSearchEvent = (feature: "table" | "flow"): void => {
  try {
    window.vscode.postMessage(createViewerSearchRequest(feature));
  } catch {
    // Search telemetry is best-effort and must not block viewer behavior.
  }
};
