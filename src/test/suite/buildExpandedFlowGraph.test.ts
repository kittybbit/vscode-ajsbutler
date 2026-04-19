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

  test("moves colliding siblings and their nearby incoming sources below the expanded panel", () => {
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
    assert.ok(orjExpanded!.y > panelBottom);
    assert.ok(flwjExpanded!.y > flwjCollapsed!.y);
    assert.ok(ntwjExpanded!.y > ntwjCollapsed!.y);
  });
});
