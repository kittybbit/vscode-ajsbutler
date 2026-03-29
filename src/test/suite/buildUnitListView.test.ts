import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { buildUnitListView } from "../../application/unit-list/buildUnitListView";

const validDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    ha=yes;
    cm="jobnet comment";
    cty="custom";
    sz=2-times-3;
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
    unit=job,,jp1admin,;
    {
      ty=rj;
    }
    unit=.CONDITION,,jp1admin,;
    {
      ty=rc;
    }
  }
}
`;

suite("Build Unit List View", () => {
  test("projects group1 and group3 values from the normalized model", () => {
    const result = parseAjs(validDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);

    const rows = buildUnitListView(document);
    const root = rows.find((row) => row.absolutePath === "/root");
    const jobnet = rows.find((row) => row.absolutePath === "/root/jobnet");
    const job = rows.find((row) => row.absolutePath === "/root/jobnet/job");
    const condition = rows.find(
      (row) => row.absolutePath === "/root/jobnet/.CONDITION",
    );

    assert.strictEqual(root?.group1.parentAbsolutePath, "/");
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
  });
});
