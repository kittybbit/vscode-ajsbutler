import * as assert from "assert";
import { ParamFactory } from "../../domain/models/parameters/ParameterFactory";
import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import { J } from "../../domain/models/units/J";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { tyFactory } from "../../domain/utils/TyUtils";

const definition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=job1,j,+0+0;
  unit=job1,,jp1admin,;
  {
    ty=j;
    cm=comment;
    wt=wait-target;
  }
}
`;

const parseJob = (): J => {
  const result = parseAjs(definition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return root.children[0] as J;
};

suite("ParameterFactory", () => {
  test("returns explicit optional scalar parameters through the facade", () => {
    const job = parseJob();

    const cm = ParamFactory.cm(job);

    assert.ok(cm);
    assert.strictEqual(cm?.rawValue, "comment");
    assert.strictEqual(cm?.value(), "comment");
  });

  test("returns defaulted optional scalar parameters through the facade", () => {
    const job = parseJob();

    const ab = ParamFactory.ab(job);

    assert.ok(ab);
    assert.strictEqual(ab?.rawValue, undefined);
    assert.strictEqual(ab?.defaultRawValue, DEFAULTS.Ab);
    assert.strictEqual(ab?.value(), DEFAULTS.Ab);
  });

  test("preserves the legacy wth to wt mapping", () => {
    const job = parseJob();

    const wth = ParamFactory.wth(job);

    assert.ok(wth);
    assert.strictEqual(wth?.parameter, "wt");
    assert.strictEqual(wth?.value(), "wait-target");
  });
});
