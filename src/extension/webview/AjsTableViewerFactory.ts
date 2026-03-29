import * as vscode from "vscode";
import { ViewerFactory } from "./ViewerFactory";
import {
  ResourceEventType,
  SaveEventType,
  WebviewEventType,
} from "../../shared/webviewEvents";
import { OPERATION, READY, RESOURCE, SAVE } from "../../shared/webviewEvents";
import { WebviewStore } from "./WebviewStore";
import { AJS_TABLE_VIEWER_TYPE } from "./constant";
import { MyExtension } from "../MyExtension";
import { readyTableDocument } from "./tableDocument";
import {
  postResourceMessage,
  reportWebviewOperation,
  saveText,
} from "./messageHandlers";

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
    const onDidReceiveMessage = (e: WebviewEventType) => {
      console.log("invoke AjsTableViewerFactory.onDidReceiveMessage.", e);
      switch (e.type) {
        case RESOURCE: {
          postResourceMessage((e as ResourceEventType).data, panel);
          break;
        }
        case READY: {
          // webview is ready.
          readyTableDocument(document, panel);
          break;
        }
        case SAVE: {
          //save contents
          if (typeof (e as SaveEventType).data === "string") {
            void saveText((e as SaveEventType).data);
          } else {
            void vscode.window.showErrorMessage(
              "Data is not a string and cannot be saved.",
            );
          }
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
    const receiveMessageDisose =
      panel.webview.onDidReceiveMessage(onDidReceiveMessage);

    panel.onDidDispose(() => {
      console.log(
        `invoke panel.onDidDispose. (${this.viewType}, ${document.uri.toString()})`,
      );
      this.store.removeByDocument(document);
      receiveMessageDisose.dispose();
    });
  }
}
