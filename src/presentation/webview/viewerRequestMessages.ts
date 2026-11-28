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
export const FLOW_PNG_SAVE = "flow_png_save";
export const FLOW_PNG_MIME_TYPE = "image/png";
export const FLOW_PNG_MAX_DIMENSION = 8192;
export const FLOW_PNG_MAX_PIXELS = 16_777_216;
export const FLOW_PNG_MAX_BYTES = 32 * 1024 * 1024;

export const viewerRequestTypes = [
  RESOURCE,
  READY,
  SAVE,
  NAVIGATE,
  SEARCH,
  CSV_EXPORT,
  DISPLAY,
  FLOW_PNG_SAVE,
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
export type ViewerFlowPngSaveRequest = {
  type: typeof FLOW_PNG_SAVE;
  data: { bytes: ArrayBuffer };
};
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
  | ViewerFlowPngSaveRequest
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

const getArrayBufferView = (value: unknown): ArrayBufferView | undefined =>
  ArrayBuffer.isView(value) ? value : undefined;

const getByteView = (value: unknown): Uint8Array | undefined => {
  const view = getArrayBufferView(value);
  const buffer = value instanceof ArrayBuffer ? value : view?.buffer;
  return buffer instanceof ArrayBuffer
    ? new Uint8Array(
        buffer,
        view?.byteOffset ?? 0,
        view?.byteLength ?? buffer.byteLength,
      )
    : undefined;
};

const isValidPngBitDepth = (colorType: number, bitDepth: number): boolean => {
  const validDepths: Readonly<Record<number, readonly number[]>> = {
    0: [1, 2, 4, 8, 16],
    2: [8, 16],
    3: [1, 2, 4, 8],
    4: [8, 16],
    6: [8, 16],
  };
  return validDepths[colorType]?.includes(bitDepth) ?? false;
};

const hasOnlyPngSaveBytes = (data: unknown): data is Record<string, unknown> =>
  isPlainRecord(data) &&
  Object.keys(data).length === 1 &&
  Object.prototype.hasOwnProperty.call(data, "bytes");

const getPngSaveByteViewFromRequest = (
  data: unknown,
): Uint8Array | undefined => {
  if (!hasOnlyPngSaveBytes(data)) return undefined;
  return getByteView(data.bytes);
};

const hasValidPngLength = (bytes: Uint8Array): boolean =>
  bytes.byteLength >= 33 && bytes.byteLength <= FLOW_PNG_MAX_BYTES;

const hasPngSignature = (view: DataView): boolean => {
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  return signature.every((value, index) => view.getUint8(index) === value);
};

const hasPngHeader = (view: DataView): boolean =>
  hasPngSignature(view) &&
  view.getUint32(8) === 13 &&
  view.getUint32(12) === 0x49484452;

const hasValidPngDimensions = (view: DataView): boolean => {
  const width = view.getUint32(16);
  const height = view.getUint32(20);
  const positiveDimensions = width >= 1 && height >= 1;
  const withinSideLimits =
    width <= FLOW_PNG_MAX_DIMENSION && height <= FLOW_PNG_MAX_DIMENSION;
  const withinAreaLimit = width * height <= FLOW_PNG_MAX_PIXELS;
  const validHeaderFields =
    isValidPngBitDepth(view.getUint8(25), view.getUint8(24)) &&
    view.getUint8(26) === 0 &&
    view.getUint8(27) === 0 &&
    view.getUint8(28) <= 1;
  return (
    positiveDimensions &&
    withinSideLimits &&
    withinAreaLimit &&
    validHeaderFields
  );
};

const hasValidPngSaveContents = (bytes: Uint8Array): boolean => {
  if (!hasValidPngLength(bytes)) return false;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return hasPngHeader(view) && hasValidPngDimensions(view);
};

const hasValidPngSaveRequestData = (data: unknown): boolean => {
  const bytes = getPngSaveByteViewFromRequest(data);
  return bytes !== undefined && hasValidPngSaveContents(bytes);
};

const getPngSaveBackingBuffer = (bytes: Uint8Array): ArrayBuffer | undefined =>
  bytes.buffer instanceof ArrayBuffer ? bytes.buffer : undefined;

const isEntirePngSaveBuffer = (
  bytes: Uint8Array,
  buffer: ArrayBuffer,
): boolean => bytes.byteOffset === 0 && bytes.byteLength === buffer.byteLength;

const copyPngSaveByteRange = (bytes: Uint8Array): ArrayBuffer | undefined => {
  const buffer = getPngSaveBackingBuffer(bytes);
  if (!buffer) return undefined;
  return isEntirePngSaveBuffer(bytes, buffer)
    ? buffer
    : buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
};

const getValidatedPngSaveBytes = (data: unknown): ArrayBuffer | undefined => {
  const bytes = getPngSaveByteViewFromRequest(data);
  return bytes && hasValidPngSaveContents(bytes)
    ? copyPngSaveByteRange(bytes)
    : undefined;
};

export const parseViewerFlowPngSaveRequest = (
  data: unknown,
): ViewerFlowPngSaveRequest | undefined => {
  const bytes = getValidatedPngSaveBytes(data);
  return bytes ? { type: FLOW_PNG_SAVE, data: { bytes } } : undefined;
};

type ViewerRequestDataParser = (data: unknown) => ViewerRequest | undefined;

const viewerRequestDataParsers: Readonly<
  Record<string, ViewerRequestDataParser>
> = {
  [RESOURCE]: parseViewerResourceRequest,
  [SAVE]: parseViewerSaveRequest,
  [FLOW_PNG_SAVE]: parseViewerFlowPngSaveRequest,
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

export const isInvalidViewerFlowPngSaveRequest = (value: unknown): boolean =>
  isPlainRecord(value) &&
  value.type === FLOW_PNG_SAVE &&
  !hasValidPngSaveRequestData(value.data);

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

export const createViewerFlowPngSaveRequest = (
  bytes: ArrayBuffer,
): ViewerFlowPngSaveRequest => ({
  type: FLOW_PNG_SAVE,
  data: { bytes },
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
