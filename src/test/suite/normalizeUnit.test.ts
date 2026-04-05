import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import {
  resolveNormalizedComment,
  resolveNormalizedGroupType,
  resolveNormalizedHasSchedule,
  resolveNormalizedHasWaitedFor,
  resolveNormalizedIsRootJobnet,
  resolveNormalizedLayout,
  resolveNormalizedUnitType,
} from "../../domain/models/ajs/normalize/unit";
import { AjsNormalizationWarning } from "../../domain/models/ajs/AjsDocument";

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
    el=job-b,qj,+400+144;
    unit=job-a,,jp1admin,;
    {
      ty=j;
      cm="first#"#"##note";
    }
    unit=job-b,,jp1admin,;
    {
      ty=qj;
      eun=job-a;
    }
  }
}
`;

const missingTypeDefinition = `
unit=root,,jp1admin,;
{
  unit=job-a,,jp1admin,;
  {
    cm="hello";
  }
}
`;

suite("Normalize unit helpers", () => {
  test("resolve normalized helper values from units", () => {
    const result = parseAjs(validDefinition);
    assert.deepStrictEqual(result.errors, []);

    const root = result.rootUnits[0];
    const jobnet = root.children[0];
    const jobA = jobnet.children[0];
    const jobB = jobnet.children[1];

    const warnings: AjsNormalizationWarning[] = [];
    assert.strictEqual(resolveNormalizedUnitType(jobnet, warnings), "n");
    assert.deepStrictEqual(warnings, []);
    assert.strictEqual(resolveNormalizedGroupType(root), "n");
    assert.strictEqual(resolveNormalizedComment(jobA), 'first""#note');
    assert.deepStrictEqual(resolveNormalizedLayout(jobA), { h: 240, v: 144 });
    assert.strictEqual(resolveNormalizedHasSchedule(jobnet, "n"), true);
    assert.strictEqual(resolveNormalizedHasSchedule(jobA, "j"), false);
    assert.strictEqual(resolveNormalizedHasWaitedFor(jobB), true);
    assert.strictEqual(resolveNormalizedIsRootJobnet(jobnet, "n"), true);
    assert.strictEqual(resolveNormalizedIsRootJobnet(jobA, "j"), false);
    assert.deepStrictEqual(resolveNormalizedLayout(root), { h: 0, v: 0 });
  });

  test("defaults unit type to g and records a warning when ty is missing", () => {
    const result = parseAjs(missingTypeDefinition);
    assert.deepStrictEqual(result.errors, []);

    const missingTypeUnit = result.rootUnits[0].children[0];
    const warnings: AjsNormalizationWarning[] = [];

    assert.strictEqual(
      resolveNormalizedUnitType(missingTypeUnit, warnings),
      "g",
    );
    assert.deepStrictEqual(warnings, [
      {
        code: "missing-unit-type",
        message: "Unit type could not be resolved for /root/job-a.",
        unitPath: "/root/job-a",
      },
    ]);
  });
});
