import * as assert from "assert";
import { createTableRenderReadyEvent } from "../../presentation/webview/editor/ajsTable/TableContents";

suite("Table render telemetry", () => {
  test("emits the existing privacy-safe render-ready schema", () => {
    assert.deepStrictEqual(createTableRenderReadyEvent(250, 42), {
      type: "performance",
      data: {
        operation: "table_render",
        result: "success",
        durationBucket: "100_499ms",
        rowCountBucket: "10_99",
      },
    });
  });
});
