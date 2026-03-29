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
  el=tool-unit,cpj,+800+0;
  el=flex-job,fxj,+960+0;
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
    ej=gt;
    ejc=8;
    ejl=1;
    ejs=100;
    ejm=ge;
    ejh=9;
    ejg=200;
    eju=le;
    ejt="abc";
    eji=150;
    ejv=VALUE;
    ejf="result.txt";
    tmitv=30;
    etn=y;
    flwf="watch.txt";
    flwc=c:d:s;
    flco=y;
    flwi=60;
    evwid=EV-1;
    evwms="waiting";
    ets=wr;
    evsid=ACT-1;
    evsms="action";
    evssv=wr;
    evsrt=y;
    evspl=5;
    evsrc=2;
    pfm=unix;
    eu=def;
    etm=10;
    jty=batch;
    ts1=ok;
    td1=1;
    top1=stop;
    ts2=ng;
    td2=2;
    top2=skip;
    ts3=warn;
    td3=3;
    top3=hold;
    ts4=err;
    td4=4;
    top4=retry;
    eun=subnet;
    mm=and;
    nmg=y;
    uem=n;
    ega=exec;
    htcfl="conn.conf";
    htknd=post;
    htexm=y;
    htrqf="request.json";
    htrqu=utf8;
    htrqm=json;
    htstf="status.log";
    htspt=200;
    htrhf="header.log";
    htrbf="body.log";
    htcdm=0:200;
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
    el=qjob,qj,+480+0;
    unit=job,,jp1admin,;
    {
      ty=rj;
      te="run.sh";
      sc="script.ksh";
      prm=--job;
      env="ENV=1";
      ev="envfile.env";
      wkp="/tmp";
      si="stdin.txt";
      so="stdout.txt";
      soa=add;
      se="stderr.txt";
      sea=new;
      pr=2;
      jd=nm;
      wth=20;
      tho=5;
      jdf="judge.txt";
      abr=y;
      rjs=1;
      rje=9;
      rec=3;
      rei=60;
      un=target-user;
    }
    unit=.CONDITION,,jp1admin,;
    {
      ty=rc;
    }
    unit=subnet,,jp1admin,;
    {
      ty=n;
    }
    unit=qjob,,jp1admin,;
    {
      ty=qj;
      qm=queue-manager;
      qu=queue-name;
      req=request-job;
      ni=0;
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
  unit=tool-unit,,jp1admin,;
  {
    ty=cpj;
    prm=--verbose;
    env="TOOL=1";
  }
  unit=flex-job,,jp1admin,;
  {
    ty=fxj;
    da="agent-dest";
    fxg=sync;
    ex="flex-agent";
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
    const qjob = rows.find((row) => row.absolutePath === "/root/jobnet/qjob");
    const subnet = rows.find(
      (row) => row.absolutePath === "/root/jobnet/subnet",
    );
    const connector = rows.find(
      (row) => row.absolutePath === "/root/connector",
    );
    const toolUnit = rows.find((row) => row.absolutePath === "/root/tool-unit");
    const flexJob = rows.find((row) => row.absolutePath === "/root/flex-job");
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
    assert.strictEqual(job?.group11.commandText, '"run.sh"');
    assert.strictEqual(job?.group11.scriptFileName, '"script.ksh"');
    assert.strictEqual(job?.group11.parameters, "--job");
    assert.strictEqual(job?.group11.environmentVariable, '"ENV=1"');
    assert.strictEqual(job?.group11.environmentVariableFile, '"envfile.env"');
    assert.strictEqual(job?.group11.workPathName, '"/tmp"');
    assert.strictEqual(job?.group11.standardInputFile, '"stdin.txt"');
    assert.strictEqual(job?.group11.standardOutputFile, '"stdout.txt"');
    assert.strictEqual(job?.group11.standardOutputAction, "add");
    assert.strictEqual(job?.group11.standardErrorFile, '"stderr.txt"');
    assert.strictEqual(job?.group11.standardErrorAction, "new");
    assert.strictEqual(job?.group11.priority, 2);
    assert.strictEqual(job?.group11.endJudgment, "nm");
    assert.strictEqual(job?.group11.waitThreshold, "20");
    assert.strictEqual(job?.group11.timeoutHold, "5");
    assert.strictEqual(job?.group11.judgmentFile, '"judge.txt"');
    assert.strictEqual(job?.group11.automaticRetryEnabled, "y");
    assert.strictEqual(job?.group11.retryStart, "1");
    assert.strictEqual(job?.group11.retryEnd, "9");
    assert.strictEqual(job?.group11.retryCount, "3");
    assert.strictEqual(job?.group11.retryInterval, "60");
    assert.strictEqual(job?.group11.targetUserName, "target-user");
    assert.strictEqual(qjob?.group11.queueManager, "queue-manager");
    assert.strictEqual(qjob?.group11.queueName, "queue-name");
    assert.strictEqual(qjob?.group11.requestJobName, "request-job");
    assert.strictEqual(qjob?.group11.priority, 3);
    assert.strictEqual(jobnet?.group12.endJudgment, "gt");
    assert.strictEqual(jobnet?.group12.judgmentReturnCode, "8");
    assert.strictEqual(jobnet?.group12.lowerReturnCode, "1");
    assert.strictEqual(jobnet?.group12.lowerJudgmentValue, "100");
    assert.strictEqual(jobnet?.group12.upperComparison, "ge");
    assert.strictEqual(jobnet?.group12.upperReturnCode, "9");
    assert.strictEqual(jobnet?.group12.upperJudgmentValue, "200");
    assert.strictEqual(jobnet?.group12.lowerComparison, "le");
    assert.strictEqual(jobnet?.group12.judgmentValueString, '"abc"');
    assert.strictEqual(jobnet?.group12.judgmentValueNumeric, "150");
    assert.strictEqual(jobnet?.group12.variableName, "VALUE");
    assert.strictEqual(jobnet?.group12.judgmentFileName, '"result.txt"');
    assert.strictEqual(jobnet?.group13.timeoutInterval, "30");
    assert.strictEqual(jobnet?.group13.eventTimeout, "y");
    assert.strictEqual(jobnet?.group13.monitoredFileName, '"watch.txt"');
    assert.strictEqual(jobnet?.group13.monitoredFileCondition, "c:d:s");
    assert.strictEqual(jobnet?.group13.monitoredFileCloseMode, "y");
    assert.strictEqual(jobnet?.group13.monitoringInterval, "60");
    assert.strictEqual(jobnet?.group13.waitEventId, "EV-1");
    assert.strictEqual(jobnet?.group13.waitHostName, undefined);
    assert.strictEqual(jobnet?.group13.waitMessage, '"waiting"');
    assert.strictEqual(jobnet?.group13.eventTimeoutAction, "wr");
    assert.strictEqual(jobnet?.group14.actionEventId, "ACT-1");
    assert.strictEqual(jobnet?.group14.actionHostName, undefined);
    assert.strictEqual(jobnet?.group14.actionMessage, '"action"');
    assert.strictEqual(jobnet?.group14.actionSeverity, "wr");
    assert.strictEqual(jobnet?.group14.actionStartType, "y");
    assert.strictEqual(jobnet?.group14.actionInterval, "5");
    assert.strictEqual(jobnet?.group14.actionCount, "2");
    assert.strictEqual(jobnet?.group14.platformMethod, "unix");
    assert.strictEqual(jobnet?.group15.executionUser, "def");
    assert.strictEqual(jobnet?.group15.executionTimeMonitor, "10");
    assert.strictEqual(jobnet?.group15.fileDescriptor, "30");
    assert.strictEqual(jobnet?.group15.jobType, "batch");
    assert.strictEqual(jobnet?.group15.terminationStatus1, "ok");
    assert.strictEqual(jobnet?.group15.terminationDelay1, "1");
    assert.strictEqual(jobnet?.group15.terminationOperation1, "stop");
    assert.strictEqual(jobnet?.group15.terminationStatus4, "err");
    assert.strictEqual(jobnet?.group15.terminationDelay4, "4");
    assert.strictEqual(jobnet?.group15.terminationOperation4, "retry");
    assert.strictEqual(jobnet?.group16.endWaitUnitName, "subnet");
    assert.strictEqual(jobnet?.group16.waitMode, "and");
    assert.strictEqual(jobnet?.group16.nestedMessageGeneration, "y");
    assert.strictEqual(jobnet?.group16.unitEndMonitoring, "n");
    assert.strictEqual(jobnet?.group16.executionGenerationAction, "exec");
    assert.strictEqual(toolUnit?.group17.toolParameters, "--verbose");
    assert.strictEqual(toolUnit?.group17.toolEnvironment, '"TOOL=1"');
    assert.strictEqual(flexJob?.group18.destinationAgent, '"agent-dest"');
    assert.strictEqual(flexJob?.group18.flexibleJobGroup, "sync");
    assert.strictEqual(flexJob?.group18.executionAgent, '"flex-agent"');
    assert.strictEqual(jobnet?.group19.httpConnectionConfig, '"conn.conf"');
    assert.strictEqual(jobnet?.group19.httpKind, "post");
    assert.strictEqual(jobnet?.group19.httpExecutionMode, "y");
    assert.strictEqual(jobnet?.group19.httpRequestFile, '"request.json"');
    assert.strictEqual(jobnet?.group19.httpRequestEncoding, "utf8");
    assert.strictEqual(jobnet?.group19.httpRequestMethod, "json");
    assert.strictEqual(jobnet?.group19.httpStatusFile, '"status.log"');
    assert.strictEqual(jobnet?.group19.httpStatusPoint, "200");
    assert.strictEqual(jobnet?.group19.httpResponseHeaderFile, '"header.log"');
    assert.strictEqual(jobnet?.group19.httpResponseBodyFile, '"body.log"');
    assert.strictEqual(jobnet?.group19.httpCodeMap, "0:200");
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
