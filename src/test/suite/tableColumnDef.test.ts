import * as assert from "assert";
import { tableColumnDef } from "../../presentation/webview/editor/ajsTable/tableColumnDef";

type ColumnLike = {
  id?: string;
  columns?: ColumnLike[];
};

const collectColumnIds = (column: ColumnLike): string[] => [
  column.id ?? "",
  ...(column.columns ?? []).flatMap(collectColumnIds),
];

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
});
