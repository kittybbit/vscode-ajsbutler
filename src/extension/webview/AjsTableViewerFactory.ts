import * as vscode from "vscode";
import { ViewerFactory } from "./ViewerFactory";
import { WebviewStore } from "./WebviewStore";
import { AJS_TABLE_VIEWER_TYPE } from "./constant";
import { MyExtension } from "../MyExtension";
import { readyTableDocument } from "./tableDocument";
import { saveText } from "./messageHandlers";

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
    this.registerStandardViewerCustomize(
      document,
      panel,
      readyTableDocument,
      (event) => saveText(event.data),
    );
  }
}
