import * as assert from "assert";
import {
  normalizeAjsRelationType,
  parseUnitEdge,
} from "../../domain/models/parameters/unitEdgeHelpers";

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

  test("normalizes unit edge types for the normalized model", () => {
    assert.strictEqual(normalizeAjsRelationType("con"), "con");
    assert.strictEqual(normalizeAjsRelationType("seq"), "seq");
    assert.strictEqual(normalizeAjsRelationType(undefined), "seq");
    assert.strictEqual(normalizeAjsRelationType("unexpected"), "seq");
  });
});
