import * as assert from "assert";
import { readFileSync } from "fs";
import { join } from "path";
import type { AjsUnit } from "../../domain/models/ajs/AjsDocument";
import { parseAjs } from "../support/parseAjs";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { buildExpandedFlowGraph } from "../../presentation/webview/editor/ajsFlow/buildExpandedFlowGraph";
import { createFlowGraphMetrics } from "../../presentation/webview/editor/ajsFlow/flowGraphPosition";

const assertClose = (actual: number, expected: number): void => {
  assert.ok(Math.abs(actual - expected) < 0.000001, `${actual} ~= ${expected}`);
};

const readSample = (name: string): string =>
  readFileSync(join(__dirname, "../../../sample", name), "utf8");

const tryFindUnitByName = (
  unit: AjsUnit,
  name: string,
): AjsUnit | undefined => {
  if (unit.name === name) {
    return unit;
  }
  for (const child of unit.children) {
    const found = tryFindUnitByName(child, name);
    if (found) {
      return found;
    }
  }
  return undefined;
};

const findUnitByName = (unit: AjsUnit, name: string): AjsUnit => {
  const found = tryFindUnitByName(unit, name);
  if (found) {
    return found;
  }
  throw new Error(`Unit not found: ${name}`);
};

const toEdgeLabel = (edge: {
  source: string;
  target: string;
  type: string;
}): string =>
  `${edge.source.split("/").pop()}->${edge.target.split("/").pop()}:${
    edge.type
  }`;

const toRoundedDecoration = (
  id: string,
  decoration: {
    panelOffsetXPx: number;
    panelOffsetYPx: number;
    panelWidthPx: number;
    panelHeightPx: number;
  },
) => ({
  id: id.split("/").pop() ?? id,
  panelOffsetXPx: Math.round(decoration.panelOffsetXPx),
  panelOffsetYPx: Math.round(decoration.panelOffsetYPx),
  panelWidthPx: Math.round(decoration.panelWidthPx),
  panelHeightPx: Math.round(decoration.panelHeightPx),
});

const nestedDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=child-net,n,+240+144;
    el=job-b,j,+400+144;
    ar=(f=child-net,t=job-b);
    unit=child-net,,jp1admin,;
    {
      ty=n;
      el=grand-net,n,+240+144;
      el=nested-job,j,+400+144;
      ar=(f=grand-net,t=nested-job);
      unit=grand-net,,jp1admin,;
      {
        ty=n;
        el=leaf,j,+240+144;
        unit=leaf,,jp1admin,;
        {
          ty=j;
        }
      }
      unit=nested-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=job-b,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

const overlappingSiblingDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=child-net,n,+240+144;
    el=flwj,j,+80+144;
    el=orj,j,+400+240;
    el=ntwj,j,+80+336;
    ar=(f=flwj,t=orj);
    ar=(f=ntwj,t=orj);
    unit=child-net,,jp1admin,;
    {
      ty=n;
      el=grand-net,n,+240+144;
      el=nested-job,j,+400+144;
      ar=(f=grand-net,t=nested-job);
      unit=grand-net,,jp1admin,;
      {
        ty=n;
      }
      unit=nested-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=flwj,,jp1admin,;
    {
      ty=j;
    }
    unit=orj,,jp1admin,;
    {
      ty=j;
    }
    unit=ntwj,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

const deepNestedJobnetDefinition = `
unit=deep_jobnet_root,,jp1admin,;
{
  ty=g;
  cm="deep jobnet root group";
  el=jn_lv1,n,+0+0;
  unit=jn_lv1,,jp1admin,;
  {
    ty=n;
    cm="jobnet level 1";
    sz=6x3;
    el=jn_lv2,n,+240+144;
    unit=jn_lv2,,jp1admin,;
    {
      ty=n;
      cm="jobnet level 2";
      sz=6x3;
      el=jn_lv3,n,+240+144;
      unit=jn_lv3,,jp1admin,;
      {
        ty=n;
        cm="jobnet level 3";
        sz=6x3;
        el=jn_lv4,n,+240+144;
        unit=jn_lv4,,jp1admin,;
        {
          ty=n;
          cm="jobnet level 4";
          sz=6x3;
          el=jn_lv5,n,+240+144;
          unit=jn_lv5,,jp1admin,;
          {
            ty=n;
            cm="jobnet level 5";
            sz=6x3;
            el=leaf_job,j,+240+144;
            unit=leaf_job,,jp1admin,;
            {
              ty=j;
              sc="echo";
              prm="leaf";
              tho=0;
            }
          }
        }
      }
    }
  }
}
`;

const deepNestedWithSiblingDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=child-net,n,+240+144;
    el=sibling-job,j,+880+144;
    unit=child-net,,jp1admin,;
    {
      ty=n;
      el=grand-net,n,+240+144;
      unit=grand-net,,jp1admin,;
      {
        ty=n;
        el=great-net,n,+240+144;
        unit=great-net,,jp1admin,;
        {
          ty=n;
          el=leaf-job,j,+240+144;
          unit=leaf-job,,jp1admin,;
          {
            ty=j;
          }
        }
      }
    }
    unit=sibling-job,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

const recoveryJobnetDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=recovery-net,rn,+240+144;
    unit=recovery-net,,jp1admin,;
    {
      ty=rn;
      el=leaf-job,j,+240+144;
      unit=leaf-job,,jp1admin,;
      {
        ty=j;
      }
    }
  }
}
`;

const siblingExpandedJobnetsDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=left-net,n,+240+144;
    el=right-net,n,+560+144;
    unit=left-net,,jp1admin,;
    {
      ty=n;
      el=left-grand,n,+240+144;
      el=left-job,j,+560+144;
      ar=(f=left-grand,t=left-job);
      unit=left-grand,,jp1admin,;
      {
        ty=n;
      }
      unit=left-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=right-net,,jp1admin,;
    {
      ty=n;
      el=right-grand,n,+240+144;
      el=right-job,j,+560+144;
      ar=(f=right-grand,t=right-job);
      unit=right-grand,,jp1admin,;
      {
        ty=n;
      }
      unit=right-job,,jp1admin,;
      {
        ty=j;
      }
    }
  }
}
`;

const parentRowPropagationDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=parent-net,n,+240+144;
    el=sibling-right,j,+880+144;
    unit=parent-net,,jp1admin,;
    {
      ty=n;
      el=child-net,n,+240+144;
      unit=child-net,,jp1admin,;
      {
        ty=n;
        el=child-job,j,+560+144;
        unit=child-job,,jp1admin,;
        {
          ty=j;
        }
      }
    }
    unit=sibling-right,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

const upperPanelCoversLowerWidthDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=upper-net,n,+240+144;
    el=lower-net,n,+240+432;
    el=right-lower,j,+880+432;
    unit=upper-net,,jp1admin,;
    {
      ty=n;
      el=upper-wide-job,j,+880+144;
      unit=upper-wide-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=lower-net,,jp1admin,;
    {
      ty=n;
      el=lower-job,j,+560+144;
      unit=lower-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=right-lower,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

const lowerPanelExceedsUpperWidthDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=upper-net,n,+240+144;
    el=lower-net,n,+240+432;
    el=right-lower,j,+880+432;
    unit=upper-net,,jp1admin,;
    {
      ty=n;
      el=upper-wide-job,j,+560+144;
      unit=upper-wide-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=lower-net,,jp1admin,;
    {
      ty=n;
      el=lower-wide-job,j,+880+144;
      unit=lower-wide-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=right-lower,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

const upperPanelIntrudesLowerPanelDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=upper-net,n,+240+144;
    el=lower-net,n,+240+432;
    unit=upper-net,,jp1admin,;
    {
      ty=n;
      el=upper-deep-job,j,+240+432;
      unit=upper-deep-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=lower-net,,jp1admin,;
    {
      ty=n;
      el=lower-job,j,+240+144;
      unit=lower-job,,jp1admin,;
      {
        ty=j;
      }
    }
  }
}
`;

const alreadyOffsetTargetDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=upper-net,n,+240+144;
    el=lower-net,n,+560+432;
    el=target-job,j,+880+720;
    unit=upper-net,,jp1admin,;
    {
      ty=n;
      el=upper-deep-job,j,+240+720;
      unit=upper-deep-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=lower-net,,jp1admin,;
    {
      ty=n;
      el=lower-job,j,+240+144;
      unit=lower-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=target-job,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

const verticallyOffsetTargetNeedsHorizontalOffsetDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=upper-net,n,+880+144;
    el=lower-net,n,+560+432;
    el=target-job,j,+880+720;
    unit=upper-net,,jp1admin,;
    {
      ty=n;
      el=upper-deep-job,j,+240+720;
      unit=upper-deep-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=lower-net,,jp1admin,;
    {
      ty=n;
      el=lower-wide-job,j,+880+144;
      unit=lower-wide-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=target-job,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

const nestedExpansionExceedsUpperWidthDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=upper-net,n,+240+144;
    el=lower-net,n,+240+432;
    el=right-lower,j,+880+432;
    unit=upper-net,,jp1admin,;
    {
      ty=n;
      el=upper-wide-job,j,+560+144;
      unit=upper-wide-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=lower-net,,jp1admin,;
    {
      ty=n;
      el=lower-child,n,+240+144;
      unit=lower-child,,jp1admin,;
      {
        ty=n;
        el=lower-wide-job,j,+1120+144;
        unit=lower-wide-job,,jp1admin,;
        {
          ty=j;
        }
      }
    }
    unit=right-lower,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

suite("Build Expanded Flow Graph", () => {
  test("characterizes deep sample graph summaries for collapsed and expanded states", () => {
    const result = parseAjs(readSample("sample_ref_deep_jobnets_utf8"));
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const rootUnit = document.rootUnits[0];
    const currentUnit = findUnitByName(rootUnit, "top_main");
    const expandedUnitNames = [
      "branch_alpha",
      "alpha_nested_1",
      "branch_beta",
      "branch_gamma",
    ];
    const expandedUnitIds = new Set(
      expandedUnitNames.map((name) => findUnitByName(rootUnit, name).id),
    );

    const collapsed = buildExpandedFlowGraph({
      document,
      currentUnitId: currentUnit.id,
      expandedUnitIds: new Set<string>(),
      basePx: 16,
    });
    const expanded = buildExpandedFlowGraph({
      document,
      currentUnitId: currentUnit.id,
      expandedUnitIds,
      basePx: 16,
    });

    assert.ok(collapsed.graph);
    assert.ok(expanded.graph);
    assert.deepStrictEqual(
      {
        nodeCount: collapsed.graph.nodes.length,
        edgeCount: collapsed.graph.edges.length,
        positionCount: collapsed.positionOverrides.size,
        decorationCount: collapsed.nodeDecorations.size,
        labels: collapsed.graph.nodes.map((node) => node.label).sort(),
        edgeLabels: collapsed.graph.edges.map(toEdgeLabel).sort(),
      },
      {
        nodeCount: 12,
        edgeCount: 10,
        positionCount: 12,
        decorationCount: 0,
        labels: [
          "branch_alpha",
          "branch_beta",
          "branch_delta",
          "branch_gamma",
          "top_left_a",
          "top_left_b",
          "top_main",
          "top_mid_a",
          "top_mid_b",
          "top_right_a",
          "top_right_b",
          "viewer_root",
        ],
        edgeLabels: [
          "branch_alpha->branch_gamma:con",
          "branch_alpha->top_mid_a:seq",
          "branch_beta->branch_delta:con",
          "branch_beta->top_right_a:seq",
          "branch_delta->top_right_b:seq",
          "branch_gamma->top_mid_b:seq",
          "top_left_a->branch_alpha:seq",
          "top_left_b->branch_gamma:seq",
          "top_mid_a->branch_beta:seq",
          "top_mid_b->branch_delta:seq",
        ],
      },
    );

    const expandedEdgeLabels = expanded.graph.edges.map(toEdgeLabel).sort();
    assert.strictEqual(
      new Set(expandedEdgeLabels).size,
      expandedEdgeLabels.length,
    );
    assert.deepStrictEqual(
      {
        nodeCount: expanded.graph.nodes.length,
        edgeCount: expanded.graph.edges.length,
        positionCount: expanded.positionOverrides.size,
        decorationCount: expanded.nodeDecorations.size,
        decorations: Array.from(expanded.nodeDecorations)
          .map(([id, decoration]) => toRoundedDecoration(id, decoration))
          .sort((left, right) => left.id!.localeCompare(right.id!)),
        keyPositions: [
          "branch_alpha",
          "alpha_nested_1",
          "alpha1_deep",
          "top_mid_a",
          "branch_beta",
          "top_right_a",
          "branch_gamma",
          "top_mid_b",
          "branch_delta",
          "top_right_b",
        ].map((name) => [
          name,
          expanded.positionOverrides.get(findUnitByName(rootUnit, name).id),
        ]),
      },
      {
        nodeCount: 31,
        edgeCount: 25,
        positionCount: 31,
        decorationCount: 4,
        decorations: [
          {
            id: "alpha_nested_1",
            panelOffsetXPx: -50,
            panelOffsetYPx: -23,
            panelWidthPx: 1109,
            panelHeightPx: 470,
          },
          {
            id: "branch_alpha",
            panelOffsetXPx: -50,
            panelOffsetYPx: -23,
            panelWidthPx: 2369,
            panelHeightPx: 1195,
          },
          {
            id: "branch_beta",
            panelOffsetXPx: -50,
            panelOffsetYPx: -23,
            panelWidthPx: 1529,
            panelHeightPx: 905,
          },
          {
            id: "branch_gamma",
            panelOffsetXPx: -50,
            panelOffsetYPx: -23,
            panelWidthPx: 1529,
            panelHeightPx: 470,
          },
        ],
        keyPositions: [
          ["branch_alpha", { x: 476, y: 377 }],
          ["alpha_nested_1", { x: 896, y: 667 }],
          ["alpha1_deep", { x: 1316, y: 957 }],
          ["top_mid_a", { x: 2996, y: 377 }],
          ["branch_beta", { x: 3416, y: 377 }],
          ["top_right_a", { x: 5096, y: 377 }],
          ["branch_gamma", { x: 476, y: 1827 }],
          ["top_mid_b", { x: 2996, y: 1827 }],
          ["branch_delta", { x: 3416, y: 1827 }],
          ["top_right_b", { x: 5096, y: 1827 }],
        ],
      },
    );
  });

  test("reveals nested jobnets only after their parent scope is expanded", () => {
    const result = parseAjs(nestedDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const childNetId = document.rootUnits[0].children[0].children[0].id;
    const grandNetId =
      document.rootUnits[0].children[0].children[0].children[0].id;
    const leafId =
      document.rootUnits[0].children[0].children[0].children[0].children[0].id;

    const collapsed = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>(),
      basePx: 16,
    });
    const childExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([childNetId]),
      basePx: 16,
    });
    const grandOnlyExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([grandNetId]),
      basePx: 16,
    });
    const fullyExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([childNetId, grandNetId]),
      basePx: 16,
    });

    assert.ok(collapsed.graph);
    assert.ok(childExpanded.graph);
    assert.ok(grandOnlyExpanded.graph);
    assert.ok(fullyExpanded.graph);

    assert.strictEqual(
      collapsed.graph?.nodes.some((node) => node.id === grandNetId),
      false,
    );
    assert.strictEqual(
      childExpanded.graph?.nodes.some((node) => node.id === grandNetId),
      true,
    );
    assert.strictEqual(
      childExpanded.graph?.nodes.some((node) => node.id === leafId),
      false,
    );
    assert.strictEqual(
      grandOnlyExpanded.graph?.nodes.some((node) => node.id === leafId),
      false,
    );
    assert.strictEqual(
      fullyExpanded.graph?.nodes.some((node) => node.id === leafId),
      true,
    );
    assert.deepStrictEqual(
      childExpanded.graph?.edges.find(
        (edge) =>
          edge.source === grandNetId && edge.target.endsWith("/nested-job"),
      ),
      {
        source: grandNetId,
        target: `${childNetId}/nested-job`,
        type: "seq",
      },
    );
    const childNetPosition = childExpanded.positionOverrides.get(childNetId);
    const siblingPosition = childExpanded.positionOverrides.get(
      `${currentUnitId}/job-b`,
    );
    assert.ok(childNetPosition);
    assert.ok(siblingPosition);
    const metrics = createFlowGraphMetrics(16);
    assert.ok(siblingPosition!.x > childNetPosition!.x + metrics.width);
    const childNetDecoration = childExpanded.nodeDecorations.get(childNetId);
    assert.ok(childNetDecoration);
    assert.ok(childNetDecoration!.panelWidthPx > metrics.width);
    assert.ok(childNetDecoration!.panelHeightPx > metrics.height);
    const fullyExpandedChildDecoration =
      fullyExpanded.nodeDecorations.get(childNetId);
    const fullyExpandedGrandDecoration =
      fullyExpanded.nodeDecorations.get(grandNetId);
    const fullyExpandedChildPosition =
      fullyExpanded.positionOverrides.get(childNetId);
    const fullyExpandedGrandPosition =
      fullyExpanded.positionOverrides.get(grandNetId);
    const fullyExpandedSiblingPosition = fullyExpanded.positionOverrides.get(
      `${currentUnitId}/job-b`,
    );
    assert.ok(fullyExpandedChildDecoration);
    assert.ok(fullyExpandedGrandDecoration);
    assert.ok(fullyExpandedChildPosition);
    assert.ok(fullyExpandedGrandPosition);
    assert.ok(fullyExpandedSiblingPosition);
    const childPanelRight =
      fullyExpandedChildPosition!.x +
      fullyExpandedChildDecoration!.panelOffsetXPx +
      fullyExpandedChildDecoration!.panelWidthPx;
    const grandPanelRight =
      fullyExpandedGrandPosition!.x +
      fullyExpandedGrandDecoration!.panelOffsetXPx +
      fullyExpandedGrandDecoration!.panelWidthPx;
    assert.ok(childPanelRight >= grandPanelRight);
    assert.ok(fullyExpandedSiblingPosition!.x > childPanelRight);
  });

  test("adds offsets by row, column, and lower-right position around the expanded node", () => {
    const result = parseAjs(overlappingSiblingDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const childNetId = document.rootUnits[0].children[0].children[0].id;
    const flwjId = document.rootUnits[0].children[0].children[1].id;
    const orjId = document.rootUnits[0].children[0].children[2].id;
    const ntwjId = document.rootUnits[0].children[0].children[3].id;

    const collapsed = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>(),
      basePx: 16,
    });
    const expanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([childNetId]),
      basePx: 16,
    });

    const decoration = expanded.nodeDecorations.get(childNetId);
    const orjCollapsed = collapsed.positionOverrides.get(orjId);
    const orjExpanded = expanded.positionOverrides.get(orjId);
    const flwjCollapsed = collapsed.positionOverrides.get(flwjId);
    const flwjExpanded = expanded.positionOverrides.get(flwjId);
    const ntwjCollapsed = collapsed.positionOverrides.get(ntwjId);
    const ntwjExpanded = expanded.positionOverrides.get(ntwjId);
    const childExpanded = expanded.positionOverrides.get(childNetId);

    assert.ok(decoration);
    assert.ok(orjCollapsed);
    assert.ok(orjExpanded);
    assert.ok(flwjCollapsed);
    assert.ok(flwjExpanded);
    assert.ok(ntwjCollapsed);
    assert.ok(ntwjExpanded);
    assert.ok(childExpanded);

    const panelBottom =
      childExpanded!.y + decoration!.panelOffsetYPx + decoration!.panelHeightPx;
    assert.ok(orjExpanded!.x > orjCollapsed!.x);
    assert.ok(orjExpanded!.y > panelBottom);
    const metrics = createFlowGraphMetrics(16);
    const panelLeft = childExpanded!.x + decoration!.panelOffsetXPx;
    assert.ok(flwjExpanded!.x + metrics.width <= panelLeft);
    assert.strictEqual(flwjExpanded!.y, flwjCollapsed!.y);
    assert.strictEqual(ntwjExpanded!.x, ntwjCollapsed!.x);
    assert.ok(ntwjExpanded!.y > ntwjCollapsed!.y);
  });

  test("keeps revealed children anchored near the expanded node origin", () => {
    const result = parseAjs(overlappingSiblingDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const childNetId = document.rootUnits[0].children[0].children[0].id;
    const grandNetId =
      document.rootUnits[0].children[0].children[0].children[0].id;
    const nestedJobId =
      document.rootUnits[0].children[0].children[0].children[1].id;

    const expanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([childNetId]),
      basePx: 16,
    });

    const childPosition = expanded.positionOverrides.get(childNetId);
    const grandNetPosition = expanded.positionOverrides.get(grandNetId);
    const nestedJobPosition = expanded.positionOverrides.get(nestedJobId);

    assert.ok(childPosition);
    assert.ok(grandNetPosition);
    assert.ok(nestedJobPosition);
    const metrics = createFlowGraphMetrics(16);
    const horizontalStep = metrics.width + metrics.marginX;
    assert.ok(grandNetPosition!.x - childPosition!.x <= horizontalStep);
    assert.ok(grandNetPosition!.y - childPosition!.y <= metrics.height * 3);
    assert.ok(nestedJobPosition!.x - childPosition!.x <= horizontalStep * 2);
    assert.ok(nestedJobPosition!.y - childPosition!.y <= metrics.height * 3);
  });

  test("expands nested jobnets level by level when a newly visible child is also expanded", () => {
    const result = parseAjs(deepNestedJobnetDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const level2Id = document.rootUnits[0].children[0].children[0].id;
    const level3Id =
      document.rootUnits[0].children[0].children[0].children[0].id;
    const level4Id =
      document.rootUnits[0].children[0].children[0].children[0].children[0].id;
    const level5Id =
      document.rootUnits[0].children[0].children[0].children[0].children[0]
        .children[0].id;
    const leafJobId =
      document.rootUnits[0].children[0].children[0].children[0].children[0]
        .children[0].children[0].id;

    const expanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([
        level2Id,
        level3Id,
        level4Id,
        level5Id,
      ]),
      basePx: 16,
    });

    assert.ok(expanded.graph);
    assert.strictEqual(
      expanded.graph?.nodes.some((node) => node.id === level5Id),
      true,
    );
    assert.strictEqual(
      expanded.graph?.nodes.some((node) => node.id === leafJobId),
      true,
    );

    const level2Decoration = expanded.nodeDecorations.get(level2Id);
    const level3Decoration = expanded.nodeDecorations.get(level3Id);
    const level2Position = expanded.positionOverrides.get(level2Id);
    const level3Position = expanded.positionOverrides.get(level3Id);

    assert.ok(level2Decoration);
    assert.ok(level3Decoration);
    assert.ok(level2Position);
    assert.ok(level3Position);

    const level2PanelRight =
      level2Position!.x +
      level2Decoration!.panelOffsetXPx +
      level2Decoration!.panelWidthPx;
    const level3PanelRight =
      level3Position!.x +
      level3Decoration!.panelOffsetXPx +
      level3Decoration!.panelWidthPx;
    const level2PanelBottom =
      level2Position!.y +
      level2Decoration!.panelOffsetYPx +
      level2Decoration!.panelHeightPx;
    const level3PanelBottom =
      level3Position!.y +
      level3Decoration!.panelOffsetYPx +
      level3Decoration!.panelHeightPx;

    assert.ok(level2PanelRight >= level3PanelRight);
    assert.ok(level2PanelBottom >= level3PanelBottom);
  });

  test("repositions parent-level siblings after a deeper nested panel enlarges its ancestor", () => {
    const result = parseAjs(deepNestedWithSiblingDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const level2Id = document.rootUnits[0].children[0].children[0].id;
    const level3Id =
      document.rootUnits[0].children[0].children[0].children[0].id;
    const level4Id =
      document.rootUnits[0].children[0].children[0].children[0].children[0].id;
    const siblingId = document.rootUnits[0].children[0].children[1].id;

    const shallowExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([level2Id]),
      basePx: 16,
    });
    const deepExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([level2Id, level3Id, level4Id]),
      basePx: 16,
    });

    const shallowSiblingPosition =
      shallowExpanded.positionOverrides.get(siblingId);
    const deepSiblingPosition = deepExpanded.positionOverrides.get(siblingId);
    const deepLevel2Position = deepExpanded.positionOverrides.get(level2Id);
    const deepLevel2Decoration = deepExpanded.nodeDecorations.get(level2Id);

    assert.ok(shallowSiblingPosition);
    assert.ok(deepSiblingPosition);
    assert.ok(deepLevel2Position);
    assert.ok(deepLevel2Decoration);

    const deepLevel2PanelRight =
      deepLevel2Position!.x +
      deepLevel2Decoration!.panelOffsetXPx +
      deepLevel2Decoration!.panelWidthPx;

    assert.ok(deepSiblingPosition!.x > shallowSiblingPosition!.x);
    assert.ok(deepSiblingPosition!.x > deepLevel2PanelRight);
  });

  test("keeps panel origin anchored to the expanded unit while deeper descendants grow it", () => {
    const result = parseAjs(deepNestedJobnetDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const level2Id = document.rootUnits[0].children[0].children[0].id;
    const level3Id =
      document.rootUnits[0].children[0].children[0].children[0].id;
    const level4Id =
      document.rootUnits[0].children[0].children[0].children[0].children[0].id;

    const shallowExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([level2Id]),
      basePx: 16,
    });
    const deepExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([level2Id, level3Id, level4Id]),
      basePx: 16,
    });

    const shallowLevel2Decoration =
      shallowExpanded.nodeDecorations.get(level2Id);
    const deepLevel2Decoration = deepExpanded.nodeDecorations.get(level2Id);

    assert.ok(shallowLevel2Decoration);
    assert.ok(deepLevel2Decoration);
    assert.strictEqual(
      deepLevel2Decoration!.panelOffsetXPx,
      shallowLevel2Decoration!.panelOffsetXPx,
    );
    assert.strictEqual(
      deepLevel2Decoration!.panelOffsetYPx,
      shallowLevel2Decoration!.panelOffsetYPx,
    );
    assert.ok(
      deepLevel2Decoration!.panelWidthPx >
        shallowLevel2Decoration!.panelWidthPx,
    );
    assert.ok(
      deepLevel2Decoration!.panelHeightPx >
        shallowLevel2Decoration!.panelHeightPx,
    );
  });

  test("expands recovery jobnet variants with nested children", () => {
    const result = parseAjs(recoveryJobnetDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const recoveryNetId = document.rootUnits[0].children[0].children[0].id;
    const leafJobId =
      document.rootUnits[0].children[0].children[0].children[0].id;

    const expanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([recoveryNetId]),
      basePx: 16,
    });

    assert.ok(expanded.graph);
    assert.strictEqual(
      expanded.graph?.nodes.some((node) => node.id === leafJobId),
      true,
    );
    assert.ok(expanded.nodeDecorations.get(recoveryNetId));
  });

  test("keeps expanded descendants anchored when a sibling expansion later moves their parent", () => {
    const result = parseAjs(siblingExpandedJobnetsDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const leftNetId = document.rootUnits[0].children[0].children[0].id;
    const rightNetId = document.rootUnits[0].children[0].children[1].id;
    const rightGrandId =
      document.rootUnits[0].children[0].children[1].children[0].id;
    const rightJobId =
      document.rootUnits[0].children[0].children[1].children[1].id;

    const rightExpandedOnly = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([rightNetId]),
      basePx: 16,
    });
    const siblingExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([rightNetId, leftNetId]),
      basePx: 16,
    });

    const rightOnlyParentPosition =
      rightExpandedOnly.positionOverrides.get(rightNetId);
    const rightOnlyGrandPosition =
      rightExpandedOnly.positionOverrides.get(rightGrandId);
    const rightOnlyJobPosition =
      rightExpandedOnly.positionOverrides.get(rightJobId);
    const movedParentPosition =
      siblingExpanded.positionOverrides.get(rightNetId);
    const movedGrandPosition =
      siblingExpanded.positionOverrides.get(rightGrandId);
    const movedJobPosition = siblingExpanded.positionOverrides.get(rightJobId);

    assert.ok(rightOnlyParentPosition);
    assert.ok(rightOnlyGrandPosition);
    assert.ok(rightOnlyJobPosition);
    assert.ok(movedParentPosition);
    assert.ok(movedGrandPosition);
    assert.ok(movedJobPosition);

    assert.ok(movedParentPosition!.x > rightOnlyParentPosition!.x);
    assert.strictEqual(
      movedGrandPosition!.x - movedParentPosition!.x,
      rightOnlyGrandPosition!.x - rightOnlyParentPosition!.x,
    );
    assert.strictEqual(
      movedGrandPosition!.y - movedParentPosition!.y,
      rightOnlyGrandPosition!.y - rightOnlyParentPosition!.y,
    );
    assert.strictEqual(
      movedJobPosition!.x - movedParentPosition!.x,
      rightOnlyJobPosition!.x - rightOnlyParentPosition!.x,
    );
    assert.strictEqual(
      movedJobPosition!.y - movedParentPosition!.y,
      rightOnlyJobPosition!.y - rightOnlyParentPosition!.y,
    );
  });

  test("keeps a later expanded sibling panel aligned with descendants after sibling offsets", () => {
    const result = parseAjs(siblingExpandedJobnetsDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const leftNetId = document.rootUnits[0].children[0].children[0].id;
    const rightNetId = document.rootUnits[0].children[0].children[1].id;
    const rightGrandId =
      document.rootUnits[0].children[0].children[1].children[0].id;
    const rightJobId =
      document.rootUnits[0].children[0].children[1].children[1].id;

    const expanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([leftNetId, rightNetId]),
      basePx: 16,
    });

    const rightParentPosition = expanded.positionOverrides.get(rightNetId);
    const rightGrandPosition = expanded.positionOverrides.get(rightGrandId);
    const rightJobPosition = expanded.positionOverrides.get(rightJobId);
    const rightDecoration = expanded.nodeDecorations.get(rightNetId);

    assert.ok(rightParentPosition);
    assert.ok(rightGrandPosition);
    assert.ok(rightJobPosition);
    assert.ok(rightDecoration);

    const panelLeft = rightParentPosition!.x + rightDecoration!.panelOffsetXPx;
    const panelRight = panelLeft + rightDecoration!.panelWidthPx;
    const panelTop = rightParentPosition!.y + rightDecoration!.panelOffsetYPx;
    const panelBottom = panelTop + rightDecoration!.panelHeightPx;
    const metrics = createFlowGraphMetrics(16);

    assert.ok(rightGrandPosition!.x >= panelLeft);
    assert.ok(rightGrandPosition!.x + metrics.width <= panelRight);
    assert.ok(rightGrandPosition!.y >= panelTop);
    assert.ok(rightGrandPosition!.y + metrics.height <= panelBottom);
    assert.ok(rightJobPosition!.x >= panelLeft);
    assert.ok(rightJobPosition!.x + metrics.width <= panelRight);
    assert.ok(rightJobPosition!.y >= panelTop);
    assert.ok(rightJobPosition!.y + metrics.height <= panelBottom);
  });

  test("pushes units on the parent row when a nested expansion enlarges that parent scope", () => {
    const result = parseAjs(parentRowPropagationDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const parentNetId = document.rootUnits[0].children[0].children[0].id;
    const childNetId =
      document.rootUnits[0].children[0].children[0].children[0].id;
    const siblingRightId = document.rootUnits[0].children[0].children[1].id;

    const parentOnlyExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([parentNetId]),
      basePx: 16,
    });
    const childExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([parentNetId, childNetId]),
      basePx: 16,
    });

    const siblingBefore =
      parentOnlyExpanded.positionOverrides.get(siblingRightId);
    const siblingAfter = childExpanded.positionOverrides.get(siblingRightId);
    const parentBefore = parentOnlyExpanded.positionOverrides.get(parentNetId);
    const parentAfter = childExpanded.positionOverrides.get(parentNetId);
    const parentDecorationBefore =
      parentOnlyExpanded.nodeDecorations.get(parentNetId);
    const parentDecorationAfter =
      childExpanded.nodeDecorations.get(parentNetId);

    assert.ok(siblingBefore);
    assert.ok(siblingAfter);
    assert.ok(parentBefore);
    assert.ok(parentAfter);
    assert.ok(parentDecorationBefore);
    assert.ok(parentDecorationAfter);
    assert.strictEqual(siblingBefore!.y, parentBefore!.y);
    assert.strictEqual(siblingAfter!.y, parentAfter!.y);
    assert.ok(siblingAfter!.x > siblingBefore!.x);
    const parentPanelRightBefore =
      parentBefore!.x +
      parentDecorationBefore!.panelOffsetXPx +
      parentDecorationBefore!.panelWidthPx;
    const parentPanelRightAfter =
      parentAfter!.x +
      parentDecorationAfter!.panelOffsetXPx +
      parentDecorationAfter!.panelWidthPx;
    assert.ok(siblingAfter!.x > parentPanelRightAfter);
    assertClose(
      siblingAfter!.x - siblingBefore!.x,
      parentPanelRightAfter - parentPanelRightBefore,
    );
  });

  test("does not propagate horizontal growth when an upper expanded panel already covers it", () => {
    const result = parseAjs(upperPanelCoversLowerWidthDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const upperNetId = document.rootUnits[0].children[0].children[0].id;
    const lowerNetId = document.rootUnits[0].children[0].children[1].id;
    const rightLowerId = document.rootUnits[0].children[0].children[2].id;

    const upperOnlyExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([upperNetId]),
      basePx: 16,
    });
    const upperAndLowerExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([upperNetId, lowerNetId]),
      basePx: 16,
    });

    const rightLowerBefore =
      upperOnlyExpanded.positionOverrides.get(rightLowerId);
    const rightLowerAfter =
      upperAndLowerExpanded.positionOverrides.get(rightLowerId);
    const upperPosition =
      upperAndLowerExpanded.positionOverrides.get(upperNetId);
    const lowerPosition =
      upperAndLowerExpanded.positionOverrides.get(lowerNetId);
    const upperDecoration =
      upperAndLowerExpanded.nodeDecorations.get(upperNetId);
    const lowerDecoration =
      upperAndLowerExpanded.nodeDecorations.get(lowerNetId);

    assert.ok(rightLowerBefore);
    assert.ok(rightLowerAfter);
    assert.ok(upperPosition);
    assert.ok(lowerPosition);
    assert.ok(upperDecoration);
    assert.ok(lowerDecoration);

    const upperPanelRight =
      upperPosition!.x +
      upperDecoration!.panelOffsetXPx +
      upperDecoration!.panelWidthPx;
    const lowerPanelRight =
      lowerPosition!.x +
      lowerDecoration!.panelOffsetXPx +
      lowerDecoration!.panelWidthPx;

    assert.ok(upperPosition!.y < lowerPosition!.y);
    assert.ok(upperPanelRight > lowerPanelRight);
    assert.strictEqual(rightLowerAfter!.x, rightLowerBefore!.x);
  });

  test("propagates only the horizontal growth beyond the upper expanded panel", () => {
    const result = parseAjs(lowerPanelExceedsUpperWidthDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const upperNetId = document.rootUnits[0].children[0].children[0].id;
    const lowerNetId = document.rootUnits[0].children[0].children[1].id;
    const rightLowerId = document.rootUnits[0].children[0].children[2].id;

    const upperOnlyExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([upperNetId]),
      basePx: 16,
    });
    const upperAndLowerExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([upperNetId, lowerNetId]),
      basePx: 16,
    });

    const rightLowerBefore =
      upperOnlyExpanded.positionOverrides.get(rightLowerId);
    const rightLowerAfter =
      upperAndLowerExpanded.positionOverrides.get(rightLowerId);
    const upperPosition =
      upperAndLowerExpanded.positionOverrides.get(upperNetId);
    const lowerPosition =
      upperAndLowerExpanded.positionOverrides.get(lowerNetId);
    const upperDecoration =
      upperAndLowerExpanded.nodeDecorations.get(upperNetId);
    const lowerDecoration =
      upperAndLowerExpanded.nodeDecorations.get(lowerNetId);

    assert.ok(rightLowerBefore);
    assert.ok(rightLowerAfter);
    assert.ok(upperPosition);
    assert.ok(lowerPosition);
    assert.ok(upperDecoration);
    assert.ok(lowerDecoration);

    const upperPanelRight =
      upperPosition!.x +
      upperDecoration!.panelOffsetXPx +
      upperDecoration!.panelWidthPx;
    const lowerPanelRight =
      lowerPosition!.x +
      lowerDecoration!.panelOffsetXPx +
      lowerDecoration!.panelWidthPx;

    assert.ok(upperPosition!.y < lowerPosition!.y);
    assert.ok(lowerPanelRight > upperPanelRight);
    assertClose(
      rightLowerAfter!.x - rightLowerBefore!.x,
      lowerPanelRight - upperPanelRight,
    );
  });

  test("propagates horizontal growth beyond the upper panel when lower is expanded after upper", () => {
    const result = parseAjs(lowerPanelExceedsUpperWidthDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const upperNetId = document.rootUnits[0].children[0].children[0].id;
    const lowerNetId = document.rootUnits[0].children[0].children[1].id;
    const rightLowerId = document.rootUnits[0].children[0].children[2].id;

    const upperOnlyExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: [upperNetId],
      basePx: 16,
    });
    const lowerExpandedAfterUpper = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: [upperNetId, lowerNetId],
      basePx: 16,
    });

    const rightLowerBefore =
      upperOnlyExpanded.positionOverrides.get(rightLowerId);
    const rightLowerAfter =
      lowerExpandedAfterUpper.positionOverrides.get(rightLowerId);
    const upperPosition =
      lowerExpandedAfterUpper.positionOverrides.get(upperNetId);
    const lowerPosition =
      lowerExpandedAfterUpper.positionOverrides.get(lowerNetId);
    const upperDecoration =
      lowerExpandedAfterUpper.nodeDecorations.get(upperNetId);
    const lowerDecoration =
      lowerExpandedAfterUpper.nodeDecorations.get(lowerNetId);

    assert.ok(rightLowerBefore);
    assert.ok(rightLowerAfter);
    assert.ok(upperPosition);
    assert.ok(lowerPosition);
    assert.ok(upperDecoration);
    assert.ok(lowerDecoration);

    const upperPanelRight =
      upperPosition!.x +
      upperDecoration!.panelOffsetXPx +
      upperDecoration!.panelWidthPx;
    const lowerPanelRight =
      lowerPosition!.x +
      lowerDecoration!.panelOffsetXPx +
      lowerDecoration!.panelWidthPx;

    assert.ok(lowerPanelRight > upperPanelRight);
    assertClose(
      rightLowerAfter!.x - rightLowerBefore!.x,
      lowerPanelRight - upperPanelRight,
    );
  });

  test("pushes a lower expanded panel origin when an upper expanded panel intrudes into it", () => {
    const result = parseAjs(upperPanelIntrudesLowerPanelDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const upperNetId = document.rootUnits[0].children[0].children[0].id;
    const lowerNetId = document.rootUnits[0].children[0].children[1].id;

    const lowerOnlyExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([lowerNetId]),
      basePx: 16,
    });
    const upperAndLowerExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: [lowerNetId, upperNetId],
      basePx: 16,
    });

    const lowerBefore = lowerOnlyExpanded.positionOverrides.get(lowerNetId);
    const upperPosition =
      upperAndLowerExpanded.positionOverrides.get(upperNetId);
    const lowerAfter = upperAndLowerExpanded.positionOverrides.get(lowerNetId);
    const upperDecoration =
      upperAndLowerExpanded.nodeDecorations.get(upperNetId);
    const lowerDecoration =
      upperAndLowerExpanded.nodeDecorations.get(lowerNetId);

    assert.ok(lowerBefore);
    assert.ok(upperPosition);
    assert.ok(lowerAfter);
    assert.ok(upperDecoration);
    assert.ok(lowerDecoration);

    const upperPanelBottom =
      upperPosition!.y +
      upperDecoration!.panelOffsetYPx +
      upperDecoration!.panelHeightPx;
    const lowerPanelTop = lowerAfter!.y + lowerDecoration!.panelOffsetYPx;

    assert.ok(lowerAfter!.y >= lowerBefore!.y);
    assert.ok(upperPanelBottom <= lowerPanelTop);
  });

  test("pushes a lower panel origin consistently when expansion order changes", () => {
    const result = parseAjs(upperPanelIntrudesLowerPanelDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const upperNetId = document.rootUnits[0].children[0].children[0].id;
    const lowerNetId = document.rootUnits[0].children[0].children[1].id;

    const upperOnlyExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: [upperNetId],
      basePx: 16,
    });
    const lowerExpandedAfterUpper = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: [upperNetId, lowerNetId],
      basePx: 16,
    });

    const lowerBefore = upperOnlyExpanded.positionOverrides.get(lowerNetId);
    const lowerAfter =
      lowerExpandedAfterUpper.positionOverrides.get(lowerNetId);
    const upperPosition =
      lowerExpandedAfterUpper.positionOverrides.get(upperNetId);
    const upperDecoration =
      lowerExpandedAfterUpper.nodeDecorations.get(upperNetId);
    const lowerDecoration =
      lowerExpandedAfterUpper.nodeDecorations.get(lowerNetId);
    const lowerThenUpper = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: [lowerNetId, upperNetId],
      basePx: 16,
    });

    assert.ok(lowerBefore);
    assert.ok(lowerAfter);
    assert.ok(upperPosition);
    assert.ok(upperDecoration);
    assert.ok(lowerDecoration);

    const upperPanelBottom =
      upperPosition!.y +
      upperDecoration!.panelOffsetYPx +
      upperDecoration!.panelHeightPx;
    const lowerPanelTop = lowerAfter!.y + lowerDecoration!.panelOffsetYPx;

    assert.ok(lowerAfter!.y >= lowerBefore!.y);
    assert.ok(upperPanelBottom <= lowerPanelTop);
    assert.deepStrictEqual(
      lowerExpandedAfterUpper.positionOverrides,
      lowerThenUpper.positionOverrides,
    );
    assert.deepStrictEqual(
      lowerExpandedAfterUpper.nodeDecorations,
      lowerThenUpper.nodeDecorations,
    );
  });

  test("does not apply vertical growth again when a target already has enough y offset", () => {
    const result = parseAjs(alreadyOffsetTargetDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const upperNetId = document.rootUnits[0].children[0].children[0].id;
    const lowerNetId = document.rootUnits[0].children[0].children[1].id;
    const targetJobId = document.rootUnits[0].children[0].children[2].id;

    const upperOnlyExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: [upperNetId],
      basePx: 16,
    });
    const upperAndLowerExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: [upperNetId, lowerNetId],
      basePx: 16,
    });

    const targetBefore = upperOnlyExpanded.positionOverrides.get(targetJobId);
    const targetAfter =
      upperAndLowerExpanded.positionOverrides.get(targetJobId);
    const lowerPosition =
      upperAndLowerExpanded.positionOverrides.get(lowerNetId);
    const lowerDecoration =
      upperAndLowerExpanded.nodeDecorations.get(lowerNetId);

    assert.ok(targetBefore);
    assert.ok(targetAfter);
    assert.ok(lowerPosition);
    assert.ok(lowerDecoration);

    const lowerPanelLeft = lowerPosition!.x + lowerDecoration!.panelOffsetXPx;
    const lowerPanelRight = lowerPanelLeft + lowerDecoration!.panelWidthPx;
    const targetIsOutsidePanelHorizontally =
      targetAfter!.x >= lowerPanelRight ||
      targetAfter!.x + createFlowGraphMetrics(16).width <= lowerPanelLeft;

    assert.ok(targetIsOutsidePanelHorizontally);
    assert.ok(targetAfter!.x >= targetBefore!.x);
    assert.strictEqual(targetAfter!.y, targetBefore!.y);
  });

  test("keeps horizontal growth when vertical growth is already covered", () => {
    const result = parseAjs(
      verticallyOffsetTargetNeedsHorizontalOffsetDefinition,
    );
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const upperNetId = document.rootUnits[0].children[0].children[0].id;
    const lowerNetId = document.rootUnits[0].children[0].children[1].id;
    const targetJobId = document.rootUnits[0].children[0].children[2].id;

    const upperOnlyExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: [upperNetId],
      basePx: 16,
    });
    const upperAndLowerExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: [upperNetId, lowerNetId],
      basePx: 16,
    });

    const targetBefore = upperOnlyExpanded.positionOverrides.get(targetJobId);
    const targetAfter =
      upperAndLowerExpanded.positionOverrides.get(targetJobId);
    const lowerPosition =
      upperAndLowerExpanded.positionOverrides.get(lowerNetId);
    const upperPosition =
      upperAndLowerExpanded.positionOverrides.get(upperNetId);
    const upperDecoration =
      upperAndLowerExpanded.nodeDecorations.get(upperNetId);
    const lowerDecoration =
      upperAndLowerExpanded.nodeDecorations.get(lowerNetId);

    assert.ok(targetBefore);
    assert.ok(targetAfter);
    assert.ok(lowerPosition);
    assert.ok(upperPosition);
    assert.ok(upperDecoration);
    assert.ok(lowerDecoration);

    const upperPanelRight =
      upperPosition!.x +
      upperDecoration!.panelOffsetXPx +
      upperDecoration!.panelWidthPx;
    const lowerPanelRight =
      lowerPosition!.x +
      lowerDecoration!.panelOffsetXPx +
      lowerDecoration!.panelWidthPx;
    const lowerPanelBottom =
      lowerPosition!.y +
      lowerDecoration!.panelOffsetYPx +
      lowerDecoration!.panelHeightPx;

    assert.ok(targetBefore!.y >= lowerPanelBottom);
    assert.ok(lowerPanelRight > upperPanelRight);
    assertClose(
      targetAfter!.x - targetBefore!.x,
      lowerPanelRight - upperPanelRight,
    );
    assert.strictEqual(targetAfter!.y, targetBefore!.y);
  });

  test("propagates horizontal growth when a nested expansion makes the parent exceed the upper panel", () => {
    const result = parseAjs(nestedExpansionExceedsUpperWidthDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const upperNetId = document.rootUnits[0].children[0].children[0].id;
    const lowerNetId = document.rootUnits[0].children[0].children[1].id;
    const lowerChildId =
      document.rootUnits[0].children[0].children[1].children[0].id;
    const rightLowerId = document.rootUnits[0].children[0].children[2].id;

    const lowerOnlyExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: [upperNetId, lowerNetId],
      basePx: 16,
    });
    const lowerChildExpanded = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: [upperNetId, lowerNetId, lowerChildId],
      basePx: 16,
    });

    const rightLowerBefore =
      lowerOnlyExpanded.positionOverrides.get(rightLowerId);
    const rightLowerAfter =
      lowerChildExpanded.positionOverrides.get(rightLowerId);
    const upperPosition = lowerChildExpanded.positionOverrides.get(upperNetId);
    const lowerPosition = lowerChildExpanded.positionOverrides.get(lowerNetId);
    const upperDecoration = lowerChildExpanded.nodeDecorations.get(upperNetId);
    const lowerDecoration = lowerChildExpanded.nodeDecorations.get(lowerNetId);

    assert.ok(rightLowerBefore);
    assert.ok(rightLowerAfter);
    assert.ok(upperPosition);
    assert.ok(lowerPosition);
    assert.ok(upperDecoration);
    assert.ok(lowerDecoration);

    const upperPanelRight =
      upperPosition!.x +
      upperDecoration!.panelOffsetXPx +
      upperDecoration!.panelWidthPx;
    const lowerPanelRight =
      lowerPosition!.x +
      lowerDecoration!.panelOffsetXPx +
      lowerDecoration!.panelWidthPx;

    assert.ok(lowerPanelRight > upperPanelRight);
    assertClose(
      rightLowerAfter!.x - rightLowerBefore!.x,
      lowerPanelRight - upperPanelRight,
    );
  });

  test("keeps the same layout when the same-depth expanded order changes", () => {
    const result = parseAjs(siblingExpandedJobnetsDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const leftNetId = document.rootUnits[0].children[0].children[0].id;
    const rightNetId = document.rootUnits[0].children[0].children[1].id;
    const rightJobId =
      document.rootUnits[0].children[0].children[1].children[1].id;

    const leftThenRight = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([leftNetId, rightNetId]),
      basePx: 16,
    });
    const rightThenLeft = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([rightNetId, leftNetId]),
      basePx: 16,
    });

    assert.deepStrictEqual(
      leftThenRight.positionOverrides.get(rightNetId),
      rightThenLeft.positionOverrides.get(rightNetId),
    );
    assert.deepStrictEqual(
      leftThenRight.positionOverrides.get(rightJobId),
      rightThenLeft.positionOverrides.get(rightJobId),
    );
    assert.deepStrictEqual(
      leftThenRight.nodeDecorations.get(leftNetId),
      rightThenLeft.nodeDecorations.get(leftNetId),
    );
    assert.deepStrictEqual(
      leftThenRight.nodeDecorations.get(rightNetId),
      rightThenLeft.nodeDecorations.get(rightNetId),
    );
  });

  test("rebuilding the same expanded state keeps panel bounds stable", () => {
    const result = parseAjs(deepNestedJobnetDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const level2Id = document.rootUnits[0].children[0].children[0].id;
    const level3Id =
      document.rootUnits[0].children[0].children[0].children[0].id;
    const level4Id =
      document.rootUnits[0].children[0].children[0].children[0].children[0].id;

    const expandedUnitIds = new Set<string>([level2Id, level3Id, level4Id]);
    const first = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds,
      basePx: 16,
    });
    const second = buildExpandedFlowGraph({
      document,
      currentUnitId,
      expandedUnitIds: new Set<string>([level2Id, level3Id, level4Id]),
      basePx: 16,
    });

    assert.deepStrictEqual(first.positionOverrides, second.positionOverrides);
    assert.deepStrictEqual(first.nodeDecorations, second.nodeDecorations);
  });
});
