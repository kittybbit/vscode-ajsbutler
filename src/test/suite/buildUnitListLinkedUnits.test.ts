import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { buildUnitListLinkedUnits } from "../../application/unit-list/buildUnitListLinkedUnits";

const definition = `
unit=root,,jp1admin,;
{
  ty=g;
  unit=a,,jp1admin,;
  {
    ty=n;
  }
  unit=b,,jp1admin,;
  {
    ty=n;
  }
  unit=c,,jp1admin,;
  {
    ty=qj;
    el=a,n,+0+0;
    el=b,n,+0+0;
  }
}
`;

suite("Build Unit List Linked Units", () => {
  test("projects previous and next linked units from parent relations", () => {
    const result = parseAjs(definition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);

    const units = document.rootUnits[0]?.children;
    assert.ok(units);

    const unitById = new Map(units.map((unit) => [unit.id, unit]));
    const [aUnit, bUnit, cUnit] = units;

    assert.ok(aUnit);
    assert.ok(bUnit);
    assert.ok(cUnit);

    const aView = buildUnitListLinkedUnits(document, aUnit, unitById);
    const cView = buildUnitListLinkedUnits(document, cUnit, unitById);

    assert.deepStrictEqual(aView.previousUnits, []);
    assert.strictEqual(aView.nextUnits.length, 1);
    assert.strictEqual(aView.nextUnits[0].id, cUnit.id);
    assert.strictEqual(aView.nextUnits[0].absolutePath, cUnit.absolutePath);
    assert.strictEqual(aView.nextUnits[0].relationType, "n");

    assert.deepStrictEqual(
      cView.previousUnits.map((link) => link.id),
      [aUnit.id, bUnit.id],
    );
    assert.deepStrictEqual(cView.nextUnits, []);
  });
});
