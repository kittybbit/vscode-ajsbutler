import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import type { ExpandedUnitPlacementConstraintDto } from "../../../../application/flow-graph/buildExpandedFlowGraph";
import { FlowGraphPosition } from "./flowGraphPosition";
import {
  ExpandedFlowGraphBuildContext,
  FlowGraphBounds,
} from "./expandedFlowGraphTypes";
import { buildUnitBaseBounds } from "./expandedFlowGraphGeometry";
import {
  addOffset,
  getDisplayPosition,
  getOffset,
  hasOffset,
} from "./expandedFlowGraphPositionState";

type GrowthOffsetTarget = {
  context: ExpandedFlowGraphBuildContext;
  unitId: string;
  horizontalGrowth: number;
  verticalGrowth: number;
  horizontalAffected: boolean;
  verticalAffected: boolean;
};

type UnitGrowthOffset = {
  unitId: string;
  offset: FlowGraphPosition;
};

type GrowthOffsetBatch = {
  context: ExpandedFlowGraphBuildContext;
  horizontalGrowth: number;
  verticalGrowth: number;
  horizontalTargetUnitIds: ReadonlySet<string>;
  verticalTargetUnitIds: ReadonlySet<string>;
};

type GrowthOffsetApplication = {
  horizontalGrowth: number;
  verticalGrowth: number;
  horizontalTargetUnitIds: ReadonlySet<string>;
  verticalTargetUnitIds: ReadonlySet<string>;
};

type UpperExpandedPanelMaxRightTarget = {
  context: ExpandedFlowGraphBuildContext;
  expandedChildren: ReadonlyArray<FlowGraphUnitDto>;
  expandedChild: FlowGraphUnitDto;
  expandedChildPosition: FlowGraphPosition;
};

type UpperExpandedPanelCandidateBounds = {
  position: FlowGraphPosition;
  bounds: FlowGraphBounds;
};

type ExpandedChildGrowthBounds = {
  position: FlowGraphPosition;
  panelBounds: FlowGraphBounds;
};

type ExpandedChildGrowthMeasurement = {
  panelBounds: FlowGraphBounds;
  baseBounds: FlowGraphBounds;
  upperPanelMaxRight?: number;
};

type ExpandedChildGrowthMeasurementContext = {
  context: ExpandedFlowGraphBuildContext;
  expandedChildren: ReadonlyArray<FlowGraphUnitDto>;
  expandedChild: FlowGraphUnitDto;
};

type ExpandedChildGrowthApplicationContext =
  ExpandedChildGrowthMeasurementContext & {
    horizontalAffectedSiblingUnitIds: readonly string[];
    verticalAffectedSiblingUnitIds: readonly string[];
  };

export type ExpandedChildGrowthOffsetDeps = {
  buildExpandedUnitPanelBounds: (
    context: ExpandedFlowGraphBuildContext,
    expandedUnit: FlowGraphUnitDto,
  ) => FlowGraphBounds | undefined;
};

type ExpandedChildrenGrowthOffsetsTarget = {
  context: ExpandedFlowGraphBuildContext;
  expandedChildren: ReadonlyArray<FlowGraphUnitDto>;
  expandedUnitConstraints: ReadonlyArray<ExpandedUnitPlacementConstraintDto>;
  deps: ExpandedChildGrowthOffsetDeps;
};

const getHorizontalGrowthOffset = (target: GrowthOffsetTarget): number => {
  return target.horizontalAffected ? target.horizontalGrowth : 0;
};

const getVerticalGrowthOffset = (target: GrowthOffsetTarget): number => {
  return target.verticalAffected
    ? Math.max(
        0,
        target.verticalGrowth - getOffset(target.context, target.unitId).y,
      )
    : 0;
};

const getGrowthOffset = (target: GrowthOffsetTarget): FlowGraphPosition => ({
  x: getHorizontalGrowthOffset(target),
  y: getVerticalGrowthOffset(target),
});

const getTargetGrowthOffset = (
  target: GrowthOffsetTarget,
): UnitGrowthOffset | undefined => {
  const offset = getGrowthOffset(target);
  return hasOffset(offset) ? { unitId: target.unitId, offset } : undefined;
};

