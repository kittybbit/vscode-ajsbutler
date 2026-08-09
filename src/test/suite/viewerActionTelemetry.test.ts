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
        operation: "copy.csv",
        host: "web",
      }),
      {
        name: "viewer.table.csv_copied",
        properties: {
          development: String(DEVELOPMENT),
          host: "web",
          view: "table",
          result: "success",
        },
      },
    );

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

    assert.deepStrictEqual(
      createViewerActionEvent({
        viewType: "ajsbutler.tableViewer",
        operation: "definition.open",
        host: "desktop",
      }),
      {
        name: "viewer.table.definition_opened",
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
        operation: "definition.open",
        host: "web",
      }),
      {
        name: "viewer.flow.definition_opened",
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

    assert.deepStrictEqual(
      createViewerNavigationActionEvent({
        viewType: "ajsbutler.tableViewer",
        targetView: "flow",
        host: "web",
      }),
      {
        name: "viewer.table.navigate_to_flow",
        properties: {
          development: String(DEVELOPMENT),
          host: "web",
          view: "table",
          result: "success",
        },
      },
    );
  });

  test("characterizes remaining action mappings and result states", () => {
    const cases = [
      ["ajsbutler.tableViewer", "unit.select", "viewer.table.unit_selected"],
      ["ajsbutler.flowViewer", "unit.select", "viewer.flow.unit_selected"],
      [
        "ajsbutler.flowViewer",
        "definition.open",
        "viewer.flow.definition_opened",
      ],
      ["ajsbutler.flowViewer", "flow.scope.open", "viewer.flow.scope_opened"],
      [
        "ajsbutler.flowViewer",
        "flow.nested.toggle",
        "viewer.flow.nested_expansion_toggled",
      ],
      [
        "ajsbutler.flowViewer",
        "flow.relationship_focus.toggle",
        "viewer.flow.relationship_focus_toggled",
      ],
    ] as const;

    for (const [viewType, operation, name] of cases) {
      const event = createViewerActionEvent({
        viewType,
        operation,
        host: "desktop",
        result: "failed",
      });

      assert.deepStrictEqual(event, {
        name,
        properties: {
          development: String(DEVELOPMENT),
          host: "desktop",
          view: viewType.endsWith(".tableViewer") ? "table" : "flow",
          result: "failed",
        },
      });
    }

    assert.deepStrictEqual(
      createViewerActionEvent({
        viewType: "ajsbutler.tableViewer",
        operation: "copy.csv",
        result: "cancelled",
      }),
      {
        name: "viewer.table.csv_copied",
        properties: {
          development: String(DEVELOPMENT),
          view: "table",
          result: "cancelled",
        },
      },
    );

    assert.strictEqual(
      createViewerNavigationActionEvent({
        viewType: "ajsbutler.tableViewer",
        targetView: "table",
      }),
      undefined,
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
