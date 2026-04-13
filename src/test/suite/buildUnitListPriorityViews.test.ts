import * as assert from "assert";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import {
  buildUnitListGroup11View,
  buildUnitListGroup7View,
} from "../../application/unit-list/buildUnitListPriorityViews";

const definition = `
unit=root,,jp1admin,;
{
  ty=g;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    mp=y;
    rg=3;
    rh="manager-a";
    pr=4;
    cd=10;
    ms=sch;
    fd=30;
    unit=subnet,,jp1admin,;
    {
      ty=n;
    }
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
    unit=qjob,,jp1admin,;
    {
      ty=qj;
      qm=queue-manager;
      qu=queue-name;
      req=request-job;
      ni=0;
    }
  }
}
`;

suite("Build Unit List Priority Views", () => {
  test("projects group7 fields and inherits priority for child jobnets", () => {
    const result = parseAjs(definition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const jobnet = document.rootUnits[0]?.children[0];
    const subnet = jobnet?.children[0];

    assert.ok(jobnet);
    assert.ok(subnet);

    const priorityById = new Map<string, number>();
    const jobnetView = buildUnitListGroup7View(document, jobnet, priorityById);
    const subnetView = buildUnitListGroup7View(document, subnet, priorityById);

    assert.strictEqual(jobnetView.concurrentExecution, "y");
    assert.strictEqual(jobnetView.retainedGenerationCount, "3");
    assert.strictEqual(jobnetView.targetManager, '"manager-a"');
    assert.strictEqual(jobnetView.priority, 4);
    assert.strictEqual(jobnetView.timeoutPeriod, "10");
    assert.strictEqual(jobnetView.scheduleOption, "sch");
    assert.strictEqual(jobnetView.requiredExecutionTime, "30");
    assert.strictEqual(subnetView.priority, 4);
  });

  test("projects group11 fields and reuses shared priority lookup", () => {
    const result = parseAjs(definition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
    const jobnet = document.rootUnits[0]?.children[0];
    const job = jobnet?.children[1];
    const qjob = jobnet?.children[2];

    assert.ok(job);
    assert.ok(qjob);

    const priorityById = new Map<string, number>();
    const jobView = buildUnitListGroup11View(document, job, priorityById);
    const qjobView = buildUnitListGroup11View(document, qjob, priorityById);

    assert.strictEqual(jobView.commandText, '"run.sh"');
    assert.strictEqual(jobView.scriptFileName, '"script.ksh"');
    assert.strictEqual(jobView.parameters, "--job");
    assert.strictEqual(jobView.environmentVariable, '"ENV=1"');
    assert.strictEqual(jobView.environmentVariableFile, '"envfile.env"');
    assert.strictEqual(jobView.workPathName, '"/tmp"');
    assert.strictEqual(jobView.standardInputFile, '"stdin.txt"');
    assert.strictEqual(jobView.standardOutputFile, '"stdout.txt"');
    assert.strictEqual(jobView.standardOutputAction, "add");
    assert.strictEqual(jobView.standardErrorFile, '"stderr.txt"');
    assert.strictEqual(jobView.standardErrorAction, "new");
    assert.strictEqual(jobView.priority, 4);
    assert.strictEqual(jobView.endJudgment, "nm");
    assert.strictEqual(jobView.waitThreshold, "20");
    assert.strictEqual(jobView.timeoutHold, "5");
    assert.strictEqual(jobView.judgmentFile, '"judge.txt"');
    assert.strictEqual(jobView.automaticRetryEnabled, "y");
    assert.strictEqual(jobView.retryStart, "1");
    assert.strictEqual(jobView.retryEnd, "9");
    assert.strictEqual(jobView.retryCount, "3");
    assert.strictEqual(jobView.retryInterval, "60");
    assert.strictEqual(jobView.targetUserName, "target-user");
    assert.strictEqual(qjobView.queueManager, "queue-manager");
    assert.strictEqual(qjobView.queueName, "queue-name");
    assert.strictEqual(qjobView.requestJobName, "request-job");
    assert.strictEqual(qjobView.priority, 3);
  });
});
