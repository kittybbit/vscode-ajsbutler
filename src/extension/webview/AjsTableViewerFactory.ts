import * as vscode from "vscode";
import { ViewerFactory } from "./ViewerFactory";
import { WebviewEventType } from "../../shared/webviewEvents";
import { WebviewStore } from "./WebviewStore";
import { AJS_TABLE_VIEWER_TYPE } from "./constant";
import { MyExtension } from "../MyExtension";
import { readyTableDocument } from "./tableDocument";
import {
  postResourceMessage,
  reportWebviewOperation,
  saveText,
} from "./messageHandlers";
import {
  createViewerMessageHandler,
  registerViewerPanelDispose,
} from "./viewerMessageRouting";

export class AjsTableViewerFactory extends ViewerFactory {
  public static init(
    myExtension: MyExtension,
    store: WebviewStore,
  ): ViewerFactory {
    console.log("invoke AjsTableViewerFactory.init");
    return new AjsTableViewerFactory(myExtension, store);
  }

  private constructor(myExtension: MyExtension, store: WebviewStore) {
    super(AJS_TABLE_VIEWER_TYPE, myExtension, store);
  }

  override customize(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
  ): void {
    const onDidReceiveMessage: (e: WebviewEventType) => void =
      createViewerMessageHandler({
        document,
        panel,
        telemetry: this.myExtension.telemetry,
        onReady: readyTableDocument,
        onResource: (event, receivedPanel) => {
          console.log(
            "invoke AjsTableViewerFactory.onDidReceiveMessage.",
            event,
          );
          postResourceMessage(event.data, receivedPanel);
        },
        onOperation: reportWebviewOperation,
        onSave: (event) => saveText(event.data),
        showErrorMessage: (message) => vscode.window.showErrorMessage(message),
      });
    const receiveMessageDispose =
      panel.webview.onDidReceiveMessage(onDidReceiveMessage);

    registerViewerPanelDispose({
      document,
      panel,
      viewType: this.viewType,
      store: this.store,
      receiveMessageDispose,
    });
  }
}
