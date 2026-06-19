import { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import { FlowGraphPosition } from "./flowGraphPosition";
import {
  ExpandedFlowGraphBuildContext,
  FlowGraphBounds,
} from "./expandedFlowGraphTypes";
import { buildUnitBaseBounds } from "./expandedFlowGraphGeometry";
import {
  addOffset,
  getDisplayPosition,
  getDisplayPositions,
  getOffset,
  hasOffset,
} from "./expandedFlowGraphPositionState";

type GrowthOffsetTarget = {
  context: ExpandedFlowGraphBuildContext;
  unitId: string;
  displayPosition: FlowGraphPosition;
  expandedUnitPosition: FlowGraphPosition;
  horizontalGrowth: number;
  verticalGrowth: number;
};

type UnitGrowthOffset = {
  unitId: string;
  offset: FlowGraphPosition;
};

type GrowthOffsetBatch = {
  context: ExpandedFlowGraphBuildContext;
  positionsBeforeOffset: ReadonlyMap<string, FlowGraphPosition>;
  expandedUnitPosition: FlowGraphPosition;
  horizontalGrowth: number;
  verticalGrowth: number;
  targetUnitIds: ReadonlySet<string>;
};

type GrowthOffsetApplication = {
  expandedUnitPosition: FlowGraphPosition;
  horizontalGrowth: number;
  verticalGrowth: number;
  targetUnitIds: ReadonlySet<string>;
};

type UpperExpandedPanelMaxRightTarget = {
  context: ExpandedFlowGraphBuildContext;
  expandedChildren: ReadonlyArray<AjsUnit>;
  expandedChild: AjsUnit;
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
  expandedUnitPosition: FlowGraphPosition;
  panelBounds: FlowGraphBounds;
  baseBounds: FlowGraphBounds;
  upperPanelMaxRight?: number;
};

type ExpandedChildGrowthMeasurementContext = {
  context: ExpandedFlowGraphBuildContext;
  expandedChildren: ReadonlyArray<AjsUnit>;
  expandedChild: AjsUnit;
};

type ExpandedChildGrowthApplicationContext =
  ExpandedChildGrowthMeasurementContext & {
    immediateVisibleChildren: ReadonlyArray<AjsUnit>;
  };

export type ExpandedChildGrowthOffsetDeps = {
  buildExpandedUnitPanelBounds: (
    context: ExpandedFlowGraphBuildContext,
    expandedUnit: AjsUnit,
  ) => FlowGraphBounds | undefined;
  getVisibleImmediateChildren: (
    context: ExpandedFlowGraphBuildContext,
    containerUnitId: string,
  ) => AjsUnit[];
};

type ExpandedChildrenGrowthOffsetsTarget = {
  context: ExpandedFlowGraphBuildContext;
  containerUnit: AjsUnit;
  expandedChildren: ReadonlyArray<AjsUnit>;
  deps: ExpandedChildGrowthOffsetDeps;
};

const isRightOfExpandedUnit = ({
  displayPosition,
  expandedUnitPosition,
}: GrowthOffsetTarget): boolean => displayPosition.x > expandedUnitPosition.x;

const isBelowExpandedUnit = ({
  displayPosition,
  expandedUnitPosition,
}: GrowthOffsetTarget): boolean => displayPosition.y > expandedUnitPosition.y;

const isSameExpandedUnitColumn = ({
  displayPosition,
  expandedUnitPosition,
}: GrowthOffsetTarget): boolean => displayPosition.x === expandedUnitPosition.x;

const isSameExpandedUnitRow = ({
  displayPosition,
  expandedUnitPosition,
}: GrowthOffsetTarget): boolean => displayPosition.y === expandedUnitPosition.y;

const getHorizontalGrowthOffset = (target: GrowthOffsetTarget): number => {
  if (
    !isRightOfExpandedUnit(target) ||
    (!isBelowExpandedUnit(target) && !isSameExpandedUnitRow(target))
  ) {
    return 0;
  }
  return target.horizontalGrowth;
};

const getVerticalGrowthOffset = (target: GrowthOffsetTarget): number => {
  if (
    !isBelowExpandedUnit(target) ||
    (!isRightOfExpandedUnit(target) && !isSameExpandedUnitColumn(target))
  ) {
    return 0;
  }
  return Math.max(
    0,
    target.verticalGrowth - getOffset(target.context, target.unitId).y,
  );
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
  positionsBeforeOffset,
  expandedUnitPosition,
  horizontalGrowth,
  verticalGrowth,
  targetUnitIds,
}: GrowthOffsetBatch): UnitGrowthOffset[] =>
  [...positionsBeforeOffset]
    .filter(([unitId]) => targetUnitIds.has(unitId))
    .map(([unitId, displayPosition]) =>
      getTargetGrowthOffset({
        context,
        unitId,
        displayPosition,
        expandedUnitPosition,
        horizontalGrowth,
        verticalGrowth,
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
    expandedUnitPosition,
    horizontalGrowth,
    verticalGrowth,
    targetUnitIds,
  } = growthOffsetApplication;
  if (horizontalGrowth === 0 && verticalGrowth === 0) {
    return false;
  }

  const positionsBeforeOffset = getDisplayPositions(context);
  return applyUnitGrowthOffsets(
    context,
    getTargetGrowthOffsets({
      context,
      positionsBeforeOffset,
      expandedUnitPosition,
      horizontalGrowth,
      verticalGrowth,
      targetUnitIds,
    }),
  );
};

const getUpperExpandedPanelCandidateBounds = (
  context: ExpandedFlowGraphBuildContext,
  deps: ExpandedChildGrowthOffsetDeps,
  upperCandidate: AjsUnit,
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
  expandedChild: AjsUnit,
): ExpandedChildGrowthBounds | undefined => {
  const position = getDisplayPosition(context, expandedChild.id);
  const panelBounds = deps.buildExpandedUnitPanelBounds(context, expandedChild);
  if (!position || !panelBounds) {
    return undefined;
  }
  return { position, panelBounds };
};

const getGrowthTargetUnitIds = (
  immediateVisibleChildren: ReadonlyArray<AjsUnit>,
  expandedChild: AjsUnit,
) =>
  new Set(
    immediateVisibleChildren
      .filter((unit) => unit.id !== expandedChild.id)
      .map((unit) => unit.id),
  );

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
    expandedUnitPosition: growthBounds.position,
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
  targetUnitIds: ReadonlySet<string>,
): GrowthOffsetApplication => {
  const { expandedUnitPosition, panelBounds, baseBounds, upperPanelMaxRight } =
    measurement;
  return {
    expandedUnitPosition,
    horizontalGrowth: calculateHorizontalGrowth(
      panelBounds,
      baseBounds,
      upperPanelMaxRight,
    ),
    verticalGrowth: calculateVerticalGrowth(panelBounds, baseBounds),
    targetUnitIds,
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
    getGrowthTargetUnitIds(
      growthContext.immediateVisibleChildren,
      growthContext.expandedChild,
    ),
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
  containerUnit,
  expandedChildren,
  deps,
}: ExpandedChildrenGrowthOffsetsTarget) => {
  const immediateVisibleChildren = deps.getVisibleImmediateChildren(
    context,
    containerUnit.id,
  );

  for (const expandedChild of expandedChildren) {
    applyExpandedChildGrowthOffsets(
      {
        context,
        expandedChildren,
        expandedChild,
        immediateVisibleChildren,
      },
      deps,
    );
  }
};
