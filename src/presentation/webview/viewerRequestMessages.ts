import {
  parseNavigationRequest,
  type NavigationRequestDto,
} from "../../application/navigation/resolveNavigationTarget";
import {
  isSearchTelemetryData,
  type SearchTelemetryData,
} from "../../application/telemetry/searchTelemetryData";
import {
  viewerOperationIds,
  type ViewerOperationId,
} from "../../application/telemetry/viewerOperation";
import {
  isViewerPerformanceTelemetryData,
  type ViewerPerformanceTelemetryData,
} from "../../application/telemetry/viewerPerformanceTelemetryData";

export const RESOURCE = "resource";
export const READY = "ready";
export const SAVE = "save";
export const OPERATION = "operation";
export const NAVIGATE = "navigate";
export const SEARCH = "search";
export const PERFORMANCE = "performance";

export const viewerRequestTypes = [
  RESOURCE,
  READY,
  SAVE,
  OPERATION,
  NAVIGATE,
  SEARCH,
  PERFORMANCE,
] as const;

export type NavigationTargetView = "flow" | "table";
export type ViewerNavigationRequestData = NavigationRequestDto & {
  targetView: NavigationTargetView;
};

export type ViewerResourceRequestData = {
  scrollType: "window" | "table";
};

export type ViewerResourceRequest = {
  type: typeof RESOURCE;
  data: ViewerResourceRequestData;
};

export type ViewerReadyRequest = { type: typeof READY };
export type ViewerSaveRequest = { type: typeof SAVE; data: string };
export type ViewerOperationRequest = {
  type: typeof OPERATION;
  data: ViewerOperationId;
};
export type ViewerNavigationRequest = {
  type: typeof NAVIGATE;
  data: ViewerNavigationRequestData;
};
export type ViewerSearchRequest = {
  type: typeof SEARCH;
  data: SearchTelemetryData;
};
export type ViewerPerformanceRequest = {
  type: typeof PERFORMANCE;
  data: ViewerPerformanceTelemetryData;
};

export type ViewerRequest =
  | ViewerResourceRequest
  | ViewerReadyRequest
  | ViewerSaveRequest
  | ViewerOperationRequest
  | ViewerNavigationRequest
  | ViewerSearchRequest
  | ViewerPerformanceRequest;

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  Object.getPrototypeOf(value) === Object.prototype;

