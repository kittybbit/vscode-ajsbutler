import * as assert from "assert";
import * as vscode from "vscode";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import { createSemanticDiffExplorerSession } from "../../application/semantic-diff/semanticDiffExplorer";
import {
  createSemanticDiffExplorerActionIdAllocator,
  createSemanticDiffExplorerSessionIdAllocator,
} from "../../application/semantic-diff/semanticDiffExplorerDto";
import type { SemanticDiffOutputContext } from "../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffResult } from "../../application/semantic-diff/semanticDiffDto";
import { createScheduleAwareExplorerSession } from "../../bootstrap/extension/createScheduleAwareExplorerSession";
import { ScheduleImpactSidecarRegistry } from "../../bootstrap/extension/scheduleImpactSidecarRegistry";
import {
  createScheduleImpactCalendarPanel,
  openScheduleImpactCalendarPanel,
  type ScheduleImpactCalendarPanelHandle,
} from "../../presentation/vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarPanel";
import { ScheduleImpactCalendarSessionRegistry } from "../../presentation/vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarSessionRegistry";
import type { SemanticDiffExplorerSessionHandle } from "../../presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelTypes";
import type { SemanticDiffScheduleImpact } from "../../application/semantic-diff/semanticDiffScheduleImpact";

const context = (): SemanticDiffOutputContext =>
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
  emitLate(value: unknown): void;
  receiveListenerDisposed(): boolean;
  disposeCount: number;
};

type FakePanelOptions = Readonly<{
  throwOnHtml?: boolean;
  throwOnPanelListener?: boolean;
}>;

const fakePanel = (
  title: string,
  options: FakePanelOptions = {},
): FakePanel => {
  let receive: ((value: unknown) => void) | undefined;
  let registeredReceive: ((value: unknown) => void) | undefined;
  let receiveDisposed = false;
  const disposeListeners = new Set<() => void>();
  const messages: unknown[] = [];
  let disposed = false;
  let disposeCount = 0;
  let html = "";
  const webview = {
    cspSource: "https://fake.invalid",
    options: {},
    get html() {
      return html;
    },
    set html(value: string) {
      if (options.throwOnHtml) throw new Error("calendar HTML failed");
      html = value;
    },
    onDidReceiveMessage: (listener: (value: unknown) => void) => {
      receive = listener;
      registeredReceive = listener;
      receiveDisposed = false;
      return {
        dispose: () => {
          receive = undefined;
          receiveDisposed = true;
        },
      };
    },
    postMessage: async (value: unknown) => {
      messages.push(value);
      return true;
    },
  } as unknown as vscode.Webview;
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
      if (options.throwOnPanelListener) {
        throw new Error("calendar panel listener failed");
      }
      disposeListeners.add(listener);
      return { dispose: () => disposeListeners.delete(listener) };
    },
    reveal: () => undefined,
  } as unknown as vscode.WebviewPanel;
  return {
    panel,
    messages,
    emit: (value) => receive?.(value),
    emitLate: (value) => registeredReceive?.(value),
    receiveListenerDisposed: () => receiveDisposed,
    get disposeCount() {
      return disposeCount;
    },
  };
};

const extensionContext = {
  extensionUri: vscode.Uri.file("/tmp/ajsbutler-test-extension"),
} as vscode.ExtensionContext;

const sidecar = {} as SemanticDiffScheduleImpact;

