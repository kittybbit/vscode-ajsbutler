import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { buildNormalizedUnit } from "../../domain/models/ajs/normalizeUnitBuilderHelpers";

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
    const result = parseAjs(validDefinition);
    assert.deepStrictEqual(result.errors, []);

    const root = result.rootUnits[0];
    const jobnet = root.children[0];
    const relation = {
      sourceUnitId: "/root/jobnet/job-a",
      targetUnitId: "/root/jobnet/job-a",
      type: "seq" as const,
    };
    const child = buildNormalizedUnit(jobnet.children[0], "j", [], []);

    const normalized = buildNormalizedUnit(jobnet, "n", [relation], [child]);

    assert.deepStrictEqual(normalized, {
      id: "/root/jobnet",
      name: "jobnet",
      unitAttribute: "jobnet,,jp1admin,",
      permission: "jp1admin",
      jp1Username: "jp1admin",
      jp1ResourceGroup: undefined,
      unitType: "n",
      groupType: undefined,
      comment: undefined,
      absolutePath: "/root/jobnet",
      depth: 1,
      parentId: "/root",
      isRoot: false,
      isRecovery: false,
      isRootJobnet: true,
      hasSchedule: true,
      hasWaitedFor: false,
      layout: { h: 0, v: 0 },
      parameters: [
        { key: "ty", value: "n" },
        { key: "sd", value: "en" },
        { key: "el", value: "job-a,j,+240+144" },
        { key: "ar", value: "(f=job-a,t=job-a)" },
      ],
      relations: [relation],
      children: [child],
    });
  });
});
