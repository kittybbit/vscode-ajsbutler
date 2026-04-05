import * as assert from "assert";
import { parseUnitEdge } from "../../domain/models/parameters/unitEdgeHelpers";

suite("Unit Edge Helpers", () => {
  test("parses unit edge strings", () => {
    assert.deepStrictEqual(parseUnitEdge("(f=job-a,t=job-b,con)"), {
      sourceName: "job-a",
      targetName: "job-b",
      relationType: "con",
    });
    assert.deepStrictEqual(parseUnitEdge("(f=job-a,t=job-b)"), {
      sourceName: "job-a",
      targetName: "job-b",
      relationType: undefined,
    });
    assert.strictEqual(parseUnitEdge("(f=job-a,con)"), undefined);
    assert.strictEqual(parseUnitEdge(undefined), undefined);
  });

  test("can require a relation type for wrapper-compatible parsing", () => {
    assert.deepStrictEqual(
      parseUnitEdge("(f=job-a,t=job-b,con)", {
        requireRelationType: true,
      }),
      {
        sourceName: "job-a",
        targetName: "job-b",
        relationType: "con",
      },
    );
    assert.strictEqual(
      parseUnitEdge("(f=job-a,t=job-b)", {
        requireRelationType: true,
      }),
      undefined,
    );
  });
});
