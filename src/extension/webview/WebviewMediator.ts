import * as vscode from "vscode";
import { LANGUAGE_ID } from "../constant";
import { mountViewerPanel } from "./mountViewerPanel";

type WebviewMediatorStore = {
  readonly allPanels: ReadonlySet<vscode.WebviewPanel>;
  dispose(): void;
  panelByUri(uri: vscode.Uri): vscode.WebviewPanel | undefined;
  removeByUri(uri: vscode.Uri): void;
};

type DocumentChangeHandler = (
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
) => void;

type WebviewMediatorDeps = {
  onDidChangeTextDocument: typeof vscode.workspace.onDidChangeTextDocument;
  onDidCloseTextDocument: typeof vscode.workspace.onDidCloseTextDocument;
  onDidRenameFiles: typeof vscode.workspace.onDidRenameFiles;
  onDidChangeActiveColorTheme: typeof vscode.window.onDidChangeActiveColorTheme;
  mountPanel: typeof mountViewerPanel;
};

const defaultDeps: WebviewMediatorDeps = {
  onDidChangeTextDocument: vscode.workspace.onDidChangeTextDocument,
  onDidCloseTextDocument: vscode.workspace.onDidCloseTextDocument,
  onDidRenameFiles: vscode.workspace.onDidRenameFiles,
  onDidChangeActiveColorTheme: vscode.window.onDidChangeActiveColorTheme,
  mountPanel: mountViewerPanel,
};

export class WebviewMediator implements vscode.Disposable {
  #viewType: string;
  #context: vscode.ExtensionContext;
  #store: WebviewMediatorStore;
  #change: DocumentChangeHandler;
  #deps: WebviewMediatorDeps;
  #subscriptions: vscode.Disposable;

  constructor(
    context: vscode.ExtensionContext,
    viewType: string,
    store: WebviewMediatorStore,
    change: DocumentChangeHandler,
    deps: WebviewMediatorDeps = defaultDeps,
  ) {
    console.log(`invoke WebviewMediator.constructor. (${viewType})`);

    this.#viewType = viewType;
    this.#context = context;
    this.#store = store;
    this.#change = change;
    this.#deps = deps;

    this.#subscriptions = vscode.Disposable.from(
      this.#deps.onDidChangeTextDocument((event) =>
        this.onDidChangeTextDocument(event),
      ),
      this.#deps.onDidCloseTextDocument((document) =>
        this.onDidCloseTextDocument(document),
      ),
      this.#deps.onDidRenameFiles((event) => this.onDidRenameFiles(event)),
      this.#deps.onDidChangeActiveColorTheme((event) =>
        this.onDidChangeActiveColorTheme(event),
      ),
    );
  }

  dispose() {
    console.log(`invoke WebviewMediator.dispose. (${this.#viewType})`);
    this.#subscriptions.dispose();
    this.#store.dispose();
  }

  private onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent): void {
    if (event.document.languageId !== LANGUAGE_ID) {
      return;
    }
    console.log(
      "invoke WebviewMediator.onDidChangeTextDocument.",
      `(${this.#viewType}, ${event.document.uri.toString()})`,
    );
    const panel = this.#store.panelByUri(event.document.uri);
    if (panel === undefined) {
      return;
    }
    this.#change(event.document, panel);
  }

  private onDidCloseTextDocument(document: vscode.TextDocument): void {
    if (document.languageId !== LANGUAGE_ID) {
      return;
    }
    console.log(
      "invoke WebviewMediator.onDidCloseTextDocument.",
      `(${this.#viewType}), ${document.uri.toString()})`,
    );
    const panel = this.#store.panelByUri(document.uri);
    if (panel === undefined) {
      return;
    }
    this.removeAndDisposePanel(document.uri, panel);
  }

  private onDidRenameFiles(event: vscode.FileRenameEvent): void {
    console.log(`invoke WebviewMediator.onDidRenameFiles. (${this.#viewType})`);
    event.files.forEach((file) => {
      console.log(
        `File renamed from ${file.oldUri.toString()}`,
        `to ${file.newUri.toString()}`,
      );
      const panel = this.#store.panelByUri(file.oldUri);
      if (panel !== undefined) {
        this.removeAndDisposePanel(file.oldUri, panel);
      }
    });
  }

  private onDidChangeActiveColorTheme(event: vscode.ColorTheme): void {
    console.log("invoke WebviewMediator.onDidChangeActiveColorTheme.", event);
    this.#store.allPanels.forEach((panel) => {
      this.#deps.mountPanel(this.#context, panel, this.#viewType);
    });
  }

  private removeAndDisposePanel(
    uri: vscode.Uri,
    panel: vscode.WebviewPanel,
  ): void {
    this.#store.removeByUri(uri);
    panel.dispose();
  }
}
