import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import type { BuildUnitList } from "../../application/unit-list/buildUnitList";
import type { UnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import {
  createViewerReadyHandler,
  createViewerSubscriptions,
  revealCounterpartPanel,
} from "../../bootstrap/extension/viewerWiring";
import { ViewerFactory } from "../../presentation/vscode/webview/ViewerFactory";
import {
  AJS_FLOW_VIEWER_TYPE,
  AJS_TABLE_VIEWER_TYPE,
} from "../../presentation/vscode/webview/constant";

type PropertyOverride = {
  restore: () => void;
};

const overrideProperty = (
  target: object,
  key: string,
  descriptor: PropertyDescriptor,
): PropertyOverride => {
  const previous = Object.getOwnPropertyDescriptor(target, key);
  Object.defineProperty(target, key, { configurable: true, ...descriptor });
  return {
    restore: () => {
      if (previous) Object.defineProperty(target, key, previous);
      else Reflect.deleteProperty(target, key);
    },
  };
};

type ViewerPanelFixture = {
  panel: vscode.WebviewPanel;
  receive: (message: unknown) => void;
};

const createViewerPanelFixture = (
  viewType: string,
  title: string,
  postMessage: () => Thenable<boolean> = async () => true,
): ViewerPanelFixture => {
  let receive: (message: unknown) => void = () => undefined;
  const disposeListeners: (() => void)[] = [];
  let disposed = false;
  const panel = {
    viewType,
    title,
    viewColumn: vscode.ViewColumn.Active,
    reveal: () => undefined,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      disposeListeners.forEach((listener) => listener());
    },
    onDidDispose: (listener: () => void) => {
      disposeListeners.push(listener);
      return { dispose: () => undefined };
    },
    webview: {
      options: {},
      html: "",
      cspSource: "vscode-webview:",
      asWebviewUri: (uri: vscode.Uri) => uri,
      postMessage,
      onDidReceiveMessage: (listener: (message: unknown) => void) => {
        receive = listener;
        return { dispose: () => undefined };
      },
    },
  } as unknown as vscode.WebviewPanel;
  return { panel, receive: (message) => receive(message) };
};

const createViewerLifecycleHarness = (
  options: {
    buildUnitList?: BuildUnitList;
    postMessage?: () => Thenable<boolean>;
  } = {},
) => {
  const commandHandlers = new Map<string, () => void>();
  const panels: ViewerPanelFixture[] = [];
  const events: {
    name: string;
    properties: Readonly<Record<string, string>>;
  }[] = [];
  let activeEditor: vscode.TextEditor | undefined;
  const errorMessages: string[] = [];
  const document = {
    uri: vscode.Uri.parse("untitled:viewer-lifecycle"),
    getText: () => "unit=viewer,,jp1admin,;{ty=g;}",
  } as vscode.TextDocument;
  const emptyDocument = {
    rootUnits: [],
    warnings: [],
    unitDefinitions: [],
    unitList: { units: [], rows: [], columns: [] },
  } as unknown as UnitListDocumentDto;
  const overrides = [
    overrideProperty(vscode.commands, "registerCommand", {
      value: (command: string, callback: () => void) => {
        commandHandlers.set(command, callback);
        return { dispose: () => commandHandlers.delete(command) };
      },
    }),
    overrideProperty(vscode.window, "activeTextEditor", {
      get: () => activeEditor,
    }),
    overrideProperty(vscode.window, "createWebviewPanel", {
      value: (viewType: string, title: string) => {
        const fixture = createViewerPanelFixture(
          viewType,
          title,
          options.postMessage,
        );
        panels.push(fixture);
        return fixture.panel;
      },
    }),
    overrideProperty(vscode.window, "showErrorMessage", {
      value: (message: string) => {
        errorMessages.push(message);
        return Promise.resolve(undefined);
      },
    }),
  ];
  const telemetry: TelemetryPort = {
    report: (event) => events.push(event),
    dispose() {},
  };
  const subscriptions = createViewerSubscriptions({
    context: {
      extensionUri: vscode.Uri.parse("file:///extension"),
      subscriptions: [],
    } as unknown as vscode.ExtensionContext,
    telemetry,
    buildUnitList:
      options.buildUnitList ??
      (() => ({ document: emptyDocument, errors: [] })),
  });

  return {
    commandHandlers,
    document,
    events,
    errorMessages,
    panels,
    subscriptions,
    setActiveDocument: (value: vscode.TextDocument) => {
      activeEditor = { document: value } as vscode.TextEditor;
    },
    restore: () => {
      subscriptions.forEach((subscription) => subscription.dispose());
      overrides.reverse().forEach(({ restore }) => restore());
    },
  };
};

