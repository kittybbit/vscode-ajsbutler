import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import { registerPreviewCommand } from "../commands/registerPreviewCommand";
import { AjsFlowViewerMediator } from "../webview/AjsFlowViewerMediator";
import { AjsFlowViewerFactory } from "../webview/AjsFlowViewerFactory";
import { AjsTableViewerMediator } from "../webview/AjsTableViewerMediator";
import { AjsTableViewerFactory } from "../webview/AjsTableViewerFactory";
import { ViewerFactory } from "../webview/ViewerFactory";
import {
  AJS_FLOW_VIEWER_TYPE,
  AJS_TABLE_VIEWER_TYPE,
} from "../webview/constant";
import { WebviewStore } from "../webview/WebviewStore";

type ViewerMediatorConstructor = new (
  myExtension: MyExtension,
  store: WebviewStore,
) => vscode.Disposable;

type ViewerFactoryConstructor = new (
  myExtension: MyExtension,
  store: WebviewStore,
) => ViewerFactory;

const createViewerBundle = (
  myExtension: MyExtension,
  viewType: string,
  ViewerMediator: ViewerMediatorConstructor,
  ViewerFactory: ViewerFactoryConstructor,
): vscode.Disposable[] => {
  const store = new WebviewStore(viewType);
  const mediator = new ViewerMediator(myExtension, store);
  const factory = new ViewerFactory(myExtension, store);

  return [mediator, registerPreviewCommand(factory, myExtension)];
};

export const createViewerSubscriptions = (
  myExtension: MyExtension,
): vscode.Disposable[] => [
  ...createViewerBundle(
    myExtension,
    AJS_TABLE_VIEWER_TYPE,
    AjsTableViewerMediator,
    AjsTableViewerFactory,
  ),
  ...createViewerBundle(
    myExtension,
    AJS_FLOW_VIEWER_TYPE,
    AjsFlowViewerMediator,
    AjsFlowViewerFactory,
  ),
];
