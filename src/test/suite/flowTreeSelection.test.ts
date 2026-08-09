import * as assert from "assert";
import type { FlowGraphUnitDto } from "../../application/flow-graph/flowGraphDocument";
import {
  collectFlowTreeAncestorUnitIds,
  isUnitInCurrentFlowScope,
  resolveFlowTreeSelectionTarget,
} from "../../presentation/webview/editor/ajsFlow/flowTreeSelection";

type TestUnitParams = Pick<
  FlowGraphUnitDto,
  "id" | "parentId" | "children" | "depth"
>;

const createUnit = ({
  children,
  depth,
  id,
  parentId,
}: TestUnitParams): FlowGraphUnitDto => ({
  id,
  name: id,
  unitAttribute: "",
  unitType: "n",
  absolutePath: id,
  depth,
  parentId,
  isRoot: parentId === undefined,
  isRootJobnet: parentId === undefined,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 0, v: 0 },
  parameters: [],
  relations: [],
  children,
});

const createSelectionTree = (): {
  currentUnit: FlowGraphUnitDto;
  leaf: FlowGraphUnitDto;
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
} => {
  const leaf = createUnit({
    children: [],
    depth: 3,
    id: "leaf",
    parentId: "grand",
  });
  const grand = createUnit({
    children: [leaf],
    depth: 2,
    id: "grand",
    parentId: "child",
  });
  const child = createUnit({
    children: [grand],
    depth: 1,
    id: "child",
    parentId: "scope",
  });
  const currentUnit = createUnit({
    children: [child],
    depth: 0,
    id: "scope",
  });
  const other = createUnit({
    children: [],
    depth: 0,
    id: "other",
  });

  return {
    currentUnit,
    leaf,
    unitById: new Map(
      [currentUnit, child, grand, leaf, other].map((unit) => [unit.id, unit]),
    ),
  };
};

suite("Flow Tree Selection", () => {
  test("collects stable tree ancestors in root-to-leaf order", () => {
    const { leaf, unitById } = createSelectionTree();

    assert.deepStrictEqual(collectFlowTreeAncestorUnitIds(leaf.id, unitById), [
      "scope",
      "child",
      "grand",
    ]);
    assert.deepStrictEqual(
      collectFlowTreeAncestorUnitIds(undefined, unitById),
      [],
    );
  });

  test("selects descendants in the current scope and reveals nested ancestors", () => {
    const { currentUnit, leaf, unitById } = createSelectionTree();

    assert.deepStrictEqual(
      resolveFlowTreeSelectionTarget(leaf.id, currentUnit, unitById),
      {
        selectedUnitId: leaf.id,
        expandedNestedUnitIds: ["child", "grand"],
      },
    );
    assert.deepStrictEqual(
      resolveFlowTreeSelectionTarget(currentUnit.id, currentUnit, unitById),
      {
        selectedUnitId: currentUnit.id,
        expandedNestedUnitIds: [],
      },
    );
  });

  test("rejects units outside the current flow scope", () => {
    const { currentUnit, unitById } = createSelectionTree();
    const other = unitById.get("other");
    assert.ok(other);

    assert.strictEqual(
      isUnitInCurrentFlowScope(other, currentUnit, unitById),
      false,
    );
    assert.strictEqual(
      resolveFlowTreeSelectionTarget(other.id, currentUnit, unitById),
      undefined,
    );
  });
});
