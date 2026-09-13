import * as vscode from "vscode";
import type {
  ScheduleImpactCalendarErrorCode,
  ScheduleImpactCalendarMessage,
} from "./scheduleImpactCalendarTransport";
import {
  createScheduleImpactCalendarError,
  createScheduleImpactCalendarFailureMessage,
  createScheduleImpactCalendarSessionMessage,
  serializeScheduleImpactCalendarMessage,
  validateScheduleImpactCalendarMessage,
} from "./scheduleImpactCalendarTransport";
import type {
  ScheduleImpactCalendarSessionHandle,
  ScheduleImpactCalendarSessionRegistry,
} from "./scheduleImpactCalendarSessionRegistry";

export type ScheduleImpactCalendarPanelRuntimeDeps = Readonly<{
  extensionContext: vscode.ExtensionContext;
  createWebviewPanel?: typeof vscode.window.createWebviewPanel;
  sessionRegistry: ScheduleImpactCalendarSessionRegistry;
}>;

export type ScheduleImpactCalendarPanelRuntime = Readonly<{
  panel: vscode.WebviewPanel;
  dispose(): void;
}>;

const panelTitle = (language: "en" | "ja"): string =>
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
  language: "en" | "ja",
): string => `<!DOCTYPE html>
<html lang="${escapeHtml(language)}">
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
  deps: ScheduleImpactCalendarPanelRuntimeDeps,
  language: "en" | "ja",
): vscode.WebviewPanel =>
  (deps.createWebviewPanel ?? vscode.window.createWebviewPanel)(
    "ajsbutler.scheduleImpactCalendar",
    panelTitle(language),
    vscode.ViewColumn.Active,
    { enableScripts: true, retainContextWhenHidden: true },
  );

const prepareCalendarPanel = (
  panel: vscode.WebviewPanel,
  deps: ScheduleImpactCalendarPanelRuntimeDeps,
  session: ScheduleImpactCalendarSessionHandle,
): void => {
  panel.webview.options = {
    enableScripts: true,
    localResourceRoots: [deps.extensionContext.extensionUri],
  };
  panel.webview.html = buildCalendarShell(
    panel,
    session.calendarSessionId,
    session.displayLanguage,
  );
};

type CalendarRuntimeState = {
  disposed: boolean;
  childCleaned: boolean;
  receiveMessageDisposable?: vscode.Disposable;
  panelDisposeDisposable?: vscode.Disposable;
};

type CalendarRuntimeContext = Readonly<{
  panel: vscode.WebviewPanel;
  registry: ScheduleImpactCalendarSessionRegistry;
  session: ScheduleImpactCalendarSessionHandle;
  state: CalendarRuntimeState;
}>;

type CalendarRequest = Extract<
  ScheduleImpactCalendarMessage,
  { type: "ready" | "refresh" }
>;

const isLiveSession = (context: CalendarRuntimeContext): boolean =>
  !context.state.disposed &&
  context.registry.isCurrent(
    context.session.calendarSessionId,
    context.session.epoch,
  );

const postFailureMessage = (
  context: CalendarRuntimeContext,
  requestId: number | null,
  code: ScheduleImpactCalendarErrorCode,
): void => {
  if (!isLiveSession(context)) return;
  void context.panel.webview.postMessage(
    createScheduleImpactCalendarFailureMessage(
      context.session.calendarSessionId,
      requestId,
      createScheduleImpactCalendarError(code),
    ),
  );
};

const postCalendarMessage = (
  context: CalendarRuntimeContext,
  message: ScheduleImpactCalendarMessage,
): void => {
  if (!isLiveSession(context)) return;
  const serialized = serializeScheduleImpactCalendarMessage(message, {
    expectedSessionId: context.session.calendarSessionId,
  });
  postSerializedCalendarMessage(context, message, serialized);
};

const postSerializedCalendarMessage = (
  context: CalendarRuntimeContext,
  message: ScheduleImpactCalendarMessage,
  serialized: ReturnType<typeof serializeScheduleImpactCalendarMessage>,
): void => {
  if (serialized.ok === false) {
    postFailureMessage(context, null, serialized.error.code);
    return;
  }
  if (!isLiveSession(context)) return;
  void context.panel.webview.postMessage(message);
};

type CalendarRequestDecision =
  | Readonly<{
      ok: true;
      request: Extract<
        ScheduleImpactCalendarMessage,
        { type: "ready" | "refresh" }
      >;
    }>
  | Readonly<{ ok: false; code: ScheduleImpactCalendarErrorCode }>;

const classifyCalendarRequest = (
  context: CalendarRuntimeContext,
  value: unknown,
): CalendarRequestDecision => {
  const current = context.registry.resolve(context.session.calendarSessionId);
  const validation = validateScheduleImpactCalendarMessage(value, {
    expectedSessionId: context.session.calendarSessionId,
    minimumRequestId: current?.latestRequestId ?? 0,
  });
  if (validation.ok === false) {
    return { ok: false, code: validation.code };
  }
  const request = getCalendarRequest(validation.value);
  if (request) return { ok: true, request };
  return { ok: false, code: "invalid-request" };
};

const getCalendarRequest = (
  value: ScheduleImpactCalendarMessage,
): CalendarRequest | undefined =>
  value.type === "ready" || value.type === "refresh" ? value : undefined;

const acceptedCalendarRequest = (
  context: CalendarRuntimeContext,
  request: CalendarRequest,
): boolean =>
  context.registry.acceptRequest(
    context.session.calendarSessionId,
    request.requestId,
    context.session.epoch,
  );

const respondToCalendarRequest = (
  context: CalendarRuntimeContext,
  request: CalendarRequest,
): void => {
  if (!acceptedCalendarRequest(context, request)) {
    postFailureMessage(context, request.requestId, "stale-request");
    return;
  }
  const accepted = context.registry.resolve(context.session.calendarSessionId);
  if (!accepted) {
    postFailureMessage(context, request.requestId, "disposed-session");
    return;
  }
  postCalendarMessage(
    context,
    createScheduleImpactCalendarSessionMessage(
      context.session.calendarSessionId,
      request.requestId,
      accepted.sidecar,
    ),
  );
};

const handleCalendarMessage = (
  context: CalendarRuntimeContext,
  value: unknown,
): void => {
  if (!isLiveSession(context)) return;
  const decision = classifyCalendarRequest(context, value);
  if (decision.ok === false) {
    postFailureMessage(context, null, decision.code);
    return;
  }
  respondToCalendarRequest(context, decision.request);
};

const createCalendarMessageListener =
  (context: CalendarRuntimeContext): ((value: unknown) => void) =>
  (value) =>
    handleCalendarMessage(context, value);

const safeDisposePanel = (panel: vscode.WebviewPanel): void => {
  try {
    panel.dispose();
  } catch {
    // A panel disposal failure must not resurrect the child session.
  }
};

const disposeCalendarChild = (context: CalendarRuntimeContext): void => {
  if (context.state.childCleaned) return;
  context.state.childCleaned = true;
  context.state.disposed = true;
  context.state.receiveMessageDisposable?.dispose();
  context.state.panelDisposeDisposable?.dispose();
  safeDisposePanel(context.panel);
};

type CalendarLifecycleContext = Readonly<{
  panel: vscode.WebviewPanel;
  registry: ScheduleImpactCalendarSessionRegistry;
  session: ScheduleImpactCalendarSessionHandle;
  state: CalendarRuntimeState;
  disposeChild: () => void;
}>;

const handleCalendarPanelDisposed = (
  context: CalendarLifecycleContext,
): void => {
  if (context.state.childCleaned) return;
  context.registry.close(
    context.session.calendarSessionId,
    context.session.epoch,
  );
  context.disposeChild();
};

const createPanelDisposeDisposable = (
  context: CalendarLifecycleContext,
): vscode.Disposable => {
  try {
    return context.panel.onDidDispose(() =>
      handleCalendarPanelDisposed(context),
    );
  } catch (error) {
    context.disposeChild();
    throw error;
  }
};

const registerCalendarPanelLifecycle = (
  context: CalendarLifecycleContext,
): vscode.Disposable => {
  const panelDisposeDisposable = createPanelDisposeDisposable(context);
  if (
    !context.registry.registerChildDisposer(
      context.session.calendarSessionId,
      context.disposeChild,
    )
  ) {
    panelDisposeDisposable.dispose();
    context.disposeChild();
    throw new Error("Schedule impact calendar session is no longer current.");
  }
  return panelDisposeDisposable;
};

export const createScheduleImpactCalendarPanelRuntime = (
  deps: ScheduleImpactCalendarPanelRuntimeDeps,
  session: ScheduleImpactCalendarSessionHandle,
): ScheduleImpactCalendarPanelRuntime => {
  const panel = createPanel(deps, session.displayLanguage);
  try {
    prepareCalendarPanel(panel, deps, session);
    const context = {
      panel,
      registry: deps.sessionRegistry,
      session,
      state: { disposed: false, childCleaned: false },
    } as {
      panel: vscode.WebviewPanel;
      registry: ScheduleImpactCalendarSessionRegistry;
      session: ScheduleImpactCalendarSessionHandle;
      state: CalendarRuntimeState;
    };
    const disposeChild = (): void => disposeCalendarChild(context);
    const messageContext: CalendarRuntimeContext = { ...context };
    if (typeof panel.webview.onDidReceiveMessage === "function") {
      context.state.receiveMessageDisposable =
        panel.webview.onDidReceiveMessage(
          createCalendarMessageListener(messageContext),
        );
    }
    const panelDisposeDisposable = registerCalendarPanelLifecycle({
      ...messageContext,
      disposeChild,
    });
    context.state.panelDisposeDisposable = panelDisposeDisposable;
    return {
      panel,
      dispose: (): void => {
        deps.sessionRegistry.close(session.calendarSessionId, session.epoch);
        disposeChild();
      },
    };
  } catch (error) {
    deps.sessionRegistry.close(session.calendarSessionId, session.epoch);
    safeDisposePanel(panel);
    throw error;
  }
};
