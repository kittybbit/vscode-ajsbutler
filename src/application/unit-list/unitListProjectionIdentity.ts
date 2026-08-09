import type { FlowGraphUnitDto } from "../flow-graph/flowGraphDocument";
import type {
  UnitListRowView,
  UnitListUnitMetadataDto,
} from "./buildUnitListView";

const allIdentityChecks = (checks: readonly (() => boolean)[]): boolean =>
  checks.every((check) => check());

type ProjectionShape = {
  rootUnits: readonly FlowGraphUnitDto[];
  treeUnits: readonly FlowGraphUnitDto[];
  rows: readonly UnitListRowView[];
  units: readonly UnitListUnitMetadataDto[];
};

type ProjectionIdentityContext = ProjectionShape & {
  treeUnitById: ReadonlyMap<string, FlowGraphUnitDto>;
};

type UnitIdentityContext = {
  unit: UnitListUnitMetadataDto;
  row: UnitListRowView | undefined;
  treeUnit: FlowGraphUnitDto | undefined;
  treeUnitById: ReadonlyMap<string, FlowGraphUnitDto>;
};

const flattenUnitListRootDtos = (
  rootUnits: readonly FlowGraphUnitDto[],
): FlowGraphUnitDto[] =>
  rootUnits.flatMap((unit) => [
    unit,
    ...flattenUnitListRootDtos(unit.children),
  ]);

const hasConsistentTreeParentage = (
  units: readonly FlowGraphUnitDto[],
  expectedParentId?: string,
): boolean =>
  units.every(
    (unit) =>
      unit.parentId === expectedParentId &&
      hasConsistentTreeParentage(unit.children, unit.id),
  );

const hasMatchingProjectionShape = ({
  rootUnits,
  treeUnits,
  rows,
  units,
}: ProjectionShape): boolean =>
  allIdentityChecks([
    () => hasConsistentTreeParentage(rootUnits),
    () => treeUnits.length === rows.length,
    () => rows.length === units.length,
  ]);

const hasUniqueProjectionIdentity = (
  units: readonly UnitListUnitMetadataDto[],
): boolean => {
  const unitIds = new Set(units.map((unit) => unit.id));
  const absolutePaths = new Set(units.map((unit) => unit.absolutePath));
  return unitIds.size === units.length && absolutePaths.size === units.length;
};

const expectedParentAbsolutePath = (
  unit: UnitListUnitMetadataDto,
  treeUnitById: ReadonlyMap<string, FlowGraphUnitDto>,
): string | undefined =>
  unit.parentId === undefined
    ? "/"
    : treeUnitById.get(unit.parentId)?.absolutePath;

const hasMatchingBasicIdentity = (
  unit: UnitListUnitMetadataDto,
  row: UnitListRowView | undefined,
  treeUnit: FlowGraphUnitDto | undefined,
): boolean =>
  allIdentityChecks([
    () => unit.id === row?.id,
    () => unit.absolutePath === row?.absolutePath,
    () => unit.id === treeUnit?.id,
    () => unit.absolutePath === treeUnit?.absolutePath,
    () => unit.name === treeUnit?.name,
    () => unit.name === row?.group1.name,
  ]);

const hasMatchingParentage = ({
  unit,
  row,
  treeUnit,
  treeUnitById,
}: UnitIdentityContext): boolean =>
  allIdentityChecks([
    () => unit.parentId === treeUnit?.parentId,
    () => unit.parentId === row?.group1.parentId,
    () =>
      row?.group1.parentAbsolutePath ===
      expectedParentAbsolutePath(unit, treeUnitById),
  ]);

const hasMatchingUnitState = (
  unit: UnitListUnitMetadataDto,
  row: UnitListRowView | undefined,
  treeUnit: FlowGraphUnitDto | undefined,
): boolean =>
  allIdentityChecks([
    () => unit.unitType === treeUnit?.unitType,
    () => unit.unitType === row?.group1.unitType,
    () => unit.isRootJobnet === treeUnit?.isRootJobnet,
    () => treeUnit?.groupType === row?.group1.groupType,
  ]);

const hasMatchingUnitMetadata = (
  row: UnitListRowView | undefined,
  treeUnit: FlowGraphUnitDto | undefined,
): boolean =>
  allIdentityChecks([
    () => treeUnit?.comment === row?.group2.comment,
    () => treeUnit?.isRecovery === row?.group3.isRecovery,
    () => treeUnit?.jp1Username === row?.group3.jp1Username,
    () => treeUnit?.jp1ResourceGroup === row?.group3.jp1ResourceGroup,
  ]);

const hasMatchingUnitIdentity = (context: UnitIdentityContext): boolean =>
  allIdentityChecks([
    () => hasMatchingBasicIdentity(context.unit, context.row, context.treeUnit),
    () => hasMatchingParentage(context),
    () => hasMatchingUnitState(context.unit, context.row, context.treeUnit),
    () => hasMatchingUnitMetadata(context.row, context.treeUnit),
  ]);

const hasMatchingProjectionRows = ({
  rows,
  treeUnits,
  units,
  treeUnitById,
}: ProjectionIdentityContext): boolean =>
  units.every((unit, index) =>
    hasMatchingUnitIdentity({
      unit,
      row: rows[index],
      treeUnit: treeUnits[index],
      treeUnitById,
    }),
  );

export const hasMatchingProjectionIdentity = (
  rootUnits: readonly FlowGraphUnitDto[],
  rows: readonly UnitListRowView[],
  units: readonly UnitListUnitMetadataDto[],
): boolean => {
  const treeUnits = flattenUnitListRootDtos(rootUnits);
  const shape = { rootUnits, treeUnits, rows, units };
  if (!hasMatchingProjectionShape(shape)) {
    return false;
  }
  const treeUnitById = new Map(treeUnits.map((unit) => [unit.id, unit]));
  return allIdentityChecks([
    () => hasUniqueProjectionIdentity(units),
    () => hasMatchingProjectionRows({ ...shape, treeUnitById }),
  ]);
};