const hasOnlyKeys = (
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean => {
  const allowedKeys = new Set(keys);
  return Object.keys(value).every((key) => allowedKeys.has(key));
};

const viewerOperationIdSet = new Set<string>(Object.values(viewerOperationIds));

const isViewerOperationId = (value: unknown): value is ViewerOperationId =>
  typeof value === "string" && viewerOperationIdSet.has(value);

const parseViewerResourceRequest = (
  data: unknown,
): ViewerResourceRequest | undefined =>
  isPlainRecord(data) &&
  Object.keys(data).length === 1 &&
  (data.scrollType === "window" || data.scrollType === "table")
    ? { type: RESOURCE, data: { scrollType: data.scrollType } }
    : undefined;

const parseViewerNavigationRequest = (
  data: unknown,
): ViewerNavigationRequest | undefined => {
  const navigation = parseNavigationRequest(data);
  if (
    navigation.status !== "available" ||
    !isPlainRecord(data) ||
    !hasOnlyKeys(data, ["targetView", "absolutePath"])
  ) {
    return undefined;
  }
  const targetView = data.targetView;
  return targetView === "flow" || targetView === "table"
    ? {
        type: NAVIGATE,
        data: { targetView, ...navigation.request },
      }
    : undefined;
};

const parseViewerSearchRequest = (
  data: unknown,
): ViewerSearchRequest | undefined =>
  isPlainRecord(data) &&
  hasOnlyKeys(data, [
    "surface",
    "action",
    "result",
    "mode",
    "queryLengthBucket",
    "resultCountBucket",
    "durationBucket",
    "scope",
  ]) &&
  isSearchTelemetryData(data)
    ? createViewerSearchRequest(data)
    : undefined;

const parseViewerPerformanceRequest = (
  data: unknown,
): ViewerPerformanceRequest | undefined => {
  return isPlainRecord(data) &&
    hasOnlyKeys(data, [
      "operation",
      "result",
      "durationBucket",
      "rowCountBucket",
      "nodeCountBucket",
      "edgeCountBucket",
    ]) &&
    isViewerPerformanceTelemetryData(data)
    ? createViewerPerformanceRequest(data)
    : undefined;
};

const parseViewerSaveRequest = (
  data: unknown,
): ViewerSaveRequest | undefined =>
  typeof data === "string" ? { type: SAVE, data } : undefined;

const parseViewerOperationRequest = (
  data: unknown,
): ViewerOperationRequest | undefined =>
  isViewerOperationId(data) ? { type: OPERATION, data } : undefined;

type ViewerRequestDataParser = (data: unknown) => ViewerRequest | undefined;

const viewerRequestDataParsers: Readonly<
  Record<string, ViewerRequestDataParser>
> = {
  [RESOURCE]: parseViewerResourceRequest,
  [SAVE]: parseViewerSaveRequest,
  [OPERATION]: parseViewerOperationRequest,
  [NAVIGATE]: parseViewerNavigationRequest,
  [SEARCH]: parseViewerSearchRequest,
  [PERFORMANCE]: parseViewerPerformanceRequest,
};

export const parseViewerRequest = (
  value: unknown,
): ViewerRequest | undefined => {
  let result: ViewerRequest | undefined;
  if (isPlainRecord(value)) {
    const isReadyRequest = value.type === READY;
    const allowedKeys = isReadyRequest ? ["type"] : ["type", "data"];
    if (hasOnlyKeys(value, allowedKeys)) {
      const parser =
        typeof value.type === "string"
          ? viewerRequestDataParsers[value.type]
          : undefined;
      result = isReadyRequest ? { type: READY } : parser?.(value.data);
    }
  }
  return result;
};

export const isInvalidViewerSaveRequest = (value: unknown): boolean =>
  isPlainRecord(value) && value.type === SAVE && typeof value.data !== "string";

export const createViewerResourceRequest = (
  scrollType: ViewerResourceRequestData["scrollType"],
): ViewerResourceRequest => ({
  type: RESOURCE,
  data: { scrollType },
});

export const createViewerReadyRequest = (): ViewerReadyRequest => ({
  type: READY,
});

export const createViewerSaveRequest = (data: string): ViewerSaveRequest => ({
  type: SAVE,
  data,
});

export const createViewerOperationRequest = (
  data: ViewerOperationId,
): ViewerOperationRequest => ({
  type: OPERATION,
  data,
});

export const createViewerNavigationRequest = (
  targetView: NavigationTargetView,
  absolutePath: string,
): ViewerNavigationRequest => ({
  type: NAVIGATE,
  data: { targetView, absolutePath },
});

const optionalField = <Key extends string, Value>(
  key: Key,
  value: Value | undefined,
): { [Field in Key]?: Value } =>
  value === undefined ? {} : ({ [key]: value } as { [Field in Key]: Value });

export const createViewerSearchRequest = (
  data: SearchTelemetryData,
): ViewerSearchRequest => ({
  type: SEARCH,
  data: {
    surface: data.surface,
    action: data.action,
    result: data.result,
    mode: data.mode,
    ...optionalField("queryLengthBucket", data.queryLengthBucket),
    ...optionalField("resultCountBucket", data.resultCountBucket),
    ...optionalField("durationBucket", data.durationBucket),
    scope: data.scope,
  },
});

export const createViewerPerformanceRequest = (
  data: ViewerPerformanceTelemetryData,
): ViewerPerformanceRequest => ({
  type: PERFORMANCE,
  data: {
    operation: data.operation,
    result: data.result,
    ...optionalField("durationBucket", data.durationBucket),
    ...optionalField("rowCountBucket", data.rowCountBucket),
    ...optionalField("nodeCountBucket", data.nodeCountBucket),
    ...optionalField("edgeCountBucket", data.edgeCountBucket),
  },
});
