import * as vscode from "vscode";
import { ViewerFactory } from "./ViewerFactory";
import {
  EventType,
  ResourceEventType,
  SaveEventType,
} from "../../domain/services/events/types";
import { READY, RESOURCE, SAVE } from "../../domain/services/events/constant";
import { ready } from "../../domain/services/events/ready";
import { resource } from "../../domain/services/events/resource";
import { save } from "../../domain/services/events/save";
import { WebviewStore } from "./WebviewStore";
import { AJS_TABLE_VIEWER_TYPE } from "./constant";

export class AjsTableViewerFactory extends ViewerFactory {
  public static init(store: WebviewStore): ViewerFactory {
    console.log("invoke AjsTableViewerFactory.init");
    return new AjsTableViewerFactory(store);
  }

  private constructor(store: WebviewStore) {
    super(AJS_TABLE_VIEWER_TYPE, store);
  }

  override customize(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
  ): void {
    const onDidReceiveMessage = (e: EventType) => {
      console.log("invode AjsTableViewerMediator.onDidReceiveMessage.", e);
      switch (e.type) {
        case RESOURCE: {
          resource(e as ResourceEventType, panel);
          break;
        }
        case READY: {
          // webview is ready.
          ready(document, panel);
          break;
        }
        case SAVE: {
          //save contents
          save(e as SaveEventType);
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
