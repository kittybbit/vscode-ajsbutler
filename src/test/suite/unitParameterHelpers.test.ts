import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { tyFactory } from "../../domain/utils/TyUtils";
import { J } from "../../domain/models/units/J";
import { resolveDefinedParams } from "../../domain/models/units/unitParameterHelpers";

const validDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=job-a,j,+0+0;
  unit=job-a,,jp1admin,;
  {
    ty=j;
    cm="first";
    te="echo hello";
    wkp="/tmp";
  }
}
`;

const parseJob = (): J => {
  const result = parseAjs(validDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return root.children[0] as J;
};

suite("Unit parameter helpers", () => {
  test("resolves defined parameter getters from the wrapper prototype chain", () => {
    const job = parseJob();

    const params = resolveDefinedParams(job);

    assert.ok(params.includes("ty"));
    assert.ok(params.includes("cm"));
    assert.ok(params.includes("te"));
    assert.ok(params.includes("wkp"));
    assert.ok(params.includes("eu"));
    assert.ok(!params.some((param) => String(param) === "priority"));
    assert.ok(!params.some((param) => String(param) === "hasWaitedFor"));
  });
});
