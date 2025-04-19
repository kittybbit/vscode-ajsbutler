import * as vscode from "vscode";
import { stringify } from "flatted";
import { parseAjs } from "../parser/AjsParser";

const createData = (content: string) => {
  const result = parseAjs(content);
  if (result.errors.length > 0) {
    return undefined;
  }
  return stringify(result.rootUnits);
};

export function debounceCreateDataFn(delay: number = 300) {
  const id: Map<string, NodeJS.Timeout> = new Map();
  return (e: vscode.TextDocumentChangeEvent, panel: vscode.WebviewPanel) => {
    if (panel === undefined) {
      return;
    }
    const document = e.document;
    const key = document.uri.toString();
    clearTimeout(id.get(key));
    id.set(
      key,
      setTimeout(() => {
        console.log(`invoke change text document. ${key}:${id.get(key)}`);
        panel.webview.postMessage({
          type: "changeDocument",
          data: createData(getContent(document.uri)),
        });
      }, delay),
    );
  };
}

export const ready = (
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
) => {
  console.log("invoke ready.");
  panel.webview.postMessage({
    type: "changeDocument",
    data: createData(getContent(document.uri)),
  });
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
