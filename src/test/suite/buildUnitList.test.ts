import * as assert from "assert";
import { toRootUnits } from "../../application/unit-list/unitListDocument";
import { buildUnitList } from "../../application/unit-list/buildUnitList";

const validDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=job,j,+0+0;
    unit=job,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

suite("Build Unit List", () => {
  test("builds a document DTO without parent references", () => {
    const result = buildUnitList(validDefinition);

    assert.deepStrictEqual(result.errors, []);
    assert.ok(result.document);
    assert.strictEqual(result.document?.rootUnits.length, 1);
    assert.strictEqual(
      result.document?.rootUnits[0].unitAttribute,
      "root,,jp1admin,",
    );
    assert.ok(!("parent" in result.document!.rootUnits[0]));
    assert.ok(!("parent" in result.document!.rootUnits[0].children[0]));
  });

  test("restores root units from the document DTO", () => {
    const result = buildUnitList(validDefinition);
    assert.ok(result.document);

    const rootUnits = toRootUnits(result.document!);

    assert.strictEqual(rootUnits.length, 1);
    assert.strictEqual(rootUnits[0].name, "root");
    assert.strictEqual(rootUnits[0].children[0].name, "jobnet");
    assert.strictEqual(rootUnits[0].children[0].children[0].name, "job");
    assert.strictEqual(rootUnits[0].children[0].parent?.name, "root");
    assert.strictEqual(
      rootUnits[0].children[0].children[0].parent?.name,
      "jobnet",
    );
  });

  test("returns no document when the parser reports errors", () => {
    const invalidDefinition = validDefinition.replace("ty=g;", "ty=g");

    const result = buildUnitList(invalidDefinition);

    assert.strictEqual(result.document, undefined);
    assert.ok(result.errors.length > 0);
  });
});
