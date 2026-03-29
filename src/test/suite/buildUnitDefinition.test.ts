import * as assert from "assert";
import { buildUnitDefinition } from "../../application/unit-definition/buildUnitDefinition";
import { AjsUnit } from "../../domain/models/ajs/AjsDocument";

const unit: AjsUnit = {
  id: "u1",
  name: "job1",
  unitAttribute: "job1,,jp1admin,",
  permission: "jp1admin",
  jp1Username: "jp1admin",
  jp1ResourceGroup: undefined,
  unitType: "j",
  groupType: undefined,
  comment: "example",
  absolutePath: "/root/job1",
  depth: 1,
  parentId: "root",
  isRoot: false,
  isRecovery: false,
  isRootJobnet: false,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 80, v: 48 },
  parameters: [
    { key: "ty", value: "j" },
    { key: "cm", value: "example" },
  ],
  dependencies: [],
  children: [],
};

suite("Build Unit Definition", () => {
  test("builds raw data and command text from a normalized unit", () => {
    const definition = buildUnitDefinition(unit);

    assert.strictEqual(definition.absolutePath, "/root/job1");
    assert.strictEqual(definition.rawData, "ty=j\ncm=example");
    assert.deepStrictEqual(definition.commands, [
      {
        id: "ajsshow",
        label: "ajsshow",
        value: "ajsshow -R /root/job1",
      },
      {
        id: "ajsprint",
        label: "ajsprint",
        value: "ajsprint -a -R /root/job1",
      },
    ]);
  });
});
