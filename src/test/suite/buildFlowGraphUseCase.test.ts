import * as assert from "assert";
import { parseAjsDocumentForTest } from "../support/parseAjs";
import { buildFlowGraphResult } from "../../application/flow-graph/buildFlowGraph";
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
  test("builds a flow graph from the normalized model and group context", () => {
    const document = parseAjsDocumentForTest(validDefinition);
    const currentUnitId = document.rootUnits[0].children[0].id;

    const result = buildFlowGraphResult(
      toFlowGraphDocumentDto(document),
      currentUnitId,
    );

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.deepStrictEqual(result.graph.edges, [
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
      result.graph.nodes.map((node) => node.id),
      [
        document.rootUnits[0].children[0].children[0].id,
        document.rootUnits[0].children[0].children[1].id,
        document.rootUnits[0].id,
        document.rootUnits[0].children[0].id,
        document.rootUnits[0].children[0].children[2].id,
      ],
    );
    assert.deepStrictEqual(
      result.graph.nodes.map((node) => ({
        id: node.id,
        isAncestor: node.metadata.isAncestor,
        isCurrent: node.metadata.isCurrent,
        layout: node.metadata.layout.kind,
      })),
      [
        {
          id: document.rootUnits[0].children[0].children[0].id,
          isAncestor: false,
          isCurrent: false,
          layout: "grid",
        },
        {
          id: document.rootUnits[0].children[0].children[1].id,
          isAncestor: false,
          isCurrent: false,
          layout: "grid",
        },
        {
          id: document.rootUnits[0].id,
          isAncestor: true,
          isCurrent: false,
          layout: "ancestor",
        },
        {
          id: currentUnitId,
          isAncestor: true,
          isCurrent: true,
          layout: "ancestor",
        },
        {
          id: document.rootUnits[0].children[0].children[2].id,
          isAncestor: true,
          isCurrent: false,
          layout: "ancestor",
        },
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
    const normalizedResult = buildFlowGraphResult(
      toFlowGraphDocumentDto(normalized),
      currentUnitId,
    );
    assert.strictEqual(normalizedResult.status, "available");
    if (normalizedResult.status !== "available") return;
    assert.deepStrictEqual(result.graph, normalizedResult.graph);
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

  test("reports malformed relations without returning a plausible edge", () => {
    const document = parseAjsDocumentForTest(validDefinition);
    const dto = toFlowGraphDocumentDto(document);
    const jobnet = dto.rootUnits[0].children[0];
    jobnet.relations.push({
      sourceUnitId: jobnet.children[0].id,
      targetUnitId: "missing-target",
      type: "seq",
    });

    const result = buildFlowGraphResult(dto, jobnet.id);

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.deepStrictEqual(result.graph.edges, [
      {
        source: jobnet.children[0].id,
        target: jobnet.children[1].id,
        type: "seq",
      },
      {
        source: jobnet.children[2].id,
        target: jobnet.children[0].id,
        type: "con",
      },
    ]);
    assert.deepStrictEqual(
      result.issues.map((issue) => issue.code),
      ["invalid_relation"],
    );
  });
});
