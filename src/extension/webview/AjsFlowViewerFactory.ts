import * as vscode from "vscode";
import { ViewerFactory } from "./ViewerFactory";
import { WebviewStore } from "./WebviewStore";
import { AJS_FLOW_VIEWER_TYPE } from "./constant";
import { MyExtension } from "../MyExtension";
import { readyFlowDocument } from "./flowDocument";

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
    this.registerStandardViewerCustomize(document, panel, readyFlowDocument);
  }
}
