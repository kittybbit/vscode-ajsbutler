import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import { registerPreviewCommand } from "../commands/registerPreviewCommand";
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

const createViewerBundle = (
  myExtension: MyExtension,
  viewType: string,
  saveHandler?: (event: { data: string }) => Promise<void>,
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

  return [mediator, registerPreviewCommand(factory, myExtension)];
};

export const createViewerSubscriptions = (
  myExtension: MyExtension,
): vscode.Disposable[] => [
  ...createViewerBundle(myExtension, AJS_TABLE_VIEWER_TYPE, (event) =>
    saveText(event.data),
  ),
  ...createViewerBundle(myExtension, AJS_FLOW_VIEWER_TYPE),
];
