import * as vscode from "vscode";
import type { SemanticDiffOutputContext } from "../../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffScheduleImpact } from "../../../application/semantic-diff/semanticDiffScheduleImpact";
import {
  ScheduleImpactCalendarSessionRegistry,
  type ScheduleImpactCalendarDisplayLanguage,
  type ScheduleImpactCalendarSessionHandle,
} from "./scheduleImpactCalendarSessionRegistry";
import {
  createScheduleImpactCalendarError,
  createScheduleImpactCalendarFailureMessage,
  createScheduleImpactCalendarSessionMessage,
  serializeScheduleImpactCalendarMessage,
  validateScheduleImpactCalendarMessage,
} from "./scheduleImpactCalendarTransport";

export type ScheduleImpactCalendarPanelDeps = Readonly<{
  extensionContext: vscode.ExtensionContext;
  createWebviewPanel?: typeof vscode.window.createWebviewPanel;
  language?: string;
  sessionRegistry?: ScheduleImpactCalendarSessionRegistry;
}>;

export type OpenScheduleImpactCalendarPanelInput = Readonly<{
  parentSessionId: string;
  context: SemanticDiffOutputContext;
  sidecar: SemanticDiffScheduleImpact;
  displayLanguage?: string;
}>;

export type ScheduleImpactCalendarPanelHandle = Readonly<{
  calendarSessionId: string;
  session: ScheduleImpactCalendarSessionHandle;
  panel: vscode.WebviewPanel;
  reveal(): void;
  dispose(): void;
}>;

const title = (language: ScheduleImpactCalendarDisplayLanguage): string =>
  language === "ja" ? "スケジュール影響カレンダー" : "Schedule Impact Calendar";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const buildCalendarShell = (
  panel: vscode.WebviewPanel,
  sessionId: string,
  language: ScheduleImpactCalendarDisplayLanguage,
): string => `<!DOCTYPE html>
<html lang="${escapeHtml(language ?? "en")}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${panel.webview.cspSource} 'unsafe-inline';">
</head>
<body data-schedule-impact-calendar-session-id="${escapeHtml(sessionId)}">
<div id="root"></div>
</body>
</html>`;

const createPanel = (
  deps: ScheduleImpactCalendarPanelDeps,
  language: ScheduleImpactCalendarDisplayLanguage,
): vscode.WebviewPanel =>
  (deps.createWebviewPanel ?? vscode.window.createWebviewPanel)(
    "ajsbutler.scheduleImpactCalendar",
    title(language),
    vscode.ViewColumn.Active,
    { enableScripts: true, retainContextWhenHidden: true },
  );

const panelCaches = new WeakMap<
  ScheduleImpactCalendarSessionRegistry,
  Map<string, ScheduleImpactCalendarPanelHandle>
>();

