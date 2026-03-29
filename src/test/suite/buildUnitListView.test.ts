import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { buildUnitListView } from "../../application/unit-list/buildUnitListView";

const validDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  gty=p;
  sdd=20240101;
  md=30;
  stt=1;
  op=mo:1;
  op=2024/01/01;
  cl=tu:2;
  cl=2024/01/02;
  el=jobnet,n,+0+0;
  el=manager,mg,+160+0;
  el=manager-jobnet,mn,+320+0;
  el=connector,nc,+480+0;
  el=start-condition,rc,+640+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    ha=yes;
    cm="jobnet comment";
    cty="custom";
    sz=2-times-3;
    mp=y;
    rg=3;
    rh="manager-a";
    ni=5;
    pr=4;
    cd=10;
    ms=sch;
    fd=30;
    de=y;
    ed=2024/12/31;
    jc=/root;
    ejn=exclusive-a;
    ln=2;
    sd=2024/12/+31;
    sd=2,en;
    st=09:30;
    cy=(3,d);
    sh=be;
    shd=5;
    cftd=be,3,9;
    sy=08:00;
    ey=18:00;
    wc=4;
    wt=00:30;
    ex="agent-a";
    ncl=y;
    ncn=connector-1;
    ncs=y;
    ncex=n;
    nchn="host-a";
    ncsv=service-a;
    ar=(f=job,t=.CONDITION,con);
    el=job,j,+0+0;
    el=.CONDITION,rc,+160+0;
    el=subnet,n,+320+0;
    unit=job,,jp1admin,;
    {
      ty=rj;
    }
    unit=.CONDITION,,jp1admin,;
    {
      ty=rc;
    }
    unit=subnet,,jp1admin,;
    {
      ty=n;
    }
  }
  unit=manager,,jp1admin,;
  {
    ty=mg;
    mh="manager-host";
    mu=manager-unit;
  }
  unit=manager-jobnet,,jp1admin,;
  {
    ty=mn;
    mh="manager-jobnet-host";
    mu=manager-jobnet-unit;
  }
  unit=connector,,jp1admin,;
  {
    ty=nc;
    ncr=release-connector;
  }
  unit=start-condition,,jp1admin,;
  {
    ty=rc;
    cond="AJSROOT" = "ready";
  }
}
`;

suite("Build Unit List View", () => {
  test("projects group fields from the normalized model", () => {
    const result = parseAjs(validDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);

    const rows = buildUnitListView(document);
    const root = rows.find((row) => row.absolutePath === "/root");
    const jobnet = rows.find((row) => row.absolutePath === "/root/jobnet");
    const job = rows.find((row) => row.absolutePath === "/root/jobnet/job");
    const manager = rows.find((row) => row.absolutePath === "/root/manager");
    const managerJobnet = rows.find(
      (row) => row.absolutePath === "/root/manager-jobnet",
    );
    const subnet = rows.find(
      (row) => row.absolutePath === "/root/jobnet/subnet",
    );
    const connector = rows.find(
      (row) => row.absolutePath === "/root/connector",
    );
    const startCondition = rows.find(
      (row) => row.absolutePath === "/root/start-condition",
    );
    const condition = rows.find(
      (row) => row.absolutePath === "/root/jobnet/.CONDITION",
    );

    assert.strictEqual(root?.group1.parentAbsolutePath, "/");
    assert.strictEqual(root?.group5.startDeadlineDate, "20240101");
    assert.strictEqual(root?.group5.maximumDuration, "30");
    assert.strictEqual(root?.group5.startTimeType, "1");
    assert.strictEqual(root?.group5.jobGroupType, "p");
    assert.strictEqual(root?.group6.mo, true);
    assert.strictEqual(root?.group6.tu, false);
    assert.strictEqual(root?.group6.we, undefined);
    assert.deepStrictEqual(root?.group6.openDates, ["2024/01/01"]);
    assert.deepStrictEqual(root?.group6.closeDates, ["2024/01/02"]);
    assert.strictEqual(jobnet?.group1.name, "jobnet");
    assert.strictEqual(jobnet?.group1.parentAbsolutePath, "/root");
    assert.strictEqual(jobnet?.group1.unitType, "n");
    assert.strictEqual(jobnet?.group1.cty, "custom");
    assert.strictEqual(job?.group1.layoutHv, "+0+0");
    assert.strictEqual(jobnet?.group1.size, "2-times-3");
    assert.strictEqual(jobnet?.group2.comment, "jobnet comment");
    assert.strictEqual(jobnet?.group2.executionAgent, '"agent-a"');
    assert.strictEqual(jobnet?.group2.nestedConnectionLimit, "y");
    assert.strictEqual(jobnet?.group2.nestedConnectionName, "connector-1");
    assert.strictEqual(jobnet?.group2.nestedConnectionEnabled, "y");
    assert.strictEqual(jobnet?.group2.nestedConnectionExternal, "n");
    assert.strictEqual(jobnet?.group2.nestedConnectionHost, '"host-a"');
    assert.strictEqual(jobnet?.group2.nestedConnectionService, "service-a");
    assert.strictEqual(jobnet?.group7.concurrentExecution, "y");
    assert.strictEqual(jobnet?.group7.retainedGenerationCount, "3");
    assert.strictEqual(jobnet?.group7.targetManager, '"manager-a"');
    assert.strictEqual(jobnet?.group7.priority, 4);
    assert.strictEqual(jobnet?.group7.timeoutPeriod, "10");
    assert.strictEqual(jobnet?.group7.scheduleOption, "sch");
    assert.strictEqual(jobnet?.group7.requiredExecutionTime, "30");
    assert.strictEqual(subnet?.group7.priority, 4);
    assert.strictEqual(jobnet?.group10.deleteAfterExecution, "y");
    assert.strictEqual(jobnet?.group10.executionDate, "2024/12/31");
    assert.strictEqual(jobnet?.group10.jobGroupPath, "/root");
    assert.strictEqual(jobnet?.group10.exclusiveJobnetName, "exclusive-a");
    assert.deepStrictEqual(jobnet?.group10.parentRules, ["2"]);
    assert.deepStrictEqual(jobnet?.group10.scheduleDateTypes, ["+", "en"]);
    assert.deepStrictEqual(jobnet?.group10.scheduleDateYearMonths, [
      "2024/12",
      "",
    ]);
    assert.deepStrictEqual(jobnet?.group10.scheduleDateDays, ["31", ""]);
    assert.deepStrictEqual(jobnet?.group10.startTimes, ["09:30"]);
    assert.deepStrictEqual(jobnet?.group10.cycles, ["3,d"]);
    assert.deepStrictEqual(jobnet?.group10.substitutes, ["be"]);
    assert.deepStrictEqual(jobnet?.group10.shiftDays, ["5"]);
    assert.deepStrictEqual(jobnet?.group10.scheduleByDaysFromStart, ["be,3"]);
    assert.deepStrictEqual(jobnet?.group10.maxShiftableDays, ["9"]);
    assert.deepStrictEqual(jobnet?.group10.startRangeTimes, ["08:00"]);
    assert.deepStrictEqual(jobnet?.group10.endRangeTimes, ["18:00"]);
    assert.deepStrictEqual(jobnet?.group10.waitCounts, ["4"]);
    assert.deepStrictEqual(jobnet?.group10.waitTimes, ["00:30"]);
    assert.deepStrictEqual(job?.group2.nextUnits, [
      {
        id: "/root/jobnet/.CONDITION",
        name: ".CONDITION",
        absolutePath: "/root/jobnet/.CONDITION",
        relationType: "con",
      },
    ]);
    assert.deepStrictEqual(condition?.group2.previousUnits, [
      {
        id: "/root/jobnet/job",
        name: "job",
        absolutePath: "/root/jobnet/job",
        relationType: "con",
      },
    ]);
    assert.strictEqual(jobnet?.group3.hardAttribute, "yes");
    assert.strictEqual(jobnet?.group3.jp1Username, "jp1admin");
    assert.strictEqual(job?.group3.isRecovery, true);
    assert.strictEqual(manager?.group4.managerHost, '"manager-host"');
    assert.strictEqual(manager?.group4.managerUnit, "manager-unit");
    assert.strictEqual(
      managerJobnet?.group4.managerHost,
      '"manager-jobnet-host"',
    );
    assert.strictEqual(
      managerJobnet?.group4.managerUnit,
      "manager-jobnet-unit",
    );
    assert.strictEqual(
      connector?.group8.nestedConnectorRelease,
      "release-connector",
    );
    assert.strictEqual(
      startCondition?.group9.startCondition,
      '"AJSROOT" = "ready"',
    );
  });
});
