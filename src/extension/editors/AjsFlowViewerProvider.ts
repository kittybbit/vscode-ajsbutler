import * as vscode from "vscode";
import { initReactPanel } from "./ReactPanel";
import { MyAppResource } from "@ui-component/editor/MyContexts";
import {
  debounceCreateDataFn,
  readyFn,
} from "../../domain/services/events/ready";
import { resourceFn } from "../../domain/services/events/resource";
import { Extension } from "../Extension";
import { Telemetry } from "../Constants";

type EventType = ResourceEventType | ReadyEventType | SaveEventType;
type ResourceEventType = { type: string; data: MyAppResource };
type ReadyEventType = { type: string };
type SaveEventType = { type: string; data: string };

/**
 * Provider for JP1/AJS flow viewr.
 */
export class AjsFlowViewerProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext) {
    // This method registers the AjsFlowViewerProvider and the command to open the flow viewer.
    console.info("registered AjsFlowViewerProvider");
    context.subscriptions.push(
      vscode.window.registerCustomEditorProvider(
        AjsFlowViewerProvider.viewType,
        new AjsFlowViewerProvider(context),
        {
          webviewOptions: { retainContextWhenHidden: true },
        },
      ),
    );
    context.subscriptions.push(
      vscode.commands.registerCommand("ajsbutler.openFlowViewer", () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
          const uri = activeEditor.document.uri;
          vscode.commands.executeCommand(
            "vscode.openWith",
            uri,
            AjsFlowViewerProvider.viewType,
            vscode.ViewColumn.Two,
          );
          Extension.reporter.sendTelemetryEvent(Telemetry.OpenFlowViewer);
        } else {
          vscode.window.showErrorMessage(
            "No active editor found to open the flow viewer.",
          );
        }
      }),
    );
  }

  public static readonly viewType = "ajsbutler.flowViewer";

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    /* token: vscode.CancellationToken */
  ): Promise<void> {
    const context = this.context;

    const refreshWebview = () => {
      initReactPanel(
        webviewPanel,
        context,
        "./out/index.js",
        AjsFlowViewerProvider.viewType,
      );
    };

    const debounceCreateData = debounceCreateDataFn(
      document,
      webviewPanel,
      500,
    );

    // change event listener
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
      (e) => {
        debounceCreateData(e);
      },
    );
    const changeConfigurationSubscription =
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("workbench.colorTheme")) {
          refreshWebview();
        }
      });

    // message receiver
    const ready = readyFn(document, webviewPanel);
    const resource = resourceFn(webviewPanel);

    const onDidReceiveMessage = (e: EventType) => {
      switch (e.type) {
        case "resource": {
          resource(e as ResourceEventType);
          break;
        }
        // webview is ready.
        case "ready": {
          ready();
          break;
        }
      }
    };
    const receiveMessageSubscription =
      webviewPanel.webview.onDidReceiveMessage(onDidReceiveMessage);

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
      changeConfigurationSubscription.dispose();
      receiveMessageSubscription.dispose();
      console.log("dispose AjsFlowViewerProvider");
    });

    // initial display
    refreshWebview();
  }
}
