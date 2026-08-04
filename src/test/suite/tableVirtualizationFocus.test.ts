import * as assert from "assert";
import { getColumnVisibilityRevision } from "../../presentation/webview/editor/ajsTable/VirtualizedTable";
import {
  getTableGridFocusKey,
  moveTableGridFocus,
  resolveTableGridFocus,
  resolveTableGridRestorationFocus,
  resolveUnitListGridShortcut,
  selectUnitTreeUnitInTable,
} from "../../presentation/webview/editor/ajsTable/navigation";
import type { UnitListUnitMetadataDto } from "../../application/unit-list/buildUnitListView";
import {
  findRowIndexByIdentity,
  revealTableRow,
} from "../../presentation/webview/editor/ajsTable/tableRowReveal";

suite("Table virtualization and focus", () => {
  test("creates a deterministic revision when visible columns change", () => {
    assert.strictEqual(
      getColumnVisibilityRevision({ name: true, comment: false }),
      "comment:false|name:true",
    );
    assert.strictEqual(
      getColumnVisibilityRevision({ comment: false, name: true }),
      getColumnVisibilityRevision({ name: true, comment: false }),
    );
    assert.notStrictEqual(
      getColumnVisibilityRevision({ name: true }),
      getColumnVisibilityRevision({ name: false }),
    );
  });

  test("restores a stable cell after sorting and visible-column changes", () => {
    const current = {
      kind: "cell" as const,
      absolutePath: "/root/job-2",
      columnId: "comment",
    };
    const sortedRows = ["/root/job-3", "/root/job-2", "/root/job-1"];

    assert.strictEqual(
      getTableGridFocusKey(current),
      "cell:/root/job-2:comment",
    );
    assert.deepStrictEqual(
      resolveTableGridFocus(
        current,
        "/root/job-2",
        sortedRows,
        ["#", "name", "comment"],
        ["name", "comment"],
      ),
      current,
    );
    assert.deepStrictEqual(
      resolveTableGridRestorationFocus(
        current,
        "/root/job-2",
        sortedRows,
        ["#", "name"],
        ["name"],
      ),
      { kind: "cell", absolutePath: "/root/job-2", columnId: "#" },
    );
  });

  test("keeps large-list keyboard movement bounded at the final row", () => {
    const rowAbsolutePaths = Array.from(
      { length: 10_000 },
      (_, index) => `/root/job-${index}`,
    );

    assert.deepStrictEqual(
      moveTableGridFocus({
        current: {
          kind: "cell",
          absolutePath: "/root/job-9990",
          columnId: "name",
        },
        key: "PageDown",
        pageSize: 37,
        rowAbsolutePaths,
        visibleColumnIds: ["#", "name"],
        sortableColumnIds: ["name"],
      }),
      {
        kind: "cell",
        absolutePath: "/root/job-9999",
        columnId: "name",
      },
    );
  });

  test("reveals rows and hands off tree focus through stable identities", () => {
    const rows = [
      { original: { id: "job", absolutePath: "/root/job" } },
    ] as never;
    const selected: string[] = [];
    const focused: string[] = [];

    assert.strictEqual(findRowIndexByIdentity(rows, "/root/job"), 0);
    assert.strictEqual(
      revealTableRow(
        { absolutePath: "/root/job" },
        {
          rows,
          selectRow: (absolutePath) => selected.push(absolutePath),
          requestFocus: (absolutePath) => focused.push(absolutePath),
        },
      ),
      true,
    );
    assert.strictEqual(
      resolveUnitListGridShortcut({
        focus: {
          kind: "cell",
          absolutePath: "/root/job",
          columnId: "name",
        },
        key: "l",
      }),
      "focusTree",
    );

    const unit: UnitListUnitMetadataDto = {
      id: "job",
      absolutePath: "/root/job",
      name: "job",
      unitType: "j",
      isRootJobnet: false,
      parameterSearchValues: [],
    };
    selectUnitTreeUnitInTable(
      "job",
      new Map([[unit.id, unit]]),
      (absolutePath) => selected.push(absolutePath),
    );

    assert.deepStrictEqual(selected, ["/root/job", "/root/job"]);
    assert.deepStrictEqual(focused, ["/root/job"]);
  });
});
