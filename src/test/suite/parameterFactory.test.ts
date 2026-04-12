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

const arrayDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=job1,j,+0+0;
  unit=job1,,jp1admin,;
  {
    ty=j;
    ar=job2,0;
    ar=job3,1;
    jpoif=if-a;
    jpoif=if-b;
  }
}
`;

const parseJob = (): J => {
  const result = parseAjs(definition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return root.children[0] as J;
};

const parseArrayJob = (): J => {
  const result = parseAjs(arrayDefinition);
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

  test("returns explicit optional array parameters through the facade", () => {
    const job = parseArrayJob();

    const ar = ParamFactory.ar(job);
    const jpoif = ParamFactory.jpoif(job);

    assert.deepStrictEqual(
      ar?.map((parameter) => parameter.value()),
      ["job2,0", "job3,1"],
    );
    assert.deepStrictEqual(
      jpoif?.map((parameter) => parameter.value()),
      ["if-a", "if-b"],
    );
  });

  test("returns undefined for missing optional array parameters", () => {
    const job = parseJob();

    const ar = ParamFactory.ar(job);

    assert.strictEqual(ar, undefined);
  });
});