const getTargetGrowthOffsets = ({
  context,
  horizontalGrowth,
  verticalGrowth,
  horizontalTargetUnitIds,
  verticalTargetUnitIds,
}: GrowthOffsetBatch): UnitGrowthOffset[] =>
  [...new Set([...horizontalTargetUnitIds, ...verticalTargetUnitIds])]
    .map((unitId) =>
      getTargetGrowthOffset({
        context,
        unitId,
        horizontalGrowth,
        verticalGrowth,
        horizontalAffected: horizontalTargetUnitIds.has(unitId),
        verticalAffected: verticalTargetUnitIds.has(unitId),
      }),
    )
    .filter((growthOffset): growthOffset is UnitGrowthOffset => !!growthOffset);

const applyUnitGrowthOffsets = (
  context: ExpandedFlowGraphBuildContext,
  growthOffsets: ReadonlyArray<UnitGrowthOffset>,
): boolean =>
  growthOffsets.reduce(
    (changed, { unitId, offset }) =>
      addOffset(context, unitId, offset) || changed,
    false,
  );

const applyGrowthOffsets = (
  context: ExpandedFlowGraphBuildContext,
  growthOffsetApplication: GrowthOffsetApplication,
) => {
  const {
    horizontalGrowth,
    verticalGrowth,
    horizontalTargetUnitIds,
    verticalTargetUnitIds,
  } = growthOffsetApplication;
  if (horizontalGrowth === 0 && verticalGrowth === 0) {
    return false;
  }

  return applyUnitGrowthOffsets(
    context,
    getTargetGrowthOffsets({
      context,
      horizontalGrowth,
      verticalGrowth,
      horizontalTargetUnitIds,
      verticalTargetUnitIds,
    }),
  );
};

const getUpperExpandedPanelCandidateBounds = (
  context: ExpandedFlowGraphBuildContext,
  deps: ExpandedChildGrowthOffsetDeps,
  upperCandidate: FlowGraphUnitDto,
): UpperExpandedPanelCandidateBounds | undefined => {
  const position = getDisplayPosition(context, upperCandidate.id);
  const bounds = deps.buildExpandedUnitPanelBounds(context, upperCandidate);
  if (!position || !bounds) {
    return undefined;
  }
  return { position, bounds };
};

const isUpperExpandedPanelCandidate = (
  candidate: UpperExpandedPanelCandidateBounds,
  expandedChildPosition: FlowGraphPosition,
) => candidate.position.y < expandedChildPosition.y;

const includeUpperPanelMaxRight = (
  maxRight: number | undefined,
  candidate: UpperExpandedPanelCandidateBounds,
) =>
  maxRight === undefined
    ? candidate.bounds.maxX
    : Math.max(maxRight, candidate.bounds.maxX);

const hasUpperExpandedPanelCandidateBounds = (
  candidate: UpperExpandedPanelCandidateBounds | undefined,
): candidate is UpperExpandedPanelCandidateBounds => !!candidate;

const getUpperExpandedPanelMaxRight = (
  {
    context,
    expandedChildren,
    expandedChild,
    expandedChildPosition,
  }: UpperExpandedPanelMaxRightTarget,
  deps: ExpandedChildGrowthOffsetDeps,
): number | undefined =>
  expandedChildren
    .filter((upperCandidate) => upperCandidate.id !== expandedChild.id)
    .map((upperCandidate) =>
      getUpperExpandedPanelCandidateBounds(context, deps, upperCandidate),
    )
    .filter(hasUpperExpandedPanelCandidateBounds)
    .filter((candidateBounds) =>
      isUpperExpandedPanelCandidate(candidateBounds, expandedChildPosition),
    )
    .reduce(includeUpperPanelMaxRight, undefined as number | undefined);

const getExpandedChildGrowthBounds = (
  context: ExpandedFlowGraphBuildContext,
  deps: ExpandedChildGrowthOffsetDeps,
  expandedChild: FlowGraphUnitDto,
): ExpandedChildGrowthBounds | undefined => {
  const position = getDisplayPosition(context, expandedChild.id);
  const panelBounds = deps.buildExpandedUnitPanelBounds(context, expandedChild);
  if (!position || !panelBounds) {
    return undefined;
  }
  return { position, panelBounds };
};

