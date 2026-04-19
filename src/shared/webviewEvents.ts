import type { MyAppResource } from "./MyAppResource";

export const RESOURCE = "resource";
export const READY = "ready";
export const SAVE = "save";
export const CHANGE_DOCUMENT = "changeDocument";
export const OPERATION = "operation";
export const NAVIGATE = "navigate";
export const REVEAL_UNIT = "revealUnit";

export type NavigationTargetView = "flow" | "table";
export type NavigationEventData = {
  targetView: NavigationTargetView;
  absolutePath: string;
};
export type RevealUnitEventData = {
  absolutePath: string;
};

export type ResourceEventType = { type: typeof RESOURCE; data: MyAppResource };
export type ReadyEventType = { type: typeof READY };
export type SaveEventType = { type: typeof SAVE; data: string };
export type OperationEventType = { type: typeof OPERATION; data: string };
export type NavigationEventType = {
  type: typeof NAVIGATE;
  data: NavigationEventData;
};
export type RevealUnitEventType = {
  type: typeof REVEAL_UNIT;
  data: RevealUnitEventData;
};

export const createNavigationEvent = (
  targetView: NavigationTargetView,
  absolutePath: string,
): NavigationEventType => ({
  type: NAVIGATE,
  data: { targetView, absolutePath },
});

export const createRevealUnitEvent = (
  absolutePath: string,
): RevealUnitEventType => ({
  type: REVEAL_UNIT,
  data: { absolutePath },
});

export type WebviewEventType =
  | ResourceEventType
  | ReadyEventType
  | SaveEventType
  | OperationEventType
  | NavigationEventType;
