import * as assert from "assert";
import * as vscode from "vscode";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import type { SemanticDiffOutputContext } from "../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffResult } from "../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffScheduleImpact } from "../../application/semantic-diff/semanticDiffScheduleImpact";
import { createViewerResourceRequest } from "../../presentation/webview/viewerRequestMessages";
import { createScheduleImpactCalendarReadyRequest } from "../../presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarTransport";
import {
  openScheduleImpactCalendarPanel,
  type ScheduleImpactCalendarPanelHandle,
} from "../../presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarPanel";
import { ScheduleImpactCalendarSessionRegistry } from "../../presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarSessionRegistry";

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

const sidecar = (): SemanticDiffScheduleImpact => ({
  period: { from: "2026-01-01", to: "2026-01-02" },
  roots: [],
  candidateGroups: [],
  issues: [],
  timelineItems: [],
});

type FakePanel = {
  panel: vscode.WebviewPanel;
  messages: unknown[];
  emit(value: unknown): void;
};

const createFakePanel = (): FakePanel => {
  let receive: ((value: unknown) => void) | undefined;
  const disposeListeners = new Set<() => void>();
  const messages: unknown[] = [];
  let disposed = false;
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
      receive = listener;
      return { dispose: () => (receive = undefined) };
    },
  } as unknown as vscode.Webview;
  const panel = {
    title: "Schedule Impact Calendar",
    webview,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      disposeListeners.forEach((listener) => listener());
    },
    onDidDispose: (listener: () => void) => {
      disposeListeners.add(listener);
      return { dispose: () => disposeListeners.delete(listener) };
    },
    reveal: () => undefined,
  } as unknown as vscode.WebviewPanel;
  return { panel, messages, emit: (value) => receive?.(value) };
};

const extensionContext = {
  extensionUri: vscode.Uri.file("/tmp/ajsbutler-test-extension"),
} as vscode.ExtensionContext;

const flush = async (): Promise<void> => {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
};

suite("Schedule impact calendar panel runtime", () => {
  test("dispatches shared resources before Calendar validation", async () => {
    const registry = new ScheduleImpactCalendarSessionRegistry();
    const fake = createFakePanel();
    const handle = openScheduleImpactCalendarPanel(
      {
        extensionContext,
        sessionRegistry: registry,
        createWebviewPanel: () => fake.panel,
      },
      {
        parentSessionId: "sde-session-calendar-resource",
        context: context(),
        sidecar: sidecar(),
      },
    );

    fake.emit(createViewerResourceRequest("window"));
    await flush();
    assert.deepStrictEqual(fake.messages, [
      {
        type: "resource",
        data: {
          isDarkMode: false,
          lang: "en",
          scrollType: "window",
        },
      },
    ]);

    fake.emit(
      createScheduleImpactCalendarReadyRequest(handle.calendarSessionId, 1),
    );
    await flush();
    assert.strictEqual(fake.messages.length, 2);
    assert.strictEqual((fake.messages[1] as { type: string }).type, "session");

    fake.emit({ type: "resource", data: { scrollType: "invalid" } });
    await flush();
    assert.strictEqual(fake.messages.length, 3);
    assert.deepStrictEqual(
      (
        fake.messages[2] as unknown as {
          type: string;
          error: { code: string };
        }
      ).error,
      { code: "invalid-request", detail: null },
    );

    handle.dispose();
    fake.emit(createViewerResourceRequest("window"));
    await flush();
    assert.strictEqual(fake.messages.length, 3);
  });

  test("keeps ready and refresh request IDs unchanged around resources", async () => {
    const registry = new ScheduleImpactCalendarSessionRegistry();
    const fake = createFakePanel();
    const handle: ScheduleImpactCalendarPanelHandle =
      openScheduleImpactCalendarPanel(
        {
          extensionContext,
          sessionRegistry: registry,
          createWebviewPanel: () => fake.panel,
        },
        {
          parentSessionId: "sde-session-calendar-request-ids",
          context: context(),
          sidecar: sidecar(),
        },
      );

    fake.emit(createViewerResourceRequest("table"));
    fake.emit(
      createScheduleImpactCalendarReadyRequest(handle.calendarSessionId, 7),
    );
    await flush();
    const sessionMessage = fake.messages[1] as {
      requestId: number;
      type: string;
    };
    assert.strictEqual(sessionMessage.type, "session");
    assert.strictEqual(sessionMessage.requestId, 7);
    handle.dispose();
  });
});
