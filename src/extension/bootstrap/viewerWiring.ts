import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import { registerPreviewCommand } from "../commands/registerPreviewCommand";
import { AjsFlowViewerFactory } from "../webview/AjsFlowViewerFactory";
import { AjsTableViewerFactory } from "../webview/AjsTableViewerFactory";
import { ViewerFactory } from "../webview/ViewerFactory";
import { WebviewMediator } from "../webview/WebviewMediator";
import {
  AJS_FLOW_VIEWER_TYPE,
  AJS_TABLE_VIEWER_TYPE,
} from "../webview/constant";
import { WebviewStore } from "../webview/WebviewStore";
import { debouncedAjsDocumentChangeFn } from "../webview/ajsDocument";

type ViewerFactoryConstructor = new (
  myExtension: MyExtension,
  store: WebviewStore,
) => ViewerFactory;

const createViewerBundle = (
  myExtension: MyExtension,
  viewType: string,
  ViewerFactory: ViewerFactoryConstructor,
): vscode.Disposable[] => {
  const store = new WebviewStore(viewType);
  const mediator = new WebviewMediator(
    myExtension,
    viewType,
    store,
    debouncedAjsDocumentChangeFn(300),
  );
  const factory = new ViewerFactory(myExtension, store);

  return [mediator, registerPreviewCommand(factory, myExtension)];
};

export const createViewerSubscriptions = (
  myExtension: MyExtension,
): vscode.Disposable[] => [
  ...createViewerBundle(
    myExtension,
    AJS_TABLE_VIEWER_TYPE,
    AjsTableViewerFactory,
  ),
  ...createViewerBundle(
    myExtension,
    AJS_FLOW_VIEWER_TYPE,
    AjsFlowViewerFactory,
  ),
];
