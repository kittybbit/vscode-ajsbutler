import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import {
  collectExpandableNestedUnitIds,
  hasExpandedAllNestedUnitIds,
} from "../../ui-component/editor/ajsFlow/nestedExpansion";

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

suite("Nested Expansion", () => {
  test("collects every expandable nested jobnet in the current scope", () => {
    const result = parseAjs(nestedDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const currentUnit = document.rootUnits[0].children[0];
    const childNetId = currentUnit.children[0].id;
    const grandNetId = currentUnit.children[0].children[0].id;

    assert.deepStrictEqual(collectExpandableNestedUnitIds(currentUnit), [
      childNetId,
      grandNetId,
    ]);
  });

  test("detects when the current scope is already fully expanded", () => {
    const expandableUnitIds = [
      "/root/jobnet/child-net",
      "/root/jobnet/grand-net",
    ];

    assert.strictEqual(
      hasExpandedAllNestedUnitIds(expandableUnitIds, new Set<string>()),
      false,
    );
    assert.strictEqual(
      hasExpandedAllNestedUnitIds(
        expandableUnitIds,
        new Set<string>(["/root/jobnet/child-net"]),
      ),
      false,
    );
    assert.strictEqual(
      hasExpandedAllNestedUnitIds(
        expandableUnitIds,
        new Set<string>(expandableUnitIds),
      ),
      true,
    );
  });
});
