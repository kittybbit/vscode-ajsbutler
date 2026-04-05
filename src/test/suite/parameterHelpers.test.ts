import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { tyFactory } from "../../domain/utils/TyUtils";
import { N } from "../../domain/models/units/N";
import { Sd, Wc } from "../../domain/models/parameters";
import {
  adjustToSdItemCount,
  resolveParameter,
  resolveParameterArray,
  resolveRootJobnetDefaultRawValue,
} from "../../domain/models/parameters/parameterHelpers";

const validDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    rg=3;
    sd=ud;
    sd=2,en;
    wc=2;
    el=subnet,n,+160+0;
    unit=subnet,,jp1admin,;
    {
      ty=n;
    }
  }
}
`;

const parseJobnets = (): { jobnet: N; subnet: N } => {
  const result = parseAjs(validDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  const jobnet = root.children[0] as N;
  const subnet = jobnet.children[0] as N;
  return { jobnet, subnet };
};

suite("Parameter helpers", () => {
  test("resolves own, inherited, default, and singular parameters", () => {
    const { jobnet, subnet } = parseJobnets();

    const own = resolveParameterArray({
      unit: jobnet,
      parameter: "rg",
      inherit: true,
      defaultRawValue: "9",
    });
    assert.strictEqual(own?.length, 1);
    assert.strictEqual(own?.[0].rawValue, "3");
    assert.strictEqual(own?.[0].position, 1);

    const inherited = resolveParameterArray({
      unit: subnet,
      parameter: "rg",
      inherit: true,
      defaultRawValue: "9",
    });
    assert.strictEqual(inherited?.length, 1);
    assert.strictEqual(inherited?.[0].rawValue, "3");
    assert.strictEqual(inherited?.[0].inherited, true);
    assert.strictEqual(inherited?.[0].position, -1);

    const fallback = resolveParameterArray({
      unit: subnet,
      parameter: "ncl",
      defaultRawValue: ["n", "y"],
    });
    assert.deepStrictEqual(
      fallback?.map((parameter) => parameter.defaultRawValue),
      ["n", "y"],
    );

    assert.throws(
      () =>
        resolveParameter({
          unit: jobnet,
          parameter: "sd",
        }),
      /unexpected array/,
    );

    assert.strictEqual(resolveRootJobnetDefaultRawValue("rg", true), "1");
    assert.strictEqual(resolveRootJobnetDefaultRawValue("sd", true), "en");
    assert.strictEqual(resolveRootJobnetDefaultRawValue("ncl", true), "n");
    assert.strictEqual(resolveRootJobnetDefaultRawValue("ncs", true), "n");
    assert.strictEqual(resolveRootJobnetDefaultRawValue("ncex", true), "n");
    assert.strictEqual(
      resolveRootJobnetDefaultRawValue("rg", false),
      undefined,
    );
  });

  test("aligns rule-based parameters to sd item count", () => {
    const { jobnet } = parseJobnets();

    const aligned = adjustToSdItemCount(
      jobnet.sd,
      jobnet.wc,
      (rule) =>
        new Wc({
          unit: jobnet,
          parameter: "wc",
          inherited: false,
          defaultRawValue: `${rule},1`,
          position: -1,
        }),
    );

    assert.deepStrictEqual(
      aligned?.map((parameter) => ({
        rule: parameter?.rule,
        value: parameter?.value(),
      })),
      [
        { rule: 1, value: "2" },
        { rule: 2, value: "2,1" },
      ],
    );

    const unchanged = adjustToSdItemCount(
      undefined,
      jobnet.sd,
      (rule) =>
        new Sd({
          unit: jobnet,
          parameter: "sd",
          inherited: false,
          defaultRawValue: `${rule},ud`,
          position: -1,
        }),
    );
    assert.strictEqual(unchanged, undefined);
  });

  test("keeps root-jobnet defaults centralized for wrapper behavior", () => {
    const { jobnet, subnet } = parseJobnets();

    assert.strictEqual(jobnet.ncl?.value(), "n");
    assert.strictEqual(jobnet.ncs?.value(), "n");
    assert.strictEqual(jobnet.ncex?.value(), "n");
    assert.strictEqual(subnet.ncl, undefined);
    assert.strictEqual(subnet.ncs, undefined);
    assert.strictEqual(subnet.ncex, undefined);
  });
});
