import * as assert from "assert";
import { parseDependencyRelation } from "../../domain/models/parameters/dependencyHelpers";

suite("Dependency Helpers", () => {
  test("parses dependency relation strings", () => {
    assert.deepStrictEqual(parseDependencyRelation("(f=job-a,t=job-b,con)"), {
      sourceName: "job-a",
      targetName: "job-b",
      relationType: "con",
    });
    assert.deepStrictEqual(parseDependencyRelation("(f=job-a,t=job-b)"), {
      sourceName: "job-a",
      targetName: "job-b",
      relationType: undefined,
    });
    assert.strictEqual(parseDependencyRelation("(f=job-a,con)"), undefined);
    assert.strictEqual(parseDependencyRelation(undefined), undefined);
  });

  test("can require a relation type for wrapper-compatible parsing", () => {
    assert.deepStrictEqual(
      parseDependencyRelation("(f=job-a,t=job-b,con)", {
        requireRelationType: true,
      }),
      {
        sourceName: "job-a",
        targetName: "job-b",
        relationType: "con",
      },
    );
    assert.strictEqual(
      parseDependencyRelation("(f=job-a,t=job-b)", {
        requireRelationType: true,
      }),
      undefined,
    );
  });
});
