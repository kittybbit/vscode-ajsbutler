// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Ajs3v12HoverProvider } from "./extension/languages/Ajs3v12HoberProvider";
import { AjsTableViewerMediator } from "./extension/webview/AjsTableViewerMediator";
import { AjsFlowViewerMediator } from "./extension/webview/AjsFlowViewerMediator";
import { Diagnostic } from "./extension/diagnostics/Diagnostic";
import { MyExtension } from "./extension/MyExtension";
import { Telemetry } from "./extension/constant";
import { registerPreview } from "./extension/commands/preview";
import { AjsTableViewerFactory } from "./extension/webview/AjsTableViewerFactory";
import { AjsFlowViewerFactory } from "./extension/webview/AjsFlowViewerFactory";
import {
  AJS_FLOW_VIEWER_TYPE,
  AJS_TABLE_VIEWER_TYPE,
} from "./extension/webview/constant";
import { WebviewStore } from "./extension/webview/WebviewStore";

let myExtension: MyExtension;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('"vscode-ajsbutler" is now active.');
  myExtension = MyExtension.init(context);
  Diagnostic.init(context);
  Ajs3v12HoverProvider.register(context);

  const ajsTableViewerStore = new WebviewStore(AJS_TABLE_VIEWER_TYPE);
  AjsTableViewerMediator.init(myExtension, ajsTableViewerStore);
  const ajsTableViewerFactory = AjsTableViewerFactory.init(
    myExtension,
    ajsTableViewerStore,
  );
  registerPreview(ajsTableViewerFactory, myExtension);
  const ajsFlowViewerStore = new WebviewStore(AJS_FLOW_VIEWER_TYPE);
  AjsFlowViewerMediator.init(myExtension, ajsFlowViewerStore);
  const ajsFlowViewerFactory = AjsFlowViewerFactory.init(
    myExtension,
    ajsFlowViewerStore,
  );
  registerPreview(ajsFlowViewerFactory, myExtension);

  myExtension.reporter.sendTelemetryEvent(Telemetry.ExtensionActivate, {
    development: String(DEVELOPMENT),
  });
}

// this method is called when your extension is deactivated
export function deactivate(): void {
  const reporter = myExtension.reporter;
  if (reporter) {
    reporter.sendTelemetryEvent(Telemetry.ExtensionDeactivate, {
      development: String(DEVELOPMENT),
    });
    reporter.dispose();
  }
  console.log('"vscode-ajsbutler" is deactive.');
}
