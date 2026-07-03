import * as assert from "assert";
import {
  createViewerActionEvent,
  createViewerNavigationActionEvent,
} from "../../application/telemetry/viewerActionTelemetry";

suite("Viewer action telemetry", () => {
  test("maps table and flow operations to schema-owned events", () => {
    assert.deepStrictEqual(
      createViewerActionEvent({
        viewType: "ajsbutler.tableViewer",
        operation: "save.csv",
        host: "desktop",
      }),
      {
        name: "viewer.table.csv_saved",
        properties: {
          development: String(DEVELOPMENT),
          host: "desktop",
          view: "table",
          result: "success",
        },
      },
    );

    assert.deepStrictEqual(
      createViewerActionEvent({
        viewType: "ajsbutler.flowViewer",
        operation: "flow.minimap.toggle",
        host: "web",
      }),
      {
        name: "viewer.flow.minimap_toggled",
        properties: {
          development: String(DEVELOPMENT),
          host: "web",
          view: "flow",
          result: "success",
        },
      },
    );
  });

  test("maps navigation to source-view action events", () => {
    assert.deepStrictEqual(
      createViewerNavigationActionEvent({
        viewType: "ajsbutler.flowViewer",
        targetView: "table",
        host: "desktop",
      }),
      {
        name: "viewer.flow.navigate_to_table",
        properties: {
          development: String(DEVELOPMENT),
          host: "desktop",
          view: "flow",
          result: "success",
        },
      },
    );
  });

  test("ignores unknown operations and unknown viewers", () => {
    assert.strictEqual(
      createViewerActionEvent({
        viewType: "ajsbutler.tableViewer",
        operation: "unknown",
      }),
      undefined,
    );
    assert.strictEqual(
      createViewerNavigationActionEvent({
        viewType: "ajsbutler.unknown",
        targetView: "flow",
      }),
      undefined,
    );
  });
});
