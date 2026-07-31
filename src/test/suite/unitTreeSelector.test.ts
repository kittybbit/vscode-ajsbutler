import * as assert from "assert";
import { mergeUnitIds } from "../../presentation/webview/editor/shared/UnitTreeSelector";
import {
  resolveUnitTreeNavigationKey,
  resolveVisibleUnitTreeRows,
} from "../../presentation/webview/editor/shared/unitTreeNavigation";

type TestUnit = {
  children: TestUnit[];
  depth: number;
  id: string;
  parentId?: string;
};

const unit = (
  id: string,
  depth: number,
  children: TestUnit[] = [],
  parentId?: string,
): TestUnit => ({ children, depth, id, parentId });

suite("Unit Tree Selector", () => {
  test("merges required unit ids without changing an already complete set", () => {
    const current = new Set(["/root", "/root/jobnet"]);
    const next = mergeUnitIds(current, ["/root", undefined, "/root/jobnet"]);

    assert.strictEqual(next, current);
    assert.deepStrictEqual([...next], ["/root", "/root/jobnet"]);
  });

  test("appends only missing required unit ids", () => {
    const next = mergeUnitIds(new Set(["/root"]), [
      "/root/jobnet",
      undefined,
      "/root/jobnet/job",
    ]);

    assert.deepStrictEqual(
      [...next],
      ["/root", "/root/jobnet", "/root/jobnet/job"],
    );
  });

  test("resolves visible rows in hierarchy order and skips collapsed descendants", () => {
    const child = unit("/root/child", 1, [], "/root");
    const root = unit("/root", 0, [child]);
    const other = unit("/other", 0);

    const rows = resolveVisibleUnitTreeRows(
      [root, other],
      new Set(["/root"]),
      () => true,
    );

    assert.deepStrictEqual(
      rows.map(({ id, parentId, isExpanded }) => ({
        id,
        isExpanded,
        parentId,
      })),
      [
        { id: "/root", isExpanded: true, parentId: undefined },
        { id: "/root/child", isExpanded: false, parentId: "/root" },
        { id: "/other", isExpanded: false, parentId: undefined },
      ],
    );
  });

  test("moves through visible enabled rows with Up, Down, Home, and End", () => {
    const rows = resolveVisibleUnitTreeRows(
      [
        unit("/root", 0, [unit("/root/disabled", 1, [], "/root")]),
        unit("/other", 0),
      ],
      new Set(["/root"]),
      (candidate) => candidate.id !== "/root/disabled",
    );

    assert.deepStrictEqual(
      resolveUnitTreeNavigationKey(rows, "/root", {
        key: "ArrowDown",
      }),
      {
        action: { kind: "focus", targetUnitId: "/other" },
        suppressDefault: true,
      },
    );
    assert.deepStrictEqual(
      resolveUnitTreeNavigationKey(rows, "/other", {
        key: "ArrowUp",
      }),
      {
        action: { kind: "focus", targetUnitId: "/root" },
        suppressDefault: true,
      },
    );
    assert.deepStrictEqual(
      resolveUnitTreeNavigationKey(rows, "/other", { key: "Home" }),
      {
        action: { kind: "focus", targetUnitId: "/root" },
        suppressDefault: true,
      },
    );
    assert.deepStrictEqual(
      resolveUnitTreeNavigationKey(rows, "/root", { key: "End" }),
      {
        action: { kind: "focus", targetUnitId: "/other" },
        suppressDefault: true,
      },
    );
  });

  test("expands before entering the first enabled child and collapses before returning to parent", () => {
    const child = unit("/root/child", 1, [], "/root");
    const root = unit("/root", 0, [child]);
    const collapsedRows = resolveVisibleUnitTreeRows(
      [root],
      new Set(),
      () => true,
    );
    const expandedRows = resolveVisibleUnitTreeRows(
      [root],
      new Set(["/root"]),
      () => true,
    );

    assert.deepStrictEqual(
      resolveUnitTreeNavigationKey(collapsedRows, "/root", {
        key: "ArrowRight",
      }),
      {
        action: { kind: "expand", targetUnitId: "/root" },
        suppressDefault: true,
      },
    );
    assert.deepStrictEqual(
      resolveUnitTreeNavigationKey(expandedRows, "/root", {
        key: "ArrowRight",
      }),
      {
        action: { kind: "focus", targetUnitId: "/root/child" },
        suppressDefault: true,
      },
    );
    assert.deepStrictEqual(
      resolveUnitTreeNavigationKey(expandedRows, "/root/child", {
        key: "ArrowLeft",
      }),
      {
        action: { kind: "focus", targetUnitId: "/root" },
        suppressDefault: true,
      },
    );
    assert.deepStrictEqual(
      resolveUnitTreeNavigationKey(expandedRows, "/root", {
        key: "ArrowLeft",
      }),
      {
        action: { kind: "collapse", targetUnitId: "/root" },
        suppressDefault: true,
      },
    );
  });

  test("selects the focused enabled row with Enter and Space and preserves modified keys", () => {
    const rows = resolveVisibleUnitTreeRows(
      [unit("/root", 0)],
      new Set(),
      () => true,
    );

    assert.deepStrictEqual(
      resolveUnitTreeNavigationKey(rows, "/root", { key: "Enter" }),
      {
        action: { kind: "select", targetUnitId: "/root" },
        suppressDefault: true,
      },
    );
    assert.deepStrictEqual(
      resolveUnitTreeNavigationKey(rows, "/root", { key: " " }),
      {
        action: { kind: "select", targetUnitId: "/root" },
        suppressDefault: true,
      },
    );
    assert.deepStrictEqual(
      resolveUnitTreeNavigationKey(rows, "/root", {
        key: "ArrowDown",
        shiftKey: true,
      }),
      { suppressDefault: false },
    );
  });

  test("does not navigate to disabled rows", () => {
    const rows = resolveVisibleUnitTreeRows(
      [unit("/disabled", 0), unit("/enabled", 0)],
      new Set(),
      (candidate) => candidate.id === "/enabled",
    );

    assert.deepStrictEqual(
      resolveUnitTreeNavigationKey(rows, "/enabled", { key: "ArrowUp" }),
      { suppressDefault: true },
    );
  });
});
