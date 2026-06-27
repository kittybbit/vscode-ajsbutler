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

const hasWeeklySchedule = (row: UnitListRowView): boolean =>
  Boolean(
    row.group6.su ||
      row.group6.mo ||
      row.group6.tu ||
      row.group6.we ||
      row.group6.th ||
      row.group6.fr ||
      row.group6.sa,
  );

const hasSchedule = (row: UnitListRowView): boolean =>
  hasWeeklySchedule(row) ||
  row.group6.openDates.length > 0 ||
  row.group6.closeDates.length > 0 ||
  row.group10.scheduleDateTypes.length > 0 ||
  row.group10.startTimes.length > 0 ||
  Boolean(row.group5.startTimeType);

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

const collectRelatedAbsolutePaths = (
  row: UnitListRowView,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
  direction: RelationshipDirection,
  cache: RelationshipSetCache = new Map(),
  visiting: ReadonlySet<string> = new Set(),
): Set<string> => {
  const canUseCache = visiting.size === 0;
  const cached = canUseCache ? cache.get(row.absolutePath) : undefined;
  if (cached) {
    return new Set(cached);
  }
  const nextVisiting = new Set(visiting);
  nextVisiting.add(row.absolutePath);
  const related = new Set<string>();

  for (const absolutePath of directlyRelatedAbsolutePaths(row, direction)) {
    if (nextVisiting.has(absolutePath)) {
      continue;
    }
    related.add(absolutePath);
    const relatedRow = rowViewByPath.get(absolutePath);
    if (relatedRow) {
      const transitiveRelated = collectRelatedAbsolutePaths(
        relatedRow,
        rowViewByPath,
        direction,
        cache,
        nextVisiting,
      );
      transitiveRelated.forEach((relatedAbsolutePath) => {
        if (!nextVisiting.has(relatedAbsolutePath)) {
          related.add(relatedAbsolutePath);
        }
      });
    }
  }

  if (canUseCache) {
    cache.set(row.absolutePath, new Set(related));
  }
  return related;
};

export const createUnitListDetailResolver = (
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>,
): ((
  selectedAbsolutePath: string | undefined,
) => UnitListDetail | undefined) => {
  const previousCache: RelationshipSetCache = new Map();
  const nextCache: RelationshipSetCache = new Map();
  const detailCache = new Map<string, UnitListDetail>();

  return (selectedAbsolutePath: string | undefined) => {
    if (!selectedAbsolutePath) {
      return undefined;
    }
    const cached = detailCache.get(selectedAbsolutePath);
    if (cached) {
      return cached;
    }
    const row = rowViewByPath.get(selectedAbsolutePath);
    if (!row) {
      return undefined;
    }
    const detail = {
      row,
      definition: unitDefinitionByPath.get(selectedAbsolutePath),
      predecessorCount: row.group2.previousUnits.length,
      successorCount: row.group2.nextUnits.length,
      upstreamCount: collectRelatedAbsolutePaths(
        row,
        rowViewByPath,
        "previous",
        previousCache,
      ).size,
      downstreamCount: collectRelatedAbsolutePaths(
        row,
        rowViewByPath,
        "next",
        nextCache,
      ).size,
      hasSchedule: hasSchedule(row),
      hasWaitedFor: row.group2.previousUnits.length > 0,
      canExpandNested: isNestedExpandable(row),
    };
    detailCache.set(selectedAbsolutePath, detail);
    return detail;
  };
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
