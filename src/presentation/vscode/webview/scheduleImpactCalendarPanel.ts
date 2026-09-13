import * as vscode from "vscode";
import type { SemanticDiffOutputContext } from "../../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffScheduleImpact } from "../../../application/semantic-diff/semanticDiffScheduleImpact";
import {
  ScheduleImpactCalendarSessionRegistry,
  type ScheduleImpactCalendarSessionHandle,
} from "./scheduleImpactCalendarSessionRegistry";
import { createScheduleImpactCalendarPanelRuntime } from "./scheduleImpactCalendarPanelRuntime";

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

const panelCaches = new WeakMap<
  ScheduleImpactCalendarSessionRegistry,
  Map<string, ScheduleImpactCalendarPanelHandle>
>();

const findCachedPanel = (
  cache: Map<string, ScheduleImpactCalendarPanelHandle>,
  registry: ScheduleImpactCalendarSessionRegistry,
  parentSessionId: string,
): ScheduleImpactCalendarPanelHandle | undefined => {
  const existing = cache.get(parentSessionId);
  if (!existing) return undefined;
  if (registry.resolve(existing.calendarSessionId)) {
    existing.reveal();
    return existing;
  }
  cache.delete(parentSessionId);
  return undefined;
};

/** Internal panel foundation. Slice 2 intentionally mounts no visible UI. */
export const openScheduleImpactCalendarPanel = (
  deps: ScheduleImpactCalendarPanelDeps,
  input: OpenScheduleImpactCalendarPanelInput,
): ScheduleImpactCalendarPanelHandle => {
  const registry =
    deps.sessionRegistry ?? new ScheduleImpactCalendarSessionRegistry();
  const cache = panelCaches.get(registry) ?? new Map();
  panelCaches.set(registry, cache);
  const existing = findCachedPanel(cache, registry, input.parentSessionId);
  if (existing) return existing;
  let panel: vscode.WebviewPanel | undefined;
  const session = registry.open({
    parentSessionId: input.parentSessionId,
    context: input.context,
    sidecar: input.sidecar,
    displayLanguage: input.displayLanguage ?? deps.language,
    reveal: () => panel?.reveal(vscode.ViewColumn.Active),
  });
  try {
    const runtime = createScheduleImpactCalendarPanelRuntime(
      {
        extensionContext: deps.extensionContext,
        createWebviewPanel: deps.createWebviewPanel,
        sessionRegistry: registry,
      },
      session,
    );
    panel = runtime.panel;
    const removeCachedPanel = (): void => {
      if (cache.get(input.parentSessionId) === handle) {
        cache.delete(input.parentSessionId);
      }
    };
    const handle: ScheduleImpactCalendarPanelHandle = {
      calendarSessionId: session.calendarSessionId,
      session,
      panel: runtime.panel,
      reveal: () => runtime.panel.reveal(vscode.ViewColumn.Active),
      dispose: (): void => {
        removeCachedPanel();
        runtime.dispose();
      },
    };
    cache.set(input.parentSessionId, handle);
    runtime.panel.onDidDispose(removeCachedPanel);
    return handle;
  } catch (error) {
    registry.close(session.calendarSessionId, session.epoch);
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
    const existing = findCachedPanel(
      openPanels,
      factoryDeps.sessionRegistry,
      input.parentSessionId,
    );
    if (existing) return existing;
    const handle = openScheduleImpactCalendarPanel(factoryDeps, input);
    const removeOpenPanel = (): void => {
      if (openPanels.get(input.parentSessionId) === activeHandle) {
        openPanels.delete(input.parentSessionId);
      }
    };
    const originalDispose = handle.dispose;
    const activeHandle: ScheduleImpactCalendarPanelHandle = {
      ...handle,
      dispose: () => {
        removeOpenPanel();
        originalDispose();
      },
    };
    openPanels.set(input.parentSessionId, activeHandle);
    handle.panel.onDidDispose(removeOpenPanel);
    return activeHandle;
  };
};
