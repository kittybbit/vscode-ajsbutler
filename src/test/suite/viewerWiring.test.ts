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
      trackEvent() {},
      dispose() {},
    };

    const subscriptions = createViewerSubscriptions({
      context,
      telemetry,
      buildUnitList: () => ({ errors: [] }),
    });

    assert.strictEqual(subscriptions.length, 4);
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
        pendingRevealByPanel,
      },
    );

    assert.deepStrictEqual(calls, ["mount", "reveal"]);
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
    assert.deepStrictEqual(calls, ["mount", "reveal", "reveal"]);
    createViewerReadyHandler(
      () => calls.push("document"),
      pendingRevealByPanel,
    )(document, panel);
    assert.deepStrictEqual(calls, [
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
});
