import * as assert from "assert";
import { Row } from "@tanstack/table-core";
import { UnitListRowView } from "../../application/unit-list/buildUnitListView";
import {
  createEmptyTableSearchState,
  createSubmittedTableSearchState,
  findTableSearchMatchingAbsolutePaths,
  getTableSearchResultPosition,
  isActiveTableSearchQuery,
  moveTableSearchResult,
} from "../../presentation/webview/editor/ajsTable/tableSearchState";

const createRow = (
  absolutePath: string,
  visibleValues: readonly unknown[],
): Row<UnitListRowView> =>
  ({
    original: { absolutePath } as UnitListRowView,
    getVisibleCells: () =>
      visibleValues.map((value, index) => ({
        id: `${absolutePath}-${index}`,
        getValue: () => value,
      })),
  }) as unknown as Row<UnitListRowView>;

suite("AJS table search state", () => {
  test("finds matching rows in current table order", () => {
    const rows = [
      createRow("/root/first", ["first job"]),
      createRow("/root/second", ["target job"]),
      createRow("/root/third", ["target net"]),
    ];

    assert.deepStrictEqual(
      findTableSearchMatchingAbsolutePaths(rows, new Map(), "target"),
      ["/root/second", "/root/third"],
    );
  });

  test("matches parameter values even when they are not in a visible cell", () => {
    const rows = [
      createRow("/root/job", ["job"]),
      createRow("/root/other", ["other"]),
    ];

    assert.deepStrictEqual(
      findTableSearchMatchingAbsolutePaths(
        rows,
        new Map([["/root/job", [{ key: "prm", value: "--target" }]]]),
        "--target",
      ),
      ["/root/job"],
    );
  });

  test("matches absolute paths even when they are not in a visible cell", () => {
    const rows = [
      createRow("/root/target-path", ["job"]),
      createRow("/root/other-path", ["other"]),
    ];

    assert.deepStrictEqual(
      findTableSearchMatchingAbsolutePaths(rows, new Map(), "target-path"),
      ["/root/target-path"],
    );
  });

  test("submits a query with result position", () => {
    const state = createSubmittedTableSearchState(" target ", [
      "/root/second",
      "/root/third",
    ]);

    assert.strictEqual(isActiveTableSearchQuery(state, "TARGET"), true);
    assert.deepStrictEqual(getTableSearchResultPosition(state), {
      current: 1,
      total: 2,
    });
  });

  test("moves next and previous search results with wrapping", () => {
    const state = createSubmittedTableSearchState("target", [
      "/root/second",
      "/root/third",
    ]);

    const nextState = moveTableSearchResult(state, "next");
    assert.strictEqual(nextState.searchedAbsolutePath, "/root/third");

    const wrappedNextState = moveTableSearchResult(nextState, "next");
    assert.strictEqual(wrappedNextState.searchedAbsolutePath, "/root/second");

    const wrappedPreviousState = moveTableSearchResult(state, "previous");
    assert.strictEqual(
      wrappedPreviousState.searchedAbsolutePath,
      "/root/third",
    );
  });

  test("empty query clears active search", () => {
    assert.deepStrictEqual(
      createSubmittedTableSearchState("   ", ["/root/job"]),
      createEmptyTableSearchState(),
    );
  });
});
