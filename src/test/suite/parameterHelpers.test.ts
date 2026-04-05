import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { tyFactory } from "../../domain/utils/TyUtils";
import { G } from "../../domain/models/units/G";
import { J } from "../../domain/models/units/J";
import { N } from "../../domain/models/units/N";
import { Ln, Sd, Wc } from "../../domain/models/parameters";
import {
  adjustToSdItemCount,
  buildDefaultableParameter,
  buildOptionalParameterArray,
  buildInheritedParameter,
  buildInheritedParameterArray,
  buildOptionalParameter,
  buildRequiredParameter,
  buildRootJobnetParameter,
  buildRootJobnetRuleParameters,
  buildSdAlignedParameters,
  buildSortedRuleParameters,
  buildTopParameter,
  resolveConnectorControlDefaultRawValue,
  resolveJobnetConnectorControlDefaultRawValue,
  resolveParameter,
  resolveParameterArray,
  resolveRootJobnetDefaultRawValue,
  resolveTopDefaultRawValue,
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

const parseRootGroup = (): G => {
  const result = parseAjs(validDefinition);
  assert.deepStrictEqual(result.errors, []);
  return tyFactory(result.rootUnits[0]) as G;
};

const transferDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=job1,j,+0+0;
  unit=job1,,jp1admin,;
  {
    ty=j;
    ts1=source-1;
    td1=dest-1;
    ts2=source-2;
    ts3=source-3;
    top4=keep;
  }
}
`;

const parseTransferJob = (): J => {
  const result = parseAjs(transferDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return root.children[0] as J;
};

const inheritedDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  cl=mo;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    pr=4;
    el=subnet,n,+160+0;
    unit=subnet,,jp1admin,;
    {
      ty=n;
    }
  }
}
`;

