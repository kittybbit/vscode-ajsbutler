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
  (collection: vscode.DiagnosticCollection) =>
  (document: vscode.TextDocument): void => {
    runForAjsDocument(document, "onDidOpenTextDocument", (targetDocument) => {
      updateDiagnostics(collection, targetDocument);
    });
  };

const createChangeDocumentListener =
  (collection: vscode.DiagnosticCollection) =>
  (event: vscode.TextDocumentChangeEvent): void => {
    runForAjsDocument(
      event.document,
      "onDidChangeTextDocument",
      (targetDocument) => {
        updateDiagnostics(collection, targetDocument);
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

export const registerDiagnostics = (): vscode.Disposable => {
  console.log("initialize Diagnostic.");
  const collection =
    vscode.languages.createDiagnosticCollection("vscode.ajsbutler");

  return vscode.Disposable.from(
    collection,
    vscode.workspace.onDidOpenTextDocument(
      createOpenDocumentListener(collection),
    ),
    vscode.workspace.onDidChangeTextDocument(
      createChangeDocumentListener(collection),
    ),
    vscode.workspace.onDidCloseTextDocument(
      createCloseDocumentListener(collection),
    ),
  );
};
