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
    );

    assert.strictEqual(nodes[0].data.unitId, "/root/jobnet");
    assert.strictEqual(
      nodes[0].data.unitDefinition.absolutePath,
      "/root/jobnet",
    );
    assert.strictEqual(nodes[0].data.isCurrent, true);
    assert.strictEqual(nodes[0].data.isAncestor, true);
    assert.strictEqual(nodes[0].data.isRootJobnet, true);
    assert.strictEqual(nodes[1].data.unitId, "/root/jobnet/job-a");
    assert.strictEqual(nodes[1].data.hasWaitedFor, true);
    assert.strictEqual(edges[0].source, "/root/jobnet");
    assert.strictEqual(edges[0].target, "/root/jobnet/job-a");
  });
});
