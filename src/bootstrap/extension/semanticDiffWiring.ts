import * as vscode from "vscode";
import type { BuildSemanticDiffReportData } from "../../application/semantic-diff/buildSemanticDiffReportData";
import {
  COMPARE_SEMANTIC_DIFF_COMMAND,
  executeCompareSemanticDiffCommand,
} from "../../presentation/vscode/commands/semanticDiffCommand";
import {
  COPY_SEMANTIC_DIFF_MARKDOWN_COMMAND,
  SAVE_SEMANTIC_DIFF_OUTPUT_COMMAND,
  SEMANTIC_DIFF_REPORT_SCHEME,
  SemanticDiffReportDocumentProvider,
} from "../../presentation/vscode/semantic-diff/semanticDiffReportDocument";
import { presentSemanticDiffOutput } from "../../presentation/semantic-diff/semanticDiffOutput";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import { createOpenSemanticDiffExplorer } from "../../presentation/vscode/semantic-diff/semanticDiffExplorerPanel";
import type { SemanticDiffSourceCaptureFactory } from "../../application/semantic-diff/semanticDiffSourceCapture";
import { createSemanticDiffSourceHandleIdAllocator } from "../../application/parsing/AjsParserWithSourceIndexPort";
import { SemanticDiffExplorerContextRegistry } from "../../presentation/vscode/semantic-diff/semanticDiffExplorerRegistry";

export type SemanticDiffWiringDeps = {
  extensionContext: vscode.ExtensionContext;
  buildSemanticDiffReportData: BuildSemanticDiffReportData;
  beginSemanticDiffSourceCapture?: SemanticDiffSourceCaptureFactory;
};

export const createSemanticDiffSubscriptions = (
  deps: SemanticDiffWiringDeps,
): vscode.Disposable[] => {
  const contextRegistry = new SemanticDiffExplorerContextRegistry();
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
    showSaveDialog: (options) => vscode.window.showSaveDialog(options),
    writeFile: (uri, content) => vscode.workspace.fs.writeFile(uri, content),
  });

  const openExplorer = createOpenSemanticDiffExplorer({
    extensionContext: deps.extensionContext,
    showQuickPick: (items, options) =>
      vscode.window.showQuickPick(items, options),
    openReport: (output) => reportDocuments.openReport(output),
    presentOutput: presentSemanticDiffOutput,
    language: vscode.env.language,
    openTextDocument: (uri) => vscode.workspace.openTextDocument(uri),
    showTextDocument: (document, options) =>
      vscode.window.showTextDocument(document, options),
    contextRegistry,
  });

  return [
    vscode.workspace.registerTextDocumentContentProvider(
      SEMANTIC_DIFF_REPORT_SCHEME,
      reportDocuments,
    ),
    vscode.commands.registerCommand(COMPARE_SEMANTIC_DIFF_COMMAND, () =>
      executeCompareSemanticDiffCommand({
        getActiveEditor: () => vscode.window.activeTextEditor,
        showQuickPick: (items, options) =>
          vscode.window.showQuickPick(items, options),
        showOpenDialog: (options) => vscode.window.showOpenDialog(options),
        showErrorMessage: (message) => vscode.window.showErrorMessage(message),
        readFile: (uri) => vscode.workspace.fs.readFile(uri),
        openTextDocument: (uri) => vscode.workspace.openTextDocument(uri),
        openReport: (output) => reportDocuments.openReport(output),
        language: vscode.env.language,
        buildSemanticDiffReportData: deps.buildSemanticDiffReportData,
        buildSemanticDiffOutputContext,
        presentSemanticDiffOutput,
        openExplorer,
        beginSemanticDiffSourceCapture: deps.beginSemanticDiffSourceCapture,
        sourceHandleIdAllocator: createSemanticDiffSourceHandleIdAllocator(),
        registerSemanticDiffSourceCapture: (
          context,
          binding,
          sources,
          release,
        ) =>
          contextRegistry.registerSourceCapture(context, {
            binding,
            sources,
            release,
          }),
        unregisterSemanticDiffSourceCapture: (context) =>
          contextRegistry.unregisterSourceCapture(context),
      }),
    ),
    vscode.commands.registerCommand(
      COPY_SEMANTIC_DIFF_MARKDOWN_COMMAND,
      (uri?: vscode.Uri) => reportDocuments.copyReport(uri),
    ),
    vscode.commands.registerCommand(
      SAVE_SEMANTIC_DIFF_OUTPUT_COMMAND,
      (uri?: vscode.Uri) => reportDocuments.saveReport(uri),
    ),
    reportDocuments,
  ];
};
