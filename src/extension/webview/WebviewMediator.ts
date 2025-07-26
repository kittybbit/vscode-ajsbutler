import * as vscode from "vscode";
import { WebviewStore } from "./WebviewStore";
import { MyExtension } from "../MyExtension";
import { LANGUAGE_ID } from "../constant";
import { BUNDLE_SRC } from "./constant";
import { initReactPanel } from "./reactPanel";
import { debouncedChangeFn } from "../../domain/services/events/change";

export abstract class WebviewMediator implements vscode.Disposable {
  #viewType: string;
  #myExtension: MyExtension;
  #store: WebviewStore;
  #change: ReturnType<typeof debouncedChangeFn>;

  constructor(myExtension: MyExtension, viewType: string, store: WebviewStore) {
    console.log(`invoke WebviewMediator.constructor. (${viewType})`);

    this.#viewType = viewType;
    this.#myExtension = myExtension;
    this.#store = store;
    this.#change = debouncedChangeFn(300);

    const context = this.#myExtension.context;
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument(
        (e: vscode.TextDocumentChangeEvent) => {
          if (e.document.languageId !== LANGUAGE_ID) {
            return;
          }
          console.log(
            `invoke WebviewMediator.onDidChangeTextDocument. (${this.#viewType}, ${e.document.uri.toString()})`,
          );
          const panel = this.#store.panelByDocument(e.document);
          if (panel === undefined) {
            return;
          }
          this.#change(e.document, panel);
        },
      ),
      vscode.workspace.onDidCloseTextDocument((e: vscode.TextDocument) => {
        if (e.languageId !== LANGUAGE_ID) {
          return;
        }
        console.log(
          `invoke WebviewMediator.onDidCloseTextDocument. (${this.#viewType}), ${e.uri.toString()})`,
        );
        const panel = this.#store.panelByDocument(e);
        if (panel === undefined) {
          return;
        }
        this.#store.removeByDocument(e);
        panel.dispose();
      }),
      vscode.workspace.onDidRenameFiles((e: vscode.FileRenameEvent) => {
        // Handle file renames
        console.log(
          `invoke WebviewMediator.onDidRenameFiles. (${this.#viewType})`,
        );
        e.files.forEach((file) => {
          console.log(
            `  File renamed from ${file.oldUri.toString()} to ${file.newUri.toString()}`,
          );
          const panel = this.#store.panelByUri(file.oldUri);
          if (panel !== undefined) {
            this.#store.removeByPanel(panel);
            panel.dispose();
          }
        });
      }),
      vscode.workspace.onDidChangeConfiguration(
        (e: vscode.ConfigurationChangeEvent) => {
          // Refresh the webview when the color theme changes to ensure the webview reflects the new theme
          if (
            e.affectsConfiguration("workbench.colorTheme") ||
            e.affectsConfiguration("window.autoDetectColorScheme")
          ) {
            console.log("invoke WebviewMediator.onDidChangeConfiguration.", e);
            this.#store.allPanels.forEach((panel) => {
              initReactPanel(context, panel, this.#viewType, BUNDLE_SRC);
            });
          }
        },
      ),
      this,
    );
  }

  dispose() {
    console.log(`invoke WebviewMediator.dispose. (${this.#viewType})`);
    this.#store.dispose();
  }
}
