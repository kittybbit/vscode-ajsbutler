import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import {
  createRevealUnitEvent,
  type NavigationTargetView,
} from "../../shared/webviewEvents";
import {
  type OpenPreviewCommandDependencies,
  executeOpenPreviewCommand,
} from "../commands/openPreviewCommand";
import { ViewerFactory } from "../webview/ViewerFactory";
import { WebviewMediator } from "../webview/WebviewMediator";
import {
  AJS_FLOW_VIEWER_TYPE,
  AJS_TABLE_VIEWER_TYPE,
} from "../webview/constant";
import { WebviewStore } from "../webview/WebviewStore";
import {
  debouncedAjsDocumentChangeFn,
  readyAjsDocument,
} from "../webview/ajsDocument";
import { mountViewerPanel } from "../webview/mountViewerPanel";
import { saveText } from "../webview/messageHandlers";

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

const revealExistingCounterpartPanel = (
  document: vscode.TextDocument,
  targetViewType: string,
  absolutePath: string,
  factoryByViewType: ReadonlyMap<string, ViewerFactory>,
): void => {
  const targetFactory = factoryByViewType.get(targetViewType);
  if (!targetFactory) {
    return;
  }

  const panel = targetFactory.getExistingPanel(document);
  if (!panel) {
    return;
  }

  panel.reveal(panel.viewColumn);
  panel.webview.postMessage(createRevealUnitEvent(absolutePath));
};

const createViewerBundle = ({
  context,
  telemetry,
  previewDeps,
  factoryByViewType,
  viewType,
  saveHandler,
}: ViewerWiringDeps & {
  previewDeps: OpenPreviewCommandDependencies;
  factoryByViewType: Map<string, ViewerFactory>;
  viewType: string;
  saveHandler?: (content: string) => Promise<void>;
}): vscode.Disposable[] => {
  const store = new WebviewStore(viewType);
  const mediator = new WebviewMediator(
    context,
    viewType,
    store,
    debouncedAjsDocumentChangeFn(300),
  );
  const factory = new ViewerFactory(
    viewType,
    telemetry,
    store,
    readyAjsDocument,
    (document, event) => {
      revealExistingCounterpartPanel(
        document,
        resolveTargetViewType(event.data.targetView),
        event.data.absolutePath,
        factoryByViewType,
      );
    },
    saveHandler,
  );
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

  return viewerConfigs.flatMap((config) =>
    createViewerBundle({
      ...deps,
      previewDeps,
      factoryByViewType,
      ...config,
    }),
  );
};
