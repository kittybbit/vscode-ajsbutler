import * as assert from "assert";
import { parseSchedulePeriod } from "../../domain/schedule/SchedulePeriod";

suite("Schedule Period", () => {
  test("parses supported Gregorian years with UTC dates and preserved bounds", () => {
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
      const result = parseSchedulePeriod({ from, to });
      assert.strictEqual(result.kind, "valid");
      if (result.kind !== "valid") return;
      assert.deepStrictEqual(result.period, { from, to });
      assert.strictEqual(
        result.fromDate.toISOString(),
        `${from}T00:00:00.000Z`,
      );
      assert.strictEqual(result.toDate.toISOString(), `${to}T00:00:00.000Z`);
    }
  });

  test("rejects malformed and impossible Gregorian dates in bound order", () => {
    for (const from of [
      "2024-2-01",
      "0001-02-29",
      "1900-02-29",
      "2100-02-29",
      "2024-04-31",
      " 2024-04-01",
      "2024-04-01 ",
      "2024-04-01T00:00:00Z",
    ]) {
      assert.deepStrictEqual(parseSchedulePeriod({ from, to: "2024-05-01" }), {
        kind: "invalid",
        reason: "invalid-from",
      });
    }
    for (const to of [
      "2024-2-01",
      "0001-02-29",
      "1900-02-29",
      "2100-02-29",
      "2024-04-31",
      " 2024-04-01",
      "2024-04-01 ",
      "2024-04-01T00:00:00Z",
    ]) {
      assert.deepStrictEqual(parseSchedulePeriod({ from: "2024-04-01", to }), {
        kind: "invalid",
        reason: "invalid-to",
      });
    }
    assert.deepStrictEqual(
      parseSchedulePeriod({ from: "invalid", to: "also-invalid" }),
      { kind: "invalid", reason: "invalid-from" },
    );
  });

  test("rejects equal and reversed half-open periods", () => {
    for (const to of ["2024-04-01", "2024-03-31"]) {
      assert.deepStrictEqual(parseSchedulePeriod({ from: "2024-04-01", to }), {
        kind: "invalid",
        reason: "non-increasing",
      });
    }
  });
});
