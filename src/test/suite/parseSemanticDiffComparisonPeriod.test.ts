import * as assert from "assert";
import { parseSemanticDiffComparisonPeriod } from "../../application/semantic-diff/parseSemanticDiffComparisonPeriod";

suite("Semantic diff comparison period", () => {
  test("accepts zero-padded real Gregorian dates and preserves them", () => {
    assert.deepStrictEqual(
      parseSemanticDiffComparisonPeriod({
        from: "2024-02-29",
        to: "2024-03-01",
      }),
      {
        kind: "valid",
        period: { from: "2024-02-29", to: "2024-03-01" },
      },
    );
  });

  test("accepts broad ten-year periods and calendar edges", () => {
    assert.strictEqual(
      parseSemanticDiffComparisonPeriod({
        from: "0001-01-01",
        to: "9999-12-31",
      }).kind,
      "valid",
    );
    assert.strictEqual(
      parseSemanticDiffComparisonPeriod({
        from: "2099-12-31",
        to: "2100-01-01",
      }).kind,
      "valid",
    );
  });

  test("rejects malformed or impossible start dates", () => {
    for (const from of ["2024-2-01", "2023-02-29", "2024-04-31", "x"]) {
      assert.deepStrictEqual(
        parseSemanticDiffComparisonPeriod({ from, to: "2024-05-01" }),
        { kind: "invalid", reason: "invalid-from" },
      );
    }
  });

  test("rejects malformed or impossible end dates", () => {
    for (const to of ["2024-2-01", "2023-02-29", "2024-04-31", "x"]) {
      assert.deepStrictEqual(
        parseSemanticDiffComparisonPeriod({ from: "2024-04-01", to }),
        { kind: "invalid", reason: "invalid-to" },
      );
    }
  });

  test("rejects equal and reversed half-open ranges", () => {
    for (const to of ["2024-04-01", "2024-03-31"]) {
      assert.deepStrictEqual(
        parseSemanticDiffComparisonPeriod({ from: "2024-04-01", to }),
        { kind: "invalid", reason: "non-increasing" },
      );
    }
  });
});
