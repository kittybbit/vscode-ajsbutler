import * as assert from "assert";
import { executeOpenPreviewCommand } from "../../extension/commands/openPreviewCommand";

suite("Open Preview Command", () => {
  test("shows an error when there is no active editor", () => {
    const errors: string[] = [];
    let mounted = false;
    let tracked = false;

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
        trackEvent: () => {
          tracked = true;
        },
      },
    });

    assert.deepStrictEqual(errors, ["No active editor found to open."]);
    assert.strictEqual(mounted, false);
    assert.strictEqual(tracked, false);
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
    assert.strictEqual(tracked.length, 1);
    assert.strictEqual(tracked[0].viewType, "ajsbutler.flowViewer");
    assert.ok("development" in tracked[0].properties);
  });
});
