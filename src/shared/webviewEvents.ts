import type { MyAppResource } from "./MyAppResource";

export const RESOURCE = "resource";
export const READY = "ready";
export const SAVE = "save";
export const CHANGE_DOCUMENT = "changeDocument";
export const OPERATION = "operation";

export type ResourceEventType = { type: typeof RESOURCE; data: MyAppResource };
export type ReadyEventType = { type: typeof READY };
export type SaveEventType = { type: typeof SAVE; data: string };
export type OperationEventType = { type: typeof OPERATION; data: string };

export type WebviewEventType =
  | ResourceEventType
  | ReadyEventType
  | SaveEventType
  | OperationEventType;
