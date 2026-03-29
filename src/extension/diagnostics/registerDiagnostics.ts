import * as vscode from "vscode";
import { buildSyntaxDiagnostics } from "../../application/editor-feedback/buildSyntaxDiagnostics";
import { LANGUAGE_ID } from "../constant";

const toVsCodeDiagnostic = (
  diagnostic: ReturnType<typeof buildSyntaxDiagnostics>[number],
): vscode.Diagnostic => {
  const startPos = new vscode.Position(diagnostic.line - 1, diagnostic.column);
  const endPos = new vscode.Position(
    diagnostic.line - 1,
    diagnostic.column + diagnostic.length,
  );
  const range = new vscode.Range(startPos, endPos);
  return new vscode.Diagnostic(
    range,
    diagnostic.message,
    vscode.DiagnosticSeverity.Error,
  );
};

const updateDiagnostics = (
  collection: vscode.DiagnosticCollection,
  document: vscode.TextDocument,
): void => {
  if (document.languageId !== LANGUAGE_ID) {
    return;
  }

  console.log(`invoke checkForErrors. (${document.uri.toString()})`);
  const diagnostics = buildSyntaxDiagnostics(document.getText()).map(
    toVsCodeDiagnostic,
  );
  collection.set(document.uri, diagnostics);
};

export const registerDiagnostics = (): vscode.Disposable => {
  console.log("initialize Diagnostic.");
  const collection =
    vscode.languages.createDiagnosticCollection("vscode.ajsbutler");

  return vscode.Disposable.from(
    collection,
    vscode.workspace.onDidOpenTextDocument((document) => {
      if (document.languageId !== LANGUAGE_ID) {
        return;
      }
      console.log(
        `invoke Diagnostic.onDidOpenTextDocument. (${document.uri.toString()})`,
      );
      updateDiagnostics(collection, document);
    }),
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.languageId !== LANGUAGE_ID) {
        return;
      }
      console.log(
        `invoke Diagnostic.onDidChangeTextDocument. (${event.document.uri.toString()})`,
      );
      updateDiagnostics(collection, event.document);
    }),
    vscode.workspace.onDidCloseTextDocument((document) => {
      if (document.languageId !== LANGUAGE_ID) {
        return;
      }
      console.log(
        `invoke Diagnostic.onDidCloseTextDocument. (${document.uri.toString()})`,
      );
      collection.delete(document.uri);
    }),
  );
};
