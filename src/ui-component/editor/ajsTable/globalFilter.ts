import { rankItem, rankings, RankingInfo } from "@tanstack/match-sorter-utils";
import { FilterMeta, Row } from "@tanstack/table-core";
import { AjsParameter } from "../../../domain/models/ajs/AjsDocument";
import Parameter from "../../../domain/models/parameters/Parameter";
import { UnitListRowView } from "../../../application/unit-list/buildUnitListView";
import { AccessorType } from "./columnDefs/common";

export type ParameterSearchValuesByPath = ReadonlyMap<
  string,
  readonly AjsParameter[]
>;
export type AjsTableSearchMode = "value" | "keyValue";

export const normalizeSearchValue = (value: unknown): string =>
  value instanceof Parameter ? value.value() : String(value);

export const buildParameterSearchValues = (
  parameters: readonly AjsParameter[],
  mode: AjsTableSearchMode,
): string[] =>
  mode === "keyValue"
    ? parameters.map((parameter) => `${parameter.key}=${parameter.value}`)
    : parameters.map((parameter) => parameter.value);

const toCellSearchValues = (value: AccessorType | undefined): string[] => {
  if (value === undefined) return [];
  const values = Array.isArray(value) ? value : [value];
  return values.map(normalizeSearchValue);
};

const rankSearchValues = (
  searchValues: readonly string[],
  filterValue: string,
): RankingInfo | undefined =>
  searchValues
    .map((searchValue) =>
      rankItem(searchValue, filterValue, { threshold: rankings.CONTAINS }),
    )
    .find((rank) => rank.passed);

const matchingParameterValues = (
  parameters: readonly AjsParameter[],
  filterValue: string,
): string[] =>
  parameters
    .filter((parameter) =>
      rankSearchValues([`${parameter.key}=${parameter.value}`], filterValue),
    )
    .map((parameter) => parameter.value);

export const isAjsTableSearchHit = (
  cellValue: AccessorType | undefined,
  parameters: readonly AjsParameter[],
  filterValue: string,
  searchMode: AjsTableSearchMode,
): boolean => {
  const cellSearchValues = toCellSearchValues(cellValue);
  if (cellSearchValues.length === 0 || filterValue.trim().length === 0) {
    return false;
  }

  if (searchMode === "keyValue") {
    const parameterValues = matchingParameterValues(parameters, filterValue);
    return cellSearchValues.some((cellSearchValue) =>
      parameterValues.some(
        (parameterValue) => cellSearchValue === parameterValue,
      ),
    );
  }

  return Boolean(rankSearchValues(cellSearchValues, filterValue));
};

export const createAjsGlobalFilterFn =
  (
    parameterSearchValuesByPath: ParameterSearchValuesByPath,
    searchMode: AjsTableSearchMode,
  ) =>
  (
    row: Row<UnitListRowView>,
    columnId: string,
    value: string,
    addMeta: (meta: FilterMeta) => void,
  ): boolean => {
    const cellValue = row.getValue<AccessorType>(columnId);
    const parameters =
      parameterSearchValuesByPath.get(row.original.absolutePath) ?? [];
    const parameterSearchValues = buildParameterSearchValues(
      parameters,
      searchMode,
    );
    const searchValues =
      searchMode === "keyValue"
        ? parameterSearchValues
        : [...toCellSearchValues(cellValue), ...parameterSearchValues];

    const itemRank = rankSearchValues(searchValues, value);
    if (!itemRank) return false;

    addMeta(itemRank);
    return itemRank.passed;
  };