suite("Semantic Diff Explorer schedule boundary", () => {
  test("keeps calendar transport/action IDs out of the Explorer session", () => {
    const session = createSemanticDiffExplorerSession(context(), {
      displayLanguage: "ja-JP",
      sessionIdAllocator: createSemanticDiffExplorerSessionIdAllocator(),
      actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(),
    });
    assert.match(session.sessionId, /^sde-session-/);
    session.actionIds.toArray().forEach((id) => {
      assert.match(id, /^sde-action-/);
      assert.doesNotMatch(id, /calendar/);
    });
  });

  test("cascades parent disposal to the calendar panel and receive listener", async () => {
    const calendarRegistry = new ScheduleImpactCalendarSessionRegistry();
    const child = fakePanel("Schedule Impact Calendar");
    const parent = fakePanel("Semantic Diff Explorer");
    const parentSession = {
      sessionId: "sde-session-parent" as never,
      panel: parent.panel,
      dispose: () => parent.panel.dispose(),
    } as SemanticDiffExplorerSessionHandle;
    const childHandle: ScheduleImpactCalendarPanelHandle =
      openScheduleImpactCalendarPanel(
        {
          extensionContext,
          language: "en",
          sessionRegistry: calendarRegistry,
          createWebviewPanel: () => child.panel,
        },
        {
          parentSessionId: parentSession.sessionId,
          context: context(),
          sidecar,
        },
      );
    const open = createScheduleAwareExplorerSession({
      sidecarRegistry: new ScheduleImpactSidecarRegistry(),
      releaseCalendarParent: (parentSessionId) =>
        calendarRegistry.releaseParent(parentSessionId),
      openExplorer: async () => parentSession,
    });
    const explorer = await open({
      context: childHandle.session.context,
      scheduleImpact: { kind: "available", sidecar },
    });

    explorer.dispose();

    assert.strictEqual(child.disposeCount, 1);
    assert.strictEqual(child.receiveListenerDisposed(), true);
    assert.strictEqual(
      calendarRegistry.resolve(childHandle.calendarSessionId),
      undefined,
    );
  });

  test("removes disposed panels from the cache before reopening", () => {
    const calendarRegistry = new ScheduleImpactCalendarSessionRegistry();
    const panels: FakePanel[] = [];
    const open = createScheduleImpactCalendarPanel({
      extensionContext,
      sessionRegistry: calendarRegistry,
      createWebviewPanel: () => {
        const panel = fakePanel("Schedule Impact Calendar");
        panels.push(panel);
        return panel.panel;
      },
    });
    const input = {
      parentSessionId: "sde-session-reopen",
      context: context(),
      sidecar,
      displayLanguage: "en",
    };

    const first = open(input);
    first.panel.dispose();
    assert.strictEqual(calendarRegistry.size, 0);

    const second = open(input);
    assert.notStrictEqual(second.calendarSessionId, first.calendarSessionId);
    assert.strictEqual(panels.length, 2);

    assert.strictEqual(
      calendarRegistry.releaseParent(input.parentSessionId),
      1,
    );
    assert.strictEqual(calendarRegistry.size, 0);
    assert.strictEqual(panels[1]?.disposeCount, 1);

    const third = open(input);
    assert.notStrictEqual(third.calendarSessionId, second.calendarSessionId);
    assert.strictEqual(panels.length, 3);
    third.dispose();
    assert.strictEqual(calendarRegistry.size, 0);
  });

  test("uses the immutable normalized session language for title and HTML", () => {
    const cases = [
      {
        input: "ja-JP",
        expectedTitle: "スケジュール影響カレンダー",
        expectedLang: "ja",
      },
      {
        input: "en-GB",
        expectedTitle: "Schedule Impact Calendar",
        expectedLang: "en",
      },
      {
        input: "fr-FR",
        expectedTitle: "Schedule Impact Calendar",
        expectedLang: "en",
      },
    ];
    cases.forEach(({ input, expectedTitle, expectedLang }) => {
      const registry = new ScheduleImpactCalendarSessionRegistry();
      const fake = fakePanel(expectedTitle);
      const handle = openScheduleImpactCalendarPanel(
        {
          extensionContext,
          language: "en",
          sessionRegistry: registry,
          createWebviewPanel: () => fake.panel,
        },
        {
          parentSessionId: `sde-session-${input}`,
          context: context(),
          sidecar,
          displayLanguage: input,
        },
      );
      assert.strictEqual(fake.panel.title, expectedTitle);
      assert.match(
        fake.panel.webview.html,
        new RegExp(`<html lang="${expectedLang}">`),
      );
      assert.strictEqual(handle.session.displayLanguage, expectedLang);
      handle.dispose();
    });
  });

  test("ignores a message delivered after the child session is disposed", () => {
    const registry = new ScheduleImpactCalendarSessionRegistry();
    const fake = fakePanel("Schedule Impact Calendar");
    const handle = openScheduleImpactCalendarPanel(
      {
        extensionContext,
        sessionRegistry: registry,
        createWebviewPanel: () => fake.panel,
      },
      { parentSessionId: "sde-session-late", context: context(), sidecar },
    );
    fake.emit({
      type: "ready",
      sessionId: handle.calendarSessionId,
      requestId: 1,
    });
    fake.emit({
      type: "ready",
      sessionId: handle.calendarSessionId,
      requestId: 1,
    });
    assert.strictEqual(fake.messages.length, 2);
    assert.strictEqual(
      (fake.messages[1] as { error: { code: string } }).error.code,
      "stale-request",
    );
    handle.dispose();
    fake.emit({
      type: "ready",
      sessionId: handle.calendarSessionId,
      requestId: 2,
    });

    assert.strictEqual(fake.messages.length, 2);
    assert.strictEqual(fake.receiveListenerDisposed(), true);
    const messagesBeforeLateCallback = [...fake.messages];
    fake.emitLate({
      type: "ready",
      sessionId: handle.calendarSessionId,
      requestId: 2,
    });
    assert.deepStrictEqual(fake.messages, messagesBeforeLateCallback);
  });

  test("rejects malformed calendar messages and preserves serialization fallback", () => {
    const registry = new ScheduleImpactCalendarSessionRegistry();
    const fake = fakePanel("Schedule Impact Calendar");
    const cyclicSidecar = {} as Record<string, unknown>;
    cyclicSidecar.self = cyclicSidecar;
    const handle = openScheduleImpactCalendarPanel(
      {
        extensionContext,
        sessionRegistry: registry,
        createWebviewPanel: () => fake.panel,
      },
      {
        parentSessionId: "sde-session-invalid-message",
        context: context(),
        sidecar: cyclicSidecar as never,
      },
    );
    fake.emit({ type: "unknown" });
    assert.strictEqual(fake.messages.length, 1);
    assert.strictEqual(
      (fake.messages[0] as { error: { code: string } }).error.code,
      "invalid-request",
    );
    fake.emit({
      type: "ready",
      sessionId: handle.calendarSessionId,
      requestId: 1,
    });
    assert.strictEqual(fake.messages.length, 2);
    assert.strictEqual(
      (fake.messages[1] as { error: { code: string } }).error.code,
      "invalid-request",
    );
    handle.dispose();
  });

  test("rolls back the session and panel when preparation fails", () => {
    const registry = new ScheduleImpactCalendarSessionRegistry();
    const fake = fakePanel("Schedule Impact Calendar", { throwOnHtml: true });
    assert.throws(
      () =>
        openScheduleImpactCalendarPanel(
          {
            extensionContext,
            sessionRegistry: registry,
            createWebviewPanel: () => fake.panel,
          },
          {
            parentSessionId: "sde-session-preparation-failure",
            context: context(),
            sidecar,
          },
        ),
      /calendar HTML failed/,
    );
    assert.strictEqual(registry.size, 0);
    assert.strictEqual(fake.disposeCount, 1);
  });

  test("rolls back the Registry when panel creation itself fails", () => {
    const registry = new ScheduleImpactCalendarSessionRegistry();
    assert.throws(
      () =>
        openScheduleImpactCalendarPanel(
          {
            extensionContext,
            sessionRegistry: registry,
            createWebviewPanel: () => {
              throw new Error("calendar panel creation failed");
            },
          },
          {
            parentSessionId: "sde-session-panel-creation-failure",
            context: context(),
            sidecar,
          },
        ),
      /calendar panel creation failed/,
    );
    assert.strictEqual(registry.size, 0);
  });

  test("rolls back when panel disposal listener registration fails", () => {
    const registry = new ScheduleImpactCalendarSessionRegistry();
    const fake = fakePanel("Schedule Impact Calendar", {
      throwOnPanelListener: true,
    });
    assert.throws(
      () =>
        openScheduleImpactCalendarPanel(
          {
            extensionContext,
            sessionRegistry: registry,
            createWebviewPanel: () => fake.panel,
          },
          {
            parentSessionId: "sde-session-listener-failure",
            context: context(),
            sidecar,
          },
        ),
      /calendar panel listener failed/,
    );
    assert.strictEqual(registry.size, 0);
    assert.strictEqual(fake.disposeCount, 1);
    assert.strictEqual(fake.receiveListenerDisposed(), true);
  });
});
