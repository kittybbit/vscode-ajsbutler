import * as assert from "assert";
import {
  buildFlowGraphFromInput,
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
    assert.deepStrictEqual(graph.edges, input.edges);
  });
});
