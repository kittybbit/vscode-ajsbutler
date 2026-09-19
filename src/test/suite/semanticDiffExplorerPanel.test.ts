import * as assert from "assert";
import * as vscode from "vscode";
import {
  createSemanticDiffCaptureScopeIdAllocator,
  createSemanticDiffSourceHandleIdAllocator,
  createSemanticDiffSourceIndexIdAllocator,
} from "../../application/parsing/AjsParserWithSourceIndexPort";
import {
  createSemanticDiffExplorerActionIdAllocator,
  createSemanticDiffExplorerSessionIdAllocator,
} from "../../application/semantic-diff/semanticDiffExplorer";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import {
  beginSemanticDiffSourceCapture,
  isSemanticDiffSourceCaptureBindingActive,
} from "../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffResult } from "../../application/semantic-diff/semanticDiffDto";
import {
  createSemanticDiffExplorerActionRequest,
  createSemanticDiffExplorerReadyRequest,
} from "../../application/semantic-diff/semanticDiffExplorerMessages";
import { createViewerResourceRequest } from "../../presentation/webview/viewerRequestMessages";
import { createOpenSemanticDiffExplorer } from "../../presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanel";
import { ScheduleImpactSidecarRegistry } from "../../bootstrap/extension/scheduleImpactSidecarRegistry";
import type { SemanticDiffScheduleImpact } from "../../application/semantic-diff/semanticDiffScheduleImpact";
import type { ScheduleImpactCalendarPanelHandle } from "../../presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarPanel";
import {
  SemanticDiffExplorerActionRegistry,
  SemanticDiffExplorerContextRegistry,
} from "../../presentation/vscode/semantic-diff/panel/semanticDiffExplorerRegistry";

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

const createPanelAllocatorDeps = () => ({
  sessionIdAllocator: createSemanticDiffExplorerSessionIdAllocator(),
  actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(),
});

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
    ...createPanelAllocatorDeps(),
  });
  return { opener, panels, contextRegistry, actionRegistry };
};

suite("Semantic Diff Explorer panel", () => {
  test("dispatches the shared resource request before semantic validation", async () => {
    const harness = createHarness();
    const handle = await harness.opener(emptyContext());
    const fake = harness.panels[0]!;

    fake.emit(createViewerResourceRequest("window"));
    await flush();

    assert.strictEqual(fake.messages.length, 1);
    assert.strictEqual((fake.messages[0] as { type: string }).type, "resource");
    assert.strictEqual(
      (fake.messages[0] as { data: { scrollType: string } }).data.scrollType,
      "window",
    );

    fake.emit(createSemanticDiffExplorerReadyRequest(handle.sessionId, 1));
    await flush();
    assert.strictEqual(fake.messages.length, 2);
    assert.strictEqual((fake.messages[1] as { type: string }).type, "session");

    fake.emit({ type: "resource", data: { scrollType: "invalid" } });
    await flush();
    assert.strictEqual(fake.messages.length, 3);
    assert.deepStrictEqual(fake.messages[2], {
      type: "failure",
      sessionId: null,
      requestId: null,
      actionId: null,
      ok: false,
      payload: null,
      error: { code: "invalid-request", detail: null },
    });

    handle.dispose();
    fake.emit(createViewerResourceRequest("window"));
    await flush();
    assert.strictEqual(fake.messages.length, 3);
  });
});