/** Internal panel foundation. Slice 2 intentionally mounts no visible UI. */
export const openScheduleImpactCalendarPanel = (
  deps: ScheduleImpactCalendarPanelDeps,
  input: OpenScheduleImpactCalendarPanelInput,
): ScheduleImpactCalendarPanelHandle => {
  const registry =
    deps.sessionRegistry ?? new ScheduleImpactCalendarSessionRegistry();
  const cache = panelCaches.get(registry) ?? new Map();
  panelCaches.set(registry, cache);
  const existing = cache.get(input.parentSessionId);
  if (existing) {
    if (registry.resolve(existing.calendarSessionId)) {
      existing.reveal();
      return existing;
    }
    cache.delete(input.parentSessionId);
  }
  let panel: vscode.WebviewPanel | undefined;
  const session = registry.open({
    parentSessionId: input.parentSessionId,
    context: input.context,
    sidecar: input.sidecar,
    displayLanguage: input.displayLanguage ?? deps.language,
    reveal: () => panel?.reveal(vscode.ViewColumn.Active),
  });
  try {
    panel = createPanel(deps, session.displayLanguage);
    panel.webview.options = {
      enableScripts: true,
      localResourceRoots: [deps.extensionContext.extensionUri],
    };
    panel.webview.html = buildCalendarShell(
      panel,
      session.calendarSessionId,
      session.displayLanguage,
    );
    let disposed = false;
    let childCleaned = false;
    let receiveMessageDisposable: vscode.Disposable | undefined;
    const post = (
      message: Parameters<typeof serializeScheduleImpactCalendarMessage>[0],
    ): void => {
      if (
        disposed ||
        !registry.isCurrent(session.calendarSessionId, session.epoch)
      ) {
        return;
      }
      const serialized = serializeScheduleImpactCalendarMessage(message, {
        expectedSessionId: session.calendarSessionId,
      });
      if (serialized.ok === false) {
        if (!registry.isCurrent(session.calendarSessionId, session.epoch)) {
          return;
        }
        void panel?.webview.postMessage(
          createScheduleImpactCalendarFailureMessage(
            session.calendarSessionId,
            null,
            serialized.error,
          ),
        );
        return;
      }
      if (!registry.isCurrent(session.calendarSessionId, session.epoch)) {
        return;
      }
      void panel?.webview.postMessage(message);
    };
    if (typeof panel.webview.onDidReceiveMessage === "function") {
      receiveMessageDisposable = panel.webview.onDidReceiveMessage((value) => {
        if (
          disposed ||
          !registry.isCurrent(session.calendarSessionId, session.epoch)
        ) {
          return;
        }
        const current = registry.resolve(session.calendarSessionId);
        const validation = validateScheduleImpactCalendarMessage(value, {
          expectedSessionId: session.calendarSessionId,
          minimumRequestId: current?.latestRequestId ?? 0,
        });
        const request =
          validation.ok &&
          (validation.value.type === "ready" ||
            validation.value.type === "refresh")
            ? validation.value
            : undefined;
        if (!request) {
          post(
            createScheduleImpactCalendarFailureMessage(
              session.calendarSessionId,
              null,
              createScheduleImpactCalendarError(
                validation.ok === false ? validation.code : "invalid-request",
              ),
            ),
          );
          return;
        }
        if (
          !registry.acceptRequest(
            session.calendarSessionId,
            request.requestId,
            session.epoch,
          )
        ) {
          post(
            createScheduleImpactCalendarFailureMessage(
              session.calendarSessionId,
              request.requestId,
              createScheduleImpactCalendarError("stale-request"),
            ),
          );
          return;
        }
        const accepted = registry.resolve(session.calendarSessionId);
        if (!accepted) {
          post(
            createScheduleImpactCalendarFailureMessage(
              session.calendarSessionId,
              request.requestId,
              createScheduleImpactCalendarError("disposed-session"),
            ),
          );
          return;
        }
        post(
          createScheduleImpactCalendarSessionMessage(
            session.calendarSessionId,
            request.requestId,
            accepted.sidecar,
          ),
        );
      });
    }
    const disposeChild = (): void => {
      if (childCleaned) return;
      childCleaned = true;
      disposed = true;
      receiveMessageDisposable?.dispose();
      panelDisposeDisposable?.dispose();
      try {
        panel?.dispose();
      } catch {
        // A panel disposal failure must not resurrect the child session.
      }
    };
    const dispose = (): void => {
      registry.close(session.calendarSessionId, session.epoch);
      disposeChild();
    };
    const panelDisposeDisposable = panel.onDidDispose(() => {
      if (childCleaned) return;
      registry.close(session.calendarSessionId, session.epoch);
      disposeChild();
    });
    if (
      !registry.registerChildDisposer(session.calendarSessionId, disposeChild)
    ) {
      disposeChild();
      throw new Error("Schedule impact calendar session is no longer current.");
    }
    const handle = {
      calendarSessionId: session.calendarSessionId,
      session,
      panel,
      reveal: () => panel?.reveal(vscode.ViewColumn.Active),
      dispose,
    };
    cache.set(input.parentSessionId, handle);
    return handle;
  } catch (error) {
    registry.close(session.calendarSessionId, session.epoch);
    try {
      panel?.dispose();
    } catch {
      // Preserve the original creation error.
    }
    throw error;
  }
};

export const createScheduleImpactCalendarPanel = (
  deps: ScheduleImpactCalendarPanelDeps,
) => {
  const factoryDeps = {
    ...deps,
    sessionRegistry:
      deps.sessionRegistry ?? new ScheduleImpactCalendarSessionRegistry(),
  };
  const openPanels = new Map<string, ScheduleImpactCalendarPanelHandle>();
  return (
    input: OpenScheduleImpactCalendarPanelInput,
  ): ScheduleImpactCalendarPanelHandle => {
    const existing = openPanels.get(input.parentSessionId);
    if (existing) {
      if (factoryDeps.sessionRegistry.resolve(existing.calendarSessionId)) {
        existing.reveal();
        return existing;
      }
      openPanels.delete(input.parentSessionId);
    }
    const handle = openScheduleImpactCalendarPanel(factoryDeps, input);
    openPanels.set(input.parentSessionId, handle);
    const originalDispose = handle.dispose;
    return {
      ...handle,
      dispose: () => {
        openPanels.delete(input.parentSessionId);
        originalDispose();
      },
    };
  };
};
