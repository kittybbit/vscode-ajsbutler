import {
  parseNavigationRequest,
  type NavigationRequestDto,
} from "../../application/navigation/resolveNavigationTarget";
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
  os: string;
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

export const parseViewerResourceState = (
  value: unknown,
): ViewerResourceStateDto | undefined => {
  if (
    !isPlainRecord(value) ||
    typeof value.isDarkMode !== "boolean" ||
    typeof value.lang !== "string" ||
    typeof value.os !== "string" ||
    (value.scrollType !== "window" && value.scrollType !== "table")
  ) {
    return undefined;
  }
  return {
    isDarkMode: value.isDarkMode,
    lang: value.lang,
    os: value.os,
    scrollType: value.scrollType,
  };
};

const parseViewerDocumentChangedMessage = (
  data: unknown,
): ViewerDocumentChangedMessage | undefined => {
  if (data === null) {
    return { type: CHANGE_DOCUMENT, data: null };
  }
  if (
    !isPlainRecord(data) ||
    !Array.isArray(data.rootUnits) ||
    !Array.isArray(data.warnings) ||
    !Array.isArray(data.unitDefinitions) ||
    !isPlainRecord(data.unitList) ||
    !Array.isArray(data.unitList.rows) ||
    !Array.isArray(data.unitList.units)
  ) {
    return undefined;
  }
  return {
    type: CHANGE_DOCUMENT,
    data: data as UnitListDocumentDto,
  };
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
  if (value.type === RESOURCE) {
    const data = parseViewerResourceState(value.data);
    return data ? { type: RESOURCE, data } : undefined;
  }
  if (value.type === CHANGE_DOCUMENT) {
    return parseViewerDocumentChangedMessage(value.data);
  }
  if (value.type === REVEAL_UNIT) {
    return parseViewerRevealUnitMessage(value.data);
  }
  return undefined;
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
