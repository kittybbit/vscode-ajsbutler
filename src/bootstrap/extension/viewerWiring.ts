import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { createViewerNavigationActionEvent } from "../../application/telemetry/viewerActionTelemetry";
import {
  createViewerOpenStartedEvent,
  createViewerReadyEvent,
} from "../../application/telemetry/viewerTelemetry";
import type { BuildUnitList } from "../../application/unit-list/buildUnitList";
import {
  type ViewerNavigationRequest,
  type NavigationTargetView,
} from "../../presentation/webview/viewerRequestMessages";
import { createViewerRevealUnitMessage } from "../../presentation/webview/viewerHostMessages";
import {
  type OpenPreviewCommandDependencies,
  executeOpenPreviewCommand,
} from "../../presentation/vscode/commands/openPreviewCommand";
import { ViewerFactory } from "../../presentation/vscode/webview/ViewerFactory";
import {
  registerViewerPanel,
  type ViewerPanelRegistration,
} from "../../presentation/vscode/webview/viewerMessageRouting";
import { WebviewMediator } from "../../presentation/vscode/webview/WebviewMediator";
import {
  AJS_FLOW_VIEWER_TYPE,
  AJS_TABLE_VIEWER_TYPE,
} from "../../presentation/vscode/webview/constant";
import { getTelemetryHost } from "../../presentation/vscode/telemetryHost";
import { WebviewStore } from "../../presentation/vscode/webview/WebviewStore";
import {
  createDebouncedAjsDocumentChange,
  createReadyAjsDocument,
} from "../../presentation/vscode/webview/ajsDocument";
import { mountViewerPanel } from "../../presentation/vscode/webview/mountViewerPanel";
import { saveText } from "../../presentation/vscode/webview/messageHandlers";

type ViewerConfig = {
  viewType: string;
  saveHandler?: (content: string) => Promise<void>;
};

const viewerConfigs: ViewerConfig[] = [
  { viewType: AJS_TABLE_VIEWER_TYPE, saveHandler: saveText },
  { viewType: AJS_FLOW_VIEWER_TYPE },
];

export type ViewerWiringDeps = {
  context: vscode.ExtensionContext;
  telemetry: TelemetryPort;
  buildUnitList: BuildUnitList;
};

const createPreviewCommandDependencies = (
  context: vscode.ExtensionContext,
  telemetry: TelemetryPort,
): OpenPreviewCommandDependencies => ({
  getActiveEditor: () => vscode.window.activeTextEditor,
  showErrorMessage: (message) => vscode.window.showErrorMessage(message),
  mountPanel: (panel, viewType) => {
    mountViewerPanel(context, panel, viewType);
  },
  reportTelemetry: (event) => telemetry.report(event),
});

const resolveTargetViewType = (targetView: NavigationTargetView): string =>
  targetView === "flow" ? AJS_FLOW_VIEWER_TYPE : AJS_TABLE_VIEWER_TYPE;

type CounterpartRevealRequest = {
  document: vscode.TextDocument;
  targetViewType: string;
  absolutePath: string;
};

type CounterpartRevealDeps = {
  factoryByViewType: ReadonlyMap<string, ViewerFactory>;
  mountPanel: (panel: vscode.WebviewPanel, viewType: string) => void;
  onOpenStarted?: (targetViewType: string) => void;
  pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>;
};

const postRevealUnit = (
  panel: vscode.WebviewPanel,
  absolutePath: string,
): void => {
  try {
    void Promise.resolve(
      panel.webview.postMessage(createViewerRevealUnitMessage(absolutePath)),
    ).catch(() => undefined);
  } catch {
    // A disposed counterpart must not break the source viewer's navigation.
  }
};

const revealPanelSafely = (panel: vscode.WebviewPanel): boolean => {
  try {
    panel.reveal(panel.viewColumn);
    return true;
  } catch {
    return false;
  }
};

