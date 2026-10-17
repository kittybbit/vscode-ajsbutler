import * as assert from "assert";
import { createCsvExportedEvent } from "../../application/telemetry/telemetryEvent";

suite("Viewer action telemetry", () => {
  test("distinguishes a clipboard export from a successful file save", () => {
    assert.deepStrictEqual(createCsvExportedEvent("copy"), {
      name: "csv.exported",
      properties: { method: "copy" },
    });
    assert.deepStrictEqual(createCsvExportedEvent("save"), {
      name: "csv.exported",
      properties: { method: "save" },
    });
  });
});
