import * as vscode from "vscode";
import { ViewerFactory } from "./ViewerFactory";
import { RESOURCE, READY } from "../../domain/services/events/constant";
import { ready } from "../../domain/services/events/ready";
import { resource } from "../../domain/services/events/resource";
import {
  EventType,
  ResourceEventType,
} from "../../domain/services/events/types";
import { WebviewStore } from "./WebviewStore";
import { AJS_FLOW_VIEWER_TYPE } from "./constant";

export class AjsFlowViewerFactory extends ViewerFactory {
  public static init(store: WebviewStore): ViewerFactory {
    console.log("invoke AjsFlowViewerFactory.init");
    return new AjsFlowViewerFactory(store);
  }

  private constructor(store: WebviewStore) {
    super(AJS_FLOW_VIEWER_TYPE, store);
  }

  override customize(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
  ): void {
    const onDidReceiveMessage = (e: EventType) => {
      console.log("invoke panel.onDidReceiveMessage", e);
      switch (e.type) {
        case RESOURCE: {
          resource(e as ResourceEventType, panel);
          break;
        }
        // webview is ready.
        case READY: {
          ready(document, panel);
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
