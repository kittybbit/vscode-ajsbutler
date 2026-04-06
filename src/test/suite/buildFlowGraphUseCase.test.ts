import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { buildFlowGraph } from "../../application/flow-graph/buildFlowGraph";

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
    const result = parseAjs(validDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);
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
});
