import * as assert from "assert";
import { buildExpandedFlowGraphResult } from "../../application/flow-graph/buildExpandedFlowGraph";
import type {
  FlowGraphUnitDto,
  ValidatedFlowGraphDocument,
} from "../../application/flow-graph/flowGraphDocument";

type UnitOverrides = Partial<FlowGraphUnitDto> &
  Pick<FlowGraphUnitDto, "id" | "unitType" | "absolutePath" | "depth">;

const unit = (overrides: UnitOverrides): FlowGraphUnitDto => ({
  name: overrides.id,
  unitAttribute: "",
  parentId: undefined,
  isRoot: overrides.depth === 0,
  isRootJobnet: overrides.unitType === "n" && overrides.depth === 0,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 240, v: 144 },
  parameters: [],
  relations: [],
  children: [],
  ...overrides,
});

const validatedDocument = (
  rootUnits: FlowGraphUnitDto[],
): ValidatedFlowGraphDocument => {
  const unitById = new Map<string, FlowGraphUnitDto>();
  const unitByAbsolutePath = new Map<string, FlowGraphUnitDto>();
  const pending = [...rootUnits];
  while (pending.length > 0) {
    const current = pending.pop() as FlowGraphUnitDto;
    unitById.set(current.id, current);
    unitByAbsolutePath.set(current.absolutePath, current);
    pending.push(...current.children);
  }
  return {
    status: "available",
    document: { rootUnits },
    index: { unitById, unitByAbsolutePath },
    issues: [],
  };
};

const createNestedDocument = (
  options: { recoveryChild?: boolean; conditionChild?: boolean } = {},
): ValidatedFlowGraphDocument => {
  const leaf = unit({
    id: "leaf",
    unitType: "j",
    absolutePath: "/scope/child/grand/leaf",
    depth: 3,
    parentId: "grand",
  });
  const grand = unit({
    id: "grand",
    unitType: "n",
    absolutePath: "/scope/child/grand",
    depth: 2,
    parentId: "child",
    children: [leaf],
  });
  const nestedJob = unit({
    id: "nested-job",
    unitType: "j",
    absolutePath: "/scope/child/nested-job",
    depth: 2,
    parentId: "child",
    layout: { h: 400, v: 144 },
  });
  const condition = unit({
    id: "condition",
    unitType: "rc",
    absolutePath: "/scope/child/.CONDITION",
    depth: 2,
    parentId: "child",
  });
  const child = unit({
    id: "child",
    unitType: options.recoveryChild ? "rn" : "n",
    absolutePath: "/scope/child",
    depth: 1,
    parentId: "scope",
    children: [
      nestedJob,
      grand,
      ...(options.conditionChild ? [condition] : []),
    ],
    relations: [
      { sourceUnitId: "grand", targetUnitId: "nested-job", type: "seq" },
      ...(options.conditionChild
        ? [
            {
              sourceUnitId: "condition",
              targetUnitId: "grand",
              type: "con" as const,
            },
          ]
        : []),
    ],
  });
  const sibling = unit({
    id: "sibling",
    unitType: "j",
    absolutePath: "/scope/sibling",
    depth: 1,
    parentId: "scope",
    layout: { h: 400, v: 144 },
  });
  const scope = unit({
    id: "scope",
    unitType: "n",
    absolutePath: "/scope",
    depth: 0,
    children: [sibling, child],
  });
  const outside = unit({
    id: "outside",
    unitType: "n",
    absolutePath: "/outside",
    depth: 0,
  });
  return validatedDocument([scope, outside]);
};

