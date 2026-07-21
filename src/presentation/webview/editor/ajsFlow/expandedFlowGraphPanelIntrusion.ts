import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import { FlowGraphPosition } from "./flowGraphPosition";
import {
  ExpandedFlowGraphBuildContext,
  FlowGraphBounds,
} from "./expandedFlowGraphTypes";
import { doBoundsOverlapHorizontally } from "./expandedFlowGraphGeometry";
import {
  addOffset,
  getDisplayPosition,
} from "./expandedFlowGraphPositionState";

type ExpandedPanelLayoutItem = {
  unit: FlowGraphUnitDto;
  position: FlowGraphPosition;
  panelBounds: FlowGraphBounds;
};

type ExpandedPanelIntrusionTarget = {
  upper: ExpandedPanelLayoutItem;
  lower: ExpandedPanelLayoutItem;
};

type ExpandedPanelIntrusionDeps = {
  buildExpandedUnitPanelBounds: (
    context: ExpandedFlowGraphBuildContext,
    expandedUnit: FlowGraphUnitDto,
  ) => FlowGraphBounds | undefined;
};

type ExpandedPanelIntrusionScan = {
  context: ExpandedFlowGraphBuildContext;
  upper: ExpandedPanelLayoutItem;
  deps: ExpandedPanelIntrusionDeps;
};

type UpperExpandedPanelIntrusionRequest = {
  context: ExpandedFlowGraphBuildContext;
  upperChild: FlowGraphUnitDto;
  expandedChildren: ReadonlyArray<FlowGraphUnitDto>;
  deps: ExpandedPanelIntrusionDeps;
};

const buildExpandedPanelLayoutItem = (
  context: ExpandedFlowGraphBuildContext,
  unit: FlowGraphUnitDto,
  deps: ExpandedPanelIntrusionDeps,
): ExpandedPanelLayoutItem | undefined => {
  const position = getDisplayPosition(context, unit.id);
  const panelBounds = deps.buildExpandedUnitPanelBounds(context, unit);
  return position && panelBounds ? { unit, position, panelBounds } : undefined;
};

const isPanelPositionedAbove = (
  upper: ExpandedPanelLayoutItem,
  lower: ExpandedPanelLayoutItem,
): boolean => upper.position.y < lower.position.y;

const doesUpperPanelIntrudeVertically = (
  upper: ExpandedPanelLayoutItem,
  lower: ExpandedPanelLayoutItem,
): boolean => upper.panelBounds.maxY > lower.panelBounds.minY;

const doExpandedPanelsOverlapHorizontally = (
  upper: ExpandedPanelLayoutItem,
  lower: ExpandedPanelLayoutItem,
): boolean => doBoundsOverlapHorizontally(upper.panelBounds, lower.panelBounds);

const doesUpperPanelIntrudeIntoLowerPanel = (
  target: ExpandedPanelIntrusionTarget,
): boolean =>
  isPanelPositionedAbove(target.upper, target.lower) &&
  doesUpperPanelIntrudeVertically(target.upper, target.lower) &&
  doExpandedPanelsOverlapHorizontally(target.upper, target.lower);

const getLowerPanelVerticalIntrusion = (
  target: ExpandedPanelIntrusionTarget,
): number => target.upper.panelBounds.maxY - target.lower.panelBounds.minY;

const getLowerPanelIntrusionOffset = (
  target: ExpandedPanelIntrusionTarget,
): FlowGraphPosition | undefined => {
  if (!doesUpperPanelIntrudeIntoLowerPanel(target)) {
    return undefined;
  }

  return {
    x: 0,
    y: getLowerPanelVerticalIntrusion(target),
  };
};

const moveLowerExpandedPanelPastUpper = (
  context: ExpandedFlowGraphBuildContext,
  target: ExpandedPanelIntrusionTarget,
): void => {
  const offset = getLowerPanelIntrusionOffset(target);
  if (offset) {
    addOffset(context, target.lower.unit.id, offset);
  }
};

const buildExpandedPanelIntrusionTarget = (
  scan: ExpandedPanelIntrusionScan,
  lower: FlowGraphUnitDto,
): ExpandedPanelIntrusionTarget | undefined => {
  const lowerItem = buildExpandedPanelLayoutItem(
    scan.context,
    lower,
    scan.deps,
  );
  return lowerItem ? { upper: scan.upper, lower: lowerItem } : undefined;
};

const isDifferentExpandedPanelUnit = (
  upper: ExpandedPanelLayoutItem,
  lower: FlowGraphUnitDto,
): boolean => lower.id !== upper.unit.id;

const collectExpandedPanelIntrusionTarget = (
  scan: ExpandedPanelIntrusionScan,
  lower: FlowGraphUnitDto,
): ExpandedPanelIntrusionTarget[] => {
  const target = buildExpandedPanelIntrusionTarget(scan, lower);
  return target ? [target] : [];
};

const getLowerExpandedPanelCandidates = (
  scan: ExpandedPanelIntrusionScan,
  expandedChildren: ReadonlyArray<FlowGraphUnitDto>,
): ExpandedPanelIntrusionTarget[] =>
  expandedChildren
    .filter((unit) => isDifferentExpandedPanelUnit(scan.upper, unit))
    .flatMap((unit) => collectExpandedPanelIntrusionTarget(scan, unit));

const buildExpandedPanelIntrusionScan = ({
  context,
  upperChild,
  deps,
}: UpperExpandedPanelIntrusionRequest):
  | ExpandedPanelIntrusionScan
  | undefined => {
  const upper = buildExpandedPanelLayoutItem(context, upperChild, deps);
  return upper ? { context, upper, deps } : undefined;
};

const resolveUpperExpandedPanelIntrusions = (
  request: UpperExpandedPanelIntrusionRequest,
): void => {
  const scan = buildExpandedPanelIntrusionScan(request);
  if (!scan) {
    return;
  }

  getLowerExpandedPanelCandidates(scan, request.expandedChildren).forEach(
    (target) => moveLowerExpandedPanelPastUpper(request.context, target),
  );
};

export const resolveExpandedScopePanelIntrusions = (
  context: ExpandedFlowGraphBuildContext,
  expandedChildren: ReadonlyArray<FlowGraphUnitDto>,
  deps: ExpandedPanelIntrusionDeps,
): void => {
  for (const upperChild of expandedChildren) {
    resolveUpperExpandedPanelIntrusions({
      context,
      upperChild,
      expandedChildren,
      deps,
    });
  }
};
