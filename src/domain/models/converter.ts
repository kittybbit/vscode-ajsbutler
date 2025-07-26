import * as vscode from "vscode";
import { stringify } from "flatted";
import { parseAjs } from "../services/parser/AjsParser";

export const toJsonData = (content: string | vscode.Uri) => {
  if (content instanceof vscode.Uri) {
    content = getContent(content);
  }
  const result = parseAjs(content);
  if (result.errors.length > 0) {
    return undefined;
  }
  return stringify(result.rootUnits);
};

const getContent = (uri: vscode.Uri) => {
  const editor = vscode.window.visibleTextEditors.find(
    (editor) => editor.document.uri.toString() === uri.toString(),
  );
  if (editor === undefined) {
    return "";
  }
  const content = editor.document.getText();
  return content;
};
