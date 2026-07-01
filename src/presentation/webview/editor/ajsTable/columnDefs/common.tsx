import React, { JSX } from "react";
import { CellContext, ColumnHelper } from "@tanstack/table-core";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import type { AjsTableColumnGroupLabels } from "../../../../../domain/services/i18n/nls";
import Parameter from "../../../../../domain/models/parameters/Parameter";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";

type PrimitiveType =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined;
const isPrimitiveType = (value: unknown): value is PrimitiveType => {
  if (value === null) {
    return true;
  }
  switch (typeof value) {
    case "bigint":
    case "boolean":
    case "number":
    case "string":
    case "symbol":
    case "undefined":
      return true;
    default:
      return false;
  }
};
type BoxType = Parameter | PrimitiveType;
export type AccessorType = BoxType | BoxType[];
export type RowViewByPath = ReadonlyMap<string, UnitListRowView>;
export type TableColumnHelper = ColumnHelper<UnitListRowView>;
export type ColumnGroupContext = {
  columnHelper: TableColumnHelper;
  labels: AjsTableColumnGroupLabels;
  rowViewByPath: RowViewByPath;
};
type ColumnCell<TValue> = (
  props: CellContext<UnitListRowView, TValue>,
) => React.ReactNode;
type RowViewSelector<TValue> = (
  rowView: UnitListRowView | undefined,
) => TValue | undefined;
type ColumnLabels = {
  label: string;
  column: (column: number) => string;
};
type RowViewColumnOptions<TValue> = {
  id: string;
  header: string;
  rowViewByPath: RowViewByPath;
  selectValue: RowViewSelector<TValue>;
  cell?: ColumnCell<TValue | undefined>;
};
type LabeledRowViewColumnsOptions<TValue> = {
  idPrefix: string;
  labels: ColumnLabels;
  rowViewByPath: RowViewByPath;
  selectors: RowViewSelector<TValue>[];
};
type NestedColumnGroupOptions<TValue> = {
  columnHelper: TableColumnHelper;
  id: string;
  labels: ColumnLabels;
  rowViewByPath: RowViewByPath;
  selectors: RowViewSelector<TValue>[];
};

export const columnGroupContext = (
  columnHelper: TableColumnHelper,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: RowViewByPath,
): ColumnGroupContext => ({ columnHelper, labels, rowViewByPath });

export const rowViewColumn = <TValue,>({
  id,
  header,
  rowViewByPath,
  selectValue,
  cell,
}: RowViewColumnOptions<TValue>) => {
  const column = {
    id,
    header,
    accessorFn: (row: UnitListRowView) =>
      selectValue(rowViewByPath.get(row.absolutePath)),
  };
  if (cell) {
    return { ...column, cell };
  }
  return column;
};

export const labeledRowViewColumns = <TValue,>({
  idPrefix,
  labels,
  rowViewByPath,
  selectors,
}: LabeledRowViewColumnsOptions<TValue>) =>
  selectors.map((selector, index) =>
    rowViewColumn({
      id: `${idPrefix}.col${index + 1}`,
      header: labels.column(index + 1),
      rowViewByPath,
      selectValue: selector,
    }),
  );

export const nestedColumnGroup = <TValue,>({
  columnHelper,
  id,
  labels,
  rowViewByPath,
  selectors,
}: NestedColumnGroupOptions<TValue>) =>
  columnHelper.group({
    id,
    header: labels.label,
    columns: labeledRowViewColumns({
      idPrefix: id,
      labels,
      rowViewByPath,
      selectors,
    }),
  });

export const blankWhenEmpty = (value: string) => value || "\u00A0";

export const arrayBoxCell = <TValue,>(
  mapValue: (value: TValue) => BoxType = (value) => value as BoxType,
) => {
  const ArrayBoxCell = (
    props: CellContext<UnitListRowView, TValue[] | undefined>,
  ) => {
    const values = props.getValue<TValue[] | undefined>();
    return Array.isArray(values) ? (
      <>{values.map((value, index) => box(mapValue(value), index))}</>
    ) : undefined;
  };
  return ArrayBoxCell;
};

export const ratingCell = (
  props: CellContext<UnitListRowView, number | undefined>,
) => {
  const priority = props.getValue<number | undefined>();
  return priority ? (
    <Rating
      value={priority}
      size="small"
      sx={{ position: "inherit" }}
      readOnly
    />
  ) : undefined;
};

const parameterBox = (param: Parameter, index: number): JSX.Element => {
  const parameterSx = () =>
    param.isDefault || param.inherited ? { color: "text.disabled" } : {};
  return (
    <Box
      key={index}
      data-param={param.parameter}
      data-raw={param.rawValue}
      data-inherited={param.inherited}
      data-defalut={param.isDefault}
      sx={parameterSx}
    >
      {param.value()}
    </Box>
  );
};

const primitiveBox = (param: PrimitiveType, index: number): JSX.Element => (
  <Box
    key={index}
    data-param={undefined}
    data-raw={param}
    data-inherited={false}
    data-defalut={false}
  >
    {new String(param).toString()}
  </Box>
);

const defaultFn = <T,>(param: T, index: number): JSX.Element => {
  if (param instanceof Parameter) {
    return parameterBox(param, index);
  }
  return isPrimitiveType(param) ? primitiveBox(param, index) : <></>;
};

/**
 * Create a box element for display.
 * @param param parameter for display
 * @param index index for display
 * @param fn function to customize display
 * @returns JSX.Element
 */
export const box = <T,>(
  param: T,
  index: number = 0,
  fn: (param: T, index: number) => JSX.Element = defaultFn,
) => fn(param, index);