const calculateHorizontalGrowth = (
  panelBounds: FlowGraphBounds,
  baseBounds: FlowGraphBounds,
  upperPanelMaxRight: number | undefined,
): number =>
  Math.max(0, panelBounds.maxX - (upperPanelMaxRight ?? baseBounds.maxX));

const calculateVerticalGrowth = (
  panelBounds: FlowGraphBounds,
  baseBounds: FlowGraphBounds,
): number => Math.max(0, panelBounds.maxY - baseBounds.maxY);

const getExpandedChildGrowthMeasurement = (
  {
    context,
    expandedChildren,
    expandedChild,
  }: ExpandedChildGrowthMeasurementContext,
  deps: ExpandedChildGrowthOffsetDeps,
): ExpandedChildGrowthMeasurement | undefined => {
  const growthBounds = getExpandedChildGrowthBounds(
    context,
    deps,
    expandedChild,
  );
  if (!growthBounds) {
    return undefined;
  }

  return {
    panelBounds: growthBounds.panelBounds,
    baseBounds: buildUnitBaseBounds(growthBounds.position, context.metrics),
    upperPanelMaxRight: getUpperExpandedPanelMaxRight(
      {
        context,
        expandedChildren,
        expandedChild,
        expandedChildPosition: growthBounds.position,
      },
      deps,
    ),
  };
};

const buildGrowthOffsetApplication = (
  measurement: ExpandedChildGrowthMeasurement,
  horizontalTargetUnitIds: ReadonlySet<string>,
  verticalTargetUnitIds: ReadonlySet<string>,
): GrowthOffsetApplication => {
  const { panelBounds, baseBounds, upperPanelMaxRight } = measurement;
  return {
    horizontalGrowth: calculateHorizontalGrowth(
      panelBounds,
      baseBounds,
      upperPanelMaxRight,
    ),
    verticalGrowth: calculateVerticalGrowth(panelBounds, baseBounds),
    horizontalTargetUnitIds,
    verticalTargetUnitIds,
  };
};

const getExpandedChildGrowthOffsetApplication = (
  growthContext: ExpandedChildGrowthApplicationContext,
  deps: ExpandedChildGrowthOffsetDeps,
): GrowthOffsetApplication | undefined => {
  const measurement = getExpandedChildGrowthMeasurement(growthContext, deps);
  if (!measurement) {
    return undefined;
  }

  return buildGrowthOffsetApplication(
    measurement,
    new Set(growthContext.horizontalAffectedSiblingUnitIds),
    new Set(growthContext.verticalAffectedSiblingUnitIds),
  );
};

const applyExpandedChildGrowthOffsets = (
  growthContext: ExpandedChildGrowthApplicationContext,
  deps: ExpandedChildGrowthOffsetDeps,
) => {
  const growthOffsetApplication = getExpandedChildGrowthOffsetApplication(
    growthContext,
    deps,
  );
  if (growthOffsetApplication) {
    applyGrowthOffsets(growthContext.context, growthOffsetApplication);
  }
};

export const applyExpandedChildrenGrowthOffsets = ({
  context,
  expandedChildren,
  expandedUnitConstraints,
  deps,
}: ExpandedChildrenGrowthOffsetsTarget) => {
  const constraintByUnitId = new Map(
    expandedUnitConstraints.map((constraint) => [
      constraint.unitId,
      constraint,
    ]),
  );

  for (const expandedChild of expandedChildren) {
    const constraint = constraintByUnitId.get(expandedChild.id);
    if (!constraint) continue;
    applyExpandedChildGrowthOffsets(
      {
        context,
        expandedChildren,
        expandedChild,
        horizontalAffectedSiblingUnitIds:
          constraint.horizontalAffectedSiblingUnitIds,
        verticalAffectedSiblingUnitIds:
          constraint.verticalAffectedSiblingUnitIds,
      },
      deps,
    );
  }
};
