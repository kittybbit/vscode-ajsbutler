import * as vscode from "vscode";
import { initReactPanel } from "./ReactPanel";
import {
  debounceCreateDataFn,
  readyFn,
} from "../../domain/services/events/ready";
import { resourceFn } from "../../domain/services/events/resource";
import { save } from "../../domain/services/events/save";
import {
  EventType,
  ResourceEventType,
  SaveEventType,
} from "../../domain/services/events/event.types";
import { Extension } from "../Extension";
import { Telemetry } from "../Constants";

/**
 * Provider for JP1/AJS table viewr.
 */
export class AjsTableViewerProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext) {
    console.info("registered AjsTableViewerProvider");
    context.subscriptions.push(
      vscode.window.registerCustomEditorProvider(
        AjsTableViewerProvider.viewType,
        new AjsTableViewerProvider(context),
        {
          webviewOptions: { retainContextWhenHidden: true },
        },
      ),
    );
    context.subscriptions.push(
      vscode.commands.registerCommand("ajsbutler.openTableViewer", () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
          const uri = activeEditor.document.uri;
          vscode.commands.executeCommand(
            "vscode.openWith",
            uri,
            AjsTableViewerProvider.viewType,
            vscode.ViewColumn.Two,
          );
          Extension.reporter.sendTelemetryEvent(Telemetry.OpenTableViewer);
        } else {
          vscode.window.showErrorMessage(
            "No active editor found to open the table viewer.",
          );
        }
      }),
    );
  }

  public static readonly viewType = "ajsbutler.tableViewer";

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    /* token: vscode.CancellationToken */
  ): Promise<void> {
    const refreshWebview = () => {
      initReactPanel(
        webviewPanel,
        this.context,
        "./out/index.js",
        AjsTableViewerProvider.viewType,
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
        // Debounce the creation of data to avoid excessive processing
        debounceCreateData(e);
      },
    );
    const changeConfigurationSubscription =
      vscode.workspace.onDidChangeConfiguration((e) => {
        // Refresh the webview when the color theme changes to ensure the webview reflects the new theme
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
        case "ready": {
          // webview is ready.
          ready();
          break;
        }
        case "save": {
          //save contents
          save(e as SaveEventType);
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
      console.log("dispose AjsTableViewerProvider");
    });

    // initial display
    refreshWebview();
  }
}
