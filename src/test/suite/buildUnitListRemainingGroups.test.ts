import * as assert from "assert";
import { parseAjsDocumentForTest } from "../support/parseAjs";
import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import { buildUnitListRemainingGroups } from "../../application/unit-list/buildUnitListRemainingGroups";

const definition = `
unit=root,,jp1admin,;
{
  ty=g;
  sdd=20240101;
  md=30;
  stt=1;
  ha=yes;
  cty="custom";
  sz=2-times-3;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    cm="jobnet comment";
    ex="agent-a";
    ncl=y;
    ncn=connector-1;
    ncs=y;
    ncex=n;
    nchn="host-a";
    ncsv=service-a;
  }
  unit=manager,,jp1admin,;
  {
    ty=mg;
    mh="manager-host";
    mu=manager-unit;
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

const eventSendingJobDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  unit=event-defaults,,jp1admin,;
  {
    ty=evsj;
  }
  unit=event-explicit,,jp1admin,;
  {
    ty=revsj;
    evssv=wr;
    evsrt=y;
    evspl=5;
    evsrc=7;
  }
  unit=regular-job,,jp1admin,;
  {
    ty=j;
  }
}
`;

const fileMonitoringJobDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  unit=file-defaults,,jp1admin,;
  {
    ty=flwj;
  }
  unit=file-explicit,,jp1admin,;
  {
    ty=rflwj;
    flwf="watch.txt";
    flwc=c:d:s;
    flco=y;
    flwi=30;
    ets=wr;
  }
  unit=regular-job,,jp1admin,;
  {
    ty=j;
  }
}
`;

const executionIntervalControlJobDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  unit=interval-defaults,,jp1admin,;
  {
    ty=tmwj;
  }
  unit=interval-explicit,,jp1admin,;
  {
    ty=rtmwj;
    tmitv=30;
    etn=y;
    ets=wr;
  }
  unit=regular-job,,jp1admin,;
  {
    ty=j;
  }
}
`;

const waitJobTimeoutActionDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  unit=log-file-defaults,,jp1admin,;
  {
    ty=lfwj;
  }
  unit=mail-defaults,,jp1admin,;
  {
    ty=mlwj;
  }
  unit=mq-defaults,,jp1admin,;
  {
    ty=mqwj;
  }
  unit=message-queue-defaults,,jp1admin,;
  {
    ty=mswj;
  }
  unit=windows-event-defaults,,jp1admin,;
  {
    ty=ntwj;
  }
  unit=mail-explicit,,jp1admin,;
  {
    ty=rmlwj;
    ets=wr;
  }
  unit=regular-job,,jp1admin,;
  {
    ty=j;
  }
}
`;

const queueGroup15Definition = `
unit=root,,jp1admin,;
{
  ty=g;
  unit=queue,,jp1admin,;
  {
    ty=qj;
    ts1=queue-src-1;
    td1=queue-dst-1;
    top1=sav;
    ts2=queue-src-2;
    td2=queue-dst-2;
    top2=del;
  }
  unit=recovery-queue,,jp1admin,;
  {
    ty=rq;
    ts3=recovery-src-3;
    td3=recovery-dst-3;
    top3=sav;
  }
  unit=regular-job,,jp1admin,;
  {
    ty=j;
    ts1=regular-src-1;
    td1=regular-dst-1;
    top1=del;
    ts4=regular-src-4;
    td4=regular-dst-4;
    top4=sav;
  }
}
`;

const remainingGroupsDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  unit=file-monitor,,jp1admin,;
  {
    ty=flwj;
    flwf="watch#"#"##.txt";
    flwc=c:d:s;
    flco=y;
    flwi=30;
    ets=wr;
  }
  unit=custom-job,,jp1admin,;
  {
    ty=cpj;
    prm="--name#"#"##value";
    env="ENV#"#"##=1";
  }
  unit=recovery-custom-job,,jp1admin,;
  {
    ty=rcpj;
    prm=--recovery;
    env=RECOVERY=1;
  }
  unit=regular-job,,jp1admin,;
  {
    ty=j;
    prm=--regular;
    env=REGULAR=1;
  }
  unit=flexible-job,,jp1admin,;
  {
    ty=fxj;
    da="agent#"#"##-destination";
    fxg=flexible-group;
    ex="agent#"#"##-execution";
  }
  unit=recovery-flexible-job,,jp1admin,;
  {
    ty=rfxj;
    da=recovery-destination;
    fxg=recovery-group;
    ex=recovery-execution;
  }
  unit=regular-agent-job,,jp1admin,;
  {
    ty=j;
    da=regular-destination;
    fxg=regular-group;
    ex=regular-execution;
  }
}
`;

