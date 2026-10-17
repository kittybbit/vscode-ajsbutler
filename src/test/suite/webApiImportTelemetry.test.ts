import * as assert from "assert";
import { createWebApiImportCompletedEvent } from "../../application/telemetry/telemetryEvent";

suite("WebAPI import telemetry", () => {
  test("records one terminal result without workflow details", () => {
    for (const result of ["success", "failed", "cancelled"] as const) {
      assert.deepStrictEqual(createWebApiImportCompletedEvent(result), {
        name: "webapi_import.completed",
        properties: { result },
      });
    }
  });
});
