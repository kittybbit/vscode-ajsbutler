import * as vscode from "vscode";
import type { BuildSyntaxDiagnostics } from "../../application/editor-feedback/buildSyntaxDiagnostics";
import { LANGUAGE_ID } from "../constant";

const toVsCodeDiagnostic = (
  diagnostic: ReturnType<BuildSyntaxDiagnostics>[number],
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
  buildSyntaxDiagnostics: BuildSyntaxDiagnostics,
  collection: vscode.DiagnosticCollection,
  document: vscode.TextDocument,
): void => {
  console.log(`invoke checkForErrors. (${document.uri.toString()})`);
  const diagnostics = buildSyntaxDiagnostics(document.getText()).map(
    toVsCodeDiagnostic,
  );
  collection.set(document.uri, diagnostics);
};

const isAjsDocument = (document: vscode.TextDocument): boolean =>
  document.languageId === LANGUAGE_ID;

const runForAjsDocument = (
  document: vscode.TextDocument,
  eventName: string,
  action: (document: vscode.TextDocument) => void,
): void => {
  if (!isAjsDocument(document)) {
    return;
  }

  console.log(`invoke Diagnostic.${eventName}. (${document.uri.toString()})`);
  action(document);
};

const createOpenDocumentListener =
  (
    buildSyntaxDiagnostics: BuildSyntaxDiagnostics,
    collection: vscode.DiagnosticCollection,
  ) =>
  (document: vscode.TextDocument): void => {
    runForAjsDocument(document, "onDidOpenTextDocument", (targetDocument) => {
      updateDiagnostics(buildSyntaxDiagnostics, collection, targetDocument);
    });
  };

const createChangeDocumentListener =
  (
    buildSyntaxDiagnostics: BuildSyntaxDiagnostics,
    collection: vscode.DiagnosticCollection,
  ) =>
  (event: vscode.TextDocumentChangeEvent): void => {
    runForAjsDocument(
      event.document,
      "onDidChangeTextDocument",
      (targetDocument) => {
        updateDiagnostics(buildSyntaxDiagnostics, collection, targetDocument);
      },
    );
  };

const createCloseDocumentListener =
  (collection: vscode.DiagnosticCollection) =>
  (document: vscode.TextDocument): void => {
    runForAjsDocument(document, "onDidCloseTextDocument", (targetDocument) => {
      collection.delete(targetDocument.uri);
    });
  };

export const registerDiagnostics = (
  buildSyntaxDiagnostics: BuildSyntaxDiagnostics,
): vscode.Disposable => {
  console.log("initialize Diagnostic.");
  const collection =
    vscode.languages.createDiagnosticCollection("vscode.ajsbutler");

  return vscode.Disposable.from(
    collection,
    vscode.workspace.onDidOpenTextDocument(
      createOpenDocumentListener(buildSyntaxDiagnostics, collection),
    ),
    vscode.workspace.onDidChangeTextDocument(
      createChangeDocumentListener(buildSyntaxDiagnostics, collection),
    ),
    vscode.workspace.onDidCloseTextDocument(
      createCloseDocumentListener(collection),
    ),
  );
};
