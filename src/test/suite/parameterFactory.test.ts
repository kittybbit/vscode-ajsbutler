import * as assert from "assert";
import { ParamFactory } from "../../domain/models/parameters/ParameterFactory";
import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import { J } from "../../domain/models/units/J";
import { N } from "../../domain/models/units/N";
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

const scheduleDefinition = `
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
    ln=2;
    ln=1;
  }
}
`;

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

const groupDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
}
`;

const transferDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=job1,j,+0+0;
  unit=job1,,jp1admin,;
  {
    ty=j;
    ts1=src-1;
    td1=dst-1;
    ts2=src-2;
    ts3=src-3;
    top4=keep;
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

const parseInheritedJobnet = (): N => {
  const result = parseAjs(inheritedDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  const jobnet = root.children[0] as N;
  return jobnet.children[0] as N;
};

const parseScheduleJobnet = (): N => {
  const result = parseAjs(scheduleDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return root.children[0] as N;
};

const parseRootDefaultJobnet = (): N => {
  const result = parseAjs(rootDefaultDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return root.children[0] as N;
};

const parseRootGroup = () => {
  const result = parseAjs(groupDefinition);
  assert.deepStrictEqual(result.errors, []);
  return tyFactory(result.rootUnits[0]);
};

const parseTransferJob = (): J => {
  const result = parseAjs(transferDefinition);
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

  test("returns inherited scalar parameters through the facade", () => {
    const subnet = parseInheritedJobnet();

    const pr = ParamFactory.pr(subnet);

    assert.ok(pr);
    assert.strictEqual(pr?.value(), "4");
    assert.strictEqual(pr?.inherited, true);
  });

  test("returns inherited-scalar defaults through the facade", () => {
    const subnet = parseInheritedJobnet();

    assert.strictEqual(ParamFactory.md(subnet)?.value(), DEFAULTS.Md);
    assert.strictEqual(ParamFactory.ni(subnet)?.value(), DEFAULTS.Ni);
    assert.strictEqual(ParamFactory.sdd(subnet)?.value(), DEFAULTS.Sdd);
    assert.strictEqual(ParamFactory.stt(subnet)?.value(), DEFAULTS.Stt);
  });

  test("returns inherited array parameters through the facade", () => {
    const subnet = parseInheritedJobnet();

    const cl = ParamFactory.cl(subnet);

    assert.deepStrictEqual(
      cl?.map((parameter) => parameter.value()),
      ["mo"],
    );
    assert.ok(cl?.every((parameter) => parameter.inherited));
  });

  test("returns schedule-rule parameters with explicit and fallback values", () => {
    const jobnet = parseScheduleJobnet();

    const wc = ParamFactory.wc(jobnet);

    assert.deepStrictEqual(
      wc?.map((parameter) => parameter?.value()),
      ["2", "2,no"],
    );
  });

  test("returns schedule-rule default values aligned to sd rules", () => {
    const jobnet = parseScheduleJobnet();

    const wt = ParamFactory.wt(jobnet);

    assert.deepStrictEqual(
      wt?.map((parameter) => parameter?.value()),
      ["no", "2,no"],
    );
  });

  test("returns schedule-rule-bearing parameters sorted by rule", () => {
    const jobnet = parseScheduleJobnet();

    const ln = ParamFactory.ln(jobnet);

    assert.deepStrictEqual(
      ln?.map((parameter) => ({
        rule: parameter.rule,
        value: parameter.value(),
      })),
      [
        { rule: 1, value: "1" },
        { rule: 2, value: "2" },
      ],
    );
  });

  test("returns explicit root-aware scalar and root-default-aware schedule-rule parameters through the facade", () => {
    const jobnet = parseScheduleJobnet();

    const rg = ParamFactory.rg(jobnet);
    const sd = ParamFactory.sd(jobnet);

    assert.strictEqual(rg?.value(), "3");
    assert.deepStrictEqual(
      sd?.map((parameter) => parameter.value()),
      ["ud", "2,en"],
    );
  });

  test("returns root-jobnet defaults through the facade", () => {
    const jobnet = parseRootDefaultJobnet();

    const rg = ParamFactory.rg(jobnet);
    const sd = ParamFactory.sd(jobnet);

    assert.strictEqual(rg?.value(), DEFAULTS.Rg);
    assert.deepStrictEqual(
      sd?.map((parameter) => parameter.value()),
      [DEFAULTS.Sd],
    );
  });

  test("returns connector-control defaults through the facade", () => {
    const root = parseRootGroup();

    assert.strictEqual(ParamFactory.ncl(root, "n")?.value(), "n");
    assert.strictEqual(ParamFactory.ncs(root, "n")?.value(), "n");
    assert.strictEqual(ParamFactory.ncex(root, "n")?.value(), "n");
    assert.strictEqual(ParamFactory.ncl(root, "y")?.value(), "y");
    assert.strictEqual(ParamFactory.ncs(root, "y")?.value(), "y");
    assert.strictEqual(ParamFactory.ncex(root, "y")?.value(), "y");
  });

  test("returns required parameters through the facade", () => {
    const job = parseJob();

    const ty = ParamFactory.ty(job);

    assert.strictEqual(ty.value(), "j");
  });

  test("returns transfer-operation parameters with derived and explicit values through the facade", () => {
    const job = parseTransferJob();

    assert.strictEqual(ParamFactory.top1(job)?.value(), "sav");
    assert.strictEqual(ParamFactory.top2(job)?.value(), "del");
    assert.strictEqual(ParamFactory.top3(job)?.value(), "del");
    assert.strictEqual(ParamFactory.top4(job)?.value(), "keep");
  });
});
