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

    const rightExpandedOnly = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([rightNetId]),
      16,
    );
    const siblingExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([rightNetId, leftNetId]),
      16,
    );

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

    const expanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([leftNetId, rightNetId]),
      16,
    );

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

    assert.ok(rightGrandPosition!.x >= panelLeft);
    assert.ok(rightGrandPosition!.x + 160 <= panelRight);
    assert.ok(rightGrandPosition!.y >= panelTop);
    assert.ok(rightGrandPosition!.y + 96 <= panelBottom);
    assert.ok(rightJobPosition!.x >= panelLeft);
    assert.ok(rightJobPosition!.x + 160 <= panelRight);
    assert.ok(rightJobPosition!.y >= panelTop);
    assert.ok(rightJobPosition!.y + 96 <= panelBottom);
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

    const parentOnlyExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([parentNetId]),
      16,
    );
    const childExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([parentNetId, childNetId]),
      16,
    );

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
    assert.strictEqual(
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

    const upperOnlyExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([upperNetId]),
      16,
    );
    const upperAndLowerExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([upperNetId, lowerNetId]),
      16,
    );

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

    const upperOnlyExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([upperNetId]),
      16,
    );
    const upperAndLowerExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([upperNetId, lowerNetId]),
      16,
    );

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
    assert.strictEqual(
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

    const upperOnlyExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      [upperNetId],
      16,
    );
    const lowerExpandedAfterUpper = buildExpandedFlowGraph(
      document,
      currentUnitId,
      [upperNetId, lowerNetId],
      16,
    );

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
    assert.strictEqual(
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

    const lowerOnlyExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([lowerNetId]),
      16,
    );
    const upperAndLowerExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      [lowerNetId, upperNetId],
      16,
    );

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

    assert.ok(lowerAfter!.y > lowerBefore!.y);
    assert.ok(upperPanelBottom <= lowerPanelTop);
  });

  test("does not push a lower panel origin when that lower unit is the newly expanded unit", () => {
    const result = parseAjs(upperPanelIntrudesLowerPanelDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const upperNetId = document.rootUnits[0].children[0].children[0].id;
    const lowerNetId = document.rootUnits[0].children[0].children[1].id;

    const upperOnlyExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      [upperNetId],
      16,
    );
    const lowerExpandedAfterUpper = buildExpandedFlowGraph(
      document,
      currentUnitId,
      [upperNetId, lowerNetId],
      16,
    );

    const lowerBefore = upperOnlyExpanded.positionOverrides.get(lowerNetId);
    const lowerAfter =
      lowerExpandedAfterUpper.positionOverrides.get(lowerNetId);

    assert.ok(lowerBefore);
    assert.ok(lowerAfter);
    assert.strictEqual(lowerAfter!.y, lowerBefore!.y);
  });

  test("does not apply vertical growth again when a target already has enough y offset", () => {
    const result = parseAjs(alreadyOffsetTargetDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnitId = document.rootUnits[0].children[0].id;
    const upperNetId = document.rootUnits[0].children[0].children[0].id;
    const lowerNetId = document.rootUnits[0].children[0].children[1].id;
    const targetJobId = document.rootUnits[0].children[0].children[2].id;

    const upperOnlyExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      [upperNetId],
      16,
    );
    const upperAndLowerExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      [upperNetId, lowerNetId],
      16,
    );

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

    const lowerPanelBottom =
      lowerPosition!.y +
      lowerDecoration!.panelOffsetYPx +
      lowerDecoration!.panelHeightPx;

    assert.ok(targetBefore!.y >= lowerPanelBottom);
    assert.strictEqual(targetAfter!.x, targetBefore!.x);
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

    const upperOnlyExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      [upperNetId],
      16,
    );
    const upperAndLowerExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      [upperNetId, lowerNetId],
      16,
    );

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
    assert.strictEqual(
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

    const lowerOnlyExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      [upperNetId, lowerNetId],
      16,
    );
    const lowerChildExpanded = buildExpandedFlowGraph(
      document,
      currentUnitId,
      [upperNetId, lowerNetId, lowerChildId],
      16,
    );

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
    assert.strictEqual(
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

    const leftThenRight = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([leftNetId, rightNetId]),
      16,
    );
    const rightThenLeft = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([rightNetId, leftNetId]),
      16,
    );

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
    const first = buildExpandedFlowGraph(
      document,
      currentUnitId,
      expandedUnitIds,
      16,
    );
    const second = buildExpandedFlowGraph(
      document,
      currentUnitId,
      new Set<string>([level2Id, level3Id, level4Id]),
      16,
    );

    assert.deepStrictEqual(first.positionOverrides, second.positionOverrides);
    assert.deepStrictEqual(first.nodeDecorations, second.nodeDecorations);
  });
});
