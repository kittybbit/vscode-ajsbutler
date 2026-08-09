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

const isViewerDocumentData = (data: unknown): data is UnitListDocumentDto => {
  if (
    !isPlainRecord(data) ||
    !hasOnlyKeys(data, ["rootUnits", "warnings", "unitDefinitions", "unitList"])
  ) {
    return false;
  }
  const unitList = data.unitList;
  if (!isPlainRecord(unitList)) {
    return false;
  }
  let isValid = ["rootUnits", "warnings", "unitDefinitions"].every((key) =>
    Array.isArray(data[key]),
  );
  if (isValid) {
    isValid = Array.isArray(unitList.rows);
  }
  if (isValid) {
    isValid = Array.isArray(unitList.units);
  }
  return isValid;
};

export const parseViewerResourceState = (
  value: unknown,
): ViewerResourceStateDto | undefined => {
  if (
    !isPlainRecord(value) ||
    !hasOnlyKeys(value, ["isDarkMode", "lang", "scrollType"]) ||
    typeof value.isDarkMode !== "boolean" ||
    typeof value.lang !== "string" ||
    (value.scrollType !== "window" && value.scrollType !== "table")
  ) {
    return undefined;
  }
  return {
    isDarkMode: value.isDarkMode,
    lang: value.lang,
    scrollType: value.scrollType,
  };
};

const parseViewerDocumentChangedMessage = (
  data: unknown,
): ViewerDocumentChangedMessage | undefined => {
  if (data === null) {
    return { type: CHANGE_DOCUMENT, data: null };
  }
  if (!isPlainJsonValue(data) || !isViewerDocumentData(data)) {
    return undefined;
  }
  return validateFlowGraphDocument(data).status === "available"
    ? { type: CHANGE_DOCUMENT, data }
    : undefined;
};

const parseViewerRevealUnitMessage = (
  data: unknown,
): ViewerRevealUnitMessage | undefined => {
  const result = parseNavigationRequest(data);
  return result.status === "available"
    ? { type: REVEAL_UNIT, data: result.request }
    : undefined;
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
  let result: ViewerHostMessage | undefined;
  switch (value.type) {
    case RESOURCE: {
      const data = parseViewerResourceState(value.data);
      result = data ? { type: RESOURCE, data } : undefined;
      break;
    }
    case CHANGE_DOCUMENT:
      result = parseViewerDocumentChangedMessage(value.data);
      break;
    case REVEAL_UNIT:
      result = parseViewerRevealUnitMessage(value.data);
      break;
  }
  return result;
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
