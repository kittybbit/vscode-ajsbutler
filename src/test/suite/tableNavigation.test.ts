import * as assert from "assert";
import {
  canNavigateToSelectedUnit,
  handleJumpLinkClick,
  getStickyColumnRevealScrollLeft,
  isTableRowSelected,
  isTableGridNavigationKey,
  moveTableGridFocus,
  navigateToFlow,
  openUnitTreeUnitInFlow,
  reduceTableRowSelection,
  resolveTableGridFocus,
  selectUnitTreeUnitInTable,
} from "../../presentation/webview/editor/ajsTable/navigation";
import { findRowIndexByIdentity } from "../../presentation/webview/editor/ajsTable/tableRowReveal";
import { revealTableRow } from "../../presentation/webview/editor/ajsTable/tableRowReveal";
import type { UnitListUnitMetadataDto } from "../../application/unit-list/buildUnitListView";

const createUnit = (
  id: string,
  absolutePath: string,
): UnitListUnitMetadataDto => ({
  id,
  absolutePath,
  name: id,
  unitType: "j",
  isRootJobnet: false,
  parameterSearchValues: [],
});

suite("Table navigation", () => {
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
        current: { kind: "header", columnId: "name" },
        key: "ArrowRight",
      }),
      { kind: "header", columnId: "comment" },
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
    const context = {
      rows,
      selectRow: (absolutePath: string) => selected.push(absolutePath),
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
  });
});
