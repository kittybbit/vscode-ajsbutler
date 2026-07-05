import * as vscode from "vscode";
import type { BuildSemanticDiffReport } from "../../application/semantic-diff/buildSemanticDiffReport";
import {
  COMPARE_SEMANTIC_DIFF_COMMAND,
  executeCompareSemanticDiffCommand,
} from "../../presentation/vscode/commands/semanticDiffCommand";

export type SemanticDiffWiringDeps = {
  buildSemanticDiffReport: BuildSemanticDiffReport;
};

export const createSemanticDiffSubscriptions = (
  deps: SemanticDiffWiringDeps,
): vscode.Disposable[] => [
  vscode.commands.registerCommand(COMPARE_SEMANTIC_DIFF_COMMAND, () =>
    executeCompareSemanticDiffCommand({
      getActiveEditor: () => vscode.window.activeTextEditor,
      showOpenDialog: (options) => vscode.window.showOpenDialog(options),
      showSaveDialog: (options) => vscode.window.showSaveDialog(options),
      showInformationMessage: (message, ...items) =>
        vscode.window.showInformationMessage(message, ...items),
      showErrorMessage: (message) => vscode.window.showErrorMessage(message),
      readFile: (uri) => vscode.workspace.fs.readFile(uri),
      writeFile: (uri, content) => vscode.workspace.fs.writeFile(uri, content),
      writeClipboard: (text) => vscode.env.clipboard.writeText(text),
      buildSemanticDiffReport: deps.buildSemanticDiffReport,
    }),
  ),
];
