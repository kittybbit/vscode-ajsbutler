import * as assert from "assert";
import {
  formatUnitCountLabel,
  getAjsTableHeaderControlLabels,
  getAjsTableSearchHelperText,
} from "../../presentation/webview/editor/ajsTable/Header";
import { getVisibleColumnSelectorColumns } from "../../presentation/webview/editor/ajsTable/DisplayColumnSelector";
import { getFixedTableVirtuosoStyle } from "../../presentation/webview/editor/ajsTable/VirtualizedTable";

suite("AJS Table Header", () => {
  test("formats visible and total unit counts", () => {
    assert.strictEqual(formatUnitCountLabel(0, 0), "0 / 0 units");
    assert.strictEqual(formatUnitCountLabel(12, 45), "12 / 45 units");
    assert.strictEqual(formatUnitCountLabel(45, 45), "45 / 45 units");
  });

  test("keeps header controls directly discoverable", () => {
    assert.deepStrictEqual(getAjsTableHeaderControlLabels("en"), {
      columns: "Select display columns.",
      copyCsv: "Copy the contents to clipbord as csv.",
      saveCsv: "Save the contents as csv.",
    });
  });

  test("describes flow-style list search state", () => {
    assert.strictEqual(
      getAjsTableSearchHelperText(undefined, undefined),
      "Search units by visible values, path, comment, or parameter value.",
    );
    assert.strictEqual(
      getAjsTableSearchHelperText(undefined, { current: 0, total: 0 }),
      "No units match in the list.",
    );
    assert.strictEqual(
      getAjsTableSearchHelperText("/root/job", { current: 1, total: 3 }),
      "Matched row is selected in the list.",
    );
  });

  test("uses a fixed internal table scroll region", () => {
    assert.deepStrictEqual(getFixedTableVirtuosoStyle(), {
      width: "100%",
      minWidth: 0,
      height: "100%",
      maxHeight: "100%",
      boxSizing: "border-box",
    });
  });

  test("filters column selector options to hideable columns", () => {
    const hideableColumn = { columnDef: { enableHiding: true } };
    const fixedColumn = { columnDef: { enableHiding: false } };
    const table = {
      getAllColumns: () => [hideableColumn, fixedColumn],
    };

    assert.deepStrictEqual(getVisibleColumnSelectorColumns(table as never), [
      hideableColumn,
    ]);
  });
});