const flushMicrotasks = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
};

type CounterpartRevealTestDeps = {
  factoryByViewType: ReadonlyMap<string, ViewerFactory>;
  mountPanel: (panel: vscode.WebviewPanel, viewType: string) => void;
  onOpenStarted: (panel: vscode.WebviewPanel, viewType: string) => void;
  onOpenFailed: (viewType: string) => void;
  onPanelFailed: (panel: vscode.WebviewPanel) => void;
  pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>;
};

const createCounterpartRevealDeps = (
  overrides: Partial<CounterpartRevealTestDeps> = {},
): CounterpartRevealTestDeps => ({
  factoryByViewType: new Map(),
  mountPanel: () => undefined,
  onOpenStarted: () => undefined,
  onOpenFailed: () => undefined,
  onPanelFailed: () => undefined,
  pendingRevealByPanel: new WeakMap(),
  ...overrides,
});

suite("Viewer wiring", () => {
  test("creates viewer subscriptions for both table and flow viewers", () => {
    const context = { subscriptions: [] } as vscode.ExtensionContext;
    const telemetry: TelemetryPort = {
      report() {},
      dispose() {},
    };

    const subscriptions = createViewerSubscriptions({
      context,
      telemetry,
      buildUnitList: () => ({ errors: [] }),
    });

    assert.strictEqual(subscriptions.length, 4);
    assert.strictEqual(new Set(subscriptions).size, subscriptions.length);
    assert.deepStrictEqual(context.subscriptions, []);
    subscriptions.forEach((subscription) => {
      assert.strictEqual(typeof subscription.dispose, "function");
      subscription.dispose();
    });
  });

  test("completes overlapping opens once, reuses a displayed panel, and ignores duplicate acknowledgements", async () => {
    const harness = createViewerLifecycleHarness();
    try {
      harness.setActiveDocument(harness.document);
      const open = harness.commandHandlers.get(`open.${AJS_TABLE_VIEWER_TYPE}`);
      assert.ok(open);
      open();
      open();
      const fixture = harness.panels[0];
      assert.ok(fixture);
      assert.deepStrictEqual(harness.events, []);

      fixture.receive({ type: "display", data: "success" });
      assert.deepStrictEqual(harness.events, []);
      fixture.receive({ type: "ready" });
      await flushMicrotasks();

      assert.deepStrictEqual(harness.events, [
        {
          name: "viewer.open_completed",
          properties: { feature: "table", host: "desktop", result: "success" },
        },
        {
          name: "viewer.open_completed",
          properties: { feature: "table", host: "desktop", result: "success" },
        },
      ]);

      fixture.receive({ type: "display", data: "failed" });
      fixture.receive({ type: "display", data: "success" });
      fixture.receive({ type: "ready" });
      await flushMicrotasks();
      assert.strictEqual(harness.events.length, 2);

      open();
      assert.deepStrictEqual(harness.events[2], {
        name: "viewer.open_completed",
        properties: { feature: "table", host: "desktop", result: "success" },
      });
    } finally {
      harness.restore();
    }
  });

  test("fails a pending open on disposal and ignores a late display acknowledgement", async () => {
    const harness = createViewerLifecycleHarness();
    try {
      harness.setActiveDocument(harness.document);
      harness.commandHandlers.get(`open.${AJS_TABLE_VIEWER_TYPE}`)?.();
      const fixture = harness.panels[0];
      assert.ok(fixture);
      fixture.receive({ type: "ready" });
      await flushMicrotasks();
      fixture.panel.dispose();
      fixture.receive({ type: "display", data: "success" });

      assert.deepStrictEqual(harness.events, [
        {
          name: "viewer.open_completed",
          properties: { feature: "table", host: "desktop", result: "failed" },
        },
      ]);
    } finally {
      harness.restore();
    }
  });

  test("notifies READY transport failures and completes each open as failed once", async () => {
    const failureModes: {
      name: string;
      buildUnitList?: BuildUnitList;
      postMessage?: () => Thenable<boolean>;
    }[] = [
      {
        name: "builder",
        buildUnitList: () => {
          throw new Error("build failed");
        },
      },
      {
        name: "synchronous postMessage",
        postMessage: () => {
          throw new Error("post failed");
        },
      },
    ];

    for (const failureMode of failureModes) {
      const harness = createViewerLifecycleHarness(failureMode);
      try {
        harness.setActiveDocument(harness.document);
        harness.commandHandlers.get(`open.${AJS_TABLE_VIEWER_TYPE}`)?.();
        const fixture = harness.panels[0];
        assert.ok(fixture, failureMode.name);

        fixture.receive({ type: "ready" });
        await new Promise((resolve) => setTimeout(resolve, 0));

        assert.deepStrictEqual(harness.errorMessages, [
          "The viewer document could not be refreshed.",
        ]);
        assert.deepStrictEqual(harness.events, [
          {
            name: "viewer.open_completed",
            properties: {
              feature: "table",
              host: "desktop",
              result: "failed",
            },
          },
        ]);
      } finally {
        harness.restore();
      }
    }
  });

  test("reveals an existing counterpart immediately", () => {
    const calls: string[] = [];
    const document = { uri: {} } as vscode.TextDocument;
    const panel = {
      viewColumn: vscode.ViewColumn.Beside,
      reveal: () => calls.push("reveal"),
      webview: {
        postMessage: (message: {
          type: string;
          data: { absolutePath: string };
        }) => calls.push(`post:${message.type}:${message.data.absolutePath}`),
      },
    } as unknown as vscode.WebviewPanel;
    const factory = {
      getExistingPanel: () => panel,
      getPanel: () => {
        throw new Error("existing panel should be reused");
      },
    } as unknown as ViewerFactory;

    revealCounterpartPanel(
      {
        document,
        targetViewType: AJS_FLOW_VIEWER_TYPE,
        absolutePath: "/root/job",
      },
      createCounterpartRevealDeps({
        factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
        mountPanel: () => calls.push("mount"),
        pendingRevealByPanel: new WeakMap(),
      }),
    );

    assert.deepStrictEqual(calls, ["reveal", "post:revealUnit:/root/job"]);
  });

  test("drops pending state when an existing counterpart is disposed", () => {
    const document = { uri: {} } as vscode.TextDocument;
    const panel = {
      viewColumn: vscode.ViewColumn.Beside,
      reveal: () => {
        throw new Error("panel disposed");
      },
      webview: { postMessage: () => undefined },
    } as unknown as vscode.WebviewPanel;
    const pendingRevealByPanel = new WeakMap<vscode.WebviewPanel, string>();
    pendingRevealByPanel.set(panel, "/root/old");
    const factory = {
      getExistingPanel: () => panel,
      getPanel: () => {
        throw new Error("disposed panel should not be replaced here");
      },
    } as unknown as ViewerFactory;

    assert.throws(() =>
      revealCounterpartPanel(
        {
          document,
          targetViewType: AJS_FLOW_VIEWER_TYPE,
          absolutePath: "/root/latest",
        },
        createCounterpartRevealDeps({
          factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
          mountPanel: () => undefined,
          pendingRevealByPanel,
        }),
      ),
    );

    assert.strictEqual(pendingRevealByPanel.has(panel), false);
  });

  test("runs ready callbacks and consumes a pending reveal once", () => {
    const calls: string[] = [];
    const document = { uri: {} } as vscode.TextDocument;
    const createPanel = (): vscode.WebviewPanel =>
      ({
        viewColumn: vscode.ViewColumn.Beside,
        webview: {
          postMessage: (message: {
            type: string;
            data: { absolutePath: string };
          }) => calls.push(`post:${message.type}:${message.data.absolutePath}`),
        },
      }) as unknown as vscode.WebviewPanel;
    const commandPanel = createPanel();
    const navigationPanel = createPanel();
    const pendingRevealByPanel = new WeakMap<vscode.WebviewPanel, string>();
    pendingRevealByPanel.set(navigationPanel, "/root/job");

    const onReady = createViewerReadyHandler(
      (_document, panel) => {
        calls.push(
          `ready:${panel === navigationPanel ? "navigation" : "command"}`,
        );
      },
      pendingRevealByPanel,
      (_document, panel) =>
        calls.push(
          `flow-ready:${panel === navigationPanel ? "navigation" : "command"}`,
        ),
    );

    onReady(document, commandPanel);
    onReady(document, navigationPanel);
    onReady(document, navigationPanel);

    assert.deepStrictEqual(calls, [
      "ready:command",
      "flow-ready:command",
      "ready:navigation",
      "flow-ready:navigation",
      "post:revealUnit:/root/job",
      "ready:navigation",
      "flow-ready:navigation",
    ]);
    assert.strictEqual(pendingRevealByPanel.has(navigationPanel), false);
  });

  test("opens a missing flow panel and reveals after document readiness", () => {
    const calls: string[] = [];
    const document = { uri: {} } as vscode.TextDocument;
    const panel = {
      viewColumn: vscode.ViewColumn.Beside,
      reveal: () => calls.push("reveal"),
      webview: {
        postMessage: (message: {
          type: string;
          data: { absolutePath: string };
        }) => calls.push(`post:${message.type}:${message.data.absolutePath}`),
      },
    } as unknown as vscode.WebviewPanel;
    let opened = false;
    const factory = {
      getExistingPanel: () => (opened ? panel : undefined),
      getPanel: () => panel,
    } as unknown as ViewerFactory;
    const pendingRevealByPanel = new WeakMap<vscode.WebviewPanel, string>();

    revealCounterpartPanel(
      {
        document,
        targetViewType: AJS_FLOW_VIEWER_TYPE,
        absolutePath: "/root/job",
      },
      createCounterpartRevealDeps({
        factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
        mountPanel: () => {
          opened = true;
          calls.push("mount");
        },
        onOpenStarted: (_panel, viewType) => calls.push(`open:${viewType}`),
        pendingRevealByPanel,
      }),
    );

    assert.deepStrictEqual(calls, [
      `open:${AJS_FLOW_VIEWER_TYPE}`,
      "mount",
      "reveal",
    ]);
    revealCounterpartPanel(
      {
        document,
        targetViewType: AJS_FLOW_VIEWER_TYPE,
        absolutePath: "/root/latest",
      },
      createCounterpartRevealDeps({
        factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
        mountPanel: () => calls.push("mount"),
        pendingRevealByPanel,
      }),
    );
    assert.deepStrictEqual(calls, [
      `open:${AJS_FLOW_VIEWER_TYPE}`,
      "mount",
      "reveal",
      "reveal",
    ]);
    createViewerReadyHandler(() => {
      calls.push("document");
    }, pendingRevealByPanel)(document, panel);
    assert.deepStrictEqual(calls, [
      `open:${AJS_FLOW_VIEWER_TYPE}`,
      "mount",
      "reveal",
      "reveal",
      "document",
      "post:revealUnit:/root/latest",
    ]);
  });

  test("opens a missing table panel and reveals after document readiness", () => {
    const calls: string[] = [];
    const document = { uri: {} } as vscode.TextDocument;
    const panel = {
      viewColumn: vscode.ViewColumn.Beside,
      reveal: () => calls.push("reveal"),
      webview: {
        postMessage: (message: {
          type: string;
          data: { absolutePath: string };
        }) => calls.push(`post:${message.type}:${message.data.absolutePath}`),
      },
    } as unknown as vscode.WebviewPanel;
    const factory = {
      getExistingPanel: () => undefined,
      getPanel: () => panel,
    } as unknown as ViewerFactory;
    const pendingRevealByPanel = new WeakMap<vscode.WebviewPanel, string>();

    revealCounterpartPanel(
      {
        document,
        targetViewType: AJS_TABLE_VIEWER_TYPE,
        absolutePath: "/root/job",
      },
      createCounterpartRevealDeps({
        factoryByViewType: new Map([[AJS_TABLE_VIEWER_TYPE, factory]]),
        mountPanel: () => calls.push("mount"),
        pendingRevealByPanel,
      }),
    );

    assert.deepStrictEqual(calls, ["mount", "reveal"]);
    createViewerReadyHandler(() => {
      calls.push("document");
    }, pendingRevealByPanel)(document, panel);
    assert.deepStrictEqual(calls, [
      "mount",
      "reveal",
      "document",
      "post:revealUnit:/root/job",
    ]);
  });

  test("cleans up pending reveal state when counterpart setup fails", () => {
    const document = { uri: {} } as vscode.TextDocument;
    const failureModes = [
      {
        name: "mount",
        mountPanel: (calls: string[]) => {
          calls.push("mount");
          throw new Error("mount failed");
        },
        revealPanel: (calls: string[]) => calls.push("reveal"),
        expectedCalls: ["mount", "dispose"],
      },
      {
        name: "reveal",
        mountPanel: (calls: string[]) => calls.push("mount"),
        revealPanel: (calls: string[]) => {
          calls.push("reveal");
          throw new Error("reveal failed");
        },
        expectedCalls: ["mount", "reveal", "dispose"],
      },
    ];

    failureModes.forEach(({ name, mountPanel, revealPanel, expectedCalls }) => {
      const calls: string[] = [];
      const pendingRevealByPanel = new WeakMap<vscode.WebviewPanel, string>();
      const panel = {
        viewColumn: vscode.ViewColumn.Beside,
        reveal: () => revealPanel(calls),
        dispose: () => calls.push("dispose"),
      } as unknown as vscode.WebviewPanel;
      const factory = {
        getExistingPanel: () => undefined,
        getPanel: () => panel,
      } as unknown as ViewerFactory;

      assert.throws(() =>
        revealCounterpartPanel(
          {
            document,
            targetViewType: AJS_FLOW_VIEWER_TYPE,
            absolutePath: `/root/${name}`,
          },
          createCounterpartRevealDeps({
            factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
            mountPanel: () => mountPanel(calls),
            pendingRevealByPanel,
          }),
        ),
      );

      assert.deepStrictEqual(calls, expectedCalls);
      assert.strictEqual(pendingRevealByPanel.has(panel), false);
    });
  });

  test("flushes a pending reveal when lifecycle telemetry fails", () => {
    const calls: string[] = [];
    const document = { uri: {} } as vscode.TextDocument;
    const panel = {
      webview: {
        postMessage: (message: {
          type: string;
          data: { absolutePath: string };
        }) => calls.push(`post:${message.type}:${message.data.absolutePath}`),
      },
    } as unknown as vscode.WebviewPanel;
    const pendingRevealByPanel = new WeakMap<vscode.WebviewPanel, string>();
    pendingRevealByPanel.set(panel, "/root/job");

    const onReady = createViewerReadyHandler(
      () => {
        calls.push("ready");
      },
      pendingRevealByPanel,
      () => {
        throw new Error("telemetry failed");
      },
    );

    assert.doesNotThrow(() => onReady(document, panel));
    assert.deepStrictEqual(calls, ["ready", "post:revealUnit:/root/job"]);
    assert.strictEqual(pendingRevealByPanel.has(panel), false);
  });

  test("keeps state stable when a target factory is unavailable", () => {
    const calls: string[] = [];
    revealCounterpartPanel(
      {
        document: { uri: {} } as vscode.TextDocument,
        targetViewType: AJS_FLOW_VIEWER_TYPE,
        absolutePath: "/root/job",
      },
      createCounterpartRevealDeps({
        factoryByViewType: new Map(),
        mountPanel: () => calls.push("mount"),
        pendingRevealByPanel: new WeakMap(),
      }),
    );
    assert.deepStrictEqual(calls, []);
  });

  test("keeps state stable when the existing-panel lookup fails", () => {
    const calls: string[] = [];
    const factory = {
      getExistingPanel: () => {
        throw new Error("context unavailable");
      },
      getPanel: () => {
        calls.push("getPanel");
        throw new Error("getPanel should not be called");
      },
    } as unknown as ViewerFactory;

    assert.doesNotThrow(() =>
      revealCounterpartPanel(
        {
          document: { uri: {} } as vscode.TextDocument,
          targetViewType: AJS_FLOW_VIEWER_TYPE,
          absolutePath: "/root/job",
        },
        createCounterpartRevealDeps({
          factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
          mountPanel: () => calls.push("mount"),
          pendingRevealByPanel: new WeakMap(),
        }),
      ),
    );
    assert.deepStrictEqual(calls, ["getPanel"]);
  });

  test("keeps state stable when the counterpart context cannot create a panel", () => {
    const calls: string[] = [];
    const factory = {
      getExistingPanel: () => undefined,
      getPanel: () => {
        throw new Error("context unavailable");
      },
    } as unknown as ViewerFactory;

    assert.doesNotThrow(() =>
      revealCounterpartPanel(
        {
          document: { uri: {} } as vscode.TextDocument,
          targetViewType: AJS_FLOW_VIEWER_TYPE,
          absolutePath: "/root/job",
        },
        createCounterpartRevealDeps({
          factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
          mountPanel: () => calls.push("mount"),
          onOpenStarted: () => calls.push("open"),
          pendingRevealByPanel: new WeakMap(),
        }),
      ),
    );
    assert.deepStrictEqual(calls, []);
  });
});
