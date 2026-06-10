import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";
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
  unit: AjsUnit;
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
    expandedUnit: AjsUnit,
  ) => FlowGraphBounds | undefined;
};

const buildExpandedPanelLayoutItem = (
  context: ExpandedFlowGraphBuildContext,
  unit: AjsUnit,
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
  context: ExpandedFlowGraphBuildContext,
  upper: ExpandedPanelLayoutItem,
  lower: AjsUnit,
  deps: ExpandedPanelIntrusionDeps,
): ExpandedPanelIntrusionTarget | undefined => {
  const lowerItem = buildExpandedPanelLayoutItem(context, lower, deps);
  return lowerItem ? { upper, lower: lowerItem } : undefined;
};

const isDifferentExpandedPanelUnit = (
  upper: ExpandedPanelLayoutItem,
  lower: AjsUnit,
): boolean => lower.id !== upper.unit.id;

const collectExpandedPanelIntrusionTarget = (
  context: ExpandedFlowGraphBuildContext,
  upper: ExpandedPanelLayoutItem,
  lower: AjsUnit,
  deps: ExpandedPanelIntrusionDeps,
): ExpandedPanelIntrusionTarget[] => {
  const target = buildExpandedPanelIntrusionTarget(context, upper, lower, deps);
  return target ? [target] : [];
};

const getLowerExpandedPanelCandidates = (
  context: ExpandedFlowGraphBuildContext,
  upper: ExpandedPanelLayoutItem,
  expandedChildren: ReadonlyArray<AjsUnit>,
  deps: ExpandedPanelIntrusionDeps,
): ExpandedPanelIntrusionTarget[] =>
  expandedChildren
    .filter((unit) => isDifferentExpandedPanelUnit(upper, unit))
    .flatMap((unit) =>
      collectExpandedPanelIntrusionTarget(context, upper, unit, deps),
    );

const resolveUpperExpandedPanelIntrusions = (
  context: ExpandedFlowGraphBuildContext,
  upperChild: AjsUnit,
  expandedChildren: ReadonlyArray<AjsUnit>,
  deps: ExpandedPanelIntrusionDeps,
): void => {
  const upper = buildExpandedPanelLayoutItem(context, upperChild, deps);
  if (!upper) {
    return;
  }

  getLowerExpandedPanelCandidates(
    context,
    upper,
    expandedChildren,
    deps,
  ).forEach((target) => moveLowerExpandedPanelPastUpper(context, target));
};

export const resolveExpandedScopePanelIntrusions = (
  context: ExpandedFlowGraphBuildContext,
  expandedChildren: ReadonlyArray<AjsUnit>,
  deps: ExpandedPanelIntrusionDeps,
): void => {
  for (const upperChild of expandedChildren) {
    resolveUpperExpandedPanelIntrusions(
      context,
      upperChild,
      expandedChildren,
      deps,
    );
  }
};
