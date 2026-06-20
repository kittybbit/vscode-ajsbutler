import * as assert from "assert";
import { reduceHoveredFlowNodeState } from "../../presentation/webview/editor/ajsFlow/useHoveredFlowNodeState";

suite("Hovered Flow Node State", () => {
  test("tracks hover source and matching leave transitions", () => {
    const hovered = reduceHoveredFlowNodeState(undefined, {
      type: "enter",
      source: "graph",
      unitId: "unit-a",
    });

    assert.deepStrictEqual(hovered, { source: "graph", unitId: "unit-a" });
    assert.strictEqual(
      reduceHoveredFlowNodeState(hovered, {
        type: "leave",
        source: "graph",
        unitId: "unit-a",
      }),
      undefined,
    );
  });

  test("ignores repeated enter for the current source and target", () => {
    const hovered = { source: "graph", unitId: "unit-a" } as const;

    assert.strictEqual(
      reduceHoveredFlowNodeState(hovered, {
        type: "enter",
        source: "graph",
        unitId: "unit-a",
      }),
      hovered,
    );
  });

  test("does not let an older source leave clear a newer hover target", () => {
    const hovered = reduceHoveredFlowNodeState(
      { source: "tree", unitId: "unit-a" },
      { type: "enter", source: "graph", unitId: "unit-b" },
    );

    assert.deepStrictEqual(
      reduceHoveredFlowNodeState(hovered, {
        type: "leave",
        source: "tree",
        unitId: "unit-a",
      }),
      { source: "graph", unitId: "unit-b" },
    );
  });

  test("clears hover when the document or graph scope changes", () => {
    assert.strictEqual(
      reduceHoveredFlowNodeState(
        { source: "graph", unitId: "unit-a" },
        { type: "contextChanged" },
      ),
      undefined,
    );
  });
});
