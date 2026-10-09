import * as assert from "assert";
import { parseRawAjsForTest } from "../support/parseAjs";
import { buildNormalizedUnit } from "../../infrastructure/parser/normalization/normalize/unitBuilder";

const validDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  gty=n;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    sd=en;
    el=job-a,j,+240+144;
    ar=(f=job-a,t=job-a);
    unit=job-a,,jp1admin,;
    {
      ty=j;
      cm="first#"#"##note";
    }
  }
}
`;

suite("Normalize unit builder helpers", () => {
  test("builds normalized units from resolved inputs", () => {
    const result = parseRawAjsForTest(validDefinition);
    assert.deepStrictEqual(result.errors, []);

    const root = result.rootUnits[0];
    const jobnet = root.children[0];
    const relation = {
      sourceUnitId: "/root/jobnet/job-a",
      targetUnitId: "/root/jobnet/job-a",
      type: "seq" as const,
    };
    const child = buildNormalizedUnit({
      unit: jobnet.children[0],
      unitType: "j",
      relations: [],
      children: [],
    });

    const normalized = buildNormalizedUnit({
      unit: jobnet,
      unitType: "n",
      relations: [relation],
      children: [child],
    });

    assert.strictEqual(normalized.id, "/root/jobnet");
    assert.strictEqual(normalized.name, "jobnet");
    assert.strictEqual(normalized.unitType, "n");
    assert.strictEqual(normalized.parentId, "/root");
    assert.strictEqual(normalized.isRootJobnet, true);
    assert.strictEqual(normalized.hasSchedule, true);
    assert.deepStrictEqual(
      normalized.parameters.map(({ key, value }) => [key, value]),
      [
        ["ty", "n"],
        ["sd", "en"],
        ["el", "job-a,j,+240+144"],
        ["ar", "(f=job-a,t=job-a)"],
      ],
    );
    assert.deepStrictEqual(
      normalized.relations.map(({ sourceUnitId, targetUnitId, type }) => [
        sourceUnitId,
        targetUnitId,
        type,
      ]),
      [[relation.sourceUnitId, relation.targetUnitId, relation.type]],
    );
    assert.deepStrictEqual(
      normalized.children.map(({ id, unitType, parentId }) => [
        id,
        unitType,
        parentId,
      ]),
      [[child.id, child.unitType, child.parentId]],
    );
  });
});
