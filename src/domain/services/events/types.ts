import { MyAppResource } from "@ui-component/editor/MyContexts";
import { OPERATION, READY, RESOURCE, SAVE } from "./constant";

export type EventType =
  | ResourceEventType
  | ReadyEventType
  | SaveEventType
  | OperationEventType;
export type ResourceEventType = { type: typeof RESOURCE; data: MyAppResource };
export type ReadyEventType = { type: typeof READY };
export type SaveEventType = { type: typeof SAVE; data: string };
export type OperationEventType = { type: typeof OPERATION; data: string };
