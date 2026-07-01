import {
  AjsDocument,
  AjsUnit,
  flattenAjsUnits,
} from "../../../../domain/models/ajs/AjsDocument";
import {
  buildUnitDefinitionByPath,
  UnitDefinitionDialogDto,
} from "../../../../application/unit-definition/buildUnitDefinition";
import type { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

export type TableViewerData = {
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>;
  rowViewByPath: ReadonlyMap<string, UnitListRowView>;
  rootUnits: AjsUnit[];
  unitById: ReadonlyMap<string, AjsUnit>;
  unitByAbsolutePath: ReadonlyMap<string, AjsUnit>;
};

const createUnitDefinitionByPath = (
  ajsDocument: AjsDocument | undefined,
): ReadonlyMap<string, UnitDefinitionDialogDto> =>
  ajsDocument
    ? buildUnitDefinitionByPath(ajsDocument)
    : new Map<string, UnitDefinitionDialogDto>();

const createRowViewByPath = (
  rowViews: UnitListRowView[] | undefined,
): ReadonlyMap<string, UnitListRowView> =>
  new Map((rowViews ?? []).map((rowView) => [rowView.absolutePath, rowView]));

const createUnitById = (units: ReadonlyArray<AjsUnit>) =>
  new Map(units.map((unit) => [unit.id, unit]));

const createUnitByAbsolutePath = (units: ReadonlyArray<AjsUnit>) =>
  new Map(units.map((unit) => [unit.absolutePath, unit]));

export const createTableViewerData = (
  ajsDocument: AjsDocument | undefined,
  rowViews: UnitListRowView[] | undefined,
): TableViewerData => {
  const rootUnits = ajsDocument?.rootUnits ?? [];
  const allUnits = ajsDocument ? flattenAjsUnits(rootUnits) : [];
  return {
    unitDefinitionByPath: createUnitDefinitionByPath(ajsDocument),
    rowViewByPath: createRowViewByPath(rowViews),
    rootUnits,
    unitById: createUnitById(allUnits),
    unitByAbsolutePath: createUnitByAbsolutePath(allUnits),
  };
};

export const findSelectedUnitId = (
  selectedAbsolutePath: string | undefined,
  unitByAbsolutePath: ReadonlyMap<string, AjsUnit>,
): string | undefined =>
  selectedAbsolutePath
    ? unitByAbsolutePath.get(selectedAbsolutePath)?.id
    : undefined;
