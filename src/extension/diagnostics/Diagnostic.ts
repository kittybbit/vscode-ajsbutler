import * as vscode from "vscode";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { LANGUAGE_ID } from "../constant";

export class Diagnostic {
  private diagnosticCollection =
    vscode.languages.createDiagnosticCollection("vscode.ajsbutler");

  private checkForErrors(document: vscode.TextDocument) {
    if (document.languageId !== LANGUAGE_ID) {
      return;
    }
    console.log(`invoke checkForErrors. (${document.uri.toString()})`);
    const result = parseAjs(document.getText());
    const diagnostics = result.errors.map((result) => {
      const startPos = new vscode.Position(
        result.line - 1,
        result.charPositionInLine,
      );
      const endPos = new vscode.Position(
        result.line - 1,
        result.charPositionInLine + 1,
      );
      const range = new vscode.Range(startPos, endPos);
      return new vscode.Diagnostic(
        range,
        result.msg,
        vscode.DiagnosticSeverity.Error,
      );
    });
    this.diagnosticCollection.set(document.uri, diagnostics);
  }

  private constructor() {
    console.log("invoke Diagnostic.constructor.");
  }

  public static init(context: vscode.ExtensionContext) {
    console.log("initialize Diagnostic.");
    const diagnostic = new Diagnostic();
    context.subscriptions.push(
      vscode.workspace.onDidOpenTextDocument((e: vscode.TextDocument) => {
        if (e.languageId !== LANGUAGE_ID) {
          return;
        }
        console.log(
          `invoke Diagnostic.onDidOpenTextDocument. (${e.uri.toString()})`,
        );
        diagnostic.checkForErrors(e);
      }),
      vscode.workspace.onDidChangeTextDocument(
        (e: vscode.TextDocumentChangeEvent) => {
          if (e.document.languageId !== LANGUAGE_ID) {
            return;
          }
          console.log(
            `invoke Diagnostic.onDidChangeTextDocument. (${e.document.uri.toString()})`,
          );
          diagnostic.checkForErrors(e.document);
        },
      ),
      vscode.workspace.onDidCloseTextDocument((e: vscode.TextDocument) => {
        if (e.languageId !== LANGUAGE_ID) {
          return;
        }
        console.log(
          `invoke Diagnostic.onDidCloseTextDocument. (${e.uri.toString()})`,
        );
        diagnostic.diagnosticCollection.delete(e.uri);
      }),
    );
  }
}
