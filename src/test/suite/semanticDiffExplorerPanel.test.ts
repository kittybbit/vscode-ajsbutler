import * as assert from "assert";
import * as vscode from "vscode";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import type { SemanticDiffResult } from "../../application/semantic-diff/semanticDiffDto";
import {
  createSemanticDiffExplorerActionRequest,
  createSemanticDiffExplorerReadyRequest,
} from "../../application/semantic-diff/semanticDiffExplorerMessages";
import { createOpenSemanticDiffExplorer } from "../../presentation/vscode/semantic-diff/semanticDiffExplorerPanel";
import {
  SemanticDiffExplorerActionRegistry,
  SemanticDiffExplorerContextRegistry,
} from "../../presentation/vscode/semantic-diff/semanticDiffExplorerRegistry";

const emptyContext = () =>
  buildSemanticDiffOutputContext({
    inputs: {
      before: { side: "before", unitIds: [], relations: [] },
      after: { side: "after", unitIds: [], relations: [] },
    },
    changes: [],
    identityDecisions: [],
    confirmationRequired: [],
    unsupportedItems: [],
    limitations: [],
  } satisfies SemanticDiffResult);

type FakePanel = {
  panel: vscode.WebviewPanel;
  messages: unknown[];
  emit(value: unknown): void;
  disposeCount: number;
};

const createFakePanel = (title: string): FakePanel => {
  let received: ((value: unknown) => void) | undefined;
  const disposeListeners = new Set<() => void>();
  let disposed = false;
  const messages: unknown[] = [];
  const webview = {
    cspSource: "https://fake.invalid",
    options: {},
    html: "",
    asWebviewUri: (uri: vscode.Uri) => uri,
    postMessage: async (value: unknown) => {
      messages.push(value);
      return true;
    },
    onDidReceiveMessage: (listener: (value: unknown) => void) => {
      received = listener;
      return { dispose: () => (received = undefined) };
    },
  } as unknown as vscode.Webview;
  let disposeCount = 0;
  const panel = {
    title,
    webview,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      disposeCount += 1;
      disposeListeners.forEach((listener) => listener());
    },
    onDidDispose: (listener: () => void) => {
      disposeListeners.add(listener);
      return {
        dispose: () => disposeListeners.delete(listener),
      };
    },
  } as unknown as vscode.WebviewPanel;
  return {
    panel,
    messages,
    emit: (value) => received?.(value),
    get disposeCount() {
      return disposeCount;
    },
  };
};

const flush = async (): Promise<void> => {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
};

const createHarness = () => {
  const panels: FakePanel[] = [];
  const contextRegistry = new SemanticDiffExplorerContextRegistry();
  const actionRegistry = new SemanticDiffExplorerActionRegistry();
  const opener = createOpenSemanticDiffExplorer({
    extensionContext: {
      extensionUri: vscode.Uri.file("/tmp/ajsbutler-test-extension"),
    } as vscode.ExtensionContext,
    createWebviewPanel: (_viewType, title) => {
      const fake = createFakePanel(title);
      panels.push(fake);
      return fake.panel;
    },
    showQuickPick: async () => undefined,
    openReport: async () => undefined,
    contextRegistry,
    actionRegistry,
    language: "en",
  });
  return { opener, panels, contextRegistry, actionRegistry };
};

