import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import {
  createViewerOpenStartedEvent,
  createViewerReadyEvent,
} from "../../application/telemetry/viewerTelemetry";
import type { BuildUnitList } from "../../application/unit-list/buildUnitList";
import {
  createRevealUnitEvent,
  type NavigationEventType,
  type NavigationTargetView,
} from "../../shared/webviewEvents";
import {
  type OpenPreviewCommandDependencies,
  executeOpenPreviewCommand,
} from "../../presentation/vscode/commands/openPreviewCommand";
import { ViewerFactory } from "../../presentation/vscode/webview/ViewerFactory";
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
  trackEvent: (viewType, properties) => {
    telemetry.trackEvent(viewType, properties);
  },
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
  panel.webview.postMessage(createRevealUnitEvent(absolutePath));
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
    onViewerReady(
      document,
      panel,
      pendingRevealByPanel.has(panel) ? "navigation" : "command",
    );
    flushPendingViewerReveal(panel, pendingRevealByPanel);
  };

const revealExistingCounterpartPanel = (
  panel: vscode.WebviewPanel,
  absolutePath: string,
  pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>,
): void => {
  panel.reveal(panel.viewColumn);
  if (pendingRevealByPanel.has(panel)) {
    pendingRevealByPanel.set(panel, absolutePath);
    return;
  }
  postRevealUnit(panel, absolutePath);
};

const openCounterpartPanel = (
  request: CounterpartRevealRequest,
  deps: CounterpartRevealDeps,
  targetFactory: ViewerFactory,
): void => {
  const newPanel = targetFactory.getPanel(request.document);
  deps.pendingRevealByPanel.set(newPanel, request.absolutePath);
  deps.onOpenStarted?.(request.targetViewType);
  deps.mountPanel(newPanel, request.targetViewType);
  newPanel.reveal(newPanel.viewColumn);
};

export const revealCounterpartPanel = (
  request: CounterpartRevealRequest,
  deps: CounterpartRevealDeps,
): void => {
  const targetFactory = deps.factoryByViewType.get(request.targetViewType);
  if (!targetFactory) {
    return;
  }

  const panel = targetFactory.getExistingPanel(request.document);
  if (panel) {
    revealExistingCounterpartPanel(
      panel,
      request.absolutePath,
      deps.pendingRevealByPanel,
    );
    return;
  }

  openCounterpartPanel(request, deps, targetFactory);
};

const revealCounterpartFromNavigation = (
  document: vscode.TextDocument,
  event: NavigationEventType,
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
    change: createDebouncedAjsDocumentChange(buildUnitList, 300),
  });
  const factory = new ViewerFactory({
    viewType,
    telemetry,
    store,
    handlers: {
      onReady: createViewerReadyHandler(
        createReadyAjsDocument(buildUnitList),
        pendingRevealByPanel,
        (_document, _panel, source) => {
          const event = createViewerReadyEvent({
            viewType,
            source,
            result: "success",
            host: getTelemetryHost(),
          });
          if (event) {
            telemetry.trackEvent(event.name, event.properties);
          }
        },
      ),
      onNavigate: (document, event) => {
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
              telemetry.trackEvent(openEvent.name, openEvent.properties);
            }
          },
          pendingRevealByPanel,
        });
      },
      onSave: saveHandler,
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
