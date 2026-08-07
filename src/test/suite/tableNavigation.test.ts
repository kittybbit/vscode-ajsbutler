import * as assert from "assert";
import {
  canNavigateToSelectedUnit,
  handleJumpLinkClick,
  getStickyColumnRevealScrollLeft,
  isTableRowSelected,
  isTableGridNavigationEventOwnedByCell,
  isTableGridNavigationKey,
  moveTableGridFocus,
  navigateToFlow,
  openUnitTreeUnitInFlow,
  reduceTableRowSelection,
  resolveTableGridFocus,
  resolveTableGridRestorationFocus,
  resolveUnitListGridShortcut,
  selectUnitTreeUnitInTable,
} from "../../presentation/webview/editor/ajsTable/navigation";
import {
  decideTableGridNavigation,
  decideTableGridRestoration,
} from "../../presentation/webview/editor/ajsTable/tableNavigationModel";
import { findRowIndexByIdentity } from "../../presentation/webview/editor/ajsTable/tableRowReveal";
import { revealTableRow } from "../../presentation/webview/editor/ajsTable/tableRowReveal";
import type { TableUnitMetadata } from "../../presentation/webview/editor/ajsTable/tableViewerData";

const createUnit = (id: string, absolutePath: string): TableUnitMetadata => ({
  id,
  absolutePath,
  name: id,
  unitType: "j",
  isRootJobnet: false,
  parameterSearchValues: [],
});

