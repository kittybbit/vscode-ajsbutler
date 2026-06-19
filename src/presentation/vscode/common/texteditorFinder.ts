import * as vscode from "vscode";

function find(
  predicate: (editor: vscode.TextEditor) => boolean,
): vscode.TextEditor | undefined {
  return vscode.window.visibleTextEditors.find(predicate);
}

export function findByUri(uri: vscode.Uri): vscode.TextEditor | undefined {
  return find((editor) => editor.document.uri.toString() === uri.toString());
}
