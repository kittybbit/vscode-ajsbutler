import {
  parseNavigationRequest,
  type NavigationRequestDto,
} from "../../application/navigation/resolveNavigationTarget";

export const RESOURCE = "resource";
export const READY = "ready";
export const SAVE = "save";
export const NAVIGATE = "navigate";
export const SEARCH = "search";
export const CSV_EXPORT = "csv_export";
export const DISPLAY = "display";

export const viewerRequestTypes = [
  RESOURCE,
  READY,
  SAVE,
  NAVIGATE,
  SEARCH,
  CSV_EXPORT,
  DISPLAY,
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
export type ViewerNavigationRequest = {
  type: typeof NAVIGATE;
  data: ViewerNavigationRequestData;
};
export type ViewerSearchFeature = "table" | "flow";
export type ViewerSearchRequest = {
  type: typeof SEARCH;
  data: { feature: ViewerSearchFeature };
};
export type ViewerCsvExportRequest = {
  type: typeof CSV_EXPORT;
  data: { method: "copy" };
};
export type ViewerDisplayResult = "success" | "failed";
export type ViewerDisplayAcknowledgementRequest = {
  type: typeof DISPLAY;
  data: ViewerDisplayResult;
};

export type ViewerRequest =
  | ViewerResourceRequest
  | ViewerReadyRequest
  | ViewerSaveRequest
  | ViewerNavigationRequest
  | ViewerSearchRequest
  | ViewerCsvExportRequest
  | ViewerDisplayAcknowledgementRequest;

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
    ? { type: NAVIGATE, data: { targetView, ...navigation.request } }
    : undefined;
};

const parseViewerSearchRequest = (
  data: unknown,
): ViewerSearchRequest | undefined =>
  isPlainRecord(data) &&
  Object.keys(data).length === 1 &&
  (data.feature === "table" || data.feature === "flow")
    ? createViewerSearchRequest(data.feature)
    : undefined;

const parseViewerCsvExportRequest = (
  data: unknown,
): ViewerCsvExportRequest | undefined =>
  isPlainRecord(data) &&
  Object.keys(data).length === 1 &&
  data.method === "copy"
    ? createViewerCsvExportRequest()
    : undefined;

const parseViewerDisplayRequest = (
  data: unknown,
): ViewerDisplayAcknowledgementRequest | undefined =>
  data === "success" || data === "failed"
    ? createViewerDisplayAcknowledgementRequest(data)
    : undefined;

const parseViewerSaveRequest = (
  data: unknown,
): ViewerSaveRequest | undefined =>
  typeof data === "string" ? { type: SAVE, data } : undefined;

type ViewerRequestDataParser = (data: unknown) => ViewerRequest | undefined;

const viewerRequestDataParsers: Readonly<
  Record<string, ViewerRequestDataParser>
> = {
  [RESOURCE]: parseViewerResourceRequest,
  [SAVE]: parseViewerSaveRequest,
  [NAVIGATE]: parseViewerNavigationRequest,
  [SEARCH]: parseViewerSearchRequest,
  [CSV_EXPORT]: parseViewerCsvExportRequest,
  [DISPLAY]: parseViewerDisplayRequest,
};

export const parseViewerRequest = (
  value: unknown,
): ViewerRequest | undefined => {
  if (!isPlainRecord(value)) return undefined;
  const isReadyRequest = value.type === READY;
  if (!hasOnlyKeys(value, isReadyRequest ? ["type"] : ["type", "data"])) {
    return undefined;
  }
  const parser =
    !isReadyRequest &&
    typeof value.type === "string" &&
    Object.prototype.hasOwnProperty.call(viewerRequestDataParsers, value.type)
      ? viewerRequestDataParsers[value.type]
      : undefined;
  return isReadyRequest ? { type: READY } : parser?.(value.data);
};

export const isInvalidViewerSaveRequest = (value: unknown): boolean =>
  isPlainRecord(value) && value.type === SAVE && typeof value.data !== "string";

export const createViewerResourceRequest = (
  scrollType: ViewerResourceRequestData["scrollType"],
): ViewerResourceRequest => ({ type: RESOURCE, data: { scrollType } });

export const createViewerReadyRequest = (): ViewerReadyRequest => ({
  type: READY,
});

export const createViewerSaveRequest = (data: string): ViewerSaveRequest => ({
  type: SAVE,
  data,
});

export const createViewerNavigationRequest = (
  targetView: NavigationTargetView,
  absolutePath: string,
): ViewerNavigationRequest => ({
  type: NAVIGATE,
  data: { targetView, absolutePath },
});

export const createViewerSearchRequest = (
  feature: ViewerSearchFeature,
): ViewerSearchRequest => ({ type: SEARCH, data: { feature } });

export const createViewerCsvExportRequest = (): ViewerCsvExportRequest => ({
  type: CSV_EXPORT,
  data: { method: "copy" },
});

export const createViewerDisplayAcknowledgementRequest = (
  result: ViewerDisplayResult,
): ViewerDisplayAcknowledgementRequest => ({ type: DISPLAY, data: result });