const createSourceEntry = (context: ReturnType<typeof emptyContext>) => {
  const indexIds = createSemanticDiffSourceIndexIdAllocator();
  const handleIds = createSemanticDiffSourceHandleIdAllocator();
  const capture = beginSemanticDiffSourceCapture(
    {
      before: {
        side: "before",
        sourceHandleId: handleIds(),
        text: "before",
        version: null,
      },
      after: {
        side: "after",
        sourceHandleId: handleIds(),
        text: "after",
        version: null,
      },
    },
    {
      parseWithSourceIndex: (text) => ({
        ok: true,
        document: { rootUnits: [], warnings: [] },
        sourceIndex: {
          sourceIndexId: indexIds(),
          unitEntries: [
            {
              unitId: text,
              headerRange: {
                start: { line: 0, character: 0 },
                end: { line: 0, character: 1 },
              },
              nameRange: null,
              parameterOccurrences: [],
            },
          ],
        },
      }),
    },
    createSemanticDiffCaptureScopeIdAllocator(),
  );
  capture.parser.parse("before");
  capture.parser.parse("after");
  const binding = capture.bind(context);
  if (!binding.ok) throw new Error("Expected source binding.");
  return {
    capture,
    binding,
    sources: {
      before: {
        side: "before" as const,
        sourceHandleId: binding.before.sourceHandleId,
        text: "before",
        version: null,
        uri: vscode.Uri.parse("untitled:before.ajs"),
      },
      after: {
        side: "after" as const,
        sourceHandleId: binding.after.sourceHandleId,
        text: "after",
        version: null,
        uri: vscode.Uri.parse("untitled:after.ajs"),
      },
    },
  };
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

  test("retains exact context identity through the host session and message", async () => {
    const harness = createHarness();
    const context = emptyContext();
    const handle = await harness.opener(context);
    const entry = harness.contextRegistry.get(context);

    assert.ok(entry);
    assert.strictEqual(entry?.context, context);
    assert.strictEqual(entry?.session.context, context);
    assert.strictEqual(entry?.session.context.result, context.result);
    assert.strictEqual(entry?.session.context.summary, context.summary);
    assert.strictEqual(entry?.session.sessionId, handle.sessionId);

    const fake = harness.panels[0]!;
    fake.emit(createSemanticDiffExplorerReadyRequest(handle.sessionId, 1));
    await flush();

    const message = fake.messages[0] as {
      type: string;
      sessionId: string;
      payload: unknown;
    };
    assert.strictEqual(message.type, "session");
    assert.strictEqual(message.sessionId, entry?.session.sessionId);
    assert.deepStrictEqual(message.payload, entry?.session.viewModel);
  });

  test("keeps the Explorer webview CSP nonce-bound and asset-free", async () => {
    const harness = createHarness();
    await harness.opener(emptyContext());
    const html = harness.panels[0]!.panel.webview.html;

    assert.match(html, /default-src 'none'/);
    assert.match(html, /script-src https:\/\/fake\.invalid 'nonce-[^']+'/);
    assert.match(html, /style-src https:\/\/fake\.invalid 'unsafe-inline'/);
    assert.doesNotMatch(html, /connect-src|font-src|eval\(|<link\b/i);
    assert.doesNotMatch(
      html,
      /background:transparent|color:var\(--vscode-foreground/,
    );
    assert.match(html, /font-family:var\(--vscode-font-family, sans-serif\)/);
    assert.match(html, /semanticDiffExplorer\.js/);
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
      ...createPanelAllocatorDeps(),
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

  test("rolls back a registered source capture when panel creation fails", async () => {
    const context = emptyContext();
    const contextRegistry = new SemanticDiffExplorerContextRegistry();
    const actionRegistry = new SemanticDiffExplorerActionRegistry();
    const source = createSourceEntry(context);
    let releases = 0;
    contextRegistry.registerSourceCapture(context, {
      binding: source.binding,
      sources: source.sources,
      release: () => {
        releases += 1;
        source.capture.release();
      },
    });
    const opener = createOpenSemanticDiffExplorer({
      extensionContext: {
        extensionUri: vscode.Uri.file("/tmp/ajsbutler-test-extension"),
      } as vscode.ExtensionContext,
      createWebviewPanel: () => {
        throw new Error("panel failed");
      },
      showQuickPick: async () => undefined,
      openReport: async () => undefined,
      contextRegistry,
      actionRegistry,
      ...createPanelAllocatorDeps(),
    });

    await assert.rejects(() => opener(context), /panel failed/);
    assert.strictEqual(contextRegistry.sourceCapture(context), undefined);
    assert.strictEqual(releases, 1);
    assert.strictEqual(
      isSemanticDiffSourceCaptureBindingActive(source.binding),
      false,
    );
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

  test("allocates output actions uniquely across Explorer sessions", async () => {
    const harness = createHarness();
    const firstContext = emptyContext();
    const secondContext = emptyContext();
    const first = await harness.opener(firstContext);
    const firstOutputActionId =
      harness.contextRegistry.get(firstContext)!.outputActionId;
    const second = await harness.opener(secondContext);
    const secondOutputActionId =
      harness.contextRegistry.get(secondContext)!.outputActionId;

    assert.notStrictEqual(first.sessionId, second.sessionId);
    assert.notStrictEqual(firstOutputActionId, secondOutputActionId);
    assert.strictEqual(harness.actionRegistry.size, 2);

    first.dispose();
    second.dispose();
  });

  test("registers and privately dispatches the available calendar action", async () => {
    const panels: FakePanel[] = [];
    const contextRegistry = new SemanticDiffExplorerContextRegistry();
    const actionRegistry = new SemanticDiffExplorerActionRegistry();
    const sidecarRegistry = new ScheduleImpactSidecarRegistry();
    const context = emptyContext();
    const sidecar = {} as SemanticDiffScheduleImpact;
    let resolvedContext: ReturnType<typeof emptyContext> | undefined;
    const opened: Array<{
      parentSessionId: string;
      context: ReturnType<typeof emptyContext>;
      sidecar: SemanticDiffScheduleImpact;
      displayLanguage?: string;
    }> = [];
    let reportActionCalls = 0;
    const opener = createOpenSemanticDiffExplorer({
      extensionContext: {
        extensionUri: vscode.Uri.file("/tmp/ajsbutler-test-extension"),
      } as vscode.ExtensionContext,
      createWebviewPanel: (_viewType, title) => {
        const fake = createFakePanel(title);
        panels.push(fake);
        return fake.panel;
      },
      showQuickPick: async () => {
        reportActionCalls += 1;
        return undefined;
      },
      openReport: async () => undefined,
      contextRegistry,
      actionRegistry,
      language: "ja-JP",
      scheduleImpactSidecarRegistry: {
        resolve: (candidate) => {
          resolvedContext = candidate as ReturnType<typeof emptyContext>;
          return sidecarRegistry.resolve(candidate);
        },
      },
      openScheduleImpactCalendarPanel: (input) => {
        opened.push(input as (typeof opened)[number]);
        return {
          calendarSessionId: "sdc-calendar-test-1",
          session: {} as never,
          panel: panels[0]!.panel,
          reveal: () => undefined,
          dispose: () => undefined,
        } as ScheduleImpactCalendarPanelHandle;
      },
      ...createPanelAllocatorDeps(),
    });
    sidecarRegistry.register(context, sidecar);

    const handle = await opener(context);
    const fake = panels[0]!;
    const calendarActionId = (fake.panel.webview.html.match(
      /data-semantic-diff-calendar-action-id="([^"]+)"/,
    ) ?? [])[1] as never;

    assert.match(calendarActionId, /^sde-action-/);
    assert.strictEqual(resolvedContext, context);
    assert.strictEqual(
      actionRegistry.has(calendarActionId, handle.sessionId),
      true,
    );
    assert.strictEqual(
      actionRegistry.metadata(calendarActionId, handle.sessionId)?.kind,
      "calendar",
    );

    fake.emit(
      createSemanticDiffExplorerActionRequest(
        handle.sessionId,
        1,
        calendarActionId,
      ),
    );
    await flush();

    assert.strictEqual(reportActionCalls, 0);
    assert.strictEqual(opened.length, 1);
    assert.strictEqual(opened[0]?.parentSessionId, handle.sessionId);
    assert.strictEqual(opened[0]?.context, context);
    assert.strictEqual(opened[0]?.sidecar, sidecar);
    assert.strictEqual(opened[0]?.displayLanguage, "ja-JP");
    assert.deepStrictEqual(fake.messages[0], {
      type: "action-result",
      sessionId: handle.sessionId,
      requestId: 1,
      actionId: calendarActionId,
      ok: true,
      payload: {
        kind: "output",
        status: "completed",
        side: null,
        targetId: null,
      },
      error: null,
    });

    handle.dispose();
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
      ...createPanelAllocatorDeps(),
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
