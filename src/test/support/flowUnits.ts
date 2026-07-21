import type { FlowGraphUnitDto } from "../../application/flow-graph/flowGraphDocument";

export const createFlowTestUnit = (
  overrides: Partial<FlowGraphUnitDto> = {},
): FlowGraphUnitDto => ({
  id: overrides.id ?? "/root/jobnet",
  name: overrides.name ?? "jobnet",
  unitAttribute: overrides.unitAttribute ?? "",
  unitType: overrides.unitType ?? "n",
  groupType: overrides.groupType,
  absolutePath: overrides.absolutePath ?? "/root/jobnet",
  depth: overrides.depth ?? 1,
  parentId: overrides.parentId,
  isRoot: overrides.isRoot ?? false,
  isRootJobnet: overrides.isRootJobnet ?? true,
  hasSchedule: overrides.hasSchedule ?? false,
  hasWaitedFor: overrides.hasWaitedFor ?? false,
  layout: overrides.layout ?? { h: 0, v: 0 },
  parameters: overrides.parameters ?? [],
  relations: overrides.relations ?? [],
  children: overrides.children ?? [],
});
