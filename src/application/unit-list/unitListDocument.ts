import type {
  AjsNormalizationWarning,
  AjsDocument,
} from "../../domain/models/ajs/AjsDocument";
import {
  type FlowGraphUnitDto,
  toFlowGraphUnitDto,
} from "../flow-graph/flowGraphDocument";
import {
  buildUnitDefinitions,
  type UnitDefinitionDialogDto,
} from "../unit-definition/buildUnitDefinition";
import {
  buildUnitListProjection,
  type UnitListProjectionDto,
  type UnitListRowView,
  type UnitListUnitMetadataDto,
} from "./buildUnitListView";
import { validateUnitListTableData } from "./unitListDocumentValidation";

export type UnitListRootDto = FlowGraphUnitDto;

export type UnitListDocumentDto = {
  rootUnits: UnitListRootDto[];
  warnings: AjsNormalizationWarning[];
  unitDefinitions: UnitDefinitionDialogDto[];
  unitList: UnitListProjectionDto;
};

export type UnitListTableDataDto = UnitListProjectionDto & {
  rootUnits: UnitListRootDto[];
};

const copyWarning = (
  warning: AjsNormalizationWarning,
): AjsNormalizationWarning => ({
  ...warning,
});

export const toUnitListRootDto = toFlowGraphUnitDto;

export const toUnitListDocumentDto = (
  document: AjsDocument,
): UnitListDocumentDto => ({
  rootUnits: document.rootUnits.map(toUnitListRootDto),
  warnings: document.warnings.map(copyWarning),
  unitDefinitions: buildUnitDefinitions(document),
  unitList: buildUnitListProjection(document),
});

const flattenUnitListRootDtos = (
  rootUnits: readonly UnitListRootDto[],
): UnitListRootDto[] =>
  rootUnits.flatMap((unit) => [
    unit,
    ...flattenUnitListRootDtos(unit.children),
  ]);

const hasConsistentTreeParentage = (
  units: readonly UnitListRootDto[],
  expectedParentId?: string,
): boolean =>
  units.every(
    (unit) =>
      unit.parentId === expectedParentId &&
      hasConsistentTreeParentage(unit.children, unit.id),
  );

const hasMatchingProjectionIdentity = (
  rootUnits: readonly UnitListRootDto[],
  rows: readonly UnitListRowView[],
  units: readonly UnitListUnitMetadataDto[],
): boolean => {
  const treeUnits = flattenUnitListRootDtos(rootUnits);
  if (
    !hasConsistentTreeParentage(rootUnits) ||
    treeUnits.length !== rows.length ||
    rows.length !== units.length
  ) {
    return false;
  }
  const unitIds = new Set(units.map((unit) => unit.id));
  const absolutePaths = new Set(units.map((unit) => unit.absolutePath));
  const treeUnitById = new Map(treeUnits.map((unit) => [unit.id, unit]));
  return (
    unitIds.size === units.length &&
    absolutePaths.size === units.length &&
    units.every(
      (unit, index) =>
        unit.id === rows[index]?.id &&
        unit.absolutePath === rows[index]?.absolutePath &&
        unit.id === treeUnits[index]?.id &&
        unit.absolutePath === treeUnits[index]?.absolutePath &&
        unit.name === treeUnits[index]?.name &&
        unit.name === rows[index]?.group1.name &&
        unit.parentId === treeUnits[index]?.parentId &&
        unit.parentId === rows[index]?.group1.parentId &&
        rows[index]?.group1.parentAbsolutePath ===
          (unit.parentId === undefined
            ? "/"
            : treeUnitById.get(unit.parentId)?.absolutePath) &&
        unit.unitType === treeUnits[index]?.unitType &&
        unit.unitType === rows[index]?.group1.unitType &&
        unit.isRootJobnet === treeUnits[index]?.isRootJobnet &&
        treeUnits[index]?.groupType === rows[index]?.group1.groupType &&
        treeUnits[index]?.comment === rows[index]?.group2.comment &&
        treeUnits[index]?.isRecovery === rows[index]?.group3.isRecovery &&
        treeUnits[index]?.jp1Username === rows[index]?.group3.jp1Username &&
        treeUnits[index]?.jp1ResourceGroup ===
          rows[index]?.group3.jp1ResourceGroup,
    )
  );
};

export const toUnitListTableData = (
  document: unknown,
): UnitListTableDataDto | undefined => {
  const candidate = validateUnitListTableData(document);
  if (candidate === undefined) {
    return undefined;
  }

  if (
    !hasMatchingProjectionIdentity(
      candidate.rootUnits,
      candidate.rows,
      candidate.units,
    )
  ) {
    return undefined;
  }
  return candidate;
};
