import * as vscode from "vscode";
import { ViewerFactory } from "./ViewerFactory";
import { RESOURCE, READY, OPERATION } from "../../shared/webviewEvents";
import {
  ResourceEventType,
  WebviewEventType,
} from "../../shared/webviewEvents";
import { WebviewStore } from "./WebviewStore";
import { AJS_FLOW_VIEWER_TYPE } from "./constant";
import { MyExtension } from "../MyExtension";
import { readyFlowDocument } from "./flowDocument";
import { postResourceMessage, reportWebviewOperation } from "./messageHandlers";

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
    const onDidReceiveMessage = (e: WebviewEventType) => {
      console.log("invoke AjsFlowViewerFactory.onDidReceiveMessage.", e);
      switch (e.type) {
        case RESOURCE: {
          postResourceMessage((e as ResourceEventType).data, panel);
          break;
        }
        case READY: {
          // webview is ready.
          readyFlowDocument(document, panel);
          break;
        }
        case OPERATION: {
          // track user operation.
          reportWebviewOperation(
            document,
            panel,
            this.myExtension.reporter,
            e.data,
          );
          break;
        }
      }
    };
    const receiveMessageDispose =
      panel.webview.onDidReceiveMessage(onDidReceiveMessage);

    panel.onDidDispose(() => {
      console.log(
        `invoke panel.onDidDispose. (${this.viewType}, ${document.uri.toString()})`,
      );
      this.store.removeByDocument(document);
      receiveMessageDispose.dispose();
    });
  }
}