suite("Table navigation", () => {
  test("returns a pure movement decision with selection and off-screen target", () => {
    const decision = decideTableGridNavigation({
      current: { kind: "cell", absolutePath: "/root/first", columnId: "name" },
      key: "PageDown",
      pageSize: 2,
      rowAbsolutePaths: ["/root/first", "/root/middle", "/root/final"],
      visibleColumnIds: ["name"],
      sortableColumnIds: ["name"],
    });

    assert.deepStrictEqual(decision, {
      focus: { kind: "cell", absolutePath: "/root/final", columnId: "name" },
      selectedAbsolutePath: "/root/final",
      scrollTargetAbsolutePath: "/root/final",
    });
  });

  test("returns a stable header fallback when a saved cell is unavailable", () => {
    const decision = decideTableGridRestoration(
      { kind: "cell", absolutePath: "/root/removed", columnId: "name" },
      "/root/removed",
      [],
      [],
      ["name"],
    );

    assert.deepStrictEqual(decision, {
      focus: { kind: "header", columnId: "name" },
      selectedAbsolutePath: undefined,
      scrollTargetAbsolutePath: undefined,
    });
  });
  test("enables flow navigation only for a selected stable path", () => {
    assert.strictEqual(canNavigateToSelectedUnit(undefined), false);
    assert.strictEqual(canNavigateToSelectedUnit(""), false);
    assert.strictEqual(canNavigateToSelectedUnit("/root/job"), true);
  });

  test("posts the existing navigation event for the selected path", () => {
    const messages: unknown[] = [];
    navigateToFlow("/root/job", (message) => {
      messages.push(message);
    });
    assert.deepStrictEqual(messages, [
      {
        type: "navigate",
        data: { targetView: "flow", absolutePath: "/root/job" },
      },
    ]);
  });

  test("chooses one stable grid entry target", () => {
    const rows = ["/root/a", "/root/b"];
    const columns = ["#", "name", "comment"];
    const sortable = ["name", "comment"];

    assert.deepStrictEqual(
      resolveTableGridFocus(undefined, undefined, rows, columns, sortable),
      { kind: "header", columnId: "name" },
    );
    assert.deepStrictEqual(
      resolveTableGridFocus(undefined, "/root/b", rows, columns, sortable),
      { kind: "cell", absolutePath: "/root/b", columnId: "#" },
    );
    assert.deepStrictEqual(
      resolveTableGridFocus(
        { kind: "header", columnId: "#" },
        undefined,
        rows,
        columns,
        sortable,
      ),
      { kind: "header", columnId: "#" },
    );
    assert.deepStrictEqual(
      resolveTableGridFocus(
        { kind: "cell", absolutePath: "/root/b", columnId: "comment" },
        "/root/b",
        ["/root/b", "/root/a"],
        ["#", "comment"],
        ["comment"],
      ),
      { kind: "cell", absolutePath: "/root/b", columnId: "comment" },
    );
    assert.deepStrictEqual(
      resolveTableGridFocus(
        { kind: "cell", absolutePath: "/missing", columnId: "hidden" },
        undefined,
        [],
        ["#"],
        [],
      ),
      undefined,
    );
  });

  test("restores workflow focus by stable path and visible column", () => {
    const rows = ["/root/a", "/root/b"];
    const columns = ["#", "name", "comment"];
    const sortable = ["name", "comment"];

    assert.deepStrictEqual(
      resolveTableGridRestorationFocus(
        { kind: "cell", absolutePath: "/root/a", columnId: "comment" },
        "/root/b",
        rows,
        columns,
        sortable,
      ),
      { kind: "cell", absolutePath: "/root/b", columnId: "comment" },
    );
    assert.deepStrictEqual(
      resolveTableGridRestorationFocus(
        { kind: "cell", absolutePath: "/root/b", columnId: "hidden" },
        "/root/b",
        rows,
        ["#", "name"],
        ["name"],
      ),
      { kind: "cell", absolutePath: "/root/b", columnId: "#" },
    );
    assert.deepStrictEqual(
      resolveTableGridRestorationFocus(
        { kind: "cell", absolutePath: "/removed", columnId: "comment" },
        "/removed",
        rows,
        columns,
        sortable,
      ),
      { kind: "header", columnId: "name" },
    );
    assert.strictEqual(
      resolveTableGridRestorationFocus(undefined, "/removed", [], [], []),
      undefined,
    );
  });

  test("moves among visible grid columns and logical rows", () => {
    const context = {
      current: {
        kind: "cell" as const,
        absolutePath: "/root/b",
        columnId: "name",
      },
      key: "ArrowRight",
      pageSize: 2,
      rowAbsolutePaths: ["/root/a", "/root/b", "/root/c", "/root/d"],
      visibleColumnIds: ["#", "name", "comment"],
      sortableColumnIds: ["name", "comment"],
    };

    assert.deepStrictEqual(moveTableGridFocus(context), {
      kind: "cell",
      absolutePath: "/root/b",
      columnId: "comment",
    });
    assert.deepStrictEqual(
      moveTableGridFocus({ ...context, key: "PageDown" }),
      {
        kind: "cell",
        absolutePath: "/root/d",
        columnId: "name",
      },
    );
    assert.deepStrictEqual(moveTableGridFocus({ ...context, key: "Home" }), {
      kind: "cell",
      absolutePath: "/root/b",
      columnId: "#",
    });
    assert.deepStrictEqual(
      moveTableGridFocus({ ...context, key: "End", ctrlKey: true }),
      {
        kind: "cell",
        absolutePath: "/root/d",
        columnId: "comment",
      },
    );
  });

  test("clamps virtualized page movement at large-list boundaries", () => {
    const rowAbsolutePaths = Array.from(
      { length: 10_000 },
      (_, index) => `/root/job-${index}`,
    );
    const base = {
      current: {
        kind: "cell" as const,
        absolutePath: rowAbsolutePaths[4_999],
        columnId: "comment",
      },
      key: "PageDown",
      pageSize: 37,
      rowAbsolutePaths,
      visibleColumnIds: ["#", "comment"],
      sortableColumnIds: ["comment"],
    };

    assert.deepStrictEqual(moveTableGridFocus(base), {
      kind: "cell",
      absolutePath: rowAbsolutePaths[5_036],
      columnId: "comment",
    });
    assert.deepStrictEqual(
      moveTableGridFocus({
        ...base,
        current: {
          ...base.current,
          absolutePath: rowAbsolutePaths[9_990],
        },
      }),
      {
        kind: "cell",
        absolutePath: rowAbsolutePaths[9_999],
        columnId: "comment",
      },
    );
  });

  test("moves between sortable headers and data without trapping Tab", () => {
    const base = {
      pageSize: 10,
      rowAbsolutePaths: ["/root/a"],
      visibleColumnIds: ["#", "name", "comment"],
      sortableColumnIds: ["name", "comment"],
    };

    assert.deepStrictEqual(
      moveTableGridFocus({
        ...base,
        current: { kind: "header", columnId: "#" },
        key: "ArrowRight",
      }),
      { kind: "header", columnId: "name" },
    );
    assert.deepStrictEqual(
      moveTableGridFocus({
        ...base,
        current: { kind: "header", columnId: "name" },
        key: "ArrowRight",
      }),
      { kind: "header", columnId: "comment" },
    );
    assert.deepStrictEqual(
      moveTableGridFocus({
        ...base,
        current: {
          kind: "cell",
          absolutePath: "/root/a",
          columnId: "#",
        },
        key: "ArrowUp",
      }),
      { kind: "header", columnId: "#" },
    );
    assert.deepStrictEqual(
      moveTableGridFocus({
        ...base,
        current: { kind: "header", columnId: "comment" },
        key: "ArrowDown",
      }),
      { kind: "cell", absolutePath: "/root/a", columnId: "comment" },
    );
    assert.deepStrictEqual(
      moveTableGridFocus({
        ...base,
        current: {
          kind: "cell",
          absolutePath: "/root/a",
          columnId: "comment",
        },
        key: "ArrowUp",
      }),
      { kind: "header", columnId: "comment" },
    );
    assert.strictEqual(isTableGridNavigationKey("Tab"), false);
    assert.strictEqual(isTableGridNavigationKey("Home"), true);
    assert.strictEqual(isTableGridNavigationKey("End", true), true);

    const cell = {};
    const nestedLink = {
      closest: (selector: string) =>
        selector === '[role="gridcell"]' ? cell : undefined,
    };
    assert.strictEqual(
      isTableGridNavigationEventOwnedByCell(
        nestedLink as never,
        cell as never,
        "ArrowDown",
      ),
      true,
    );
    assert.strictEqual(
      isTableGridNavigationEventOwnedByCell(
        nestedLink as never,
        cell as never,
        "Enter",
      ),
      false,
    );
  });

  test("clamps header and cell focus at table boundaries", () => {
    const rows = ["/root/first", "/root/last"];
    const columns = ["#", "name", "comment"];
    const context = {
      pageSize: 10,
      rowAbsolutePaths: rows,
      visibleColumnIds: columns,
      sortableColumnIds: ["name", "comment"],
    };

    assert.deepStrictEqual(
      moveTableGridFocus({
        ...context,
        current: {
          kind: "cell",
          absolutePath: rows[0],
          columnId: "#",
        },
        key: "ArrowLeft",
      }),
      { kind: "cell", absolutePath: rows[0], columnId: "#" },
    );
    assert.deepStrictEqual(
      moveTableGridFocus({
        ...context,
        current: { kind: "header", columnId: "#" },
        key: "ArrowLeft",
      }),
      { kind: "header", columnId: "#" },
    );
    assert.deepStrictEqual(
      moveTableGridFocus({
        ...context,
        current: { kind: "header", columnId: "comment" },
        key: "ArrowRight",
      }),
      { kind: "header", columnId: "comment" },
    );
    assert.deepStrictEqual(
      moveTableGridFocus({
        ...context,
        current: { kind: "header", columnId: "comment" },
        key: "End",
        ctrlKey: true,
      }),
      { kind: "cell", absolutePath: rows[1], columnId: "comment" },
    );
  });

  test("resolves list grid shortcuts only for their owned focus target", () => {
    const cell = {
      kind: "cell" as const,
      absolutePath: "/root/job",
      columnId: "name",
    };
    const header = { kind: "header" as const, columnId: "name" };

    assert.strictEqual(
      resolveUnitListGridShortcut({ focus: cell, key: "h" }),
      "focusColumnHeader",
    );
    assert.strictEqual(
      resolveUnitListGridShortcut({ focus: cell, key: "H" }),
      "focusColumnHeader",
    );
    assert.strictEqual(
      resolveUnitListGridShortcut({ focus: cell, key: "l" }),
      "focusTree",
    );
    assert.strictEqual(
      resolveUnitListGridShortcut({ focus: header, key: "L" }),
      "focusTree",
    );
    assert.strictEqual(
      resolveUnitListGridShortcut({ focus: cell, key: "d" }),
      "openDetails",
    );
    assert.strictEqual(
      resolveUnitListGridShortcut({ focus: cell, key: "D" }),
      "openDetails",
    );
    assert.strictEqual(
      resolveUnitListGridShortcut({ focus: header, key: "Escape" }),
      "returnToSavedCell",
    );
    assert.strictEqual(
      resolveUnitListGridShortcut({ focus: header, key: "d" }),
      undefined,
    );
    assert.strictEqual(
      resolveUnitListGridShortcut({ focus: cell, key: "h", shiftKey: true }),
      undefined,
    );
    assert.strictEqual(
      resolveUnitListGridShortcut({ focus: cell, key: "d", ctrlKey: true }),
      undefined,
    );
    assert.strictEqual(
      resolveUnitListGridShortcut({ focus: cell, key: "d", metaKey: true }),
      undefined,
    );
    assert.strictEqual(
      resolveUnitListGridShortcut({ focus: cell, key: "l", shiftKey: true }),
      undefined,
    );
  });

  test("reveals a cell that would otherwise sit behind the sticky index column", () => {
    assert.strictEqual(getStickyColumnRevealScrollLeft(320, 42, 118), 244);
    assert.strictEqual(getStickyColumnRevealScrollLeft(320, 140, 118), 320);
    assert.strictEqual(getStickyColumnRevealScrollLeft(40, 20, 100), 0);
  });

  test("jump links select their target without selecting the source row", () => {
    const jumped: string[] = [];
    let stopped = 0;

    handleJumpLinkClick("/root/parent", (identity) => jumped.push(identity))({
      stopPropagation: () => stopped++,
    });

    assert.deepStrictEqual(jumped, ["/root/parent"]);
    assert.strictEqual(stopped, 1);
  });

  test("keeps visual selection attached only to the selected path", () => {
    assert.strictEqual(
      isTableRowSelected({
        absolutePath: "/root/job",
        selectedAbsolutePath: "/root/job",
        index: 4,
        revealedRowIndex: undefined,
      }),
      true,
    );
    assert.strictEqual(
      isTableRowSelected({
        absolutePath: "/root/other",
        selectedAbsolutePath: "/root/job",
        index: 4,
        revealedRowIndex: undefined,
      }),
      false,
    );
    assert.strictEqual(
      isTableRowSelected({
        absolutePath: "/root/other",
        selectedAbsolutePath: "/root/job",
        index: 1,
        revealedRowIndex: 1,
      }),
      false,
    );
  });

  test("clears stable selection when the document changes", () => {
    const selected = reduceTableRowSelection(undefined, {
      type: "select",
      absolutePath: "/root/job",
    });
    assert.strictEqual(selected, "/root/job");
    assert.strictEqual(
      reduceTableRowSelection(selected, { type: "documentChanged" }),
      undefined,
    );
  });

  test("keeps row selection state stable when the same path is selected again", () => {
    const selected = reduceTableRowSelection("/root/job", {
      type: "select",
      absolutePath: "/root/job",
    });

    assert.strictEqual(selected, "/root/job");
  });

  test("maps unit-tree selection and scope opening through stable paths", () => {
    const unit = createUnit("unit-id", "/root/jobnet/job");
    const unitById = new Map([[unit.id, unit]]);
    const revealed: string[] = [];
    const navigated: string[] = [];

    selectUnitTreeUnitInTable(unit.id, unitById, (absolutePath) => {
      revealed.push(absolutePath);
    });
    selectUnitTreeUnitInTable("missing", unitById, (absolutePath) => {
      revealed.push(absolutePath);
    });
    openUnitTreeUnitInFlow(unit.id, unitById, (absolutePath) => {
      navigated.push(absolutePath);
    });
    openUnitTreeUnitInFlow("missing", unitById, (absolutePath) => {
      navigated.push(absolutePath);
    });

    assert.deepStrictEqual(revealed, ["/root/jobnet/job"]);
    assert.deepStrictEqual(navigated, ["/root/jobnet/job"]);
  });

  test("resolves the scroll target from the selected row identity", () => {
    const rows = [
      { original: { id: "root", absolutePath: "/root" } },
      { original: { id: "job", absolutePath: "/root/job" } },
    ];

    assert.strictEqual(findRowIndexByIdentity(rows as never, "job"), 1);
    assert.strictEqual(findRowIndexByIdentity(rows as never, "/root/job"), 1);
    assert.strictEqual(
      findRowIndexByIdentity(rows as never, "missing"),
      undefined,
    );
    assert.strictEqual(
      findRowIndexByIdentity(rows as never, undefined),
      undefined,
    );
  });

  test("reveals only a valid row request and leaves selection stable otherwise", () => {
    const rows = [
      { original: { id: "job", absolutePath: "/root/job" } },
    ] as never;
    const selected: string[] = [];
    const focused: string[] = [];
    const context = {
      rows,
      selectRow: (absolutePath: string) => selected.push(absolutePath),
      requestFocus: (absolutePath: string) => focused.push(absolutePath),
    };

    assert.strictEqual(
      revealTableRow({ absolutePath: "/root/job" }, context),
      true,
    );
    assert.strictEqual(
      revealTableRow({ absolutePath: "/missing" }, context),
      false,
    );
    assert.strictEqual(revealTableRow({ absolutePath: 1 }, context), false);
    assert.deepStrictEqual(selected, ["/root/job"]);
    assert.deepStrictEqual(focused, ["/root/job"]);
  });
});
