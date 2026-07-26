import { UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";
import type {
  UnitListRowView,
  UnitListUnitMetadataDto,
} from "../../../../application/unit-list/buildUnitListView";
import type {
  UnitListRootDto,
  UnitListTableDataDto,
} from "../../../../application/unit-list/unitListDocument";

export type TableViewerData = {
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>;
  rowViewByPath: ReadonlyMap<string, UnitListRowView>;
  rootUnits: UnitListRootDto[];
  unitById: ReadonlyMap<string, UnitListUnitMetadataDto>;
  unitByAbsolutePath: ReadonlyMap<string, UnitListUnitMetadataDto>;
  parameterSearchValuesByPath: ReadonlyMap<string, readonly string[]>;
};

const createRowViewByPath = (
  rowViews: UnitListRowView[] | undefined,
): ReadonlyMap<string, UnitListRowView> =>
  new Map((rowViews ?? []).map((rowView) => [rowView.absolutePath, rowView]));

const createUnitById = (units: ReadonlyArray<UnitListUnitMetadataDto>) =>
  new Map(units.map((unit) => [unit.id, unit]));

const createUnitByAbsolutePath = (
  units: ReadonlyArray<UnitListUnitMetadataDto>,
) => new Map(units.map((unit) => [unit.absolutePath, unit]));

const createParameterSearchValuesByPath = (
  units: ReadonlyArray<UnitListUnitMetadataDto>,
) =>
  new Map(units.map((unit) => [unit.absolutePath, unit.parameterSearchValues]));

export const createTableViewerData = (
  tableData: UnitListTableDataDto | undefined,
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>,
): TableViewerData => {
  const rootUnits = tableData?.rootUnits ?? [];
  const rows = tableData?.rows ?? [];
  const units = tableData?.units ?? [];
  return {
    unitDefinitionByPath,
    rowViewByPath: createRowViewByPath(rows),
    rootUnits,
    unitById: createUnitById(units),
    unitByAbsolutePath: createUnitByAbsolutePath(units),
    parameterSearchValuesByPath: createParameterSearchValuesByPath(units),
  };
};

export const findSelectedUnitId = (
  selectedAbsolutePath: string | undefined,
  unitByAbsolutePath: ReadonlyMap<string, UnitListUnitMetadataDto>,
): string | undefined =>
  selectedAbsolutePath
    ? unitByAbsolutePath.get(selectedAbsolutePath)?.id
    : undefined;
