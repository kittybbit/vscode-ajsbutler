import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { createViewerNavigationActionEvent } from "../../application/telemetry/viewerActionTelemetry";
import {
  createViewerOpenStartedEvent,
  createViewerReadyEvent,
} from "../../application/telemetry/viewerTelemetry";
import type { BuildUnitList } from "../../application/unit-list/buildUnitList";
import type { UnitListDocumentDto } from "../../application/unit-list/unitListDocument";
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
import type { SemanticDiffFlowViewerBridge } from "./semanticDiffFlowViewerBridge";

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
  flowBridge?: SemanticDiffFlowViewerBridge;
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

const handleViewerReady = ({
  document,
  panel,
  onReady,
  pendingRevealByPanel,
  onViewerReady,
}: Readonly<{
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
  onReady: (document: vscode.TextDocument, panel: vscode.WebviewPanel) => void;
  pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>;
  onViewerReady: (
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
    source: "command" | "navigation",
  ) => void;
}>): void => {
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
  (document: vscode.TextDocument, panel: vscode.WebviewPanel): void =>
    handleViewerReady({
      document,
      panel,
      onReady,
      pendingRevealByPanel,
      onViewerReady,
    });

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

const getExistingCounterpartPanel = (
  factory: ViewerFactory,
  document: vscode.TextDocument,
): vscode.WebviewPanel | undefined => {
  try {
    return factory.getExistingPanel(document);
  } catch {
    return undefined;
  }
};

const getNewCounterpartPanel = (
  factory: ViewerFactory,
  document: vscode.TextDocument,
): vscode.WebviewPanel | undefined => {
  try {
    return factory.getPanel(document);
  } catch {
    return undefined;
  }
};

const openNewCounterpartPanel = (
  request: CounterpartRevealRequest,
  deps: CounterpartRevealDeps,
  factory: ViewerFactory,
): void => {
  const panel = getNewCounterpartPanel(factory, request.document);
  if (!panel) return;
  openCounterpartPanel(request, deps, panel);
};

const revealExistingOrOpenCounterpart = (
  request: CounterpartRevealRequest,
  deps: CounterpartRevealDeps,
  factory: ViewerFactory,
): void => {
  const panel = getExistingCounterpartPanel(factory, request.document);
  if (panel) {
    revealExistingCounterpartPanel(
      panel,
      request.absolutePath,
      deps.pendingRevealByPanel,
    );
    return;
  }
  openNewCounterpartPanel(request, deps, factory);
};

export const revealCounterpartPanel = (
  request: CounterpartRevealRequest,
  deps: CounterpartRevealDeps,
): void => {
  const targetFactory = deps.factoryByViewType.get(request.targetViewType);
  if (!targetFactory) {
    return;
  }
  revealExistingOrOpenCounterpart(request, deps, targetFactory);
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

const reportNavigationTelemetry = (
  telemetry: TelemetryPort,
  viewType: string,
  event: ViewerNavigationRequest,
): void => {
  const navigationEvent = createViewerNavigationActionEvent({
    viewType,
    targetView: event.data.targetView,
    host: getTelemetryHost(),
  });
  if (navigationEvent) {
    reportTelemetrySafely(telemetry, navigationEvent);
  }
};

const reportNavigationOpenStarted = (
  telemetry: TelemetryPort,
  targetViewType: string,
): void => {
  const openEvent = createViewerOpenStartedEvent({
    viewType: targetViewType,
    source: "navigation",
    result: "success",
    host: getTelemetryHost(),
  });
  if (openEvent) {
    reportTelemetrySafely(telemetry, openEvent);
  }
};

const handleViewerNavigation = ({
  document,
  event,
  viewType,
  telemetry,
  previewDeps,
  factoryByViewType,
  pendingRevealByPanel,
}: Readonly<{
  document: vscode.TextDocument;
  event: ViewerNavigationRequest;
  viewType: string;
  telemetry: TelemetryPort;
  previewDeps: OpenPreviewCommandDependencies;
  factoryByViewType: Map<string, ViewerFactory>;
  pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>;
}>): void => {
  reportNavigationTelemetry(telemetry, viewType, event);
  revealCounterpartFromNavigation(document, event, {
    factoryByViewType,
    mountPanel: previewDeps.mountPanel,
    onOpenStarted: (targetViewType) =>
      reportNavigationOpenStarted(telemetry, targetViewType),
    pendingRevealByPanel,
  });
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
  (document, event) =>
    handleViewerNavigation({
      document,
      event,
      viewType,
      telemetry,
      previewDeps,
      factoryByViewType,
      pendingRevealByPanel,
    });

type ViewerBundleOptions = ViewerWiringDeps & {
  previewDeps: OpenPreviewCommandDependencies;
  factoryByViewType: Map<string, ViewerFactory>;
  viewType: string;
  saveHandler?: (content: string) => Promise<void>;
  pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>;
  flowBridge?: SemanticDiffFlowViewerBridge;
};

const createDocumentChangeHandler = (
  viewType: string,
  flowBridge: SemanticDiffFlowViewerBridge | undefined,
) =>
  viewType === AJS_FLOW_VIEWER_TYPE
    ? (document: UnitListDocumentDto | null, panel: vscode.WebviewPanel) =>
        flowBridge?.onDocumentChanged(document, panel)
    : undefined;

const notifyFlowReady = ({
  viewType,
  flowBridge,
  document,
  panel,
}: Readonly<{
  viewType: string;
  flowBridge?: SemanticDiffFlowViewerBridge;
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
}>): void => {
  if (flowBridge && viewType === AJS_FLOW_VIEWER_TYPE) {
    flowBridge.onReady(document, panel);
  }
};

const reportReadyTelemetry = ({
  viewType,
  telemetry,
  source,
}: Readonly<{
  viewType: string;
  telemetry: TelemetryPort;
  source: "command" | "navigation";
}>): void => {
  const event = createViewerReadyEvent({
    viewType,
    source,
    result: "success",
    host: getTelemetryHost(),
  });
  if (event) {
    reportTelemetrySafely(telemetry, event);
  }
};

const createViewerReadyCallback = ({
  viewType,
  telemetry,
  flowBridge,
}: Readonly<{
  viewType: string;
  telemetry: TelemetryPort;
  flowBridge?: SemanticDiffFlowViewerBridge;
}>): ((
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
  source: "command" | "navigation",
) => void) => {
  return (document, panel, source) => {
    notifyFlowReady({ viewType, flowBridge, document, panel });
    reportReadyTelemetry({ viewType, telemetry, source });
  };
};

const createViewerMediator = ({
  context,
  viewType,
  buildUnitList,
  telemetry,
  flowBridge,
  store,
}: Readonly<{
  context: vscode.ExtensionContext;
  viewType: string;
  buildUnitList: BuildUnitList;
  telemetry: TelemetryPort;
  flowBridge?: SemanticDiffFlowViewerBridge;
  store: WebviewStore;
}>): WebviewMediator =>
  new WebviewMediator({
    context,
    viewType,
    store,
    change: createDebouncedAjsDocumentChange(
      buildUnitList,
      300,
      telemetry,
      createDocumentChangeHandler(viewType, flowBridge),
    ),
  });

const createPanelRegistrar =
  ({
    telemetry,
    store,
  }: Readonly<{
    telemetry: TelemetryPort;
    store: WebviewStore;
  }>): ViewerPanelRegistration =>
  (registration) => {
    registerViewerPanel({
      ...registration,
      telemetry,
      store,
      showErrorMessage: (message) => vscode.window.showErrorMessage(message),
    });
  };

const createViewerFactory = ({
  telemetry,
  buildUnitList,
  previewDeps,
  factoryByViewType,
  viewType,
  saveHandler,
  pendingRevealByPanel,
  flowBridge,
  store,
  registerPanel,
}: ViewerBundleOptions & {
  store: WebviewStore;
  registerPanel: ViewerPanelRegistration;
}): ViewerFactory =>
  new ViewerFactory({
    viewType,
    store,
    handlers: {
      onReady: createViewerReadyHandler(
        createReadyAjsDocument(buildUnitList, telemetry),
        pendingRevealByPanel,
        createViewerReadyCallback({ viewType, telemetry, flowBridge }),
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

const createViewerOpenCommand = (
  viewType: string,
  factory: ViewerFactory,
  previewDeps: OpenPreviewCommandDependencies,
): vscode.Disposable =>
  vscode.commands.registerCommand(`open.${viewType}`, () => {
    console.log(`invoke registerPreview. (${viewType})`);
    executeOpenPreviewCommand({
      viewType,
      panelFactory: factory,
      deps: previewDeps,
    });
  });

const createViewerBundle = (
  options: ViewerBundleOptions,
): vscode.Disposable[] => {
  const store = new WebviewStore(options.viewType);
  const mediator = createViewerMediator({
    context: options.context,
    viewType: options.viewType,
    buildUnitList: options.buildUnitList,
    telemetry: options.telemetry,
    flowBridge: options.flowBridge,
    store,
  });
  const registerPanel = createPanelRegistrar({
    telemetry: options.telemetry,
    store,
  });
  const factory = createViewerFactory({ ...options, store, registerPanel });
  if (options.viewType === AJS_FLOW_VIEWER_TYPE) {
    options.flowBridge?.setFactory(factory);
  }
  options.factoryByViewType.set(options.viewType, factory);

  return [
    mediator,
    createViewerOpenCommand(options.viewType, factory, options.previewDeps),
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
      flowBridge: deps.flowBridge,
      ...config,
    }),
  );
};
