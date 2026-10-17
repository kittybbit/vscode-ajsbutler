import * as assert from "assert";
import {
  executeOpenPreviewCommand,
  type OpenPreviewCommandDependencies,
  type PreviewPanelFactory,
} from "../../presentation/vscode/commands/openPreviewCommand";

const createDeps = (
  overrides: Partial<OpenPreviewCommandDependencies> = {},
) => {
  const calls: string[] = [];
  const deps: OpenPreviewCommandDependencies = {
    getActiveEditor: () => ({ document: {} }) as never,
    showErrorMessage: async (message) => {
      calls.push(`error:${message}`);
      return undefined;
    },
    mountPanel: () => calls.push("mount"),
    revealPanel: () => true,
    onOpenStarted: (_panel, viewType) => calls.push(`started:${viewType}`),
    onOpenFailed: (viewType) => calls.push(`failed:${viewType}`),
    onPanelFailed: () => calls.push("panel-failed"),
    ...overrides,
  };
  return { calls, deps };
};

const createFactory = (
  overrides: Partial<PreviewPanelFactory> = {},
): PreviewPanelFactory => ({
  getPanel: () => ({}) as never,
  getExistingPanel: () => undefined,
  ...overrides,
});

suite("Open Preview Command", () => {
  test("reports a failed completion when there is no active editor", () => {
    const { calls, deps } = createDeps({
      getActiveEditor: () => undefined,
    });

    executeOpenPreviewCommand({
      viewType: "ajsbutler.tableViewer",
      panelFactory: createFactory({
        getPanel: () => {
          throw new Error("panel should not be created");
        },
      }),
      deps,
    });

    assert.deepStrictEqual(calls, [
      "failed:ajsbutler.tableViewer",
      "error:No active editor found to open.",
    ]);
  });

  test("maps active-editor access failures to a safe message", () => {
    const { calls, deps } = createDeps({
      getActiveEditor: () => {
        throw new Error("secret editor failure");
      },
    });

    executeOpenPreviewCommand({
      viewType: "ajsbutler.flowViewer",
      panelFactory: createFactory(),
      deps,
    });

    assert.deepStrictEqual(calls, [
      "failed:ajsbutler.flowViewer",
      "error:Active editor could not be accessed.",
    ]);
  });

  test("reports a displayed panel only after a successful reveal", () => {
    const existingPanel = {} as never;
    const document = {};
    const { calls, deps } = createDeps({
      getActiveEditor: () => ({ document }) as never,
    });

    executeOpenPreviewCommand({
      viewType: "ajsbutler.flowViewer",
      panelFactory: createFactory({
        getExistingPanel: () => existingPanel,
        getPanel: () => {
          throw new Error("a replacement panel must not be created");
        },
      }),
      deps,
    });

    assert.deepStrictEqual(calls, ["started:ajsbutler.flowViewer"]);
  });

  test("fails an existing-panel open when reveal fails", () => {
    const { calls, deps } = createDeps({ revealPanel: () => false });

    executeOpenPreviewCommand({
      viewType: "ajsbutler.tableViewer",
      panelFactory: createFactory({ getExistingPanel: () => ({}) as never }),
      deps,
    });

    assert.deepStrictEqual(calls, [
      "failed:ajsbutler.tableViewer",
      "error:Viewer could not be opened.",
    ]);
  });

  test("starts a new open and mounts its panel", () => {
    const panel = {} as never;
    const { calls, deps } = createDeps({
      mountPanel: (receivedPanel) => {
        assert.strictEqual(receivedPanel, panel);
        calls.push("mount");
      },
    });

    executeOpenPreviewCommand({
      viewType: "ajsbutler.flowViewer",
      panelFactory: createFactory({ getPanel: () => panel }),
      deps,
    });

    assert.deepStrictEqual(calls, ["started:ajsbutler.flowViewer", "mount"]);
  });

  test("fails and disposes a newly created panel when mount or reveal fails", () => {
    let disposed = false;
    const panel = { dispose: () => (disposed = true) } as never;
    const { calls, deps } = createDeps({
      mountPanel: () => {
        throw new Error("secret mount error");
      },
    });

    executeOpenPreviewCommand({
      viewType: "ajsbutler.tableViewer",
      panelFactory: createFactory({ getPanel: () => panel }),
      deps,
    });

    assert.strictEqual(disposed, true);
    assert.deepStrictEqual(calls, [
      "started:ajsbutler.tableViewer",
      "panel-failed",
      "error:Viewer could not be opened.",
    ]);
    assert.ok(calls.every((call) => !call.includes("secret")));
  });
});
