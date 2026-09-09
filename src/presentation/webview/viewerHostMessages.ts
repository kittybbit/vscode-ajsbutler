import {
  parseNavigationRequest,
  type NavigationRequestDto,
} from "../../application/navigation/resolveNavigationTarget";
import { validateFlowGraphDocument } from "../../application/flow-graph/flowGraphDocument";
import type { UnitListDocumentDto } from "../../application/unit-list/unitListDocument";

export const RESOURCE = "resource";
export const CHANGE_DOCUMENT = "changeDocument";
export const REVEAL_UNIT = "revealUnit";

export const viewerHostMessageTypes = [
  RESOURCE,
  CHANGE_DOCUMENT,
  REVEAL_UNIT,
] as const;

export type ViewerHostMessageType = (typeof viewerHostMessageTypes)[number];

export type ViewerResourceStateDto = {
  isDarkMode: boolean;
  lang: string;
  scrollType: "window" | "table";
};

export type ViewerDocumentChangedMessage = {
  type: typeof CHANGE_DOCUMENT;
  data: UnitListDocumentDto | null;
};

export type ViewerResourceStateMessage = {
  type: typeof RESOURCE;
  data: ViewerResourceStateDto;
};

export type ViewerRevealUnitMessage = {
  type: typeof REVEAL_UNIT;
  data: NavigationRequestDto;
};

export type ViewerHostMessage =
  | ViewerDocumentChangedMessage
  | ViewerResourceStateMessage
  | ViewerRevealUnitMessage;

export type ViewerHostMessageData = ViewerHostMessage["data"];

export type ViewerPostMessagePort = {
  postMessage(message: unknown): void;
};

const isPlainRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return Object.getPrototypeOf(value) === Object.prototype;
};

