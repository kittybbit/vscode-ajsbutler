import * as assert from "assert";
import {
  canNavigateToSelectedUnit,
  handleSelectTableRow,
  handleSelectTableRowKeyDown,
  handleJumpLinkClick,
  isTableRowSelected,
  navigateToFlow,
  openUnitTreeUnitInFlow,
  reduceTableRowSelection,
  selectUnitTreeUnitInTable,
} from "../../presentation/webview/editor/ajsTable/navigation";
import { findRowIndexByIdentity } from "../../presentation/webview/editor/ajsTable/tableRowReveal";
import type { AjsUnit } from "../../domain/models/ajs/AjsDocument";

const createUnit = (id: string, absolutePath: string): AjsUnit =>
  ({
    id,
    absolutePath,
    name: id,
    unitType: "j",
    children: [],
  }) as AjsUnit;

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

  test("selects a row with pointer, Enter, or Space interaction", () => {
    const selected: string[] = [];
    let prevented = 0;
    const rowTarget = {} as EventTarget & HTMLElement;
    const nestedTarget = {} as EventTarget;
    const selectRow = (absolutePath: string) => selected.push(absolutePath);
    const keyboardHandler = handleSelectTableRowKeyDown("/root/job", selectRow);

    handleSelectTableRow("/root/job", selectRow)();
    keyboardHandler({
      currentTarget: rowTarget,
      key: "Escape",
      preventDefault: () => prevented++,
      target: rowTarget,
    });
    keyboardHandler({
      currentTarget: rowTarget,
      key: "Enter",
      preventDefault: () => prevented++,
      target: rowTarget,
    });
    keyboardHandler({
      currentTarget: rowTarget,
      key: " ",
      preventDefault: () => prevented++,
      target: rowTarget,
    });
    keyboardHandler({
      currentTarget: rowTarget,
      key: "Enter",
      preventDefault: () => prevented++,
      target: nestedTarget,
    });

    assert.deepStrictEqual(selected, ["/root/job", "/root/job", "/root/job"]);
    assert.strictEqual(prevented, 2);
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
});
