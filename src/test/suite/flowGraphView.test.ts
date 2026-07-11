import * as assert from "assert";
import { createTheme } from "@mui/material/styles";
import type { AjsUnit } from "../../domain/models/ajs/AjsDocument";
import type { FlowGraphDto } from "../../application/flow-graph/buildFlowGraphCore";
import type { UnitDefinitionDialogDto } from "../../application/unit-definition/buildUnitDefinition";
import { createReactFlowData } from "../../presentation/webview/editor/ajsFlow/flowGraphView";
import { applyHoveredUnitToFlowNodes } from "../../presentation/webview/editor/ajsFlow/flowGraphHover";

type TestUnitParams = Pick<
  AjsUnit,
  "id" | "name" | "unitType" | "absolutePath" | "depth" | "parentId" | "layout"
> & {
  children?: AjsUnit[];
};

const createTestUnit = ({
  children = [],
  ...params
}: TestUnitParams): AjsUnit => ({
  unitAttribute: "",
  isRoot: false,
  isRootJobnet: false,
  hasSchedule: false,
  hasWaitedFor: false,
  parameters: [],
  relations: [],
  children,
  ...params,
});

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
            semanticDiffHighlight: {
              kind: "confirmation-required",
              changeIds: [],
              confirmationIds: ["confirm:job-a"],
            },
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
            ty: "rn",
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
          semanticDiffHighlight: {
            kind: "changed",
            changeIds: ["relation:added"],
            confirmationIds: [],
          },
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
          commandBuilders: [],
        },
      ],
      [
        "/root/jobnet/job-a",
        {
          absolutePath: "/root/jobnet/job-a",
          rawData: "ty=j",
          commands: [],
          commandBuilders: [],
        },
      ],
      [
        "/root/jobnet/child-net",
        {
          absolutePath: "/root/jobnet/child-net",
          rawData: "ty=n",
          commands: [],
          commandBuilders: [],
        },
      ],
      [
        "/root/jobnet/child-net/grand-net",
        {
          absolutePath: "/root/jobnet/child-net/grand-net",
          rawData: "ty=n",
          commands: [],
          commandBuilders: [],
        },
      ],
    ]);
    const leafUnit = createTestUnit({
      id: "/root/jobnet/child-net/grand-net/leaf",
      name: "leaf",
      unitType: "j",
      absolutePath: "/root/jobnet/child-net/grand-net/leaf",
      depth: 4,
      parentId: "/root/jobnet/child-net/grand-net",
      layout: { h: 720, v: 336 },
    });
    const grandNetUnit = createTestUnit({
      id: "/root/jobnet/child-net/grand-net",
      name: "grand-net",
      unitType: "n",
      absolutePath: "/root/jobnet/child-net/grand-net",
      depth: 3,
      parentId: "/root/jobnet/child-net",
      layout: { h: 560, v: 240 },
      children: [leafUnit],
    });
    const childNetUnit = createTestUnit({
      id: "/root/jobnet/child-net",
      name: "child-net",
      unitType: "rn",
      absolutePath: "/root/jobnet/child-net",
      depth: 2,
      parentId: "/root/jobnet",
      layout: { h: 400, v: 144 },
      children: [grandNetUnit],
    });

    const { nodes, edges } = createReactFlowData({
      graph,
      unitDefinitionByPath,
      theme: createTheme(),
      dialogDataState: {
        dialogData: undefined,
        setDialogData: () => undefined,
      },
      currentUnitIdState: {
        currentUnitId: "/root/jobnet",
        setCurrentUnitId: () => undefined,
      },
      options: {
        searchMatchedUnitIds: new Set([
          "/root/jobnet/child-net",
          "/root/jobnet/child-net/grand-net",
        ]),
        searchedUnitId: "/root/jobnet/child-net/grand-net",
        selectedUnitId: "/root/jobnet/child-net",
        unitById: new Map([
          [childNetUnit.id, childNetUnit],
          [grandNetUnit.id, grandNetUnit],
        ]),
        nestedExpansionState: {
          expandedUnitIds: new Set<string>(),
          toggleExpandedUnitId: () => undefined,
        },
        nodeDecorations: new Map([
          [
            "/root/jobnet/child-net",
            {
              panelOffsetXPx: -24,
              panelOffsetYPx: -16,
              panelWidthPx: 512,
              panelHeightPx: 384,
            },
          ],
        ]),
        positionOverrides: new Map([
          ["/root/jobnet/child-net", { x: 400, y: 144 }],
        ]),
      },
    });

    assert.strictEqual(nodes[0].data.unitId, "/root/jobnet");
    assert.strictEqual(
      nodes[0].data.unitDefinition.absolutePath,
      "/root/jobnet",
    );
    assert.strictEqual(nodes[0].data.isCurrent, true);
    assert.strictEqual(nodes[0].data.isAncestor, true);
    assert.strictEqual(nodes[0].data.isRootJobnet, true);
    assert.strictEqual(nodes[0].data.canExpandNested, false);
    assert.strictEqual(nodes[0].initialWidth, 168);
    assert.strictEqual(nodes[0].initialHeight, 116);
    assert.strictEqual(nodes[0].data.isSearchMatch, false);
    const searchMatchNode = nodes.find(
      (node) => node.id === "/root/jobnet/child-net/grand-net",
    );
    assert.ok(searchMatchNode);
    assert.strictEqual(searchMatchNode.data.isSearchMatch, true);
    assert.strictEqual(searchMatchNode.data.isCurrentSearchResult, true);
    assert.strictEqual(searchMatchNode.data.isSelected, false);
    assert.strictEqual(searchMatchNode.selected, false);
    const anotherSearchMatchNode = nodes.find(
      (node) => node.id === "/root/jobnet/child-net",
    );
    assert.ok(anotherSearchMatchNode);
    assert.strictEqual(anotherSearchMatchNode.data.isSearchMatch, true);
    assert.strictEqual(
      anotherSearchMatchNode.data.isCurrentSearchResult,
      false,
    );
    assert.strictEqual(anotherSearchMatchNode.data.isSelected, true);
    assert.strictEqual(anotherSearchMatchNode.selected, true);
    const hoveredNodes = applyHoveredUnitToFlowNodes(
      nodes,
      "/root/jobnet/child-net",
    );
    const hoveredSearchMatchNode = hoveredNodes.find(
      (node) => node.id === "/root/jobnet/child-net",
    );
    assert.ok(hoveredSearchMatchNode);
    assert.strictEqual(hoveredSearchMatchNode.data.isHovered, true);
    assert.strictEqual(hoveredSearchMatchNode.data.isSelected, true);
    assert.notStrictEqual(hoveredSearchMatchNode, anotherSearchMatchNode);
    assert.strictEqual(hoveredNodes[0], nodes[0]);
    assert.strictEqual(nodes[1].data.unitId, "/root/jobnet/job-a");
    assert.strictEqual(nodes[1].data.hasWaitedFor, true);
    assert.deepStrictEqual(nodes[1].data.semanticDiffHighlight, {
      kind: "confirmation-required",
      changeIds: [],
      confirmationIds: ["confirm:job-a"],
    });
    assert.strictEqual(nodes[2].data.canExpandNested, true);
    assert.strictEqual(nodes[3].data.canExpandNested, true);
    const childNetBoundsNode = nodes.find(
      (node) => node.id === "/root/jobnet/child-net::nested-panel-bounds",
    );
    assert.ok(childNetBoundsNode);
    assert.strictEqual(childNetBoundsNode.type, "group");
    assert.deepStrictEqual(childNetBoundsNode.position, { x: 376, y: 128 });
    assert.strictEqual(childNetBoundsNode.width, 512);
    assert.strictEqual(childNetBoundsNode.height, 384);
    assert.strictEqual(childNetBoundsNode.initialWidth, 512);
    assert.strictEqual(childNetBoundsNode.initialHeight, 384);
    assert.strictEqual(childNetBoundsNode.style?.width, 512);
    assert.strictEqual(childNetBoundsNode.style?.height, 384);
    assert.strictEqual(childNetBoundsNode.selectable, false);
    assert.strictEqual(childNetBoundsNode.draggable, false);
    assert.strictEqual(childNetBoundsNode.connectable, false);
    assert.strictEqual(edges[0].source, "/root/jobnet");
    assert.strictEqual(edges[0].target, "/root/jobnet/job-a");
    assert.strictEqual(edges[0].style?.strokeWidth, 3);
    assert.deepStrictEqual(edges[0].data, {
      semanticDiffHighlight: {
        kind: "changed",
        changeIds: ["relation:added"],
        confirmationIds: [],
      },
    });
  });
});
