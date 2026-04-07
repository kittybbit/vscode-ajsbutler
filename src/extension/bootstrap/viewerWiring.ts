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

const createTableViewerSubscriptions = (
  myExtension: MyExtension,
): vscode.Disposable[] => {
  const store = new WebviewStore(AJS_TABLE_VIEWER_TYPE);
  const mediator = AjsTableViewerMediator.init(myExtension, store);
  const factory = AjsTableViewerFactory.init(myExtension, store);

  return [mediator, registerPreviewCommand(factory, myExtension)];
};

const createFlowViewerSubscriptions = (
  myExtension: MyExtension,
): vscode.Disposable[] => {
  const store = new WebviewStore(AJS_FLOW_VIEWER_TYPE);
  const mediator = AjsFlowViewerMediator.init(myExtension, store);
  const factory = AjsFlowViewerFactory.init(myExtension, store);

  return [mediator, registerPreviewCommand(factory, myExtension)];
};

export const createViewerSubscriptions = (
  myExtension: MyExtension,
): vscode.Disposable[] => [
  ...createTableViewerSubscriptions(myExtension),
  ...createFlowViewerSubscriptions(myExtension),
];
