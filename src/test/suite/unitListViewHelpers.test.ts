import * as assert from "assert";
import { AjsDocument, AjsUnit } from "../../domain/models/ajs/AjsDocument";
import {
  buildCalendarWeekView,
  getPriorityForUnitTypes,
  isNonWeekCalendarValue,
  parseCftd,
  parseCy,
  parseLnParentRule,
  parseSd,
  parseSh,
  parseShd,
  parseTimeValue,
  parseWc,
} from "../../application/unit-list/unitListViewHelpers";

const createUnit = (overrides: Partial<AjsUnit> = {}): AjsUnit => ({
  id: "u1",
  name: "unit",
  unitAttribute: "unit,,jp1admin,",
  permission: "jp1admin",
  jp1Username: "jp1admin",
  jp1ResourceGroup: undefined,
  unitType: "j",
  groupType: undefined,
  comment: undefined,
  absolutePath: "/root/unit",
  depth: 1,
  parentId: "root",
  isRoot: false,
  isRecovery: false,
  isRootJobnet: false,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 80, v: 48 },
  parameters: [],
  relations: [],
  children: [],
  ...overrides,
});

suite("Unit List View helpers", () => {
  test("maps calendar week flags and non-week values separately", () => {
    const weekView = buildCalendarWeekView(
      ["mo:1", "2024/01/01"],
      ["tu:2", "2024/01/02"],
    );

    assert.strictEqual(weekView.mo, true);
    assert.strictEqual(weekView.tu, false);
    assert.strictEqual(weekView.we, undefined);
    assert.strictEqual(isNonWeekCalendarValue("2024/01/01"), true);
    assert.strictEqual(isNonWeekCalendarValue("mo:1"), false);
  });

  test("resolves priority from ni, pr precedence, and parent inheritance", () => {
    const root = createUnit({
      id: "root",
      name: "root",
      absolutePath: "/root",
      depth: 0,
      parentId: undefined,
      unitType: "n",
      isRoot: true,
      isRootJobnet: true,
      parameters: [
        { key: "ni", value: "5", position: 1 },
        { key: "pr", value: "4", position: 2 },
      ],
    });
    const child = createUnit({
      id: "child",
      absolutePath: "/root/child",
      unitType: "j",
      parameters: [],
    });
    const qjob = createUnit({
      id: "qjob",
      absolutePath: "/root/qjob",
      unitType: "qj",
      parameters: [{ key: "ni", value: "0", position: 1 }],
    });
    root.children = [child, qjob];

    const document: AjsDocument = {
      rootUnits: [root],
      warnings: [],
    };

    assert.strictEqual(
      getPriorityForUnitTypes(document, root, new Map(), ["n", "rn"]),
      4,
    );
    assert.strictEqual(
      getPriorityForUnitTypes(document, child, new Map(), ["j", "rj"]),
      4,
    );
    assert.strictEqual(
      getPriorityForUnitTypes(document, qjob, new Map(), [
        "j",
        "rj",
        "pj",
        "rp",
        "qj",
        "rq",
      ]),
      3,
    );
  });

  test("parses schedule-related parameter fragments consistently", () => {
    assert.deepStrictEqual(parseSd("2024/12/+31"), {
      type: "+",
      yearMonth: "2024/12",
      day: "31",
    });
    assert.deepStrictEqual(parseSd("2,en"), {
      type: "en",
      yearMonth: "",
      day: "",
    });
    assert.strictEqual(parseLnParentRule("2,parent-rule"), "parent-rule");
    assert.strictEqual(parseTimeValue("09:30", "+00:00"), "09:30");
    assert.strictEqual(parseCy("(3,d)"), "3,d");
    assert.strictEqual(parseSh("be"), "be");
    assert.strictEqual(parseShd("5"), "5");
    assert.deepStrictEqual(parseCftd("be,3,9"), {
      scheduleByDaysFromStart: "be,3",
      maxShiftableDays: "9",
    });
    assert.strictEqual(parseWc("4"), "4");
  });
});
