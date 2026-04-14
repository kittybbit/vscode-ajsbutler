import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
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

suite("Build Unit List Remaining Groups", () => {
  test("projects all remaining group fields from unit parameters", () => {
    const result = parseAjs(definition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
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
});
