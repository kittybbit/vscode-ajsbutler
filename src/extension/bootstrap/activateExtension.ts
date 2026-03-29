import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import { Telemetry } from "../constant";
import { registerHoverProvider } from "../languages/registerHoverProvider";
import { registerDiagnostics } from "../diagnostics/registerDiagnostics";
import { WebviewStore } from "../webview/WebviewStore";
import {
  AJS_FLOW_VIEWER_TYPE,
  AJS_TABLE_VIEWER_TYPE,
} from "../webview/constant";
import { AjsTableViewerMediator } from "../webview/AjsTableViewerMediator";
import { AjsFlowViewerMediator } from "../webview/AjsFlowViewerMediator";
import { AjsTableViewerFactory } from "../webview/AjsTableViewerFactory";
import { AjsFlowViewerFactory } from "../webview/AjsFlowViewerFactory";
import { registerPreviewCommand } from "../commands/registerPreviewCommand";

export type ActivatedExtension = {
  myExtension: MyExtension;
};

export const activateExtension = (
  context: vscode.ExtensionContext,
): ActivatedExtension => {
  const myExtension = MyExtension.init(context);

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

  context.subscriptions.push(
    registerDiagnostics(),
    registerHoverProvider(),
    ajsTableViewerMediator,
    ajsFlowViewerMediator,
    registerPreviewCommand(ajsTableViewerFactory, myExtension),
    registerPreviewCommand(ajsFlowViewerFactory, myExtension),
  );

  myExtension.reporter.sendTelemetryEvent(Telemetry.ExtensionActivate, {
    development: String(DEVELOPMENT),
  });

  return {
    myExtension,
  };
};

export const deactivateExtension = (
  activatedExtension: ActivatedExtension | undefined,
): void => {
  const reporter = activatedExtension?.myExtension.reporter;
  if (reporter) {
    reporter.sendTelemetryEvent(Telemetry.ExtensionDeactivate, {
      development: String(DEVELOPMENT),
    });
    reporter.dispose();
  }
};
