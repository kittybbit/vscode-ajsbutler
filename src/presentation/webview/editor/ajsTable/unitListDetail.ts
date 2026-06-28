import type { UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";
import type { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

export type UnitListDetail = {
  row: UnitListRowView;
  definition?: UnitDefinitionDialogDto;
  predecessorCount: number;
  successorCount: number;
  upstreamCount: number;
  downstreamCount: number;
  hasSchedule: boolean;
  hasWaitedFor: boolean;
  canExpandNested: boolean;
};

type RelationshipDirection = "previous" | "next";
type RelationshipSetCache = Map<string, ReadonlySet<string>>;
type RelationshipTraversalContext = {
  cache: RelationshipSetCache;
  direction: RelationshipDirection;
  rowViewByPath: ReadonlyMap<string, UnitListRowView>;
};

type UnitListDetailResolverContext = {
  detailCache: Map<string, UnitListDetail>;
  nextTraversal: RelationshipTraversalContext;
  previousTraversal: RelationshipTraversalContext;
  rowViewByPath: ReadonlyMap<string, UnitListRowView>;
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>;
};

const hasWeeklySchedule = (row: UnitListRowView): boolean =>
  [
    row.group6.su,
    row.group6.mo,
    row.group6.tu,
    row.group6.we,
    row.group6.th,
    row.group6.fr,
    row.group6.sa,
  ].some(Boolean);

const hasSchedule = (row: UnitListRowView): boolean =>
  [
    hasWeeklySchedule(row),
    row.group6.openDates.length > 0,
    row.group6.closeDates.length > 0,
    row.group10.scheduleDateTypes.length > 0,
    row.group10.startTimes.length > 0,
    Boolean(row.group5.startTimeType),
  ].some(Boolean);

const isNestedExpandable = (row: UnitListRowView): boolean =>
  row.group1.unitType === "n";

const directlyRelatedAbsolutePaths = (
  row: UnitListRowView,
  direction: RelationshipDirection,
): string[] =>
  (direction === "previous"
    ? row.group2.previousUnits
    : row.group2.nextUnits
  ).map((unit) => unit.absolutePath);

const takeNextUnvisitedPath = (
  pendingAbsolutePaths: string[],
  visitedAbsolutePaths: ReadonlySet<string>,
): string | undefined => {
  let absolutePath = pendingAbsolutePaths.pop();
  while (absolutePath !== undefined && visitedAbsolutePaths.has(absolutePath)) {
    absolutePath = pendingAbsolutePaths.pop();
  }
  return absolutePath;
};

const appendDirectlyRelatedPaths = (
  pendingAbsolutePaths: string[],
  absolutePath: string,
  context: RelationshipTraversalContext,
): void => {
  const relatedRow = context.rowViewByPath.get(absolutePath);
  if (relatedRow) {
    pendingAbsolutePaths.push(
      ...directlyRelatedAbsolutePaths(relatedRow, context.direction),
    );
  }
};

const collectUncachedRelatedAbsolutePaths = (
  row: UnitListRowView,
  context: RelationshipTraversalContext,
): Set<string> => {
  const related = new Set<string>();
  const visited = new Set([row.absolutePath]);
  const pending = directlyRelatedAbsolutePaths(row, context.direction);
  let absolutePath = takeNextUnvisitedPath(pending, visited);

  while (absolutePath !== undefined) {
    visited.add(absolutePath);
    related.add(absolutePath);
    appendDirectlyRelatedPaths(pending, absolutePath, context);
    absolutePath = takeNextUnvisitedPath(pending, visited);
  }

  return related;
};

const collectRelatedAbsolutePaths = (
  row: UnitListRowView,
  context: RelationshipTraversalContext,
): Set<string> => {
  const cached = context.cache.get(row.absolutePath);
  if (cached) {
    return new Set(cached);
  }
  const related = collectUncachedRelatedAbsolutePaths(row, context);
  context.cache.set(row.absolutePath, new Set(related));
  return related;
};

const buildUnitListDetail = (
  selectedAbsolutePath: string,
  row: UnitListRowView,
  context: UnitListDetailResolverContext,
): UnitListDetail => ({
  row,
  definition: context.unitDefinitionByPath.get(selectedAbsolutePath),
  predecessorCount: row.group2.previousUnits.length,
  successorCount: row.group2.nextUnits.length,
  upstreamCount: collectRelatedAbsolutePaths(row, context.previousTraversal)
    .size,
  downstreamCount: collectRelatedAbsolutePaths(row, context.nextTraversal).size,
  hasSchedule: hasSchedule(row),
  hasWaitedFor: row.group2.previousUnits.length > 0,
  canExpandNested: isNestedExpandable(row),
});

const findCachedUnitListDetail = (
  selectedAbsolutePath: string | undefined,
  context: UnitListDetailResolverContext,
): UnitListDetail | undefined =>
  selectedAbsolutePath === undefined
    ? undefined
    : context.detailCache.get(selectedAbsolutePath);

const findSelectedRow = (
  selectedAbsolutePath: string | undefined,
  context: UnitListDetailResolverContext,
): UnitListRowView | undefined =>
  selectedAbsolutePath === undefined
    ? undefined
    : context.rowViewByPath.get(selectedAbsolutePath);

const buildSelectedUnitListDetail = (
  selectedAbsolutePath: string | undefined,
  row: UnitListRowView | undefined,
  context: UnitListDetailResolverContext,
): UnitListDetail | undefined =>
  selectedAbsolutePath === undefined || row === undefined
    ? undefined
    : buildUnitListDetail(selectedAbsolutePath, row, context);

const cacheResolvedUnitListDetail = (
  selectedAbsolutePath: string | undefined,
  detail: UnitListDetail | undefined,
  context: UnitListDetailResolverContext,
): void => {
  if (selectedAbsolutePath !== undefined && detail !== undefined) {
    context.detailCache.set(selectedAbsolutePath, detail);
  }
};

const resolveCachedUnitListDetail = (
  selectedAbsolutePath: string | undefined,
  context: UnitListDetailResolverContext,
): UnitListDetail | undefined => {
  const cached = findCachedUnitListDetail(selectedAbsolutePath, context);
  if (cached) {
    return cached;
  }
  const detail = buildSelectedUnitListDetail(
    selectedAbsolutePath,
    findSelectedRow(selectedAbsolutePath, context),
    context,
  );
  cacheResolvedUnitListDetail(selectedAbsolutePath, detail, context);
  return detail;
};

export const createUnitListDetailResolver = (
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>,
): ((
  selectedAbsolutePath: string | undefined,
) => UnitListDetail | undefined) => {
  const context: UnitListDetailResolverContext = {
    detailCache: new Map(),
    nextTraversal: {
      cache: new Map(),
      direction: "next",
      rowViewByPath,
    },
    previousTraversal: {
      cache: new Map(),
      direction: "previous",
      rowViewByPath,
    },
    rowViewByPath,
    unitDefinitionByPath,
  };

  return (selectedAbsolutePath: string | undefined) =>
    resolveCachedUnitListDetail(selectedAbsolutePath, context);
};

export const resolveUnitListDetail = (
  selectedAbsolutePath: string | undefined,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>,
): UnitListDetail | undefined =>
  createUnitListDetailResolver(
    rowViewByPath,
    unitDefinitionByPath,
  )(selectedAbsolutePath);
