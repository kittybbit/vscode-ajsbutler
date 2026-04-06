import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import { registerPreviewCommand } from "../commands/registerPreviewCommand";
import { AjsFlowViewerMediator } from "../webview/AjsFlowViewerMediator";
import { AjsFlowViewerFactory } from "../webview/AjsFlowViewerFactory";
import { AjsTableViewerMediator } from "../webview/AjsTableViewerMediator";
import { AjsTableViewerFactory } from "../webview/AjsTableViewerFactory";
import {
  AJS_FLOW_VIEWER_TYPE,
  AJS_TABLE_VIEWER_TYPE,
} from "../webview/constant";
import { WebviewStore } from "../webview/WebviewStore";

export const createViewerSubscriptions = (
  myExtension: MyExtension,
): vscode.Disposable[] => {
  const ajsTableViewerStore = new WebviewStore(AJS_TABLE_VIEWER_TYPE);
  const ajsTableViewerMediator = AjsTableViewerMediator.init(
    myExtension,
    ajsTableViewerStore,
  );
  const ajsTableViewerFactory = AjsTableViewerFactory.init(
    myExtension,
    ajsTableViewerStore,
  );

  const ajsFlowViewerStore = new WebviewStore(AJS_FLOW_VIEWER_TYPE);
  const ajsFlowViewerMediator = AjsFlowViewerMediator.init(
    myExtension,
    ajsFlowViewerStore,
  );
  const ajsFlowViewerFactory = AjsFlowViewerFactory.init(
    myExtension,
    ajsFlowViewerStore,
  );

  return [
    ajsTableViewerMediator,
    ajsFlowViewerMediator,
    registerPreviewCommand(ajsTableViewerFactory, myExtension),
    registerPreviewCommand(ajsFlowViewerFactory, myExtension),
  ];
};
