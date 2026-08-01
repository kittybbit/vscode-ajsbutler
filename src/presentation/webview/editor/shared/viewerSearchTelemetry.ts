import {
  toCountBucket,
  toDurationBucket,
} from "../../../../application/telemetry/telemetryBuckets";
import { createViewerSearchRequest } from "../../viewerRequestMessages";

type ViewerSearchSurface = "flow" | "table";
type ViewerSearchAction = "submitted" | "navigated" | "cleared";
type ViewerSearchScope = "current_flow_scope" | "visible_rows";

type ViewerSearchEventParams = {
  action: ViewerSearchAction;
  durationMs?: number;
  query: string;
  resultCount: number;
  scope: ViewerSearchScope;
  surface: ViewerSearchSurface;
};

const resolveSearchResult = (
  action: ViewerSearchAction,
  resultCount: number,
): "cleared" | "matched" | "no_match" => {
  if (action === "cleared") {
    return "cleared";
  }
  return resultCount > 0 ? "matched" : "no_match";
};

export const postViewerSearchEvent = ({
  action,
  durationMs,
  query,
  resultCount,
  scope,
  surface,
}: ViewerSearchEventParams): void => {
  window.vscode.postMessage(
    createViewerSearchRequest({
      surface,
      action,
      result: resolveSearchResult(action, resultCount),
      mode: "partial",
      queryLengthBucket: toCountBucket(query.trim().length),
      resultCountBucket: toCountBucket(resultCount),
      durationBucket:
        durationMs === undefined ? undefined : toDurationBucket(durationMs),
      scope,
    }),
  );
};
