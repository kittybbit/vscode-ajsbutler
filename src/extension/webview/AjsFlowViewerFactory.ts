import * as vscode from "vscode";
import { ViewerFactory } from "./ViewerFactory";
import { WebviewEventType } from "../../shared/webviewEvents";
import { WebviewStore } from "./WebviewStore";
import { AJS_FLOW_VIEWER_TYPE } from "./constant";
import { MyExtension } from "../MyExtension";
import { readyFlowDocument } from "./flowDocument";
import { postResourceMessage, reportWebviewOperation } from "./messageHandlers";
import {
  createViewerMessageHandler,
  registerViewerPanelDispose,
} from "./viewerMessageRouting";

export class AjsFlowViewerFactory extends ViewerFactory {
  public static init(
    myExtension: MyExtension,
    store: WebviewStore,
  ): ViewerFactory {
    console.log("invoke AjsFlowViewerFactory.init");
    return new AjsFlowViewerFactory(myExtension, store);
  }

  private constructor(myExtension: MyExtension, store: WebviewStore) {
    super(AJS_FLOW_VIEWER_TYPE, myExtension, store);
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
        onReady: readyFlowDocument,
        onResource: (event, receivedPanel) => {
          console.log(
            "invoke AjsFlowViewerFactory.onDidReceiveMessage.",
            event,
          );
          postResourceMessage(event.data, receivedPanel);
        },
        onOperation: reportWebviewOperation,
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
