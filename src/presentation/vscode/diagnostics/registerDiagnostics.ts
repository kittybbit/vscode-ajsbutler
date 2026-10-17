import * as vscode from "vscode";
import type { DiagnoseAjsDefinition } from "../../../application/editor-feedback/diagnoseAjsDefinition";
import type { SyntaxDiagnosticDto } from "../../../application/editor-feedback/syntaxDiagnosticTypes";
import { LANGUAGE_ID } from "../constant";

const toVsCodeDiagnostic = (
  diagnostic: SyntaxDiagnosticDto,
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

export const updateDiagnostics = (
  diagnoseAjsDefinition: DiagnoseAjsDefinition,
  collection: vscode.DiagnosticCollection,
  document: vscode.TextDocument,
): void => {
  console.log(`invoke checkForErrors. (${document.uri.toString()})`);
  const syntaxDiagnostics = diagnoseAjsDefinition(document.getText());
  collection.set(document.uri, syntaxDiagnostics.map(toVsCodeDiagnostic));
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
    diagnoseAjsDefinition: DiagnoseAjsDefinition,
    collection: vscode.DiagnosticCollection,
  ) =>
  (document: vscode.TextDocument): void => {
    runForAjsDocument(document, "onDidOpenTextDocument", (targetDocument) => {
      updateDiagnostics(diagnoseAjsDefinition, collection, targetDocument);
    });
  };

const createChangeDocumentListener =
  (
    diagnoseAjsDefinition: DiagnoseAjsDefinition,
    collection: vscode.DiagnosticCollection,
  ) =>
  (event: vscode.TextDocumentChangeEvent): void => {
    runForAjsDocument(
      event.document,
      "onDidChangeTextDocument",
      (targetDocument) => {
        updateDiagnostics(diagnoseAjsDefinition, collection, targetDocument);
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
  diagnoseAjsDefinition: DiagnoseAjsDefinition,
): vscode.Disposable => {
  console.log("initialize Diagnostic.");
  const collection =
    vscode.languages.createDiagnosticCollection("vscode.ajsbutler");

  return vscode.Disposable.from(
    collection,
    vscode.workspace.onDidOpenTextDocument(
      createOpenDocumentListener(diagnoseAjsDefinition, collection),
    ),
    vscode.workspace.onDidChangeTextDocument(
      createChangeDocumentListener(diagnoseAjsDefinition, collection),
    ),
    vscode.workspace.onDidCloseTextDocument(
      createCloseDocumentListener(collection),
    ),
  );
};
