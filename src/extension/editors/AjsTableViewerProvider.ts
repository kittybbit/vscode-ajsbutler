import * as vscode from "vscode";
import { initReactPanel } from "./ReactPanel";
import {
  debounceCreateDataFn,
  ready,
} from "../../domain/services/events/ready";
import { resource } from "../../domain/services/events/resource";
import { save } from "../../domain/services/events/save";
import {
  EventType,
  ResourceEventType,
  SaveEventType,
} from "../../domain/services/events/event.types";
import { Extension } from "../Extension";
import { Telemetry, LANGUAGE_ID } from "../constant";
import { BUNDLE_SRC } from "./constant";
import { WebviewStore } from "./ViewStore";

/**
 * Provider for JP1/AJS table viewr.
 */
export class AjsTableViewerProvider
  implements vscode.CustomTextEditorProvider, vscode.Disposable {
  public static register(context: vscode.ExtensionContext) {
    console.log("registered AjsTableViewerProvider");
    const ajsTableViewerProvider = new AjsTableViewerProvider(context);

    context.subscriptions.push(
      vscode.window.registerCustomEditorProvider(
        AjsTableViewerProvider.VIEW_TYPE,
        ajsTableViewerProvider,
        {
          webviewOptions: { retainContextWhenHidden: true },
        },
      ),
      vscode.commands.registerCommand("ajsbutler.openTableViewer", () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
          const uri = activeEditor.document.uri;
          vscode.commands.executeCommand(
            "vscode.openWith",
            uri,
            AjsTableViewerProvider.VIEW_TYPE,
            vscode.ViewColumn.Beside,
          );
          Extension.reporter.sendTelemetryEvent(Telemetry.OpenTableViewer);
        } else {
          vscode.window.showErrorMessage(
            "No active editor found to open the table viewer.",
          );
        }
      }),
      vscode.workspace.onDidChangeTextDocument(
        (e: vscode.TextDocumentChangeEvent) => {
          if (e.document.languageId !== LANGUAGE_ID) {
            return;
          }
          console.log(
            "invoke AjsTableViewerProvider.onDidChangeTextDocument",
            e,
          );
          // Debounce the creation of data to avoid excessive processing
          const panel = ajsTableViewerProvider.store.byDocument(e.document);
          ajsTableViewerProvider.debouncedCreateData(e, panel);
        },
      ),
      vscode.workspace.onDidChangeConfiguration(
        (e: vscode.ConfigurationChangeEvent) => {
          // Refresh the webview when the color theme changes to ensure the webview reflects the new theme
          if (
            e.affectsConfiguration("workbench.colorTheme") ||
            e.affectsConfiguration("window.autoDetectColorScheme")
          ) {
            console.log(
              "invoke AjsTableViewerProvider.onDidChangeConfiguration.",
              e,
            );
            ajsTableViewerProvider.store.allViews.forEach((panel) => {
              initReactPanel(
                context,
                panel,
                AjsTableViewerProvider.VIEW_TYPE,
                BUNDLE_SRC,
              );
            });
          }
        },
      ),
      ajsTableViewerProvider,
    );
  }

  public static readonly VIEW_TYPE = "ajsbutler.tableViewer";
  private store = new WebviewStore();
  private debouncedCreateData = debounceCreateDataFn(300);

  constructor(private readonly context: vscode.ExtensionContext) { }
  dispose() {
    console.log("invoke AjsTableViewerProvider.dispose.");
    this.store.dispose();
  }

  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
    /* token: vscode.CancellationToken */
  ): Promise<void> {
    console.log(
      `invoke AjsTableViewerProvider.resolveCustomTextEditor. (${panel.title}, ${document.uri.toString()})`,
    );

    const onDidReceiveMessage = (e: EventType) => {
      console.log("invode AjsTableViewerProvider.onDidReceiveMessage.", e);
      switch (e.type) {
        case "resource": {
          resource(e as ResourceEventType, panel);
          break;
        }
        case "ready": {
          // webview is ready.
          ready(document, panel);
          break;
        }
        case "save": {
          //save contents
          save(e as SaveEventType);
          break;
        }
      }
    };
    const receiveMessageDisose =
      panel.webview.onDidReceiveMessage(onDidReceiveMessage);

    panel.onDidDispose(() => {
      console.log("invoke AjsTableViewerProvider.onDidDispose.");
      receiveMessageDisose.dispose();
      this.store.remove(panel);
    });

    // initial display
    initReactPanel(
      this.context,
      panel,
      AjsTableViewerProvider.VIEW_TYPE,
      BUNDLE_SRC,
    );
    this.store.add(panel, document);
  }
}
