import type { MyAppResource } from "./MyAppResource";
import {
  parseNavigationRequest,
  type NavigationRequestDto,
} from "../application/navigation/resolveNavigationTarget";

export const RESOURCE = "resource";
export const READY = "ready";
export const SAVE = "save";
export const CHANGE_DOCUMENT = "changeDocument";
export const OPERATION = "operation";
export const NAVIGATE = "navigate";
export const REVEAL_UNIT = "revealUnit";
export const SEARCH = "search";
export const PERFORMANCE = "performance";

export type NavigationTargetView = "flow" | "table";
export type NavigationEventData = NavigationRequestDto & {
  targetView: NavigationTargetView;
};
export type RevealUnitEventData = NavigationRequestDto;

export type ResourceEventType = { type: typeof RESOURCE; data: MyAppResource };
export type ReadyEventType = { type: typeof READY };
export type SaveEventType = { type: typeof SAVE; data: string };
export type OperationEventType = { type: typeof OPERATION; data: string };
export type SearchEventData = {
  surface: "table" | "flow";
  action: "submitted" | "navigated" | "cleared";
  result: "matched" | "no_match" | "cleared";
  mode: "partial";
  queryLengthBucket?: string;
  resultCountBucket?: string;
  durationBucket?: string;
  scope: "visible_rows" | "current_flow_scope";
};
export type SearchEventType = { type: typeof SEARCH; data: SearchEventData };
export type PerformanceEventData = {
  operation:
    | "unit_list_build"
    | "flow_graph_build"
    | "table_render"
    | "flow_render"
    | "csv_export";
  result: "success" | "failed";
  durationBucket?: string;
  unitCountBucket?: string;
  rowCountBucket?: string;
  nodeCountBucket?: string;
  edgeCountBucket?: string;
  errorCode?: string;
};
export type PerformanceEventType = {
  type: typeof PERFORMANCE;
  data: PerformanceEventData;
};
export type NavigationEventType = {
  type: typeof NAVIGATE;
  data: NavigationEventData;
};
export type RevealUnitEventType = {
  type: typeof REVEAL_UNIT;
  data: RevealUnitEventData;
};

export const createNavigationEvent = (
  targetView: NavigationTargetView,
  absolutePath: string,
): NavigationEventType => ({
  type: NAVIGATE,
  data: { targetView, absolutePath },
});

export const createRevealUnitEvent = (
  absolutePath: string,
): RevealUnitEventType => ({
  type: REVEAL_UNIT,
  data: { absolutePath },
});

export const parseRevealUnitEventData = (
  data: unknown,
): NavigationRequestDto | undefined => {
  const result = parseNavigationRequest(data);
  return result.status === "available" ? result.request : undefined;
};

export const parseNavigationEventData = (
  data: unknown,
): NavigationEventData | undefined => {
  const request = parseRevealUnitEventData(data);
  if (!request || typeof data !== "object" || data === null) return undefined;
  const targetView = (data as Record<string, unknown>).targetView;
  return targetView === "flow" || targetView === "table"
    ? { targetView, ...request }
    : undefined;
};

export const createOperationEvent = (
  operation: string,
): OperationEventType => ({
  type: OPERATION,
  data: operation,
});

export const createSearchEvent = (data: SearchEventData): SearchEventType => ({
  type: SEARCH,
  data,
});

export const createPerformanceEvent = (
  data: PerformanceEventData,
): PerformanceEventType => ({
  type: PERFORMANCE,
  data,
});

export type WebviewEventType =
  | ResourceEventType
  | ReadyEventType
  | SaveEventType
  | OperationEventType
  | SearchEventType
  | PerformanceEventType
  | NavigationEventType;