suite("Semantic diff Explorer panel", () => {
  test("waits for ready before sending the session payload", async () => {
    const harness = createHarness();
    const handle = await harness.opener(emptyContext());
    const fake = harness.panels[0]!;

    assert.deepStrictEqual(fake.messages, []);
    fake.emit(createSemanticDiffExplorerReadyRequest(handle.sessionId, 1));
    await flush();

    assert.strictEqual(fake.messages.length, 1);
    assert.strictEqual((fake.messages[0] as { type: string }).type, "session");
    assert.strictEqual(
      (fake.messages[0] as { sessionId: string }).sessionId,
      handle.sessionId,
    );
  });

  test("reports an oversized initial session with nullable correlation", async () => {
    const harness = createHarness();
    const oversized = "x".repeat(4_300_000);
    const context = buildSemanticDiffOutputContext({
      inputs: {
        before: { side: "before", unitIds: [], relations: [] },
        after: { side: "after", unitIds: [], relations: [] },
      },
      changes: [
        {
          id: "huge-change",
          kind: "changed",
          elementKind: "attribute",
          confirmationLevel: "confirmed",
          identityDecisionId: "identity:huge-change",
          before: {
            kind: "attribute",
            unit: {
              id: "before-unit",
              name: "before",
              absolutePath: "/before",
              unitType: "u",
            },
            parameterKey: "definition",
            category: "execution-definition",
            values: [oversized],
          },
          after: {
            kind: "attribute",
            unit: {
              id: "after-unit",
              name: "after",
              absolutePath: "/after",
              unitType: "u",
            },
            parameterKey: "definition",
            category: "execution-definition",
            values: [oversized],
          },
          attributeCategory: "execution-definition",
          relationPair: null,
        },
      ],
      identityDecisions: [],
      confirmationRequired: [],
      unsupportedItems: [],
      limitations: [],
    } satisfies SemanticDiffResult);
    const handle = await harness.opener(context);
    const fake = harness.panels[0]!;

    fake.emit(createSemanticDiffExplorerReadyRequest(handle.sessionId, 1));
    await flush();

    assert.strictEqual(fake.messages.length, 1);
    assert.deepStrictEqual(fake.messages[0], {
      type: "failure",
      sessionId: null,
      requestId: null,
      actionId: null,
      ok: false,
      payload: null,
      error: { code: "payload-too-large", detail: null },
    });
  });

  test("disposes panel resources exactly once and removes ownership", async () => {
    const harness = createHarness();
    let releases = 0;
    const opener = createOpenSemanticDiffExplorer({
      extensionContext: {
        extensionUri: vscode.Uri.file("/tmp/ajsbutler-test-extension"),
      } as vscode.ExtensionContext,
      createWebviewPanel: (_viewType, title) => {
        const fake = createFakePanel(title);
        harness.panels.push(fake);
        return fake.panel;
      },
      showQuickPick: async () => undefined,
      openReport: async () => undefined,
      contextRegistry: harness.contextRegistry,
      actionRegistry: harness.actionRegistry,
      sourceLifetimeRelease: () => {
        releases += 1;
      },
    });
    const context = emptyContext();
    const handle = await opener(context);
    const fake = harness.panels[0]!;

    handle.dispose();
    handle.dispose();
    fake.panel.dispose();

    assert.strictEqual(fake.disposeCount, 1);
    assert.strictEqual(releases, 1);
    assert.strictEqual(harness.contextRegistry.size, 0);
    assert.strictEqual(harness.actionRegistry.size, 0);
  });

  test("supersedes an older same-context panel without clearing the newer one", async () => {
    const harness = createHarness();
    const context = emptyContext();
    const first = await harness.opener(context);
    const second = await harness.opener(context);

    assert.notStrictEqual(first.sessionId, second.sessionId);
    assert.strictEqual(harness.panels[0]!.disposeCount, 1);
    assert.strictEqual(
      harness.contextRegistry.get(context)?.session.sessionId,
      second.sessionId,
    );
    second.dispose();
    assert.strictEqual(harness.contextRegistry.size, 0);
  });

  test("rejects unknown actions with nullable strict correlation", async () => {
    const harness = createHarness();
    const handle = await harness.opener(emptyContext());
    const fake = harness.panels[0]!;
    fake.emit(createSemanticDiffExplorerReadyRequest(handle.sessionId, 1));
    await flush();
    fake.emit(
      createSemanticDiffExplorerActionRequest(
        handle.sessionId,
        2,
        "sde-action-999999" as never,
      ),
    );
    await flush();

    const failure = fake.messages[1] as {
      type: string;
      sessionId: unknown;
      requestId: unknown;
      actionId: unknown;
      error: { code: string };
    };
    assert.strictEqual(failure.type, "failure");
    assert.strictEqual(failure.sessionId, null);
    assert.strictEqual(failure.requestId, null);
    assert.strictEqual(failure.actionId, null);
    assert.strictEqual(failure.error.code, "unknown-action");
  });

  test("does not post or open output after disposal during picker", async () => {
    const context = emptyContext();
    const panels: FakePanel[] = [];
    let resolvePicker: ((value: unknown) => void) | undefined;
    let opened = false;
    const contextRegistry = new SemanticDiffExplorerContextRegistry();
    const actionRegistry = new SemanticDiffExplorerActionRegistry();
    const opener = createOpenSemanticDiffExplorer({
      extensionContext: {
        extensionUri: vscode.Uri.file("/tmp/ajsbutler-test-extension"),
      } as vscode.ExtensionContext,
      createWebviewPanel: (_viewType, title) => {
        const fake = createFakePanel(title);
        panels.push(fake);
        return fake.panel;
      },
      showQuickPick: () =>
        new Promise((resolve) => {
          resolvePicker = resolve;
        }),
      openReport: async () => {
        opened = true;
      },
      contextRegistry,
      actionRegistry,
    });
    const handle = await opener(context);
    const fake = panels[0]!;
    const outputActionId = contextRegistry.get(context)!.outputActionId;
    fake.emit(createSemanticDiffExplorerReadyRequest(handle.sessionId, 1));
    await flush();
    fake.emit(
      createSemanticDiffExplorerActionRequest(
        handle.sessionId,
        2,
        outputActionId,
      ),
    );
    await flush();
    handle.dispose();
    resolvePicker?.({ mode: "full", label: "Full Markdown" });
    await flush();

    assert.strictEqual(opened, false);
    assert.strictEqual(fake.messages.length, 1);
  });
});
