import * as assert from "assert";
import { ParamFactory } from "../../domain/models/parameters/ParameterFactory";
import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import { J } from "../../domain/models/units/J";
import { Cj } from "../../domain/models/units/Cj";
import { Evsj } from "../../domain/models/units/Evsj";
import { Htpj } from "../../domain/models/units/Htpj";
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

const scheduleDefaultDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    sd=2026/04/27;
    sd=2,en;
  }
}
`;

const explicitRuleOneScheduleDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    sd=1,en;
    sd=2,en;
    st=08:00;
    st=2,09:00;
    sy=M120;
    sy=2,U60;
    ey=C180;
    ey=2,18:00;
    ln=3;
    ln=2,4;
    cy=(3,d);
    cy=2,(4,w);
    sh=be;
    sh=2,af;
    shd=5;
    shd=2,6;
    cftd=be,3,9;
    cftd=2,af,4,8;
    wc=4;
    wc=2,5;
    wt=00:30;
    wt=2,01:00;
  }
}
`;

const undefinedScheduleDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    sd=0,ud;
  }
}
`;

const scheduleRelativeTimeDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    sd=2026/04/27;
    sd=2,en;
    sy=M120;
    ey=2,U60;
  }
}
`;

const nestedScheduleDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    ln=2;
    el=subnet,n,+160+0;
    unit=subnet,,jp1admin,;
    {
      ty=n;
      ln=2;
      ln=1;
    }
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

const jobEndJudgmentDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=job1,j,+0+0;
  el=custom,cj,+160+0;
  unit=job1,,jp1admin,;
  {
    ty=j;
  }
  unit=custom,,jp1admin,;
  {
    ty=cj;
  }
}
`;

const explicitJobEndJudgmentDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=job1,j,+0+0;
  unit=job1,,jp1admin,;
  {
    ty=j;
    jd=ab;
  }
}
`;

const httpConnectionJobDefaultDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=http,htpj,+0+0;
  el=explicit,rhtpj,+160+0;
  unit=http,,jp1admin,;
  {
    ty=htpj;
    htcfl="conn.conf";
    htstf="status.log";
    htrhf="header.log";
  }
  unit=explicit,,jp1admin,;
  {
    ty=rhtpj;
    htcfl="conn.conf";
    htstf="status.log";
    htrhf="header.log";
    eu=ent;
  }
}
`;

const eventSendingJobDefaultDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=event,evsj,+0+0;
  el=explicit,revsj,+160+0;
  unit=event,,jp1admin,;
  {
    ty=evsj;
  }
  unit=explicit,,jp1admin,;
  {
    ty=revsj;
    evssv=wr;
    evsrt=y;
    evspl=5;
    evsrc=7;
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

const parseScheduleDefaultJobnet = (): N => {
  const result = parseAjs(scheduleDefaultDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return root.children[0] as N;
};

const parseExplicitRuleOneScheduleJobnet = (): N => {
  const result = parseAjs(explicitRuleOneScheduleDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return root.children[0] as N;
};

const parseUndefinedScheduleJobnet = (): N => {
  const result = parseAjs(undefinedScheduleDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return root.children[0] as N;
};

const parseScheduleRelativeTimeJobnet = (): N => {
  const result = parseAjs(scheduleRelativeTimeDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return root.children[0] as N;
};

const parseNestedScheduleJobnets = (): { jobnet: N; subnet: N } => {
  const result = parseAjs(nestedScheduleDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  const jobnet = root.children[0] as N;
  const subnet = jobnet.children[0] as N;
  return { jobnet, subnet };
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

const parseJobEndJudgmentUnits = (): { job: J; customJob: Cj } => {
  const result = parseAjs(jobEndJudgmentDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return {
    job: root.children[0] as J,
    customJob: root.children[1] as Cj,
  };
};

const parseExplicitJobEndJudgmentJob = (): J => {
  const result = parseAjs(explicitJobEndJudgmentDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return root.children[0] as J;
};

const parseHttpConnectionJobs = (): {
  httpJob: Htpj;
  explicitHttpJob: Htpj;
} => {
  const result = parseAjs(httpConnectionJobDefaultDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return {
    httpJob: root.children[0] as Htpj,
    explicitHttpJob: root.children[1] as Htpj,
  };
};

const parseEventSendingJobs = (): {
  eventJob: Evsj;
  explicitEventJob: Evsj;
} => {
  const result = parseAjs(eventSendingJobDefaultDefinition);
  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  return {
    eventJob: root.children[0] as Evsj,
    explicitEventJob: root.children[1] as Evsj,
  };
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

  test("aligns omitted schedule-rule numbers to explicit rule one", () => {
    const jobnet = parseExplicitRuleOneScheduleJobnet();

    const st = ParamFactory.st(jobnet);
    const sy = ParamFactory.sy(jobnet);
    const ey = ParamFactory.ey(jobnet);
    const ln = ParamFactory.ln(jobnet);
    const cy = ParamFactory.cy(jobnet);
    const sh = ParamFactory.sh(jobnet);
    const shd = ParamFactory.shd(jobnet);
    const cftd = ParamFactory.cftd(jobnet);
    const wc = ParamFactory.wc(jobnet);
    const wt = ParamFactory.wt(jobnet);

    assert.deepStrictEqual(
      st?.map((parameter) => parameter?.time),
      ["08:00", "09:00"],
    );
    assert.deepStrictEqual(
      sy?.map((parameter) => parameter?.time),
      ["M120", "U60"],
    );
    assert.deepStrictEqual(
      ey?.map((parameter) => parameter?.time),
      ["C180", "18:00"],
    );
    assert.deepStrictEqual(
      ln?.map((parameter) => parameter?.parentRule),
      ["3", "4"],
    );
    assert.deepStrictEqual(
      cy?.map((parameter) => parameter?.cycle),
      ["3,d", "4,w"],
    );
    assert.deepStrictEqual(
      sh?.map((parameter) => parameter?.substitute),
      ["be", "af"],
    );
    assert.deepStrictEqual(
      shd?.map((parameter) => parameter?.shiftDays),
      ["5", "6"],
    );
    assert.deepStrictEqual(
      cftd?.map((parameter) => ({
        scheduleByDaysFromStart: parameter?.scheduleByDaysFromStart,
        maxShiftableDays: parameter?.maxShiftableDays,
      })),
      [
        { scheduleByDaysFromStart: "be,3", maxShiftableDays: "9" },
        { scheduleByDaysFromStart: "af,4", maxShiftableDays: "8" },
      ],
    );
    assert.deepStrictEqual(
      wc?.map((parameter) => parameter?.numberOfTimes),
      ["4", "5"],
    );
    assert.deepStrictEqual(
      wt?.map((parameter) => parameter?.time),
      ["00:30", "01:00"],
    );
  });

  test("returns schedule-rule-bearing parameters sorted by rule", () => {
    const { subnet } = parseNestedScheduleJobnets();

    const ln = ParamFactory.ln(subnet);

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

  test("ignores ln on the root jobnet", () => {
    const { jobnet } = parseNestedScheduleJobnets();

    assert.strictEqual(ParamFactory.ln(jobnet), undefined);
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

  test("preserves an explicit undefined schedule rule through the facade", () => {
    const jobnet = parseUndefinedScheduleJobnet();

    const sd = ParamFactory.sd(jobnet);

    assert.deepStrictEqual(
      sd?.map((parameter) => ({
        rule: parameter.rule,
        type: parameter.type,
        value: parameter.value(),
      })),
      [{ rule: 0, type: "ud", value: "0,ud" }],
    );
  });

  test("returns schedule-rule defaults aligned to every sd rule", () => {
    const jobnet = parseScheduleDefaultJobnet();

    const st = ParamFactory.st(jobnet);
    const shd = ParamFactory.shd(jobnet);
    const cftd = ParamFactory.cftd(jobnet);
    const wc = ParamFactory.wc(jobnet);
    const wt = ParamFactory.wt(jobnet);

    assert.deepStrictEqual(
      st?.map((parameter) => parameter?.time),
      [DEFAULTS.St, DEFAULTS.St],
    );
    assert.deepStrictEqual(
      shd?.map((parameter) => parameter?.shiftDays),
      [DEFAULTS.Shd, DEFAULTS.Shd],
    );
    assert.deepStrictEqual(
      cftd?.map((parameter) => ({
        scheduleByDaysFromStart: parameter?.scheduleByDaysFromStart,
        maxShiftableDays: parameter?.maxShiftableDays,
      })),
      [
        { scheduleByDaysFromStart: DEFAULTS.Cftd, maxShiftableDays: undefined },
        { scheduleByDaysFromStart: DEFAULTS.Cftd, maxShiftableDays: undefined },
      ],
    );
    assert.deepStrictEqual(
      wc?.map((parameter) => parameter?.numberOfTimes),
      [DEFAULTS.Wc, DEFAULTS.Wc],
    );
    assert.deepStrictEqual(
      wt?.map((parameter) => parameter?.time),
      [DEFAULTS.Wt, DEFAULTS.Wt],
    );
  });

  test("preserves relative-minute start and end delay values", () => {
    const jobnet = parseScheduleRelativeTimeJobnet();

    const sy = ParamFactory.sy(jobnet);
    const ey = ParamFactory.ey(jobnet);

    assert.deepStrictEqual(
      sy?.map((parameter) => parameter?.time),
      ["M120", undefined],
    );
    assert.deepStrictEqual(
      ey?.map((parameter) => parameter?.time),
      [undefined, "U60"],
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

  test("returns JP1/AJS3 v13 end-judgment defaults through the facade", () => {
    const { job, customJob } = parseJobEndJudgmentUnits();

    assert.strictEqual(ParamFactory.jd(job)?.value(), "cod");
    assert.strictEqual(ParamFactory.jd(customJob)?.value(), "cod");
    assert.strictEqual(ParamFactory.tho(job)?.value(), DEFAULTS.Tho);
    assert.strictEqual(ParamFactory.abr(job)?.value(), DEFAULTS.Abr);
    assert.strictEqual(ParamFactory.wth(job), undefined);
    assert.strictEqual(ParamFactory.jdf(job), undefined);
  });

  test("preserves explicit end-judgment values through the facade", () => {
    const job = parseExplicitJobEndJudgmentJob();

    assert.strictEqual(ParamFactory.jd(job)?.value(), "ab");
  });

  test("returns HTTP Connection job execution-user defaults through the facade", () => {
    const { httpJob, explicitHttpJob } = parseHttpConnectionJobs();
    const genericJob = parseJob();

    assert.strictEqual(httpJob.eu?.value(), DEFAULTS.HttpConnectionJobEu);
    assert.strictEqual(explicitHttpJob.eu?.value(), "ent");
    assert.strictEqual(ParamFactory.eu(genericJob)?.value(), DEFAULTS.Eu);
  });

  test("returns JP1 event sending job arrival-check defaults through the facade", () => {
    const { eventJob, explicitEventJob } = parseEventSendingJobs();

    assert.strictEqual(eventJob.evssv?.value(), DEFAULTS.Evssv);
    assert.strictEqual(eventJob.evsrt?.value(), DEFAULTS.Evsrt);
    assert.strictEqual(eventJob.evspl?.value(), DEFAULTS.Evspl);
    assert.strictEqual(eventJob.evsrc?.value(), DEFAULTS.Evsrc);
    assert.strictEqual(explicitEventJob.evssv?.value(), "wr");
    assert.strictEqual(explicitEventJob.evsrt?.value(), "y");
    assert.strictEqual(explicitEventJob.evspl?.value(), "5");
    assert.strictEqual(explicitEventJob.evsrc?.value(), "7");
  });
});