suite("Build Expanded Flow Graph use case", () => {
  test("returns deterministic expanded structure and placement constraints", () => {
    const document = createNestedDocument();
    const first = buildExpandedFlowGraphResult({
      document,
      activeScopeUnitId: "scope",
      requestedExpandedUnitIds: ["grand", "child"],
    });
    const second = buildExpandedFlowGraphResult({
      document,
      activeScopeUnitId: "scope",
      requestedExpandedUnitIds: ["child", "grand"],
    });

    assert.strictEqual(first.status, "available");
    assert.strictEqual(second.status, "available");
    assert.deepStrictEqual(first, second);
    if (first.status !== "available") return;

    assert.deepStrictEqual(
      first.graph.nodes.map((node) => node.id),
      ["sibling", "child", "scope", "grand", "nested-job", "leaf"],
    );
    assert.deepStrictEqual(first.graph.edges, [
      { source: "grand", target: "nested-job", type: "seq" },
    ]);
    assert.deepStrictEqual(first.constraints.realizedExpandedUnitIds, [
      "child",
      "grand",
    ]);
    assert.deepStrictEqual(first.constraints.containmentOrderUnitIds, [
      "scope",
      "child",
      "grand",
      "leaf",
      "nested-job",
      "sibling",
    ]);
    assert.deepStrictEqual(first.constraints.expandedUnits, [
      {
        unitId: "child",
        containerUnitId: "scope",
        affectedSiblingUnitIds: ["sibling"],
        horizontalAffectedSiblingUnitIds: ["sibling"],
        verticalAffectedSiblingUnitIds: [],
        subtreeRange: { start: 1, end: 5 },
      },
      {
        unitId: "grand",
        containerUnitId: "child",
        affectedSiblingUnitIds: ["nested-job"],
        horizontalAffectedSiblingUnitIds: ["nested-job"],
        verticalAffectedSiblingUnitIds: [],
        subtreeRange: { start: 2, end: 4 },
      },
    ]);
  });

  test("omits malformed requests with typed issues", () => {
    const result = buildExpandedFlowGraphResult({
      document: createNestedDocument(),
      activeScopeUnitId: "scope",
      requestedExpandedUnitIds: [
        "child",
        "child",
        "missing",
        "outside",
        "scope",
        "sibling",
      ],
    });

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.deepStrictEqual(
      result.constraints.normalizedRequestedExpandedUnitIds,
      ["child"],
    );
    assert.deepStrictEqual(
      result.issues.map((issue) => issue.code),
      [
        "duplicate_visible_unit",
        "missing_visible_unit",
        "out_of_scope_visible_unit",
        "out_of_scope_visible_unit",
        "invalid_visible_unit",
      ],
    );
  });

  test("does not realize a requested descendant whose parent is collapsed", () => {
    const result = buildExpandedFlowGraphResult({
      document: createNestedDocument(),
      activeScopeUnitId: "scope",
      requestedExpandedUnitIds: ["grand"],
    });

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.deepStrictEqual(
      result.constraints.normalizedRequestedExpandedUnitIds,
      ["grand"],
    );
    assert.deepStrictEqual(result.constraints.realizedExpandedUnitIds, []);
    assert.ok(!result.graph.nodes.some((node) => node.id === "leaf"));
  });

  test("preserves recovery, condition, relation, and base highlight semantics", () => {
    const highlight = {
      kind: "changed" as const,
      changeIds: ["unit:child"],
      confirmationIds: [],
    };
    const result = buildExpandedFlowGraphResult({
      document: createNestedDocument({
        recoveryChild: true,
        conditionChild: true,
      }),
      activeScopeUnitId: "scope",
      requestedExpandedUnitIds: ["child"],
      semanticDiffHighlights: {
        nodes: new Map([["child", highlight]]),
        edges: new Map(),
      },
    });

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    const recoveryNode = result.graph.nodes.find((node) => node.id === "child");
    const conditionNode = result.graph.nodes.find(
      (node) => node.id === "condition",
    );
    assert.strictEqual(recoveryNode?.type, "jobnet");
    assert.deepStrictEqual(
      recoveryNode?.metadata.semanticDiffHighlight,
      highlight,
    );
    assert.strictEqual(conditionNode?.type, "condition");
    assert.deepStrictEqual(
      result.constraints.nodePlacements.find(
        (placement) => placement.unitId === "condition",
      ),
      {
        unitId: "condition",
        parentAnchorUnitId: "child",
        kind: "nested_condition",
      },
    );
    assert.ok(
      result.graph.edges.some(
        (edge) =>
          edge.source === "condition" &&
          edge.target === "grand" &&
          edge.type === "con",
      ),
    );
  });

  test("orders expanded sibling sets and their affected scope deterministically", () => {
    const document = createNestedDocument();
    const scope = document.index.unitById.get("scope") as FlowGraphUnitDto;
    const otherLeaf = unit({
      id: "other-leaf",
      unitType: "j",
      absolutePath: "/scope/other/other-leaf",
      depth: 2,
      parentId: "other",
    });
    const other = unit({
      id: "other",
      unitType: "n",
      absolutePath: "/scope/other",
      depth: 1,
      parentId: "scope",
      layout: { h: 560, v: 144 },
      children: [otherLeaf],
    });
    const upperLeft = unit({
      id: "upper-left",
      unitType: "j",
      absolutePath: "/scope/upper-left",
      depth: 1,
      parentId: "scope",
      layout: { h: 80, v: 48 },
    });
    const below = unit({
      id: "below",
      unitType: "j",
      absolutePath: "/scope/below",
      depth: 1,
      parentId: "scope",
      layout: { h: 240, v: 240 },
    });
    const lowerRight = unit({
      id: "lower-right",
      unitType: "j",
      absolutePath: "/scope/lower-right",
      depth: 1,
      parentId: "scope",
      layout: { h: 720, v: 240 },
    });
    scope.children.push(other, upperLeft, below, lowerRight);
    const updatedDocument = validatedDocument(document.document.rootUnits);
    const result = buildExpandedFlowGraphResult({
      document: updatedDocument,
      activeScopeUnitId: "scope",
      requestedExpandedUnitIds: ["other", "child"],
    });

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.deepStrictEqual(result.constraints.realizedExpandedUnitIds, [
      "child",
      "other",
    ]);
    assert.deepStrictEqual(
      result.constraints.expandedUnits.map((constraint) => ({
        unitId: constraint.unitId,
        affectedSiblingUnitIds: constraint.affectedSiblingUnitIds,
        horizontalAffectedSiblingUnitIds:
          constraint.horizontalAffectedSiblingUnitIds,
        verticalAffectedSiblingUnitIds:
          constraint.verticalAffectedSiblingUnitIds,
      })),
      [
        {
          unitId: "child",
          affectedSiblingUnitIds: ["sibling", "other", "below", "lower-right"],
          horizontalAffectedSiblingUnitIds: ["sibling", "other", "lower-right"],
          verticalAffectedSiblingUnitIds: ["below", "lower-right"],
        },
        {
          unitId: "other",
          affectedSiblingUnitIds: ["lower-right"],
          horizontalAffectedSiblingUnitIds: ["lower-right"],
          verticalAffectedSiblingUnitIds: ["lower-right"],
        },
      ],
    );
  });

  test("returns unavailable for a missing or invalid active scope", () => {
    const document = createNestedDocument();
    for (const activeScopeUnitId of ["missing", "sibling"]) {
      const result = buildExpandedFlowGraphResult({
        document,
        activeScopeUnitId,
        requestedExpandedUnitIds: [],
      });
      assert.strictEqual(result.status, "unavailable");
    }
  });

  test("handles a representative deep expanded hierarchy iteratively", () => {
    const depth = 400;
    const units: FlowGraphUnitDto[] = [];
    for (let index = 0; index < depth; index++) {
      units.push(
        unit({
          id: `net-${index}`,
          unitType: "n",
          absolutePath: `/net-${index}`,
          depth: index,
          parentId: index === 0 ? undefined : `net-${index - 1}`,
        }),
      );
      if (index > 0) units[index - 1].children = [units[index]];
    }
    const document = validatedDocument([units[0]]);
    const result = buildExpandedFlowGraphResult({
      document,
      activeScopeUnitId: "net-0",
      requestedExpandedUnitIds: units.slice(1).map((item) => item.id),
    });

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.strictEqual(result.constraints.realizedExpandedUnitIds.length, 399);
    assert.strictEqual(result.graph.nodes.length, 400);
    assert.deepStrictEqual(
      result.constraints.expandedUnits.at(-1)?.subtreeRange,
      { start: 399, end: 400 },
    );
  });

  test("keeps a bounded large scope deterministic without partial content", () => {
    const children = Array.from({ length: 500 }, (_, index) =>
      unit({
        id: `job-${index}`,
        unitType: "j",
        absolutePath: `/scope/job-${index}`,
        depth: 1,
        parentId: "scope",
        layout: { h: index * 16, v: 144 },
      }),
    );
    const document = validatedDocument([
      unit({
        id: "scope",
        unitType: "n",
        absolutePath: "/scope",
        depth: 0,
        children,
      }),
    ]);

    const first = buildExpandedFlowGraphResult({
      document,
      activeScopeUnitId: "scope",
      requestedExpandedUnitIds: [],
    });
    const second = buildExpandedFlowGraphResult({
      document,
      activeScopeUnitId: "scope",
      requestedExpandedUnitIds: [],
    });

    assert.strictEqual(first.status, "available");
    assert.strictEqual(second.status, "available");
    assert.deepStrictEqual(first, second);
    if (first.status !== "available") return;
    assert.strictEqual(first.graph.nodes.length, 501);
    assert.strictEqual(first.constraints.containmentOrderUnitIds.length, 501);
    assert.strictEqual(first.graph.nodes[0].id, "job-0");
    assert.strictEqual(first.graph.nodes.at(-1)?.id, "scope");
    assert.deepStrictEqual(first.issues, []);
  });
});
