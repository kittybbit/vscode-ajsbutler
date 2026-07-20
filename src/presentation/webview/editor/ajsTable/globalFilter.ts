import { rankItem, rankings, RankingInfo } from "@tanstack/match-sorter-utils";
import { FilterMeta, Row } from "@tanstack/table-core";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import { AccessorType } from "./columnDefs/common";

export type ParameterSearchValuesByPath = ReadonlyMap<
  string,
  readonly string[]
>;

export const normalizeSearchValue = (value: unknown): string => String(value);

export const buildParameterSearchValues = (
  parameterValues: readonly string[],
): string[] => [...parameterValues];

export const toCellSearchValues = (
  value: AccessorType | undefined,
): string[] => {
  if (value === undefined) return [];
  const values = Array.isArray(value) ? value : [value];
  return values.map(normalizeSearchValue);
};

export const rankSearchValues = (
  searchValues: readonly string[],
  filterValue: string,
): RankingInfo | undefined =>
  searchValues
    .map((searchValue) =>
      rankItem(searchValue, filterValue, { threshold: rankings.CONTAINS }),
    )
    .find((rank) => rank.passed);

export const getAjsTableSearchValues = (
  cellValue: AccessorType | undefined,
  parameterValues: readonly string[],
): string[] => [
  ...toCellSearchValues(cellValue),
  ...buildParameterSearchValues(parameterValues),
];

export const isAjsTableSearchHit = (
  cellValue: AccessorType | undefined,
  _parameterValues: readonly string[],
  filterValue: string,
): boolean => {
  if (filterValue.trim().length === 0) {
    return false;
  }

  return Boolean(rankSearchValues(toCellSearchValues(cellValue), filterValue));
};

export const createAjsGlobalFilterFn =
  (parameterSearchValuesByPath: ParameterSearchValuesByPath) =>
  (
    row: Row<UnitListRowView>,
    columnId: string,
    value: string,
    addMeta: (meta: FilterMeta) => void,
  ): boolean => {
    const cellValue = row.getValue<AccessorType>(columnId);
    const parameterValues =
      parameterSearchValuesByPath.get(row.original.absolutePath) ?? [];
    const searchValues = getAjsTableSearchValues(cellValue, parameterValues);

    const itemRank = rankSearchValues(searchValues, value);
    if (!itemRank) return false;

    addMeta(itemRank);
    return itemRank.passed;
  };
