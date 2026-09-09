import * as assert from "assert";
import {
  buildFlowGraphFromInput,
  flowGraphEdgeId,
  FlowGraphInput,
} from "../../application/flow-graph/buildFlowGraphCore";

const input: FlowGraphInput = {
  currentNode: {
    id: "jobnet",
    label: "Root Jobnet",
    absolutePath: "/root/jobnet",
    ty: "n",
    comment: "current",
    depth: 1,
    h: 0,
    v: 0,
    isRootJobnet: true,
    hasSchedule: true,
    hasWaitedFor: false,
  },
  ancestorNodes: [
    {
      id: "group",
      label: "Group",
      absolutePath: "/root",
      ty: "g",
      gty: "n",
      comment: "ancestor",
      depth: 0,
      h: 0,
      v: 0,
      isRootJobnet: false,
      hasSchedule: false,
      hasWaitedFor: false,
    },
  ],
  conditionNode: {
    id: "condition",
    label: ".CONDITION",
    absolutePath: "/root/jobnet/.CONDITION",
    ty: "rc",
    comment: "condition",
    depth: 2,
    h: 0,
    v: 0,
    isRootJobnet: false,
    hasSchedule: false,
    hasWaitedFor: false,
  },
  childNodes: [
    {
      id: "job-a",
      label: "Job A",
      absolutePath: "/root/jobnet/Job A",
      ty: "j",
      comment: "job",
      depth: 2,
      h: 240,
      v: 144,
      isRootJobnet: false,
      hasSchedule: false,
      hasWaitedFor: true,
    },
    {
      id: "job-b",
      label: "Job B",
      absolutePath: "/root/jobnet/Job B",
      ty: "qj",
      comment: "job",
      depth: 2,
      h: 400,
      v: 144,
      isRootJobnet: false,
      hasSchedule: false,
      hasWaitedFor: false,
    },
  ],
  edges: [
    { source: "job-a", target: "job-b", type: "seq" },
    { source: "condition", target: "job-a", type: "con" },
  ],
};

suite("Build Flow Graph", () => {
  test("creates deterministic node and edge DTOs", () => {
    const graph = buildFlowGraphFromInput(input);

    assert.deepStrictEqual(
      graph.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        isAncestor: node.metadata.isAncestor,
        isCurrent: node.metadata.isCurrent,
        layout: node.metadata.layout.kind,
      })),
      [
        {
          id: "job-a",
          type: "job",
          isAncestor: false,
          isCurrent: false,
          layout: "grid",
        },
        {
          id: "job-b",
          type: "job",
          isAncestor: false,
          isCurrent: false,
          layout: "grid",
        },
        {
          id: "group",
          type: "jobgroup",
          isAncestor: true,
          isCurrent: false,
          layout: "ancestor",
        },
        {
          id: "jobnet",
          type: "jobnet",
          isAncestor: true,
          isCurrent: true,
          layout: "ancestor",
        },
        {
          id: "condition",
          type: "condition",
          isAncestor: true,
          isCurrent: false,
          layout: "ancestor",
        },
      ],
    );
    assert.deepStrictEqual(graph.edges, [
      {
        ...input.edges[0],
        id: flowGraphEdgeId(input.edges[0], 0),
        semanticDiffHighlight: undefined,
      },
      {
        ...input.edges[1],
        id: flowGraphEdgeId(input.edges[1], 0),
        semanticDiffHighlight: undefined,
      },
    ]);
  });

  test("carries optional semantic diff highlight metadata", () => {
    const graph = buildFlowGraphFromInput({
      ...input,
      semanticDiffHighlights: {
        nodes: new Map([
          [
            "job-a",
            {
              kind: "confirmation-required",
              changeIds: [],
              confirmationIds: ["confirm:job-a"],
            },
          ],
        ]),
        edges: new Map([
          [
            flowGraphEdgeId(input.edges[0]),
            {
              kind: "changed",
              changeIds: ["relation:job-a->job-b"],
              confirmationIds: [],
            },
          ],
        ]),
      },
    });

    assert.deepStrictEqual(
      graph.nodes.find((node) => node.id === "job-a")?.metadata
        .semanticDiffHighlight,
      {
        kind: "confirmation-required",
        changeIds: [],
        confirmationIds: ["confirm:job-a"],
      },
    );
    assert.deepStrictEqual(graph.edges[0].semanticDiffHighlight, {
      kind: "changed",
      changeIds: ["relation:job-a->job-b"],
      confirmationIds: [],
    });
  });

  test("uses collision-free IDs for parallel and duplicate relation occurrences", () => {
    const edge = { source: "a|", target: "b:😀", type: "seq" as const };
    assert.notStrictEqual(flowGraphEdgeId(edge, 0), flowGraphEdgeId(edge, 1));
    assert.notStrictEqual(
      flowGraphEdgeId(edge, 0),
      flowGraphEdgeId({ ...edge, type: "con" }, 0),
    );
    assert.notStrictEqual(
      flowGraphEdgeId({ source: "a", target: "b:😀", type: "seq" }, 0),
      flowGraphEdgeId({ source: "a|", target: "b", type: "seq" }, 0),
    );

    const duplicateGraph = buildFlowGraphFromInput({
      ...input,
      edges: [edge, edge, { ...edge, type: "con" }],
      semanticDiffHighlights: {
        nodes: new Map(),
        edges: new Map([
          [
            flowGraphEdgeId(edge, 0),
            { kind: "added", changeIds: ["change:0"], confirmationIds: [] },
          ],
          [
            flowGraphEdgeId(edge, 1),
            { kind: "added", changeIds: ["change:1"], confirmationIds: [] },
          ],
        ]),
      },
    });
    assert.deepStrictEqual(
      duplicateGraph.edges.map(({ id, semanticDiffHighlight }) => ({
        id,
        kind: semanticDiffHighlight?.kind,
      })),
      [
        { id: flowGraphEdgeId(edge, 0), kind: "added" },
        { id: flowGraphEdgeId(edge, 1), kind: "added" },
        { id: flowGraphEdgeId({ ...edge, type: "con" }, 0), kind: undefined },
      ],
    );
  });
});
