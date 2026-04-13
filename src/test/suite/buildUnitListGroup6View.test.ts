import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { buildUnitListGroup6View } from "../../application/unit-list/buildUnitListGroup6View";

const definition = `
unit=root,,jp1admin,;
{
  ty=g;
  op=mo:1;
  op=2024/01/01;
  cl=tu:2;
  cl=2024/01/02;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
  }
}
`;

suite("Build Unit List Group 6 View", () => {
  test("projects calendar week flags and non-week dates for group units", () => {
    const result = parseAjs(definition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const root = document.rootUnits[0];

    const view = buildUnitListGroup6View(root);

    assert.strictEqual(view.mo, true);
    assert.strictEqual(view.tu, false);
    assert.strictEqual(view.we, undefined);
    assert.deepStrictEqual(view.openDates, ["2024/01/01"]);
    assert.deepStrictEqual(view.closeDates, ["2024/01/02"]);
  });

  test("returns empty date arrays for non-group units", () => {
    const result = parseAjs(definition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const jobnet = document.rootUnits[0]?.children[0];

    assert.ok(jobnet);

    const view = buildUnitListGroup6View(jobnet);

    assert.deepStrictEqual(view.openDates, []);
    assert.deepStrictEqual(view.closeDates, []);
    assert.strictEqual(view.mo, undefined);
    assert.strictEqual(view.tu, undefined);
  });
});
