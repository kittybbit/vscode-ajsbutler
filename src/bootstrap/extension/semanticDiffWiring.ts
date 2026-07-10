import * as vscode from "vscode";
import type { BuildSemanticDiffReport } from "../../application/semantic-diff/buildSemanticDiffReport";
import {
  COMPARE_SEMANTIC_DIFF_COMMAND,
  executeCompareSemanticDiffCommand,
} from "../../presentation/vscode/commands/semanticDiffCommand";
import {
  COPY_SEMANTIC_DIFF_MARKDOWN_COMMAND,
  SEMANTIC_DIFF_REPORT_SCHEME,
  SemanticDiffReportDocumentProvider,
} from "../../presentation/vscode/semantic-diff/semanticDiffReportDocument";

export type SemanticDiffWiringDeps = {
  buildSemanticDiffReport: BuildSemanticDiffReport;
};

export const createSemanticDiffSubscriptions = (
  deps: SemanticDiffWiringDeps,
): vscode.Disposable[] => {
  const reportDocuments = new SemanticDiffReportDocumentProvider({
    openTextDocument: (uri) => vscode.workspace.openTextDocument(uri),
    showTextDocument: (document, options) =>
      vscode.window.showTextDocument(document, options),
    getActiveEditor: () => vscode.window.activeTextEditor,
    writeClipboard: (text) => vscode.env.clipboard.writeText(text),
    showInformationMessage: (message) =>
      vscode.window.showInformationMessage(message),
    showErrorMessage: (message) => vscode.window.showErrorMessage(message),
    createUri: (components) => vscode.Uri.from(components),
  });

  return [
    vscode.workspace.registerTextDocumentContentProvider(
      SEMANTIC_DIFF_REPORT_SCHEME,
      reportDocuments,
    ),
    vscode.commands.registerCommand(COMPARE_SEMANTIC_DIFF_COMMAND, () =>
      executeCompareSemanticDiffCommand({
        getActiveEditor: () => vscode.window.activeTextEditor,
        showOpenDialog: (options) => vscode.window.showOpenDialog(options),
        showErrorMessage: (message) => vscode.window.showErrorMessage(message),
        readFile: (uri) => vscode.workspace.fs.readFile(uri),
        openReport: (report) => reportDocuments.openReport(report),
        buildSemanticDiffReport: deps.buildSemanticDiffReport,
      }),
    ),
    vscode.commands.registerCommand(
      COPY_SEMANTIC_DIFF_MARKDOWN_COMMAND,
      (uri?: vscode.Uri) => reportDocuments.copyReport(uri),
    ),
  ];
};
