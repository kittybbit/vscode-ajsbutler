import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
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
      {
        factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
        mountPanel: () => calls.push("mount"),
        pendingRevealByPanel: new WeakMap(),
      },
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
        {
          factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
          mountPanel: () => undefined,
          pendingRevealByPanel,
        },
      ),
    );

    assert.strictEqual(pendingRevealByPanel.has(panel), false);
  });

  test("reports readiness source and consumes a pending reveal once", () => {
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
      (_document, panel) =>
        calls.push(
          `ready:${panel === navigationPanel ? "navigation" : "command"}`,
        ),
      pendingRevealByPanel,
      (_document, panel, source) =>
        calls.push(
          `source:${panel === navigationPanel ? "navigation" : "command"}:${source}`,
        ),
    );

    onReady(document, commandPanel);
    onReady(document, navigationPanel);
    onReady(document, navigationPanel);

    assert.deepStrictEqual(calls, [
      "ready:command",
      "source:command:command",
      "ready:navigation",
      "source:navigation:navigation",
      "post:revealUnit:/root/job",
      "ready:navigation",
      "source:navigation:command",
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
      {
        factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
        mountPanel: () => {
          opened = true;
          calls.push("mount");
        },
        onOpenStarted: (viewType) => calls.push(`open:${viewType}`),
        pendingRevealByPanel,
      },
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
      {
        factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
        mountPanel: () => calls.push("mount"),
        pendingRevealByPanel,
      },
    );
    assert.deepStrictEqual(calls, [
      `open:${AJS_FLOW_VIEWER_TYPE}`,
      "mount",
      "reveal",
      "reveal",
    ]);
    createViewerReadyHandler(
      () => calls.push("document"),
      pendingRevealByPanel,
    )(document, panel);
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
      {
        factoryByViewType: new Map([[AJS_TABLE_VIEWER_TYPE, factory]]),
        mountPanel: () => calls.push("mount"),
        pendingRevealByPanel,
      },
    );

    assert.deepStrictEqual(calls, ["mount", "reveal"]);
    createViewerReadyHandler(
      () => calls.push("document"),
      pendingRevealByPanel,
    )(document, panel);
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
          {
            factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
            mountPanel: () => mountPanel(calls),
            pendingRevealByPanel,
          },
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
      () => calls.push("ready"),
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
      {
        factoryByViewType: new Map(),
        mountPanel: () => calls.push("mount"),
        pendingRevealByPanel: new WeakMap(),
      },
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
        {
          factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
          mountPanel: () => calls.push("mount"),
          pendingRevealByPanel: new WeakMap(),
        },
      ),
    );
    assert.deepStrictEqual(calls, []);
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
        {
          factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
          mountPanel: () => calls.push("mount"),
          onOpenStarted: () => calls.push("open"),
          pendingRevealByPanel: new WeakMap(),
        },
      ),
    );
    assert.deepStrictEqual(calls, []);
  });
});
