import * as vscode from "vscode";
import { parseAjs } from "../../domain/services/parser/AjsParser";

export class Diagnostic {
  private diagnosticCollection =
    vscode.languages.createDiagnosticCollection("vscode.ajsbutler");

  private checkForErrors(document: vscode.TextDocument) {
    if (document.languageId !== "jp1ajs") {
      return;
    }
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

  public static init(context: vscode.ExtensionContext) {
    console.info("initialize Diagnostic.");
    const diagnostic = new Diagnostic();
    context.subscriptions.push(
      vscode.workspace.onDidOpenTextDocument(diagnostic.checkForErrors),
    );
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument((event) =>
        diagnostic.checkForErrors(event.document),
      ),
    );
    context.subscriptions.push(
      vscode.workspace.onDidCloseTextDocument((doc) =>
        diagnostic.diagnosticCollection.delete(doc.uri),
      ),
    );
  }
}