const disposePanelSafely = (panel: vscode.WebviewPanel): void => {
  try {
    panel.dispose();
  } catch {
    // A cleanup failure must not replace the counterpart-open failure.
  }
};

const reportTelemetrySafely = (
  telemetry: TelemetryPort,
  event: Parameters<TelemetryPort["report"]>[0],
): void => {
  try {
    telemetry.report(event);
  } catch {
    // Telemetry must not change viewer lifecycle or navigation behavior.
  }
};

export const flushPendingViewerReveal = (
  panel: vscode.WebviewPanel,
  pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>,
): void => {
  const absolutePath = pendingRevealByPanel.get(panel);
  if (!absolutePath) {
    return;
  }
  pendingRevealByPanel.delete(panel);
  postRevealUnit(panel, absolutePath);
};

export const createViewerReadyHandler =
  (
    onReady: (
      document: vscode.TextDocument,
      panel: vscode.WebviewPanel,
    ) => void,
    pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>,
    onViewerReady: (
      document: vscode.TextDocument,
      panel: vscode.WebviewPanel,
      source: "command" | "navigation",
    ) => void = () => {},
  ) =>
  (document: vscode.TextDocument, panel: vscode.WebviewPanel): void => {
    onReady(document, panel);
    try {
      onViewerReady(
        document,
        panel,
        pendingRevealByPanel.has(panel) ? "navigation" : "command",
      );
    } catch {
      // Lifecycle telemetry must not prevent a pending reveal from flushing.
    }
    flushPendingViewerReveal(panel, pendingRevealByPanel);
  };

const revealExistingCounterpartPanel = (
  panel: vscode.WebviewPanel,
  absolutePath: string,
  pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>,
): void => {
  if (!revealPanelSafely(panel)) {
    pendingRevealByPanel.delete(panel);
    throw new Error("Counterpart panel could not be revealed.");
  }
  if (pendingRevealByPanel.has(panel)) {
    pendingRevealByPanel.set(panel, absolutePath);
    return;
  }
  postRevealUnit(panel, absolutePath);
};

const openCounterpartPanel = (
  request: CounterpartRevealRequest,
  deps: CounterpartRevealDeps,
  newPanel: vscode.WebviewPanel,
): void => {
  deps.pendingRevealByPanel.set(newPanel, request.absolutePath);
  try {
    deps.onOpenStarted?.(request.targetViewType);
    deps.mountPanel(newPanel, request.targetViewType);
    if (!revealPanelSafely(newPanel)) {
      throw new Error("Counterpart panel could not be revealed.");
    }
  } catch (error) {
    deps.pendingRevealByPanel.delete(newPanel);
    disposePanelSafely(newPanel);
    throw error;
  }
};

export const revealCounterpartPanel = (
  request: CounterpartRevealRequest,
  deps: CounterpartRevealDeps,
): void => {
  const targetFactory = deps.factoryByViewType.get(request.targetViewType);
  if (!targetFactory) {
    return;
  }

  let panel: vscode.WebviewPanel | undefined;
  try {
    panel = targetFactory.getExistingPanel(request.document);
  } catch {
    return;
  }
  if (panel) {
    revealExistingCounterpartPanel(
      panel,
      request.absolutePath,
      deps.pendingRevealByPanel,
    );
    return;
  }

  let newPanel: vscode.WebviewPanel;
  try {
    newPanel = targetFactory.getPanel(request.document);
  } catch {
    return;
  }
  openCounterpartPanel(request, deps, newPanel);
};

const revealCounterpartFromNavigation = (
  document: vscode.TextDocument,
  event: ViewerNavigationRequest,
  deps: CounterpartRevealDeps,
): void => {
  revealCounterpartPanel(
    {
      document,
      targetViewType: resolveTargetViewType(event.data.targetView),
      absolutePath: event.data.absolutePath,
    },
    deps,
  );
};

