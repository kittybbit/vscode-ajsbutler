import * as vscode from "vscode";
import {
  createCsvExportedEvent,
  createViewerOpenCompletedEvent,
} from "../../application/telemetry/telemetryEvent";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import type { BuildUnitList } from "../../application/unit-list/buildUnitList";
import type { UnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import { type ViewerNavigationRequest } from "../../presentation/webview/viewerRequestMessages";
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
  saveHandler?: (content: string) => Promise<boolean>;
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

type ViewerDisplayResult = "success" | "failed";
type PendingViewerOpen = (result: ViewerDisplayResult) => void;
type ViewerDisplayState = {
  transportResult?: ViewerDisplayResult;
  displayResult?: ViewerDisplayResult;
  pending: PendingViewerOpen[];
};

const resolveViewerFeature = (viewType: string): "table" | "flow" =>
  viewType === AJS_FLOW_VIEWER_TYPE ? "flow" : "table";

const reportViewerOpenCompleted = (
  telemetry: TelemetryPort,
  feature: "table" | "flow",
  result: ViewerDisplayResult,
): void => {
  try {
    telemetry.report(
      createViewerOpenCompletedEvent({
        feature,
        host: getTelemetryHost(),
        result,
      }),
    );
  } catch {
    // Telemetry must not change viewer behavior.
  }
};

const getViewerDisplayState = (
  stateByPanel: WeakMap<vscode.WebviewPanel, ViewerDisplayState>,
  panel: vscode.WebviewPanel,
): ViewerDisplayState => {
  let state = stateByPanel.get(panel);
  if (!state) {
    state = { pending: [] };
    stateByPanel.set(panel, state);
  }
  return state;
};

const resolveViewerDisplayResult = (
  state: ViewerDisplayState,
): ViewerDisplayResult | undefined => {
  const results = [state.transportResult, state.displayResult];
  if (results.includes("failed")) return "failed";
  if (results.includes(undefined)) return undefined;
  return "success";
};

const settleViewerDisplay = (state: ViewerDisplayState): void => {
  const result = resolveViewerDisplayResult(state);
  if (!result) return;
  state.pending.splice(0).forEach((complete) => complete(result));
};

const beginViewerOpen = (
  telemetry: TelemetryPort,
  state: ViewerDisplayState,
  viewType: string,
): void => {
  const feature = resolveViewerFeature(viewType);
  state.pending.push((completion) =>
    reportViewerOpenCompleted(telemetry, feature, completion),
  );
  settleViewerDisplay(state);
};

const updateViewerResult = (
  state: ViewerDisplayState,
  property: "transportResult" | "displayResult",
  result: ViewerDisplayResult,
): void => {
  state[property] = result;
  settleViewerDisplay(state);
};

const failPendingViewerOpens = (
  stateByPanel: WeakMap<vscode.WebviewPanel, ViewerDisplayState>,
  panel: vscode.WebviewPanel,
): void => {
  updateViewerResult(
    getViewerDisplayState(stateByPanel, panel),
    "displayResult",
    "failed",
  );
};

const reportOpenFailure = (telemetry: TelemetryPort, viewType: string): void =>
  reportViewerOpenCompleted(
    telemetry,
    resolveViewerFeature(viewType),
    "failed",
  );

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

const createPreviewCommandDependencies = (
  context: vscode.ExtensionContext,
  telemetry: TelemetryPort,
  stateByPanel: WeakMap<vscode.WebviewPanel, ViewerDisplayState>,
): OpenPreviewCommandDependencies => ({
  getActiveEditor: () => vscode.window.activeTextEditor,
  showErrorMessage: (message) => vscode.window.showErrorMessage(message),
  mountPanel: (panel, viewType) => mountViewerPanel(context, panel, viewType),
  revealPanel: revealPanelSafely,
  onOpenStarted: (panel, viewType) =>
    beginViewerOpen(
      telemetry,
      getViewerDisplayState(stateByPanel, panel),
      viewType,
    ),
  onOpenFailed: (viewType) => reportOpenFailure(telemetry, viewType),
  onPanelFailed: (panel) => failPendingViewerOpens(stateByPanel, panel),
});

type CounterpartRevealRequest = {
  document: vscode.TextDocument;
  targetViewType: string;
  absolutePath: string;
};

type CounterpartRevealDeps = {
  factoryByViewType: ReadonlyMap<string, ViewerFactory>;
  mountPanel: (panel: vscode.WebviewPanel, viewType: string) => void;
  onOpenStarted: (panel: vscode.WebviewPanel, viewType: string) => void;
  onOpenFailed: (viewType: string) => void;
  onPanelFailed: (panel: vscode.WebviewPanel) => void;
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

export const flushPendingViewerReveal = (
  panel: vscode.WebviewPanel,
  pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>,
): void => {
  const absolutePath = pendingRevealByPanel.get(panel);
  if (!absolutePath) return;
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
  onReady: (
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
  ) => void | Promise<void>;
  pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>;
  onViewerReady: (
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
  ) => void;
}>): void | Promise<void> => {
  const result = onReady(document, panel);
  try {
    onViewerReady(document, panel);
  } catch {
    // A Flow callback must not prevent a pending reveal from flushing.
  }
  flushPendingViewerReveal(panel, pendingRevealByPanel);
  return result;
};

export const createViewerReadyHandler =
  (
    onReady: (
      document: vscode.TextDocument,
      panel: vscode.WebviewPanel,
    ) => void | Promise<void>,
    pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>,
    onViewerReady: (
      document: vscode.TextDocument,
      panel: vscode.WebviewPanel,
    ) => void = () => {},
  ) =>
  (
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
  ): void | Promise<void> =>
    handleViewerReady({
      document,
      panel,
      onReady,
      pendingRevealByPanel,
      onViewerReady,
    });

const revealExistingCounterpartPanel = (
  panel: vscode.WebviewPanel,
  request: CounterpartRevealRequest,
  deps: CounterpartRevealDeps,
): void => {
  if (!revealPanelSafely(panel)) {
    deps.pendingRevealByPanel.delete(panel);
    deps.onOpenFailed(request.targetViewType);
    throw new Error("Counterpart panel could not be revealed.");
  }
  deps.onOpenStarted(panel, request.targetViewType);
  if (deps.pendingRevealByPanel.has(panel)) {
    deps.pendingRevealByPanel.set(panel, request.absolutePath);
    return;
  }
  postRevealUnit(panel, request.absolutePath);
};

const openCounterpartPanel = (
  request: CounterpartRevealRequest,
  deps: CounterpartRevealDeps,
  newPanel: vscode.WebviewPanel,
): void => {
  deps.pendingRevealByPanel.set(newPanel, request.absolutePath);
  deps.onOpenStarted(newPanel, request.targetViewType);
  try {
    deps.mountPanel(newPanel, request.targetViewType);
    if (!revealPanelSafely(newPanel)) {
      throw new Error("Counterpart panel could not be revealed.");
    }
  } catch (error) {
    deps.pendingRevealByPanel.delete(newPanel);
    deps.onPanelFailed(newPanel);
    disposePanelSafely(newPanel);
    throw error;
  }
};

const getCounterpartPanel = (
  factory: ViewerFactory,
  document: vscode.TextDocument,
  method: "getExistingPanel" | "getPanel",
): vscode.WebviewPanel | undefined => {
  try {
    return factory[method](document);
  } catch {
    return undefined;
  }
};

const openNewCounterpartPanel = (
  request: CounterpartRevealRequest,
  deps: CounterpartRevealDeps,
  factory: ViewerFactory,
): void => {
  const panel = getCounterpartPanel(factory, request.document, "getPanel");
  if (!panel) {
    deps.onOpenFailed(request.targetViewType);
    return;
  }
  openCounterpartPanel(request, deps, panel);
};

const revealExistingOrOpenCounterpart = (
  request: CounterpartRevealRequest,
  deps: CounterpartRevealDeps,
  factory: ViewerFactory,
): void => {
  const panel = getCounterpartPanel(
    factory,
    request.document,
    "getExistingPanel",
  );
  if (panel) {
    revealExistingCounterpartPanel(panel, request, deps);
    return;
  }
  openNewCounterpartPanel(request, deps, factory);
};

export const revealCounterpartPanel = (
  request: CounterpartRevealRequest,
  deps: CounterpartRevealDeps,
): void => {
  const factory = deps.factoryByViewType.get(request.targetViewType);
  if (!factory) {
    deps.onOpenFailed(request.targetViewType);
    return;
  }
  revealExistingOrOpenCounterpart(request, deps, factory);
};

const revealCounterpartFromNavigation = (
  document: vscode.TextDocument,
  event: ViewerNavigationRequest,
  deps: CounterpartRevealDeps,
): void => {
  revealCounterpartPanel(
    {
      document,
      targetViewType:
        event.data.targetView === "flow"
          ? AJS_FLOW_VIEWER_TYPE
          : AJS_TABLE_VIEWER_TYPE,
      absolutePath: event.data.absolutePath,
    },
    deps,
  );
};

const createViewerNavigationHandler =
  ({
    previewDeps,
    factoryByViewType,
    pendingRevealByPanel,
  }: {
    previewDeps: OpenPreviewCommandDependencies;
    factoryByViewType: Map<string, ViewerFactory>;
    pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>;
  }): ((
    document: vscode.TextDocument,
    event: ViewerNavigationRequest,
  ) => void) =>
  (document, event) =>
    revealCounterpartFromNavigation(document, event, {
      factoryByViewType,
      mountPanel: previewDeps.mountPanel,
      onOpenStarted: previewDeps.onOpenStarted,
      onOpenFailed: previewDeps.onOpenFailed,
      onPanelFailed: previewDeps.onPanelFailed,
      pendingRevealByPanel,
    });

type ViewerBundleOptions = ViewerWiringDeps & {
  previewDeps: OpenPreviewCommandDependencies;
  factoryByViewType: Map<string, ViewerFactory>;
  viewType: string;
  saveHandler?: (content: string) => Promise<boolean>;
  pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>;
  displayStateByPanel: WeakMap<vscode.WebviewPanel, ViewerDisplayState>;
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

const createViewerReadyCallback =
  ({
    viewType,
    flowBridge,
  }: Readonly<{
    viewType: string;
    flowBridge?: SemanticDiffFlowViewerBridge;
  }>): ((document: vscode.TextDocument, panel: vscode.WebviewPanel) => void) =>
  (document, panel) => {
    if (flowBridge && viewType === AJS_FLOW_VIEWER_TYPE) {
      flowBridge.onReady(document, panel);
    }
  };

const createViewerMediator = ({
  context,
  viewType,
  buildUnitList,
  flowBridge,
  store,
}: Readonly<{
  context: vscode.ExtensionContext;
  viewType: string;
  buildUnitList: BuildUnitList;
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

const createViewerTransportHandler = (
  buildUnitList: BuildUnitList,
  stateByPanel: WeakMap<vscode.WebviewPanel, ViewerDisplayState>,
): ((
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
) => Promise<void>) => {
  const postReadyDocument = createReadyAjsDocument(buildUnitList);
  return (document, panel) =>
    postReadyDocument(document, panel).then(
      (result) =>
        updateViewerResult(
          getViewerDisplayState(stateByPanel, panel),
          "transportResult",
          result,
        ),
      (error: unknown) => {
        updateViewerResult(
          getViewerDisplayState(stateByPanel, panel),
          "transportResult",
          "failed",
        );
        throw error;
      },
    );
};

const reportCsvExportedSafely = (telemetry: TelemetryPort): void => {
  try {
    telemetry.report(createCsvExportedEvent("save"));
  } catch {
    // Telemetry must not change the successful file write.
  }
};

const saveCsvAndReport = async (
  telemetry: TelemetryPort,
  saveHandler: NonNullable<ViewerBundleOptions["saveHandler"]>,
  content: string,
): Promise<boolean> => {
  const saved = await saveHandler(content);
  if (saved) reportCsvExportedSafely(telemetry);
  return saved;
};

const createViewerSaveHandler = (
  telemetry: TelemetryPort,
  saveHandler: ViewerBundleOptions["saveHandler"],
): ((content: string) => Promise<boolean>) | undefined => {
  if (!saveHandler) return undefined;
  return (content) => saveCsvAndReport(telemetry, saveHandler, content);
};

const createViewerFactory = ({
  telemetry,
  buildUnitList,
  previewDeps,
  factoryByViewType,
  viewType,
  saveHandler,
  pendingRevealByPanel,
  displayStateByPanel,
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
        createViewerTransportHandler(buildUnitList, displayStateByPanel),
        pendingRevealByPanel,
        createViewerReadyCallback({ viewType, flowBridge }),
      ),
      onNavigate: createViewerNavigationHandler({
        previewDeps,
        factoryByViewType,
        pendingRevealByPanel,
      }),
      onDisplay: (result, panel) =>
        updateViewerResult(
          getViewerDisplayState(displayStateByPanel, panel),
          "displayResult",
          result,
        ),
      onDisposed: (panel) => failPendingViewerOpens(displayStateByPanel, panel),
      onSave: createViewerSaveHandler(telemetry, saveHandler),
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
    flowBridge: options.flowBridge,
    store,
  });
  const registerPanel = createPanelRegistrar({
    telemetry: options.telemetry,
    store,
  });
  const factory = createViewerFactory({ ...options, store, registerPanel });
  if (options.viewType === AJS_FLOW_VIEWER_TYPE) {
    options.flowBridge?.setFactory(factory, {
      onOpenStarted: (panel) =>
        beginViewerOpen(
          options.telemetry,
          getViewerDisplayState(options.displayStateByPanel, panel),
          options.viewType,
        ),
      onOpenFailed: () =>
        reportOpenFailure(options.telemetry, options.viewType),
      onPanelFailed: (panel) =>
        failPendingViewerOpens(options.displayStateByPanel, panel),
    });
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
  const displayStateByPanel = new WeakMap<
    vscode.WebviewPanel,
    ViewerDisplayState
  >();
  const previewDeps = createPreviewCommandDependencies(
    deps.context,
    deps.telemetry,
    displayStateByPanel,
  );
  const factoryByViewType = new Map<string, ViewerFactory>();
  const pendingRevealByPanel = new WeakMap<vscode.WebviewPanel, string>();

  return viewerConfigs.flatMap((config) =>
    createViewerBundle({
      ...deps,
      previewDeps,
      factoryByViewType,
      pendingRevealByPanel,
      displayStateByPanel,
      flowBridge: deps.flowBridge,
      ...config,
    }),
  );
};