suite("Build Unit List Remaining Groups", () => {
  test("projects all remaining group fields from unit parameters", () => {
    const document = parseAjsDocumentForTest(definition);
    const root = document.rootUnits[0];
    const jobnet = document.rootUnits[0]?.children[0];
    const manager = document.rootUnits[0]?.children[1];
    const connector = document.rootUnits[0]?.children[2];
    const startCondition = document.rootUnits[0]?.children[3];

    assert.ok(root);
    assert.ok(jobnet);
    assert.ok(manager);
    assert.ok(connector);
    assert.ok(startCondition);

    const rootView = buildUnitListRemainingGroups(root, [], []);
    const jobnetView = buildUnitListRemainingGroups(jobnet, [], []);
    const managerView = buildUnitListRemainingGroups(manager, [], []);
    const connectorView = buildUnitListRemainingGroups(connector, [], []);
    const startConditionView = buildUnitListRemainingGroups(
      startCondition,
      [],
      [],
    );

    assert.strictEqual(rootView.group1.name, "root");
    assert.strictEqual(rootView.group1.parentAbsolutePath, "/");
    assert.strictEqual(rootView.group1.unitType, "g");
    assert.strictEqual(rootView.group1.cty, '"custom"');
    assert.strictEqual(rootView.group1.size, "2-times-3");
    assert.strictEqual(rootView.group5.startDeadlineDate, "20240101");
    assert.strictEqual(rootView.group5.maximumDuration, "30");
    assert.strictEqual(rootView.group5.startTimeType, "1");
    assert.strictEqual(rootView.group5.jobGroupType, "g");
    assert.strictEqual(rootView.group3.hardAttribute, "yes");

    assert.strictEqual(jobnetView.group1.name, "jobnet");
    assert.strictEqual(jobnetView.group1.parentAbsolutePath, "/root");
    assert.strictEqual(jobnetView.group1.unitType, "n");
    assert.strictEqual(jobnetView.group2.comment, "jobnet comment");
    assert.strictEqual(jobnetView.group2.executionAgent, '"agent-a"');
    assert.strictEqual(jobnetView.group2.nestedConnectionLimit, "y");
    assert.strictEqual(jobnetView.group2.nestedConnectionName, "connector-1");
    assert.strictEqual(jobnetView.group2.nestedConnectionService, "service-a");
    assert.strictEqual(jobnetView.group2.nestedConnectionEnabled, "y");
    assert.strictEqual(jobnetView.group2.nestedConnectionExternal, "n");
    assert.strictEqual(jobnetView.group2.nestedConnectionHost, '"host-a"');

    assert.strictEqual(managerView.group4.managerHost, '"manager-host"');
    assert.strictEqual(managerView.group4.managerUnit, "manager-unit");

    assert.strictEqual(
      connectorView.group8.nestedConnectorRelease,
      "release-connector",
    );

    assert.strictEqual(
      startConditionView.group9.startCondition,
      '"AJSROOT" = "ready"',
    );
  });

  test("projects JP1 event sending job arrival-check defaults for group 14", () => {
    const document = parseAjsDocumentForTest(eventSendingJobDefinition);
    const eventDefaults = document.rootUnits[0]?.children[0];
    const eventExplicit = document.rootUnits[0]?.children[1];
    const regularJob = document.rootUnits[0]?.children[2];

    assert.ok(eventDefaults);
    assert.ok(eventExplicit);
    assert.ok(regularJob);

    const defaultView = buildUnitListRemainingGroups(eventDefaults, [], []);
    const explicitView = buildUnitListRemainingGroups(eventExplicit, [], []);
    const regularView = buildUnitListRemainingGroups(regularJob, [], []);

    assert.strictEqual(defaultView.group14.actionSeverity, DEFAULTS.Evssv);
    assert.strictEqual(defaultView.group14.actionStartType, DEFAULTS.Evsrt);
    assert.strictEqual(defaultView.group14.actionInterval, DEFAULTS.Evspl);
    assert.strictEqual(defaultView.group14.actionCount, DEFAULTS.Evsrc);

    assert.strictEqual(explicitView.group14.actionSeverity, "wr");
    assert.strictEqual(explicitView.group14.actionStartType, "y");
    assert.strictEqual(explicitView.group14.actionInterval, "5");
    assert.strictEqual(explicitView.group14.actionCount, "7");

    assert.strictEqual(regularView.group14.actionSeverity, undefined);
    assert.strictEqual(regularView.group14.actionStartType, undefined);
    assert.strictEqual(regularView.group14.actionInterval, undefined);
    assert.strictEqual(regularView.group14.actionCount, undefined);
  });

  test("projects file monitoring job defaults for group 13", () => {
    const document = parseAjsDocumentForTest(fileMonitoringJobDefinition);
    const fileDefaults = document.rootUnits[0]?.children[0];
    const fileExplicit = document.rootUnits[0]?.children[1];
    const regularJob = document.rootUnits[0]?.children[2];

    assert.ok(fileDefaults);
    assert.ok(fileExplicit);
    assert.ok(regularJob);

    const defaultView = buildUnitListRemainingGroups(fileDefaults, [], []);
    const explicitView = buildUnitListRemainingGroups(fileExplicit, [], []);
    const regularView = buildUnitListRemainingGroups(regularJob, [], []);

    assert.strictEqual(defaultView.group13.monitoredFileName, undefined);
    assert.strictEqual(
      defaultView.group13.monitoredFileCondition,
      DEFAULTS.Flwc,
    );
    assert.strictEqual(
      defaultView.group13.monitoredFileCloseMode,
      DEFAULTS.Flco,
    );
    assert.strictEqual(defaultView.group13.monitoringInterval, DEFAULTS.Flwi);
    assert.strictEqual(defaultView.group13.eventTimeoutAction, DEFAULTS.Ets);

    assert.strictEqual(explicitView.group13.monitoredFileName, '"watch.txt"');
    assert.strictEqual(explicitView.group13.monitoredFileCondition, "c:d:s");
    assert.strictEqual(explicitView.group13.monitoredFileCloseMode, "y");
    assert.strictEqual(explicitView.group13.monitoringInterval, "30");
    assert.strictEqual(explicitView.group13.eventTimeoutAction, "wr");

    assert.strictEqual(regularView.group13.monitoredFileCondition, undefined);
    assert.strictEqual(regularView.group13.monitoredFileCloseMode, undefined);
    assert.strictEqual(regularView.group13.monitoringInterval, undefined);
    assert.strictEqual(regularView.group13.eventTimeoutAction, undefined);
  });

  test("projects execution-interval control job defaults for group 13", () => {
    const document = parseAjsDocumentForTest(
      executionIntervalControlJobDefinition,
    );
    const intervalDefaults = document.rootUnits[0]?.children[0];
    const intervalExplicit = document.rootUnits[0]?.children[1];
    const regularJob = document.rootUnits[0]?.children[2];

    assert.ok(intervalDefaults);
    assert.ok(intervalExplicit);
    assert.ok(regularJob);

    const defaultView = buildUnitListRemainingGroups(intervalDefaults, [], []);
    const explicitView = buildUnitListRemainingGroups(intervalExplicit, [], []);
    const regularView = buildUnitListRemainingGroups(regularJob, [], []);

    assert.strictEqual(defaultView.group13.timeoutInterval, DEFAULTS.Tmitv);
    assert.strictEqual(defaultView.group13.eventTimeout, DEFAULTS.Etn);
    assert.strictEqual(defaultView.group13.eventTimeoutAction, DEFAULTS.Ets);

    assert.strictEqual(explicitView.group13.timeoutInterval, "30");
    assert.strictEqual(explicitView.group13.eventTimeout, "y");
    assert.strictEqual(explicitView.group13.eventTimeoutAction, "wr");

    assert.strictEqual(regularView.group13.timeoutInterval, undefined);
    assert.strictEqual(regularView.group13.eventTimeout, undefined);
    assert.strictEqual(regularView.group13.eventTimeoutAction, undefined);
  });

  test("projects shared wait-job timeout-action defaults for group 13", () => {
    const document = parseAjsDocumentForTest(waitJobTimeoutActionDefinition);
    const logFileDefaults = document.rootUnits[0]?.children[0];
    const mailDefaults = document.rootUnits[0]?.children[1];
    const mqDefaults = document.rootUnits[0]?.children[2];
    const messageQueueDefaults = document.rootUnits[0]?.children[3];
    const windowsEventDefaults = document.rootUnits[0]?.children[4];
    const mailExplicit = document.rootUnits[0]?.children[5];
    const regularJob = document.rootUnits[0]?.children[6];

    assert.ok(logFileDefaults);
    assert.ok(mailDefaults);
    assert.ok(mqDefaults);
    assert.ok(messageQueueDefaults);
    assert.ok(windowsEventDefaults);
    assert.ok(mailExplicit);
    assert.ok(regularJob);

    assert.strictEqual(
      buildUnitListRemainingGroups(logFileDefaults, [], []).group13
        .eventTimeoutAction,
      DEFAULTS.Ets,
    );
    assert.strictEqual(
      buildUnitListRemainingGroups(mailDefaults, [], []).group13
        .eventTimeoutAction,
      DEFAULTS.Ets,
    );
    assert.strictEqual(
      buildUnitListRemainingGroups(mqDefaults, [], []).group13
        .eventTimeoutAction,
      DEFAULTS.Ets,
    );
    assert.strictEqual(
      buildUnitListRemainingGroups(messageQueueDefaults, [], []).group13
        .eventTimeoutAction,
      DEFAULTS.Ets,
    );
    assert.strictEqual(
      buildUnitListRemainingGroups(windowsEventDefaults, [], []).group13
        .eventTimeoutAction,
      DEFAULTS.Ets,
    );
    assert.strictEqual(
      buildUnitListRemainingGroups(mailExplicit, [], []).group13
        .eventTimeoutAction,
      "wr",
    );
    assert.strictEqual(
      buildUnitListRemainingGroups(regularJob, [], []).group13
        .eventTimeoutAction,
      undefined,
    );
  });

  test("hides QUEUE job transfer operations in group 15", () => {
    const document = parseAjsDocumentForTest(queueGroup15Definition);
    const queueJob = document.rootUnits[0]?.children[0];
    const recoveryQueueJob = document.rootUnits[0]?.children[1];
    const regularJob = document.rootUnits[0]?.children[2];

    assert.ok(queueJob);
    assert.ok(recoveryQueueJob);
    assert.ok(regularJob);

    const queueView = buildUnitListRemainingGroups(queueJob, [], []);
    const recoveryQueueView = buildUnitListRemainingGroups(
      recoveryQueueJob,
      [],
      [],
    );
    const regularView = buildUnitListRemainingGroups(regularJob, [], []);

    assert.strictEqual(queueView.group15.terminationStatus1, "queue-src-1");
    assert.strictEqual(queueView.group15.terminationDelay1, "queue-dst-1");
    assert.strictEqual(queueView.group15.terminationOperation1, undefined);
    assert.strictEqual(queueView.group15.terminationStatus2, "queue-src-2");
    assert.strictEqual(queueView.group15.terminationDelay2, "queue-dst-2");
    assert.strictEqual(queueView.group15.terminationOperation2, undefined);

    assert.strictEqual(
      recoveryQueueView.group15.terminationStatus3,
      "recovery-src-3",
    );
    assert.strictEqual(
      recoveryQueueView.group15.terminationDelay3,
      "recovery-dst-3",
    );
    assert.strictEqual(
      recoveryQueueView.group15.terminationOperation3,
      undefined,
    );

    assert.strictEqual(regularView.group15.terminationStatus1, "regular-src-1");
    assert.strictEqual(regularView.group15.terminationDelay1, "regular-dst-1");
    assert.strictEqual(regularView.group15.terminationOperation1, "del");
    assert.strictEqual(regularView.group15.terminationStatus4, "regular-src-4");
    assert.strictEqual(regularView.group15.terminationDelay4, "regular-dst-4");
    assert.strictEqual(regularView.group15.terminationOperation4, "sav");
  });

  test("preserves group 13 values and type-gates group 17/18 fields", () => {
    const document = parseAjsDocumentForTest(remainingGroupsDefinition);
    const fileMonitor = document.rootUnits[0]?.children[0];
    const customJob = document.rootUnits[0]?.children[1];
    const recoveryCustomJob = document.rootUnits[0]?.children[2];
    const regularJob = document.rootUnits[0]?.children[3];
    const flexibleJob = document.rootUnits[0]?.children[4];
    const recoveryFlexibleJob = document.rootUnits[0]?.children[5];
    const regularAgentJob = document.rootUnits[0]?.children[6];

    assert.ok(fileMonitor);
    assert.ok(customJob);
    assert.ok(recoveryCustomJob);
    assert.ok(regularJob);
    assert.ok(flexibleJob);
    assert.ok(recoveryFlexibleJob);
    assert.ok(regularAgentJob);

    const fileMonitorView = buildUnitListRemainingGroups(fileMonitor, [], []);
    const customJobView = buildUnitListRemainingGroups(customJob, [], []);
    const recoveryCustomJobView = buildUnitListRemainingGroups(
      recoveryCustomJob,
      [],
      [],
    );
    const regularJobView = buildUnitListRemainingGroups(regularJob, [], []);
    const flexibleJobView = buildUnitListRemainingGroups(flexibleJob, [], []);
    const recoveryFlexibleJobView = buildUnitListRemainingGroups(
      recoveryFlexibleJob,
      [],
      [],
    );
    const regularAgentJobView = buildUnitListRemainingGroups(
      regularAgentJob,
      [],
      [],
    );

    assert.strictEqual(
      fileMonitorView.group13.monitoredFileName,
      '"watch#"#"##.txt"',
    );
    assert.strictEqual(fileMonitorView.group13.monitoredFileCondition, "c:d:s");
    assert.strictEqual(fileMonitorView.group13.monitoredFileCloseMode, "y");
    assert.strictEqual(fileMonitorView.group13.monitoringInterval, "30");
    assert.strictEqual(fileMonitorView.group13.eventTimeoutAction, "wr");

    assert.strictEqual(
      customJobView.group17.toolParameters,
      '"--name#"#"##value"',
    );
    assert.strictEqual(customJobView.group17.toolEnvironment, '"ENV#"#"##=1"');
    assert.strictEqual(
      recoveryCustomJobView.group17.toolParameters,
      "--recovery",
    );
    assert.strictEqual(
      recoveryCustomJobView.group17.toolEnvironment,
      "RECOVERY=1",
    );
    assert.strictEqual(regularJobView.group17.toolParameters, undefined);
    assert.strictEqual(regularJobView.group17.toolEnvironment, undefined);

    assert.strictEqual(
      flexibleJobView.group18.destinationAgent,
      '"agent#"#"##-destination"',
    );
    assert.strictEqual(
      flexibleJobView.group18.flexibleJobGroup,
      "flexible-group",
    );
    assert.strictEqual(
      flexibleJobView.group18.executionAgent,
      '"agent#"#"##-execution"',
    );
    assert.strictEqual(
      recoveryFlexibleJobView.group18.executionAgent,
      "recovery-execution",
    );
    assert.strictEqual(
      regularAgentJobView.group18.destinationAgent,
      "regular-destination",
    );
    assert.strictEqual(
      regularAgentJobView.group18.flexibleJobGroup,
      "regular-group",
    );
    assert.strictEqual(regularAgentJobView.group18.executionAgent, undefined);
  });
});
