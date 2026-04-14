import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { buildUnitListGroup10View } from "../../application/unit-list/buildUnitListGroup10View";

const definition = `
unit=root,,jp1admin,;
{
  ty=g;
  de=y;
  ed=2024/12/31;
  jc=/root/jobnet;
  ejn=exclusive-a;
  ln=2;
  sd=2024/03/05;
  sd=2,+10;
  sd=3,en;
  st=08:00;
  st=+09:00;
  cy=(3,d);
  sh=be;
  shd=5;
  cftd=be,3,9;
  sy=08:00;
  ey=18:00;
  wc=4;
  wt=00:30;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
  }
}
`;

suite("Build Unit List Group 10 View", () => {
  test("projects schedule-related group10 fields from unit parameters", () => {
    const result = parseAjs(definition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const root = document.rootUnits[0];

    const view = buildUnitListGroup10View(root);

    assert.strictEqual(view.deleteAfterExecution, "y");
    assert.strictEqual(view.executionDate, "2024/12/31");
    assert.strictEqual(view.jobGroupPath, "/root/jobnet");
    assert.strictEqual(view.exclusiveJobnetName, "exclusive-a");
    assert.deepStrictEqual(view.parentRules, ["2"]);
    assert.deepStrictEqual(view.scheduleDateTypes, ["", "+", "en"]);
    assert.deepStrictEqual(view.scheduleDateYearMonths, ["2024/03/", "", ""]);
    assert.deepStrictEqual(view.scheduleDateDays, ["05", "10", ""]);
    assert.deepStrictEqual(view.startTimes, ["08:00", "+09:00"]);
    assert.deepStrictEqual(view.cycles, ["3"]);
    assert.deepStrictEqual(view.substitutes, ["be"]);
    assert.deepStrictEqual(view.shiftDays, ["5"]);
    assert.deepStrictEqual(view.scheduleByDaysFromStart, ["be,3"]);
    assert.deepStrictEqual(view.maxShiftableDays, ["9"]);
    assert.deepStrictEqual(view.startRangeTimes, ["08:00"]);
    assert.deepStrictEqual(view.endRangeTimes, ["18:00"]);
    assert.deepStrictEqual(view.waitCounts, ["4"]);
    assert.deepStrictEqual(view.waitTimes, ["00:30"]);
  });

  test("returns empty arrays for units without schedule parameters", () => {
    const result = parseAjs(definition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const jobnet = document.rootUnits[0]?.children[0];

    assert.ok(jobnet);

    const view = buildUnitListGroup10View(jobnet);

    assert.deepStrictEqual(view.parentRules, []);
    assert.deepStrictEqual(view.scheduleDateTypes, []);
    assert.deepStrictEqual(view.scheduleDateYearMonths, []);
    assert.deepStrictEqual(view.scheduleDateDays, []);
    assert.deepStrictEqual(view.startTimes, []);
    assert.deepStrictEqual(view.cycles, []);
    assert.deepStrictEqual(view.substitutes, []);
    assert.deepStrictEqual(view.shiftDays, []);
    assert.deepStrictEqual(view.scheduleByDaysFromStart, []);
    assert.deepStrictEqual(view.maxShiftableDays, []);
    assert.deepStrictEqual(view.startRangeTimes, []);
    assert.deepStrictEqual(view.endRangeTimes, []);
    assert.deepStrictEqual(view.waitCounts, []);
    assert.deepStrictEqual(view.waitTimes, []);
  });
});