const createViewerNavigationHandler =
  ({
    viewType,
    telemetry,
    previewDeps,
    factoryByViewType,
    pendingRevealByPanel,
  }: {
    viewType: string;
    telemetry: TelemetryPort;
    previewDeps: OpenPreviewCommandDependencies;
    factoryByViewType: Map<string, ViewerFactory>;
    pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>;
  }): ((
    document: vscode.TextDocument,
    event: ViewerNavigationRequest,
  ) => void) =>
  (document, event) => {
    const navigationEvent = createViewerNavigationActionEvent({
      viewType,
      targetView: event.data.targetView,
      host: getTelemetryHost(),
    });
    if (navigationEvent) {
      reportTelemetrySafely(telemetry, navigationEvent);
    }

    revealCounterpartFromNavigation(document, event, {
      factoryByViewType,
      mountPanel: previewDeps.mountPanel,
      onOpenStarted: (targetViewType) => {
        const openEvent = createViewerOpenStartedEvent({
          viewType: targetViewType,
          source: "navigation",
          result: "success",
          host: getTelemetryHost(),
        });
        if (openEvent) {
          reportTelemetrySafely(telemetry, openEvent);
        }
      },
      pendingRevealByPanel,
    });
  };

const createViewerBundle = ({
  context,
  telemetry,
  buildUnitList,
  previewDeps,
  factoryByViewType,
  viewType,
  saveHandler,
  pendingRevealByPanel,
}: ViewerWiringDeps & {
  previewDeps: OpenPreviewCommandDependencies;
  factoryByViewType: Map<string, ViewerFactory>;
  viewType: string;
  saveHandler?: (content: string) => Promise<void>;
  pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>;
}): vscode.Disposable[] => {
  const store = new WebviewStore(viewType);
  const mediator = new WebviewMediator({
    context,
    viewType,
    store,
    change: createDebouncedAjsDocumentChange(buildUnitList, 300, telemetry),
  });
  const registerPanel: ViewerPanelRegistration = (registration) => {
    registerViewerPanel({
      ...registration,
      telemetry,
      store,
      showErrorMessage: (message) => vscode.window.showErrorMessage(message),
    });
  };
  const factory = new ViewerFactory({
    viewType,
    store,
    handlers: {
      onReady: createViewerReadyHandler(
        createReadyAjsDocument(buildUnitList, telemetry),
        pendingRevealByPanel,
        (_document, _panel, source) => {
          const event = createViewerReadyEvent({
            viewType,
            source,
            result: "success",
            host: getTelemetryHost(),
          });
          if (event) {
            reportTelemetrySafely(telemetry, event);
          }
        },
      ),
      onNavigate: createViewerNavigationHandler({
        viewType,
        telemetry,
        previewDeps,
        factoryByViewType,
        pendingRevealByPanel,
      }),
      onSave: saveHandler,
    },
    deps: {
      createWebviewPanel: vscode.window.createWebviewPanel,
      registerPanel,
    },
  });
  factoryByViewType.set(viewType, factory);

  return [
    mediator,
    vscode.commands.registerCommand(`open.${viewType}`, () => {
      console.log(`invoke registerPreview. (${viewType})`);
      executeOpenPreviewCommand({
        viewType,
        panelFactory: factory,
        deps: previewDeps,
      });
    }),
  ];
};

export const createViewerSubscriptions = (
  deps: ViewerWiringDeps,
): vscode.Disposable[] => {
  const previewDeps = createPreviewCommandDependencies(
    deps.context,
    deps.telemetry,
  );
  const factoryByViewType = new Map<string, ViewerFactory>();
  const pendingRevealByPanel = new WeakMap<vscode.WebviewPanel, string>();

  return viewerConfigs.flatMap((config) =>
    createViewerBundle({
      ...deps,
      previewDeps,
      factoryByViewType,
      pendingRevealByPanel,
      ...config,
    }),
  );
};
