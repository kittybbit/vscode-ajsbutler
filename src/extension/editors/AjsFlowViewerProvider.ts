import * as vscode from "vscode";
import { initReactPanel } from "./ReactPanel";
import { MyAppResource } from "@ui-component/editor/MyContexts";
import {
  debounceCreateDataFn,
  ready,
} from "../../domain/services/events/ready";
import { resource } from "../../domain/services/events/resource";
import { Extension } from "../Extension";
import { Telemetry, LANGUAGE_ID } from "../constant";
import { BUNDLE_SRC } from "./constant";
import { WebviewStore } from "./ViewStore";

type EventType = ResourceEventType | ReadyEventType | SaveEventType;
type ResourceEventType = { type: string; data: MyAppResource };
type ReadyEventType = { type: string };
type SaveEventType = { type: string; data: string };

/**
 * Provider for JP1/AJS flow viewr.
 */
export class AjsFlowViewerProvider
  implements vscode.CustomTextEditorProvider, vscode.Disposable
{
  public static register(context: vscode.ExtensionContext) {
    // This method registers the AjsFlowViewerProvider and the command to open the flow viewer.
    console.log("registered AjsFlowViewerProvider");
    const ajsFlowViewerProvider = new AjsFlowViewerProvider(context);

    context.subscriptions.push(
      vscode.window.registerCustomEditorProvider(
        AjsFlowViewerProvider.VIEW_TYPE,
        ajsFlowViewerProvider,
        {
          webviewOptions: { retainContextWhenHidden: true },
        },
      ),
      vscode.commands.registerCommand("ajsbutler.openFlowViewer", () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
          const uri = activeEditor.document.uri;
          vscode.commands.executeCommand(
            "vscode.openWith",
            uri,
            AjsFlowViewerProvider.VIEW_TYPE,
            vscode.ViewColumn.Beside,
          );
          Extension.reporter.sendTelemetryEvent(Telemetry.OpenFlowViewer);
        } else {
          vscode.window.showErrorMessage(
            "No active editor found to open the flow viewer.",
          );
        }
      }),
      vscode.workspace.onDidChangeTextDocument(
        (e: vscode.TextDocumentChangeEvent) => {
          if (e.document.languageId !== LANGUAGE_ID) {
            return;
          }
          console.log(
            "invoke AjsFlowViewerProvider.onDidChangeTextDocument",
            e,
          );
          // Debounce the creation of data to avoid excessive processing
          const panel = ajsFlowViewerProvider.store.byDocument(e.document);
          ajsFlowViewerProvider.debouncedCreateData(e, panel);
        },
      ),
      vscode.workspace.onDidChangeConfiguration(
        (e: vscode.ConfigurationChangeEvent) => {
          if (
            e.affectsConfiguration("workbench.colorTheme") ||
            e.affectsConfiguration("window.autoDetectColorScheme")
          ) {
            console.log(
              "invoke AjsFlowViewerProvider.onDidChangeConfiguration.",
              e,
            );
            ajsFlowViewerProvider.store.allViews.forEach((panel) => {
              initReactPanel(
                context,
                panel,
                AjsFlowViewerProvider.VIEW_TYPE,
                BUNDLE_SRC,
              );
            });
          }
        },
      ),
      ajsFlowViewerProvider,
    );
  }

  public static readonly VIEW_TYPE = "ajsbutler.flowViewer";
  private store = new WebviewStore();
  private debouncedCreateData = debounceCreateDataFn(300);

  constructor(private readonly context: vscode.ExtensionContext) {}
  dispose() {
    console.log("invoke AjsFlowViewerProvider.dispose.");
    this.store.dispose();
  }

  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
    /* token: vscode.CancellationToken */
  ): Promise<void> {
    console.log(
      `invoke AjsFlowViewerProvider.resolveCustomTextEditor. (${panel.title}, ${document.uri.toString()})`,
    );

    const onDidReceiveMessage = (e: EventType) => {
      console.log("invoke AjsFlowViewerProvider.onDidReceiveMessage", e);
      switch (e.type) {
        case "resource": {
          resource(e as ResourceEventType, panel);
          break;
        }
        // webview is ready.
        case "ready": {
          ready(document, panel);
          break;
        }
      }
    };
    const receiveMessageDispose =
      panel.webview.onDidReceiveMessage(onDidReceiveMessage);

    panel.onDidDispose(() => {
      console.log("invoke AjsFlowViewerProvider.onDidDispose.");
      receiveMessageDispose.dispose();
      this.store.remove(panel);
    });

    // initial display
    initReactPanel(
      this.context,
      panel,
      AjsFlowViewerProvider.VIEW_TYPE,
      BUNDLE_SRC,
    );
    this.store.add(panel, document);
  }
}
