import * as vscode from "vscode";

export type PreviewPanelFactory = {
  getPanel(document: vscode.TextDocument): vscode.WebviewPanel;
  getExistingPanel(
    document: vscode.TextDocument,
  ): vscode.WebviewPanel | undefined;
};

export type OpenPreviewCommandDependencies = {
  getActiveEditor: () => vscode.TextEditor | undefined;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
  mountPanel: (panel: vscode.WebviewPanel, viewType: string) => void;
  revealPanel: (panel: vscode.WebviewPanel) => boolean;
  onOpenStarted: (panel: vscode.WebviewPanel, viewType: string) => void;
  onOpenFailed: (viewType: string) => void;
  onPanelFailed: (panel: vscode.WebviewPanel) => void;
};

type ExecuteOpenPreviewCommandArgs = {
  viewType: string;
  panelFactory: PreviewPanelFactory;
  deps: OpenPreviewCommandDependencies;
};

type OpenPreviewDocumentArgs = {
  document: vscode.TextDocument;
  viewType: string;
  panelFactory: PreviewPanelFactory;
  deps: OpenPreviewCommandDependencies;
};

export const executeOpenPreviewCommand = ({
  viewType,
  panelFactory,
  deps,
}: ExecuteOpenPreviewCommandArgs): void => {
  const document = getActiveDocument(deps, viewType);
  if (document) {
    console.log(
      `invoke open.${viewType}. (${formatDocumentUriForLog(document)})`,
    );
    const existingPanel = getExistingPanel({
      document,
      panelFactory,
      deps,
      viewType,
    });
    if (existingPanel !== null) {
      if (existingPanel) {
        revealExistingPanel({ panel: existingPanel, viewType, deps });
      } else {
        createAndOpenPanel({ document, viewType, panelFactory, deps });
      }
    }
  }
};

const getActiveDocument = (
  deps: OpenPreviewCommandDependencies,
  viewType: string,
): vscode.TextDocument | undefined => {
  try {
    const activeEditor = deps.getActiveEditor();
    if (!activeEditor) {
      failToOpenViewer(deps, viewType, "No active editor found to open.");
      return undefined;
    }
    return activeEditor.document;
  } catch {
    failToOpenViewer(deps, viewType, "Active editor could not be accessed.");
    return undefined;
  }
};

const getExistingPanel = ({
  document,
  panelFactory,
  deps,
  viewType,
}: OpenPreviewDocumentArgs): vscode.WebviewPanel | undefined | null => {
  try {
    return panelFactory.getExistingPanel(document);
  } catch {
    failToOpenViewer(deps, viewType, "Viewer could not be opened.");
    return null;
  }
};

const revealExistingPanel = ({
  panel,
  viewType,
  deps,
}: {
  panel: vscode.WebviewPanel;
  viewType: string;
  deps: OpenPreviewCommandDependencies;
}): void => {
  if (deps.revealPanel(panel)) {
    deps.onOpenStarted(panel, viewType);
  } else {
    failToOpenViewer(deps, viewType, "Viewer could not be opened.");
  }
};

const mountAndRevealPanel = ({
  panel,
  viewType,
  deps,
}: {
  panel: vscode.WebviewPanel;
  viewType: string;
  deps: OpenPreviewCommandDependencies;
}): boolean => {
  try {
    deps.mountPanel(panel, viewType);
    return deps.revealPanel(panel);
  } catch {
    return false;
  }
};

const createAndOpenPanel = ({
  document,
  viewType,
  panelFactory,
  deps,
}: OpenPreviewDocumentArgs): void => {
  let panel: vscode.WebviewPanel;
  try {
    panel = panelFactory.getPanel(document);
  } catch {
    failToOpenViewer(deps, viewType, "Viewer could not be opened.");
    return;
  }

  deps.onOpenStarted(panel, viewType);
  if (!mountAndRevealPanel({ panel, viewType, deps })) {
    disposePanelAfterFailedMount(panel);
    deps.onPanelFailed(panel);
    showErrorMessageSafely(deps, "Viewer could not be opened.");
  }
};

const formatDocumentUriForLog = (document: vscode.TextDocument): string => {
  try {
    return document.uri.toString();
  } catch {
    return "unknown";
  }
};

const failToOpenViewer = (
  deps: OpenPreviewCommandDependencies,
  viewType: string,
  message: string,
): void => {
  deps.onOpenFailed(viewType);
  showErrorMessageSafely(deps, message);
};

const showErrorMessageSafely = (
  deps: OpenPreviewCommandDependencies,
  message: string,
): void => {
  try {
    void Promise.resolve(deps.showErrorMessage(message)).catch(() => undefined);
  } catch {
    // A notification failure must not replace the command's host-safe outcome.
  }
};

const disposePanelAfterFailedMount = (panel: vscode.WebviewPanel): void => {
  try {
    panel.dispose();
  } catch {
    // A disposal failure must not expose the original host exception.
  }
};
