import { MyAppResource } from "@ui-component/editor/MyContexts";
import { READY, RESOURCE, SAVE } from "./constant";

export type EventType = ResourceEventType | ReadyEventType | SaveEventType;
export type ResourceEventType = { type: typeof RESOURCE; data: MyAppResource };
export type ReadyEventType = { type: typeof READY };
export type SaveEventType = { type: typeof SAVE; data: string };
