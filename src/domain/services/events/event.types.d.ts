import { MyAppResource } from '@ui-component/editor/MyContexts';

export type EventType = ResourceEventType | ReadyEventType | SaveEventType;
export type ResourceEventType = { type: string, data: MyAppResource };
export type ReadyEventType = { type: string };
export type SaveEventType = { type: string, data: string };
