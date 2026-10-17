import * as assert from "assert";
import { createSearchExecutedEvent } from "../../application/telemetry/telemetryEvent";

suite("Search telemetry", () => {
  test("creates one feature-only event for a newly committed search", () => {
    assert.deepStrictEqual(createSearchExecutedEvent("flow"), {
      name: "search.executed",
      properties: { feature: "flow" },
    });
  });

  test("supports only the two viewer features", () => {
    assert.deepStrictEqual(createSearchExecutedEvent("table").properties, {
      feature: "table",
    });
    // @ts-expect-error The transport never carries raw query text or scope.
    createSearchExecutedEvent({ feature: "table", query: "/private" });
  });
});
