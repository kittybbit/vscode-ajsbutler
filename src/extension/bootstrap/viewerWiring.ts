import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import { registerPreviewCommand } from "../commands/registerPreviewCommand";
import {
  createOpenPreviewCommandDependencies,
  openPreviewCommand,
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
import { saveText } from "../webview/messageHandlers";

type ViewerConfig = {
  viewType: string;
  saveHandler?: (content: string) => Promise<void>;
};

const viewerConfigs: ViewerConfig[] = [
  { viewType: AJS_TABLE_VIEWER_TYPE, saveHandler: saveText },
  { viewType: AJS_FLOW_VIEWER_TYPE },
];

const createViewerBundle = (
  myExtension: MyExtension,
  previewDeps: ReturnType<typeof createOpenPreviewCommandDependencies>,
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
    registerPreviewCommand(viewType, () => {
      openPreviewCommand(viewType, factory, previewDeps);
    }),
  ];
};

export const createViewerSubscriptions = (
  myExtension: MyExtension,
): vscode.Disposable[] => {
  const previewDeps = createOpenPreviewCommandDependencies(
    myExtension.context,
    (eventViewType, properties) => {
      myExtension.telemetry.trackEvent(eventViewType, properties);
    },
  );

  return viewerConfigs.flatMap((config) =>
    createViewerBundle(myExtension, previewDeps, config),
  );
};
