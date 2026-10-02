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

  test("accepts canonical Gregorian years from 0000 through 9999", () => {
    for (const [from, to] of [
      ["0000-02-28", "0000-02-29"],
      ["0001-01-01", "0001-01-02"],
      ["0099-12-30", "0099-12-31"],
      ["0100-02-28", "0100-03-01"],
      ["1900-02-28", "1900-03-01"],
      ["2000-02-28", "2000-02-29"],
      ["2099-12-31", "2100-01-01"],
      ["2100-02-28", "2100-03-01"],
      ["9999-12-30", "9999-12-31"],
    ]) {
      assert.deepStrictEqual(parseSemanticDiffComparisonPeriod({ from, to }), {
        kind: "valid",
        period: { from, to },
      });
    }
  });

  test("rejects malformed or impossible start dates", () => {
    for (const from of [
      "2024-2-01",
      "2023-02-29",
      "0001-02-29",
      "1900-02-29",
      "2100-02-29",
      "2024-04-31",
      " 2024-04-01",
      "2024-04-01 ",
      "2024-04-01T00:00:00Z",
      "x",
    ]) {
      assert.deepStrictEqual(
        parseSemanticDiffComparisonPeriod({ from, to: "2024-05-01" }),
        { kind: "invalid", reason: "invalid-from" },
      );
    }
  });

  test("rejects malformed or impossible end dates", () => {
    for (const to of [
      "2024-2-01",
      "2023-02-29",
      "0001-02-29",
      "1900-02-29",
      "2100-02-29",
      "2024-04-31",
      " 2024-04-01",
      "2024-04-01 ",
      "2024-04-01T00:00:00Z",
      "x",
    ]) {
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

  test("keeps invalid-bound reason precedence deterministic", () => {
    assert.deepStrictEqual(
      parseSemanticDiffComparisonPeriod({ from: "bad", to: "also-bad" }),
      { kind: "invalid", reason: "invalid-from" },
    );
    assert.deepStrictEqual(
      parseSemanticDiffComparisonPeriod({
        from: "2024-04-01",
        to: "also-bad",
      }),
      { kind: "invalid", reason: "invalid-to" },
    );
  });
});
