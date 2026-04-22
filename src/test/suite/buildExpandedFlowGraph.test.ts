import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { buildExpandedFlowGraph } from "../../ui-component/editor/ajsFlow/buildExpandedFlowGraph";

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

suite("Build Expanded Flow Graph", () => {
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

    const collapsed = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>(),
      16,
    );
    const childExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([childNetId]),
      16,
    );
    const grandOnlyExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([grandNetId]),
      16,
    );
    const fullyExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([childNetId, grandNetId]),
      16,
    );

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
    assert.ok(siblingPosition!.x > childNetPosition!.x + 96);
    const childNetDecoration = childExpanded.nodeDecorations.get(childNetId);
    assert.ok(childNetDecoration);
    assert.ok(childNetDecoration!.panelWidthPx > 96);
    assert.ok(childNetDecoration!.panelHeightPx > 96);
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

    const collapsed = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>(),
      16,
    );
    const expanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([childNetId]),
      16,
    );

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
    assert.ok(flwjExpanded!.x > flwjCollapsed!.x);
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

    const expanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([childNetId]),
      16,
    );

    const childPosition = expanded.positionOverrides.get(childNetId);
    const grandNetPosition = expanded.positionOverrides.get(grandNetId);
    const nestedJobPosition = expanded.positionOverrides.get(nestedJobId);

    assert.ok(childPosition);
    assert.ok(grandNetPosition);
    assert.ok(nestedJobPosition);
    assert.ok(grandNetPosition!.x - childPosition!.x < 160);
    assert.ok(grandNetPosition!.y - childPosition!.y < 320);
    assert.ok(nestedJobPosition!.x - childPosition!.x < 240);
    assert.ok(nestedJobPosition!.y - childPosition!.y < 320);
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

    const expanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([level2Id, level3Id, level4Id, level5Id]),
      16,
    );

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

    const shallowExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([level2Id]),
      16,
    );
    const deepExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([level2Id, level3Id, level4Id]),
      16,
    );

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

  test("expands recovery jobnet variants with nested children", () => {
    const result = parseAjs(recoveryJobnetDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const recoveryNetId = document.rootUnits[0].children[0].children[0].id;
    const leafJobId =
      document.rootUnits[0].children[0].children[0].children[0].id;

    const expanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([recoveryNetId]),
      16,
    );

    assert.ok(expanded.graph);
    assert.strictEqual(
      expanded.graph?.nodes.some((node) => node.id === leafJobId),
      true,
    );
    assert.ok(expanded.nodeDecorations.get(recoveryNetId));
  });
});
