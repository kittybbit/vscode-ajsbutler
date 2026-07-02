import * as assert from "assert";
import { createWebApiImportWorkflowEvent } from "../../application/telemetry/webApiImportTelemetry";

suite("WebAPI import telemetry", () => {
  test("creates privacy-safe workflow events with coarse buckets", () => {
    assert.deepStrictEqual(
      createWebApiImportWorkflowEvent({
        host: "desktop",
        stage: "completed",
        result: "success",
        durationMs: 1200,
        unitCount: 42,
        all: true,
      }),
      {
        name: "webapi_import.workflow.completed",
        properties: {
          development: String(DEVELOPMENT),
          host: "desktop",
          stage: "completed",
          result: "success",
          durationBucket: "1_4s",
          unitCountBucket: "10_99",
          all: "true",
        },
      },
    );

    assert.deepStrictEqual(
      createWebApiImportWorkflowEvent({
        host: "web",
        stage: "failed",
        result: "failed",
        durationMs: 500,
        errorCode: "server-error",
        httpStatus: 503,
      }),
      {
        name: "webapi_import.workflow.failed",
        properties: {
          development: String(DEVELOPMENT),
          host: "web",
          stage: "failed",
          result: "failed",
          durationBucket: "500_999ms",
          errorCode: "server-error",
          httpStatusCategory: "5xx",
        },
      },
    );
  });
});