const parseInheritedJobnets = (): { jobnet: N; subnet: N } => {
  const result = parseAjs(inheritedDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  const jobnet = root.children[0] as N;
  const subnet = jobnet.children[0] as N;
  return { jobnet, subnet };
};

const rootDefaultDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
  }
}
`;

const parseRootDefaultJobnet = (): N => {
  const result = parseAjs(rootDefaultDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return root.children[0] as N;
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

  test("builds and aligns sd-based rule parameters in one helper", () => {
    const { jobnet } = parseJobnets();

    const aligned = buildSdAlignedParameters(
      resolveParameterArray({
        unit: jobnet,
        parameter: "wc",
        defaultRawValue: "no",
      }),
      jobnet.sd,
      (param) => new Wc(param),
      (rule) =>
        new Wc({
          unit: jobnet,
          parameter: "wc",
          inherited: false,
          defaultRawValue: `${rule},no`,
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
        { rule: 2, value: "2,no" },
      ],
    );
  });

  test("builds inherited scalar and array parameters through shared helpers", () => {
    const { jobnet, subnet } = parseInheritedJobnets();

    const inheritedPriority = buildInheritedParameter(
      {
        unit: subnet,
        parameter: "pr",
        defaultRawValue: "1",
      },
      (param) => param.rawValue ?? param.defaultRawValue,
    );
    assert.strictEqual(inheritedPriority, "4");

    const fallbackPriority = buildInheritedParameter(
      {
        unit: jobnet,
        parameter: "ni",
        defaultRawValue: "7",
      },
      (param) => param.defaultRawValue ?? param.rawValue,
    );
    assert.strictEqual(fallbackPriority, "7");

    const inheritedCloseDates = buildInheritedParameterArray(
      {
        unit: subnet,
        parameter: "cl",
      },
      (param) => param.rawValue ?? param.defaultRawValue,
    );
    assert.deepStrictEqual(inheritedCloseDates, ["mo"]);
  });

  test("builds root-jobnet-aware scalar and rule-array parameters", () => {
    const rootJobnet = parseRootDefaultJobnet();
    const { subnet } = parseJobnets();

    const rootRg = buildRootJobnetParameter(
      {
        unit: rootJobnet,
        parameter: "rg",
        isRootJobnet: true,
        rootDefaultParameter: "rg",
      },
      (param) => param.defaultRawValue ?? param.rawValue,
    );
    assert.strictEqual(rootRg, "1");

    const inheritedRg = buildRootJobnetParameter(
      {
        unit: subnet,
        parameter: "rg",
        isRootJobnet: false,
        rootDefaultParameter: "rg",
      },
      (param) => param.defaultRawValue ?? param.rawValue,
    );
    assert.strictEqual(inheritedRg, "3");

    const rootSd = buildRootJobnetRuleParameters(
      {
        unit: rootJobnet,
        parameter: "sd",
        isRootJobnet: true,
        rootDefaultParameter: "sd",
      },
      (param) => new Sd(param),
    );
    assert.deepStrictEqual(
      rootSd?.map((parameter) => ({
        rule: parameter.rule,
        value: parameter.value(),
      })),
      [{ rule: 1, value: "en" }],
    );
  });

  test("builds top parameters through the shared helper", () => {
    const job = parseTransferJob();

    const derivedTop1 = buildTopParameter(
      {
        unit: job,
        parameter: "top1",
        index: 1,
      },
      (param) => param.defaultRawValue ?? param.rawValue,
    );
    assert.strictEqual(derivedTop1, "sav");

    const explicitTop4 = buildTopParameter(
      {
        unit: job,
        parameter: "top4",
        index: 4,
      },
      (param) => param.defaultRawValue ?? param.rawValue,
    );
    assert.strictEqual(explicitTop4, "keep");
  });

  test("builds optional scalar parameters with explicit, default, and missing values", () => {
    const { jobnet } = parseJobnets();

    const explicitRg = buildOptionalParameter(
      {
        unit: jobnet,
        parameter: "rg",
        defaultRawValue: "9",
      },
      (param) => param.rawValue ?? param.defaultRawValue,
    );
    assert.strictEqual(explicitRg, "3");

    const defaultAb = buildOptionalParameter(
      {
        unit: jobnet,
        parameter: "ab",
        defaultRawValue: "no",
      },
      (param) => param.defaultRawValue ?? param.rawValue,
    );
    assert.strictEqual(defaultAb, "no");

    const missingCm = buildOptionalParameter(
      {
        unit: jobnet,
        parameter: "cm",
      },
      (param) => param.rawValue ?? param.defaultRawValue,
    );
    assert.strictEqual(missingCm, undefined);
  });

  test("builds optional array parameters with explicit and missing values", () => {
    const { jobnet } = parseJobnets();
    const root = parseRootGroup();

    const explicitSd = buildOptionalParameterArray(
      {
        unit: jobnet,
        parameter: "sd",
      },
      (param) => param.rawValue ?? param.defaultRawValue,
    );
    assert.deepStrictEqual(explicitSd, ["ud", "2,en"]);

    const explicitEl = buildOptionalParameterArray(
      {
        unit: root,
        parameter: "el",
      },
      (param) => param.rawValue ?? param.defaultRawValue,
    );
    assert.deepStrictEqual(explicitEl, ["jobnet,n,+0+0"]);

    const missingEnv = buildOptionalParameterArray(
      {
        unit: jobnet,
        parameter: "env",
      },
      (param) => param.rawValue ?? param.defaultRawValue,
    );
    assert.strictEqual(missingEnv, undefined);
  });

  test("builds defaultable scalar parameters with explicit, supplied, and missing defaults", () => {
    const { jobnet } = parseJobnets();

    const explicitNcl = buildDefaultableParameter(
      {
        unit: jobnet,
        parameter: "ncl",
        defaultRawValue: "y",
      },
      (param) => param.rawValue ?? param.defaultRawValue,
    );
    assert.strictEqual(explicitNcl, "y");

    const suppliedNcs = buildDefaultableParameter(
      {
        unit: jobnet,
        parameter: "ncs",
        defaultRawValue: "n",
      },
      (param) => param.rawValue ?? param.defaultRawValue,
    );
    assert.strictEqual(suppliedNcs, "n");

    const missingNcex = buildDefaultableParameter(
      {
        unit: jobnet,
        parameter: "ncex",
      },
      (param) => param.rawValue ?? param.defaultRawValue,
    );
    assert.strictEqual(missingNcex, undefined);
  });

  test("builds required parameters and keeps the missing-parameter error", () => {
    const { jobnet } = parseJobnets();

    const requiredTy = buildRequiredParameter(
      {
        unit: jobnet,
        parameter: "ty",
      },
      (param) => param.rawValue,
      () => "Ty parameter should be specified.",
    );
    assert.strictEqual(requiredTy, "n");

    const missingTyUnit = Object.assign(
      Object.create(Object.getPrototypeOf(jobnet)),
      jobnet,
      {
        parameters: jobnet.parameters.filter(
          (parameter) => parameter.key !== "ty",
        ),
      },
    ) as N;

    assert.throws(
      () =>
        buildRequiredParameter(
          {
            unit: missingTyUnit,
            parameter: "ty",
          },
          (param) => param.rawValue,
          () => "Ty parameter should be specified.",
        ),
      /Ty parameter should be specified\./,
    );
  });

  test("builds sorted rule parameters for simple rule arrays", () => {
    const { jobnet } = parseJobnets();

    const sortedLn = buildSortedRuleParameters(
      [
        {
          unit: jobnet,
          parameter: "ln",
          inherited: false,
          rawValue: "2,after",
          position: 1,
        },
        {
          unit: jobnet,
          parameter: "ln",
          inherited: false,
          rawValue: "1,before",
          position: 0,
        },
      ],
      (param) => new Ln(param),
    );

    assert.deepStrictEqual(
      sortedLn?.map((parameter) => ({
        rule: parameter.rule,
        value: parameter.value(),
      })),
      [
        { rule: 1, value: "before" },
        { rule: 2, value: "after" },
      ],
    );
  });

  test("keeps root-jobnet defaults centralized for wrapper behavior", () => {
    const rootGroup = parseRootGroup();
    const { jobnet, subnet } = parseJobnets();

    assert.strictEqual(
      resolveConnectorControlDefaultRawValue("always-disabled"),
      "n",
    );
    assert.strictEqual(resolveJobnetConnectorControlDefaultRawValue(true), "n");
    assert.strictEqual(
      resolveJobnetConnectorControlDefaultRawValue(false),
      undefined,
    );

    assert.strictEqual(rootGroup.ncl?.value(), "n");
    assert.strictEqual(rootGroup.ncs?.value(), "n");
    assert.strictEqual(rootGroup.ncex?.value(), "n");
    assert.strictEqual(jobnet.ncl?.value(), "n");
    assert.strictEqual(jobnet.ncs?.value(), "n");
    assert.strictEqual(jobnet.ncex?.value(), "n");
    assert.strictEqual(subnet.ncl, undefined);
    assert.strictEqual(subnet.ncs, undefined);
    assert.strictEqual(subnet.ncex, undefined);
  });

  test("preserves sorted root-jobnet sd defaults through shared helper usage", () => {
    const rootDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
}
`;

    const result = parseAjs(rootDefinition);
    assert.deepStrictEqual(result.errors, []);
    const root = tyFactory(result.rootUnits[0]) as N;

    assert.deepStrictEqual(
      root.sd?.map((parameter) => ({
        rule: parameter.rule,
        value: parameter.value(),
      })),
      [{ rule: 1, value: "en" }],
    );
  });

  test("derives top defaults from transfer source and destination presence", () => {
    const job = parseTransferJob();

    assert.strictEqual(resolveTopDefaultRawValue(job, 1), "sav");
    assert.strictEqual(resolveTopDefaultRawValue(job, 2), "del");
    assert.strictEqual(resolveTopDefaultRawValue(job, 3), "del");
    assert.strictEqual(resolveTopDefaultRawValue(job, 4), "");

    assert.strictEqual(job.top1?.value(), "sav");
    assert.strictEqual(job.top2?.value(), "del");
    assert.strictEqual(job.top3?.value(), "del");
    assert.strictEqual(job.top4?.value(), "keep");
  });
});
