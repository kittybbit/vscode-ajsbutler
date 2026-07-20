import * as assert from "assert";
import { buildUnitListView } from "../../application/unit-list/buildUnitListView";
import { tableColumnDef } from "../../presentation/webview/editor/ajsTable/tableColumnDef";
import { parseAjsDocumentForTest } from "../support/parseAjs";

type ColumnLike = {
  id?: string;
  columns?: ColumnLike[];
  accessorFn?: (row: unknown, index: number) => unknown;
};

const collectColumnIds = (column: ColumnLike): string[] => [
  column.id ?? "",
  ...(column.columns ?? []).flatMap(collectColumnIds),
];

const primitiveDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  gty=n;
  op=mo:1;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    sd=en;
    ar=(f=job-a,t=job-b);
    unit=job-a,,jp1admin,;
    {
      ty=j;
      prm=--job;
    }
    unit=job-b,,jp1admin,;
    {
      ty=qj;
    }
  }
}
`;

const isPrimitive = (value: unknown): boolean =>
  value === null ||
  ["bigint", "boolean", "number", "string", "symbol", "undefined"].includes(
    typeof value,
  );

const isAccessorValue = (value: unknown): boolean =>
  Array.isArray(value) ? value.every(isPrimitive) : isPrimitive(value);

const collectLeafColumns = (columns: ColumnLike[]): ColumnLike[] =>
  columns.flatMap((column) =>
    column.columns ? collectLeafColumns(column.columns) : [column],
  );

suite("Table Column Definition", () => {
  test("preserves schedule definition column ids and nesting order", () => {
    const columns = tableColumnDef("en", () => undefined, new Map());
    const scheduleGroup = columns.find(
      (column) => column.id === "group10",
    ) as ColumnLike;

    assert.deepStrictEqual(collectColumnIds(scheduleGroup), [
      "group10",
      "group10.col1",
      "group10.col2",
      "group10.col3",
      "group10.col4",
      "group10.col5",
      "group10.group1",
      "group10.group1.col1",
      "group10.group1.col2",
      "group10.group1.col3",
      "group10.col6",
      "grsoup10.col7",
      "group10.col8",
      "group10.col9",
      "group10.col10",
      "group10.col11",
      "group10.group2",
      "group10.group2.col1",
      "group10.group2.col2",
      "group10.group3",
      "group10.group3.col1",
      "group10.group3.col2",
    ]);
  });

  test("returns only primitive values or primitive arrays from accessors", () => {
    const rows = buildUnitListView(
      parseAjsDocumentForTest(primitiveDefinition),
    );
    const rowViewByPath = new Map(rows.map((row) => [row.absolutePath, row]));
    const columns = collectLeafColumns(
      tableColumnDef("en", () => undefined, rowViewByPath) as ColumnLike[],
    );

    rows.forEach((row, rowIndex) => {
      columns.forEach((column) => {
        if (!column.accessorFn) return;
        const value = column.accessorFn(row, rowIndex);
        assert.ok(
          isAccessorValue(value),
          `${column.id ?? "unknown column"} returned a non-primitive value`,
        );
      });
    });
  });
});
