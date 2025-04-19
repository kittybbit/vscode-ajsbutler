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
    console.log("registered AjsFlowViewerProvider");
    const ajsFlowViewerProvider = new AjsFlowViewerProvider(context);
    context.subscriptions.push(
      vscode.window.registerCustomEditorProvider(
        AjsFlowViewerProvider.viewType,
        ajsFlowViewerProvider,
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

  constructor(private readonly context: vscode.ExtensionContext) { }

  private refreshWebview(panel: vscode.WebviewPanel) {
    initReactPanel(
      panel,
      this.context,
      "./out/index.js",
      AjsFlowViewerProvider.viewType,
    );
  }

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
    /* token: vscode.CancellationToken */
  ): Promise<void> {
    console.log(
      "invoke AjsFlowViewerProvider.resolveCustomTextEditor.",
      document.uri.toString(),
    );

    const debounceCreateData = debounceCreateDataFn(
      document,
      panel,
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
        console.log(
          "invoke AjsFlowViewerProvider.onDidChangeConfiguration.",
          e,
        );
        if (e.affectsConfiguration("workbench.colorTheme")) {
          this.refreshWebview(panel);
        }
      });

    // message receiver
    const ready = readyFn(document, panel);
    const resource = resourceFn(panel);

    const onDidReceiveMessage = (e: EventType) => {
      console.log("invoke AjsFlowViewerProvider.onDidReceiveMessage", e);
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
      panel.webview.onDidReceiveMessage(onDidReceiveMessage);

    panel.onDidDispose(() => {
      console.log("invoke AjsFlowViewerProvider.onDidDispose.");
      changeDocumentSubscription.dispose();
      changeConfigurationSubscription.dispose();
      receiveMessageSubscription.dispose();
      panel = undefined;
    });

    // initial display
    this.refreshWebview(panel);
  }
}
