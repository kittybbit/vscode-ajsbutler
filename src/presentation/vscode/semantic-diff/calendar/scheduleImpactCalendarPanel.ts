import * as vscode from "vscode";
import type { SemanticDiffOutputContext } from "../../../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffScheduleImpact } from "../../../../application/semantic-diff/semanticDiffScheduleImpact";
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

const getPanelCache = (
  registry: ScheduleImpactCalendarSessionRegistry,
): Map<string, ScheduleImpactCalendarPanelHandle> => {
  const cache = panelCaches.get(registry);
  if (cache) return cache;
  const created = new Map<string, ScheduleImpactCalendarPanelHandle>();
  panelCaches.set(registry, created);
  return created;
};

const createCalendarPanelHandle = ({
  deps,
  input,
  registry,
  cache,
  session,
}: Readonly<{
  deps: ScheduleImpactCalendarPanelDeps;
  input: OpenScheduleImpactCalendarPanelInput;
  registry: ScheduleImpactCalendarSessionRegistry;
  cache: Map<string, ScheduleImpactCalendarPanelHandle>;
  session: ScheduleImpactCalendarSessionHandle;
}>): ScheduleImpactCalendarPanelHandle => {
  const runtime = createScheduleImpactCalendarPanelRuntime(
    {
      extensionContext: deps.extensionContext,
      createWebviewPanel: deps.createWebviewPanel,
      sessionRegistry: registry,
    },
    session,
  );
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
};

/** Internal panel foundation. Slice 2 intentionally mounts no visible UI. */
export const openScheduleImpactCalendarPanel = (
  deps: ScheduleImpactCalendarPanelDeps,
  input: OpenScheduleImpactCalendarPanelInput,
): ScheduleImpactCalendarPanelHandle => {
  const registry =
    deps.sessionRegistry ?? new ScheduleImpactCalendarSessionRegistry();
  const cache = getPanelCache(registry);
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
    const handle = createCalendarPanelHandle({
      deps,
      input,
      registry,
      cache,
      session,
    });
    panel = handle.panel;
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
  return (input) => createFactoryPanel(factoryDeps, openPanels, input);
};

const createFactoryPanel = (
  deps: ScheduleImpactCalendarPanelDeps,
  openPanels: Map<string, ScheduleImpactCalendarPanelHandle>,
  input: OpenScheduleImpactCalendarPanelInput,
): ScheduleImpactCalendarPanelHandle => {
  const registry = deps.sessionRegistry!;
  const existing = findCachedPanel(openPanels, registry, input.parentSessionId);
  if (existing) return existing;
  const handle = openScheduleImpactCalendarPanel(deps, input);
  return cacheFactoryPanel(openPanels, input.parentSessionId, handle);
};

const cacheFactoryPanel = (
  openPanels: Map<string, ScheduleImpactCalendarPanelHandle>,
  parentSessionId: string,
  handle: ScheduleImpactCalendarPanelHandle,
): ScheduleImpactCalendarPanelHandle => {
  const removeOpenPanel = (): void => {
    if (openPanels.get(parentSessionId) === activeHandle) {
      openPanels.delete(parentSessionId);
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
  openPanels.set(parentSessionId, activeHandle);
  handle.panel.onDidDispose(removeOpenPanel);
  return activeHandle;
};
