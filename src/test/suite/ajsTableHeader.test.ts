import * as assert from "assert";
import {
  formatUnitCountLabel,
  getAjsTableHeaderControlLabels,
  getAjsTableSearchHelperText,
} from "../../presentation/webview/editor/ajsTable/Header";
import {
  createColumnVisibilityUpdate,
  getDisplayColumnSelectorControlLabels,
  getVisibleColumnSelectorColumns,
} from "../../presentation/webview/editor/ajsTable/DisplayColumnSelector";
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
    assert.strictEqual(
      getAjsTableHeaderControlLabels("ja").columns,
      "表示するカラムを選択する。",
    );
    assert.strictEqual(
      getAjsTableHeaderControlLabels("unsupported").columns,
      "Select display columns.",
    );
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

  test("builds a single visibility update for grouped column toggles", () => {
    assert.deepStrictEqual(
      createColumnVisibilityUpdate(["group.a", "group.b"], false),
      {
        "group.a": false,
        "group.b": false,
      },
    );
    assert.deepStrictEqual(createColumnVisibilityUpdate(["group.a"], true), {
      "group.a": true,
    });
  });

  test("preserves localized display-column controls and fallback", () => {
    assert.deepStrictEqual(getDisplayColumnSelectorControlLabels("en"), {
      hideAll: "All columns to invisible.",
      showAll: "All columns to visible.",
    });
    assert.deepStrictEqual(getDisplayColumnSelectorControlLabels("ja"), {
      hideAll: "全てのカラムを非表示にする。",
      showAll: "全てのカラムを表示にする。",
    });
    assert.deepStrictEqual(
      getDisplayColumnSelectorControlLabels("unsupported"),
      getDisplayColumnSelectorControlLabels("en"),
    );
  });
});
