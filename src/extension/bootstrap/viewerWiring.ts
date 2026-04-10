import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
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

const createPreviewCommandDependencies = (
  myExtension: MyExtension,
): OpenPreviewCommandDependencies => ({
  getActiveEditor: () => vscode.window.activeTextEditor,
  showErrorMessage: (message) => vscode.window.showErrorMessage(message),
  mountPanel: (panel, viewType) => {
    mountViewerPanel(myExtension.context, panel, viewType);
  },
  trackEvent: (viewType, properties) => {
    myExtension.telemetry.trackEvent(viewType, properties);
  },
});

const createViewerBundle = (
  myExtension: MyExtension,
  previewDeps: OpenPreviewCommandDependencies,
  { viewType, saveHandler }: ViewerConfig,
): vscode.Disposable[] => {
  const store = new WebviewStore(viewType);
  const mediator = new WebviewMediator(
    myExtension,
    viewType,
    store,
    debouncedAjsDocumentChangeFn(300),
  );
  const factory = new ViewerFactory(
    viewType,
    myExtension,
    store,
    readyAjsDocument,
    saveHandler,
  );

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
  myExtension: MyExtension,
): vscode.Disposable[] => {
  const previewDeps = createPreviewCommandDependencies(myExtension);

  return viewerConfigs.flatMap((config) =>
    createViewerBundle(myExtension, previewDeps, config),
  );
};
