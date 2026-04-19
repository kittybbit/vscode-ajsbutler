import * as assert from "assert";
import { createTheme } from "@mui/material/styles";
import { FlowGraphDto } from "../../application/flow-graph/buildFlowGraphCore";
import { UnitDefinitionDialogDto } from "../../application/unit-definition/buildUnitDefinition";
import { createReactFlowData } from "../../ui-component/editor/ajsFlow/flowGraphView";

suite("Flow Graph View", () => {
  test("maps flow graph DTOs without requiring UnitEntity instances", () => {
    const graph: FlowGraphDto = {
      nodes: [
        {
          id: "/root/jobnet",
          label: "jobnet",
          type: "jobnet",
          metadata: {
            absolutePath: "/root/jobnet",
            ty: "n",
            comment: "current",
            isAncestor: true,
            isCurrent: true,
            isRootJobnet: true,
            hasSchedule: true,
            hasWaitedFor: false,
            layout: {
              kind: "ancestor",
              depth: 1,
            },
          },
        },
        {
          id: "/root/jobnet/job-a",
          label: "job-a",
          type: "job",
          metadata: {
            absolutePath: "/root/jobnet/job-a",
            ty: "j",
            comment: "child",
            isAncestor: false,
            isCurrent: false,
            isRootJobnet: false,
            hasSchedule: false,
            hasWaitedFor: true,
            layout: {
              kind: "grid",
              h: 240,
              v: 144,
            },
          },
        },
        {
          id: "/root/jobnet/child-net",
          label: "child-net",
          type: "jobnet",
          metadata: {
            absolutePath: "/root/jobnet/child-net",
            ty: "n",
            comment: "nested child",
            isAncestor: false,
            isCurrent: false,
            isRootJobnet: false,
            hasSchedule: false,
            hasWaitedFor: false,
            layout: {
              kind: "grid",
              h: 400,
              v: 144,
            },
          },
        },
        {
          id: "/root/jobnet/child-net/grand-net",
          label: "grand-net",
          type: "jobnet",
          metadata: {
            absolutePath: "/root/jobnet/child-net/grand-net",
            ty: "n",
            comment: "nested grandchild",
            isAncestor: false,
            isCurrent: false,
            isRootJobnet: false,
            hasSchedule: false,
            hasWaitedFor: false,
            layout: {
              kind: "grid",
              h: 560,
              v: 240,
            },
          },
        },
      ],
      edges: [
        {
          source: "/root/jobnet",
          target: "/root/jobnet/job-a",
          type: "seq",
        },
      ],
    };
    const unitDefinitionByPath = new Map<string, UnitDefinitionDialogDto>([
      [
        "/root/jobnet",
        {
          absolutePath: "/root/jobnet",
          rawData: "ty=n",
          commands: [],
        },
      ],
      [
        "/root/jobnet/job-a",
        {
          absolutePath: "/root/jobnet/job-a",
          rawData: "ty=j",
          commands: [],
        },
      ],
      [
        "/root/jobnet/child-net",
        {
          absolutePath: "/root/jobnet/child-net",
          rawData: "ty=n",
          commands: [],
        },
      ],
      [
        "/root/jobnet/child-net/grand-net",
        {
          absolutePath: "/root/jobnet/child-net/grand-net",
          rawData: "ty=n",
          commands: [],
        },
      ],
    ]);

    const { nodes, edges } = createReactFlowData(
      graph,
      unitDefinitionByPath,
      createTheme(),
      {
        dialogData: undefined,
        setDialogData: () => undefined,
      },
      {
        currentUnitId: "/root/jobnet",
        setCurrentUnitId: () => undefined,
      },
      {
        nodeDecorations: new Map(),
        unitById: new Map([
          [
            "/root/jobnet/child-net",
            {
              id: "/root/jobnet/child-net",
              name: "child-net",
              unitAttribute: "",
              unitType: "n",
              absolutePath: "/root/jobnet/child-net",
              depth: 2,
              parentId: "/root/jobnet",
              isRoot: false,
              isRootJobnet: false,
              hasSchedule: false,
              hasWaitedFor: false,
              layout: { h: 400, v: 144 },
              parameters: [],
              relations: [],
              children: [
                {
                  id: "/root/jobnet/child-net/grand-net",
                  name: "grand-net",
                  unitAttribute: "",
                  unitType: "n",
                  absolutePath: "/root/jobnet/child-net/grand-net",
                  depth: 3,
                  parentId: "/root/jobnet/child-net",
                  isRoot: false,
                  isRootJobnet: false,
                  hasSchedule: false,
                  hasWaitedFor: false,
                  layout: { h: 560, v: 240 },
                  parameters: [],
                  relations: [],
                  children: [
                    {
                      id: "/root/jobnet/child-net/grand-net/leaf",
                      name: "leaf",
                      unitAttribute: "",
                      unitType: "j",
                      absolutePath: "/root/jobnet/child-net/grand-net/leaf",
                      depth: 4,
                      parentId: "/root/jobnet/child-net/grand-net",
                      isRoot: false,
                      isRootJobnet: false,
                      hasSchedule: false,
                      hasWaitedFor: false,
                      layout: { h: 720, v: 336 },
                      parameters: [],
                      relations: [],
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
          [
            "/root/jobnet/child-net/grand-net",
            {
              id: "/root/jobnet/child-net/grand-net",
              name: "grand-net",
              unitAttribute: "",
              unitType: "n",
              absolutePath: "/root/jobnet/child-net/grand-net",
              depth: 3,
              parentId: "/root/jobnet/child-net",
              isRoot: false,
              isRootJobnet: false,
              hasSchedule: false,
              hasWaitedFor: false,
              layout: { h: 560, v: 240 },
              parameters: [],
              relations: [],
              children: [
                {
                  id: "/root/jobnet/child-net/grand-net/leaf",
                  name: "leaf",
                  unitAttribute: "",
                  unitType: "j",
                  absolutePath: "/root/jobnet/child-net/grand-net/leaf",
                  depth: 4,
                  parentId: "/root/jobnet/child-net/grand-net",
                  isRoot: false,
                  isRootJobnet: false,
                  hasSchedule: false,
                  hasWaitedFor: false,
                  layout: { h: 720, v: 336 },
                  parameters: [],
                  relations: [],
                  children: [],
                },
              ],
            },
          ],
        ]),
        nestedExpansionState: {
          expandedUnitIds: new Set<string>(),
          toggleExpandedUnitId: () => undefined,
        },
        positionOverrides: new Map(),
      },
    );

    assert.strictEqual(nodes[0].data.unitId, "/root/jobnet");
    assert.strictEqual(
      nodes[0].data.unitDefinition.absolutePath,
      "/root/jobnet",
    );
    assert.strictEqual(nodes[0].data.isCurrent, true);
    assert.strictEqual(nodes[0].data.isAncestor, true);
    assert.strictEqual(nodes[0].data.isRootJobnet, true);
    assert.strictEqual(nodes[0].data.canExpandNested, false);
    assert.strictEqual(nodes[1].data.unitId, "/root/jobnet/job-a");
    assert.strictEqual(nodes[1].data.hasWaitedFor, true);
    assert.strictEqual(nodes[2].data.canExpandNested, true);
    assert.strictEqual(nodes[3].data.canExpandNested, true);
    assert.strictEqual(edges[0].source, "/root/jobnet");
    assert.strictEqual(edges[0].target, "/root/jobnet/job-a");
  });
});
