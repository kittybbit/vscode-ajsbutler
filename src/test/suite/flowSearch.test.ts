import * as assert from "assert";
import { parseAjsDocumentForTest } from "../support/parseAjs";
import { findFlowSearchResult } from "../../presentation/webview/editor/ajsFlow/flowSearch";
import {
  type FlowGraphUnitDto,
  toFlowGraphDocumentDto,
  validateFlowGraphDocument,
} from "../../application/flow-graph/flowGraphDocument";
import { createFlowTestUnit } from "../support/flowUnits";

const nestedDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    cm="scope root";
    el=child-net,n,+240+144;
    el=job-b,j,+400+144;
    unit=child-net,,jp1admin,;
    {
      ty=n;
      cm="nested comment";
      el=grand-net,n,+240+144;
      el=nested-job,j,+400+144;
      unit=grand-net,,jp1admin,;
      {
        ty=n;
        el=leaf-job,j,+240+144;
        unit=leaf-job,,jp1admin,;
        {
          ty=j;
          cm="leaf comment";
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
      cm="outside nested scope";
    }
  }
}
`;

type FlowSearchFixture = {
  childNetId: string;
  currentUnit: FlowGraphUnitDto;
  grandNetId: string;
  leafJobId: string;
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
};

const createFlowSearchFixture = (): FlowSearchFixture => {
  const validation = validateFlowGraphDocument(
    toFlowGraphDocumentDto(parseAjsDocumentForTest(nestedDefinition)),
  );
  assert.strictEqual(validation.status, "available");
  assert.ok(validation.status === "available");
  const currentUnit = validation.document.rootUnits[0].children[0];
  const childNetId = currentUnit.children[0].id;
  const grandNetId = currentUnit.children[0].children[0].id;
  const leafJobId = currentUnit.children[0].children[0].children[0].id;

  return {
    childNetId,
    currentUnit,
    grandNetId,
    leafJobId,
    unitById: validation.index.unitById,
  };
};

suite("Flow Search", () => {
  test("finds the first current-scope match and expands ancestor jobnets", () => {
    const { childNetId, currentUnit, grandNetId, leafJobId, unitById } =
      createFlowSearchFixture();

    const searchResult = findFlowSearchResult(currentUnit, "leaf", unitById);

    assert.deepStrictEqual(searchResult, {
      matchedUnitId: leafJobId,
      matchedUnitIds: [leafJobId],
      expandedAncestorUnitIds: [childNetId, grandNetId],
    });
  });

  test("matches a contiguous query that includes spaces from searchable unit text", () => {
    const { childNetId, currentUnit, grandNetId, leafJobId, unitById } =
      createFlowSearchFixture();

    const searchResult = findFlowSearchResult(
      currentUnit,
      "leaf comment",
      unitById,
    );

    assert.deepStrictEqual(searchResult, {
      matchedUnitId: leafJobId,
      matchedUnitIds: [leafJobId],
      expandedAncestorUnitIds: [childNetId, grandNetId],
    });
  });

  test("prefers the first descendant match when the current scope also matches", () => {
    const { childNetId, currentUnit, unitById } = createFlowSearchFixture();

    const searchResult = findFlowSearchResult(currentUnit, "/jobnet", unitById);

    assert.deepStrictEqual(searchResult, {
      matchedUnitId: childNetId,
      matchedUnitIds: [
        currentUnit.id,
        childNetId,
        currentUnit.children[0].children[0].id,
        currentUnit.children[0].children[0].children[0].id,
      ],
      expandedAncestorUnitIds: [
        childNetId,
        currentUnit.children[0].children[0].id,
      ],
    });
  });

  test("matches by absolute path and stays inside the current scope", () => {
    const validation = validateFlowGraphDocument(
      toFlowGraphDocumentDto(parseAjsDocumentForTest(nestedDefinition)),
    );
    assert.strictEqual(validation.status, "available");
    assert.ok(validation.status === "available");
    const unitById = validation.index.unitById;
    const currentUnit =
      validation.document.rootUnits[0].children[0].children[0];

    const searchResult = findFlowSearchResult(
      currentUnit,
      "/jobnet/job-b",
      unitById,
    );

    assert.strictEqual(searchResult, undefined);
  });

  test("returns undefined for blank queries", () => {
    const { currentUnit, unitById } = createFlowSearchFixture();

    const searchResult = findFlowSearchResult(currentUnit, "   ", unitById);

    assert.strictEqual(searchResult, undefined);
  });

  test("returns no match for a bounded long query", () => {
    const { currentUnit, unitById } = createFlowSearchFixture();
    const longQuery = `leaf-${"x".repeat(512)}`;

    assert.strictEqual(
      findFlowSearchResult(currentUnit, longQuery, unitById),
      undefined,
    );
  });

  test("preserves current-scope order for a bounded large result set", () => {
    const resultCount = 2048;
    const currentUnit = createFlowTestUnit({
      id: "/root/jobnet",
      name: "jobnet",
      children: [],
    });
    const children = Array.from({ length: resultCount }, (_, index) =>
      createFlowTestUnit({
        id: `/root/jobnet/job-${index}`,
        name: `job-${index}`,
        unitType: "j",
        absolutePath: `/root/jobnet/job-${index}`,
        depth: 2,
        parentId: currentUnit.id,
        isRootJobnet: false,
      }),
    );
    currentUnit.children = children;
    const unitById = new Map(
      [currentUnit, ...children].map((unit) => [unit.id, unit]),
    );

    const first = findFlowSearchResult(currentUnit, "job-", unitById);
    const repeated = findFlowSearchResult(currentUnit, "job-", unitById);

    assert.ok(first);
    assert.strictEqual(first.matchedUnitId, children[0].id);
    assert.deepStrictEqual(
      first.matchedUnitIds,
      children.map(({ id }) => id),
    );
    assert.deepStrictEqual(first.expandedAncestorUnitIds, []);
    assert.deepStrictEqual(repeated, first);
  });
});
