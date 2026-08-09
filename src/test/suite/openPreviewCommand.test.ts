import * as assert from "assert";
import { VscodeTelemetryAdapter } from "../../infrastructure/telemetry/VscodeTelemetryAdapter";
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
        reportTelemetry: (event) => {
          tracked.push({ viewType: event.name, properties: event.properties });
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

  test("maps active-editor access failure without exposing the host error", () => {
    const errors: string[] = [];
    const tracked: Array<{
      viewType: string;
      properties: Record<string, string>;
    }> = [];

    assert.doesNotThrow(() =>
      executeOpenPreviewCommand({
        viewType: "ajsbutler.tableViewer",
        panelFactory: {
          getPanel: () => {
            throw new Error("panel should not be created");
          },
        },
        deps: {
          getActiveEditor: () => {
            throw new Error("secret editor host failure");
          },
          showErrorMessage: async (message) => {
            errors.push(message);
            return undefined;
          },
          mountPanel: () => {
            throw new Error("panel should not be mounted");
          },
          reportTelemetry: (event) => {
            tracked.push({
              viewType: event.name,
              properties: event.properties,
            });
          },
        },
      }),
    );

    assert.deepStrictEqual(errors, ["Active editor could not be accessed."]);
    assert.strictEqual(tracked.length, 1);
    assert.strictEqual(tracked[0].viewType, "viewer.table.open_started");
    assert.strictEqual(tracked[0].properties.source, "command");
    assert.strictEqual(tracked[0].properties.result, "failed");
    assert.strictEqual(tracked[0].properties.errorCode, "active_editor_failed");
    assert.ok(!errors[0].includes("secret editor host failure"));
  });

  test("maps panel creation failure to a safe host outcome", () => {
    const errors: string[] = [];
    const tracked: Array<{
      viewType: string;
      properties: Record<string, string>;
    }> = [];
    const document = {
      uri: { toString: () => "file:///sample.ajs" },
    };

    assert.doesNotThrow(() =>
      executeOpenPreviewCommand({
        viewType: "ajsbutler.tableViewer",
        panelFactory: {
          getPanel: () => {
            throw new Error("secret panel host failure");
          },
        },
        deps: {
          getActiveEditor: () => ({ document }) as never,
          showErrorMessage: async (message) => {
            errors.push(message);
            return undefined;
          },
          mountPanel: () => {
            throw new Error("panel should not be mounted");
          },
          reportTelemetry: (event) => {
            tracked.push({
              viewType: event.name,
              properties: event.properties,
            });
          },
        },
      }),
    );

    assert.deepStrictEqual(errors, ["Viewer could not be opened."]);
    assert.strictEqual(tracked.length, 1);
    assert.strictEqual(tracked[0].viewType, "viewer.table.open_started");
    assert.strictEqual(tracked[0].properties.result, "failed");
    assert.strictEqual(tracked[0].properties.errorCode, "open_failed");
    assert.ok(!errors[0].includes("secret panel host failure"));
  });

  test("disposes a panel when mounting fails", () => {
    let disposed = false;
    const panel = {
      dispose: () => {
        disposed = true;
      },
    };
    const document = {
      uri: { toString: () => "file:///sample.ajs" },
    };

    assert.doesNotThrow(() =>
      executeOpenPreviewCommand({
        viewType: "ajsbutler.flowViewer",
        panelFactory: {
          getPanel: () => panel as never,
        },
        deps: {
          getActiveEditor: () => ({ document }) as never,
          showErrorMessage: () => {
            throw new Error("notification host failure");
          },
          mountPanel: () => {
            throw new Error("secret mount host failure");
          },
          reportTelemetry: () => {
            throw new Error("telemetry host failure");
          },
        },
      }),
    );

    assert.strictEqual(disposed, true);
  });

  test("continues opening when the document URI cannot be formatted for logging", () => {
    let mounted = false;
    const panel = {};
    const document = {
      uri: {
        toString: () => {
          throw new Error("URI formatting failed");
        },
      },
    };

    assert.doesNotThrow(() =>
      executeOpenPreviewCommand({
        viewType: "ajsbutler.flowViewer",
        panelFactory: {
          getPanel: (receivedDocument) => {
            assert.strictEqual(receivedDocument, document);
            return panel as never;
          },
        },
        deps: {
          getActiveEditor: () => ({ document }) as never,
          showErrorMessage: async () => undefined,
          mountPanel: () => {
            mounted = true;
          },
          reportTelemetry: () => {},
        },
      }),
    );

    assert.strictEqual(mounted, true);
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
        reportTelemetry: (event) => {
          tracked.push({ viewType: event.name, properties: event.properties });
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

  test("keeps preview opening available when the SDK reporter fails", () => {
    const telemetry = new VscodeTelemetryAdapter("test", () => ({
      sendTelemetryEvent() {
        throw new Error("telemetry failed");
      },
      dispose() {},
    }));
    const panel = {};
    const document = {
      uri: { toString: () => "file:///sample.ajs" },
    };
    let mounted = false;

    assert.doesNotThrow(() =>
      executeOpenPreviewCommand({
        viewType: "ajsbutler.tableViewer",
        panelFactory: {
          getPanel: () => panel as never,
        },
        deps: {
          getActiveEditor: () => ({ document }) as never,
          showErrorMessage: async () => undefined,
          mountPanel: () => {
            mounted = true;
          },
          reportTelemetry: (event) => telemetry.report(event),
        },
      }),
    );
    assert.strictEqual(mounted, true);
  });
});
