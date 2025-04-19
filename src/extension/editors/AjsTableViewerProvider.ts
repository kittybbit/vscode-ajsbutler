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
    console.log("registered AjsTableViewerProvider");
    const ajsTableViewerProvider = new AjsTableViewerProvider(context);
    context.subscriptions.push(
      vscode.window.registerCustomEditorProvider(
        AjsTableViewerProvider.viewType,
        ajsTableViewerProvider,
        {
          webviewOptions: { retainContextWhenHidden: false },
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

  constructor(private readonly context: vscode.ExtensionContext) { }

  private refreshWebview = (panel: vscode.WebviewPanel) => {
    initReactPanel(
      panel,
      this.context,
      "./out/index.js",
      AjsTableViewerProvider.viewType,
    );
  };

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
    /* token: vscode.CancellationToken */
  ): Promise<void> {
    console.log(
      "invoke AjsTableViewerProvider.resolveCustomTextEditor.",
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
        console.log("AjsTableViewerProvider.onDidChangeTextDocument", e);
        // Debounce the creation of data to avoid excessive processing
        debounceCreateData(e);
      },
    );
    const changeConfigurationSubscription =
      vscode.workspace.onDidChangeConfiguration((e) => {
        console.log(
          "invoke AjsTableViewerProvider.onDidChangeConfiguration.",
          e,
        );
        // Refresh the webview when the color theme changes to ensure the webview reflects the new theme
        if (e.affectsConfiguration("workbench.colorTheme")) {
          this.refreshWebview(panel);
        }
      });

    // message receiver
    const ready = readyFn(document, panel);
    const resource = resourceFn(panel);

    const onDidReceiveMessage = (e: EventType) => {
      console.log("invode AjsTableViewerProvider.onDidReceiveMessage.", e);
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
      panel.webview.onDidReceiveMessage(onDidReceiveMessage);

    panel.onDidDispose(() => {
      console.log("invoke AjsTableViewerProvider.onDidDispose.");
      changeDocumentSubscription.dispose();
      changeConfigurationSubscription.dispose();
      receiveMessageSubscription.dispose();
      panel = undefined;
    });

    // initial display
    this.refreshWebview(panel);
  }
}
