import * as assert from "assert";
import { createCsvExportPerformanceEvent } from "../../presentation/webview/editor/ajsTable/Header";

suite("CSV export telemetry", () => {
  test("preserves the CSV export operation and privacy-safe buckets", () => {
    assert.deepStrictEqual(createCsvExportPerformanceEvent(250, 42), {
      type: "performance",
      data: {
        operation: "csv_export",
        result: "success",
        durationBucket: "100_499ms",
        rowCountBucket: "10_99",
      },
    });
  });
});
