import * as assert from "assert";
import { executeOpenPreviewCommand } from "../../presentation/vscode/commands/openPreviewCommand";

suite("Open Preview Command", () => {
  test("shows an error when there is no active editor", () => {
    const errors: string[] = [];
    let mounted = false;
    const tracked: Array<{
      viewType: string;
      properties: Record<string, string>;
    }> = [];

    executeOpenPreviewCommand({
      viewType: "ajsbutler.tableViewer",
      panelFactory: {
        getPanel: () => {
          throw new Error("panel should not be created");
        },
      },
      deps: {
        getActiveEditor: () => undefined,
        showErrorMessage: async (message) => {
          errors.push(message);
          return undefined;
        },
        mountPanel: () => {
          mounted = true;
        },
        trackEvent: (viewType, properties) => {
          tracked.push({ viewType, properties });
        },
      },
    });

    assert.deepStrictEqual(errors, ["No active editor found to open."]);
    assert.strictEqual(mounted, false);
    assert.strictEqual(tracked.length, 1);
    assert.strictEqual(tracked[0].viewType, "viewer.table.open_started");
    assert.strictEqual(tracked[0].properties.source, "command");
    assert.strictEqual(tracked[0].properties.result, "failed");
    assert.strictEqual(tracked[0].properties.errorCode, "no_active_editor");
  });

  test("opens and mounts the preview for the active editor", () => {
    const mounted: Array<{ panel: object; viewType: string }> = [];
    const tracked: Array<{
      viewType: string;
      properties: Record<string, string>;
    }> = [];
    const panel = {};
    const document = {
      uri: { toString: () => "file:///sample.ajs" },
    };
    const activeEditor = { document };

    executeOpenPreviewCommand({
      viewType: "ajsbutler.flowViewer",
      panelFactory: {
        getPanel: (receivedDocument) => {
          assert.strictEqual(receivedDocument, document);
          return panel as never;
        },
      },
      deps: {
        getActiveEditor: () => activeEditor as never,
        showErrorMessage: async () => undefined,
        mountPanel: (receivedPanel, viewType) => {
          mounted.push({ panel: receivedPanel, viewType });
        },
        trackEvent: (viewType, properties) => {
          tracked.push({ viewType, properties });
        },
      },
    });

    assert.deepStrictEqual(mounted, [
      { panel, viewType: "ajsbutler.flowViewer" },
    ]);
    assert.strictEqual(tracked.length, 2);
    assert.deepStrictEqual(
      tracked.map((event) => event.viewType),
      ["viewer.flow.open_started", "ajsbutler.flowViewer"],
    );
    assert.strictEqual(tracked[0].properties.source, "command");
    assert.strictEqual(tracked[0].properties.result, "success");
    assert.ok("development" in tracked[1].properties);
  });
});
