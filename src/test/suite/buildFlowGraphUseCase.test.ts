import * as assert from "assert";
import { parseAjsDocumentForTest } from "../support/parseAjs";
import {
  buildFlowGraph,
  buildFlowGraphResult,
} from "../../application/flow-graph/buildFlowGraph";
import { toFlowGraphDocumentDto } from "../../application/flow-graph/flowGraphDocument";

const validDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=job-a,j,+240+144;
    el=job-b,qj,+400+144;
    el=.CONDITION,rc,+0+0;
    ar=(f=job-a,t=job-b);
    ar=(f=.CONDITION,t=job-a,con);
    unit=job-a,,jp1admin,;
    {
      ty=j;
    }
    unit=job-b,,jp1admin,;
    {
      ty=qj;
      eun=job-a;
    }
    unit=.CONDITION,,jp1admin,;
    {
      ty=rc;
    }
  }
}
`;

suite("Build Flow Graph Use Case", () => {
  test("builds a flow graph from the normalized model", () => {
    const document = parseAjsDocumentForTest(validDefinition);
    const currentUnitId = document.rootUnits[0].children[0].id;

    const graph = buildFlowGraph(document, currentUnitId);

    assert.ok(graph);
    assert.deepStrictEqual(graph?.edges, [
      {
        source: "/root/jobnet/job-a",
        target: "/root/jobnet/job-b",
        type: "seq",
      },
      {
        source: "/root/jobnet/.CONDITION",
        target: "/root/jobnet/job-a",
        type: "con",
      },
    ]);
    assert.deepStrictEqual(
      graph?.nodes.map((node) => node.id),
      [
        document.rootUnits[0].children[0].children[0].id,
        document.rootUnits[0].children[0].children[1].id,
        document.rootUnits[0].id,
        document.rootUnits[0].children[0].id,
        document.rootUnits[0].children[0].children[2].id,
      ],
    );
  });

  test("builds the same graph from a JSON-round-tripped flow document", () => {
    const normalized = parseAjsDocumentForTest(validDefinition);
    const currentUnitId = normalized.rootUnits[0].children[0].id;
    const dto = toFlowGraphDocumentDto(normalized);
    const serialized = JSON.parse(JSON.stringify(dto)) as unknown;

    const result = buildFlowGraphResult(serialized, currentUnitId);

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.deepStrictEqual(
      result.graph,
      buildFlowGraph(normalized, currentUnitId),
    );
    assert.strictEqual(
      result.index.unitById.get(currentUnitId)?.name,
      "jobnet",
    );
    assert.deepStrictEqual(result.issues, []);
  });

  test("returns a typed unavailable result for a missing scope", () => {
    const document = parseAjsDocumentForTest(validDefinition);

    const result = buildFlowGraphResult(document, "missing-scope");

    assert.deepStrictEqual(result, {
      status: "unavailable",
      issues: [
        {
          code: "scope_not_found",
          message: "Flow graph scope was not found: missing-scope",
        },
      ],
    });
  });

  test("returns unavailable for an existing unit that is not a flow scope", () => {
    const document = parseAjsDocumentForTest(validDefinition);
    const jobId = document.rootUnits[0].children[0].children[0].id;

    const result = buildFlowGraphResult(document, jobId);

    assert.deepStrictEqual(result, {
      status: "unavailable",
      issues: [
        {
          code: "invalid_scope",
          message: `Unit is not a flow graph scope: ${jobId}`,
        },
      ],
    });
  });
});
