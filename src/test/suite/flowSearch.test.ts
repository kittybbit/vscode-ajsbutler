import * as assert from "assert";
import { flattenAjsUnits } from "../../domain/models/ajs/AjsDocument";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { findFlowSearchResult } from "../../ui-component/editor/ajsFlow/flowSearch";

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

suite("Flow Search", () => {
  test("finds the first current-scope match and expands ancestor jobnets", () => {
    const result = parseAjs(nestedDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const allUnits = flattenAjsUnits(document.rootUnits);
    const unitById = new Map(allUnits.map((unit) => [unit.id, unit]));
    const currentUnit = document.rootUnits[0].children[0];
    const childNetId = currentUnit.children[0].id;
    const grandNetId = currentUnit.children[0].children[0].id;
    const leafJobId = currentUnit.children[0].children[0].children[0].id;

    const searchResult = findFlowSearchResult(
      currentUnit,
      "leaf comment",
      unitById,
    );

    assert.deepStrictEqual(searchResult, {
      matchedUnitId: leafJobId,
      expandedAncestorUnitIds: [childNetId, grandNetId],
    });
  });

  test("matches by absolute path and stays inside the current scope", () => {
    const result = parseAjs(nestedDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const allUnits = flattenAjsUnits(document.rootUnits);
    const unitById = new Map(allUnits.map((unit) => [unit.id, unit]));
    const currentUnit = document.rootUnits[0].children[0].children[0];

    const searchResult = findFlowSearchResult(
      currentUnit,
      "/jobnet/job-b",
      unitById,
    );

    assert.strictEqual(searchResult, undefined);
  });

  test("returns undefined for blank queries", () => {
    const result = parseAjs(nestedDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const allUnits = flattenAjsUnits(document.rootUnits);
    const unitById = new Map(allUnits.map((unit) => [unit.id, unit]));
    const currentUnit = document.rootUnits[0].children[0];

    const searchResult = findFlowSearchResult(currentUnit, "   ", unitById);

    assert.strictEqual(searchResult, undefined);
  });
});