const hasOnlyKeys = (
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean => {
  const allowedKeys = new Set(keys);
  return Object.keys(value).every((key) => allowedKeys.has(key));
};

const isUnsupportedJsonValue = (value: unknown): boolean => {
  switch (typeof value) {
    case "undefined":
    case "function":
    case "symbol":
    case "bigint":
      return true;
    case "number":
      return !Number.isFinite(value);
    default:
      return false;
  }
};

const isJsonObject = (value: unknown): value is object => {
  if (typeof value !== "object") {
    return false;
  }
  return value !== null;
};

const hasPlainJsonPrototype = (value: object): boolean =>
  [Object.prototype, Array.prototype].includes(Object.getPrototypeOf(value));

const isPlainJsonProperty = (parent: object, key: string): boolean => {
  const value = (parent as Record<string, unknown>)[key];
  return isJsonObject(value)
    ? hasPlainJsonPrototype(value)
    : !isUnsupportedJsonValue(value);
};

const allChecksPass = (checks: readonly (() => boolean)[]): boolean =>
  checks.every((check) => check());

const isViewerResourceState = (
  value: unknown,
): value is Record<string, unknown> =>
  isPlainRecord(value) &&
  allChecksPass([
    () => hasOnlyKeys(value, ["isDarkMode", "lang", "scrollType"]),
    () => typeof value.isDarkMode === "boolean",
    () => typeof value.lang === "string",
    () => value.scrollType === "window" || value.scrollType === "table",
  ]);

const isPlainJsonValue = (root: unknown): boolean => {
  let isValid = true;
  try {
    const serialized = JSON.stringify(
      root,
      function (this: unknown, key: string, child: unknown): unknown {
        isValid = isValid && isPlainJsonProperty(this as object, key);
        return child;
      },
    );
    return isValid && serialized !== undefined;
  } catch {
    return false;
  }
};

const hasDocumentArrays = (data: Record<string, unknown>): boolean =>
  ["rootUnits", "warnings", "unitDefinitions"].every((key) =>
    Array.isArray(data[key]),
  );

const hasUnitListArrays = (unitList: Record<string, unknown>): boolean =>
  Array.isArray(unitList.rows) && Array.isArray(unitList.units);

const isViewerDocumentData = (data: unknown): data is UnitListDocumentDto => {
  if (!isPlainRecord(data)) return false;
  return hasValidViewerDocumentShape(data);
};

const hasValidViewerDocumentShape = (data: Record<string, unknown>): boolean =>
  allChecksPass([
    () =>
      hasOnlyKeys(data, [
        "rootUnits",
        "warnings",
        "unitDefinitions",
        "unitList",
        "semanticDiffOverlay",
      ]),
    () => hasDocumentArrays(data),
    () => isPlainRecord(data.unitList) && hasUnitListArrays(data.unitList),
  ]);

export const parseViewerResourceState = (
  value: unknown,
): ViewerResourceStateDto | undefined => {
  if (!isViewerResourceState(value)) return undefined;
  const resource = value as {
    isDarkMode: boolean;
    lang: string;
    scrollType: "window" | "table";
  };
  return {
    isDarkMode: resource.isDarkMode,
    lang: resource.lang,
    scrollType: resource.scrollType,
  };
};

const isValidViewerDocument = (data: unknown): data is UnitListDocumentDto =>
  isPlainJsonValue(data) &&
  isViewerDocumentData(data) &&
  validateFlowGraphDocument(data).status === "available";

const parseViewerDocumentChangedMessage = (
  data: unknown,
): ViewerDocumentChangedMessage | undefined => {
  if (data === null) return { type: CHANGE_DOCUMENT, data: null };
  if (!isValidViewerDocument(data)) return undefined;
  return { type: CHANGE_DOCUMENT, data };
};

const parseViewerRevealUnitMessage = (
  data: unknown,
): ViewerRevealUnitMessage | undefined => {
  if (!isPlainRecord(data)) return undefined;
  if (!hasOnlyKeys(data, ["absolutePath"])) return undefined;
  const result = parseNavigationRequest(data);
  return revealUnitMessage(result);
};

const revealUnitMessage = (
  result: ReturnType<typeof parseNavigationRequest>,
): ViewerRevealUnitMessage | undefined => {
  if (result.status !== "available") return undefined;
  return { type: REVEAL_UNIT, data: result.request };
};

type ViewerMessageParser = (data: unknown) => ViewerHostMessage | undefined;

const viewerMessageParsers: Partial<
  Record<ViewerHostMessageType, ViewerMessageParser>
> = {
  [RESOURCE]: (data) => {
    const resource = parseViewerResourceState(data);
    return resource ? { type: RESOURCE, data: resource } : undefined;
  },
  [CHANGE_DOCUMENT]: parseViewerDocumentChangedMessage,
  [REVEAL_UNIT]: parseViewerRevealUnitMessage,
};

const getViewerMessageParser = (
  type: unknown,
): ViewerMessageParser | undefined => {
  if (typeof type !== "string") return undefined;
  if (!Object.prototype.hasOwnProperty.call(viewerMessageParsers, type)) {
    return undefined;
  }
  return viewerMessageParsers[type as ViewerHostMessageType];
};

export const parseViewerHostMessage = (
  value: unknown,
): ViewerHostMessage | undefined => {
  if (!isPlainRecord(value)) {
    return undefined;
  }
  if (!hasOnlyKeys(value, ["type", "data"])) {
    return undefined;
  }
  const parser = getViewerMessageParser(value.type);
  return parser?.(value.data);
};

export const createViewerDocumentChangedMessage = (
  data: UnitListDocumentDto | undefined,
): ViewerDocumentChangedMessage => ({
  type: CHANGE_DOCUMENT,
  data: data ?? null,
});

export const createViewerResourceStateMessage = (
  data: ViewerResourceStateDto,
): ViewerResourceStateMessage => ({
  type: RESOURCE,
  data,
});

export const createViewerRevealUnitMessage = (
  absolutePath: string,
): ViewerRevealUnitMessage => ({
  type: REVEAL_UNIT,
  data: { absolutePath },
});
