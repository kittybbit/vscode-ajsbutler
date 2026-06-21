export const shouldRenderNodeComment = (
  label?: string,
  comment?: string,
): boolean => !!comment && comment !== label;

export type FlowNodeStatus = "schedule" | "waitedFor";
export type FlowNodeKind = "job" | "jobnet" | "jobgroup" | "condition";
export type FlowNodeHeaderTone = "neutral" | "primary" | "warning" | "info";

const headerToneByKind: Record<FlowNodeKind, FlowNodeHeaderTone> = {
  job: "neutral",
  jobnet: "primary",
  jobgroup: "warning",
  condition: "info",
};

export const resolveFlowNodeHeaderTone = (
  kind: FlowNodeKind,
): FlowNodeHeaderTone => headerToneByKind[kind];

export const resolveFlowNodeStatuses = (state: {
  hasSchedule: boolean;
  hasWaitedFor: boolean;
}): FlowNodeStatus[] => [
  ...(state.hasSchedule ? (["schedule"] as const) : []),
  ...(state.hasWaitedFor ? (["waitedFor"] as const) : []),
];
