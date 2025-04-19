import * as vscode from "vscode";
import { stringify } from "flatted";
import { parseAjs } from "../parser/AjsParser";

export const createData = (content: string) => {
  const result = parseAjs(content);
  if (result.errors.length > 0) {
    return undefined;
  }
  return stringify(result.rootUnits);
};

export function debounceCreateDataFn(
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
  delay: number = 300,
) {
  let id: NodeJS.Timeout;
  return (e: vscode.TextDocumentChangeEvent) => {
    if (e.document.uri.toString() === document.uri.toString()) {
      clearTimeout(id);
      id = setTimeout(() => {
        console.log("invoke change text document.");
        panel.webview.postMessage({
          type: "changeDocument",
          data: createData(getContent(document.uri)),
        });
      }, delay);
    }
  };
}

export const readyFn = (
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
) => {
  return () => {
    console.log("invoke ready.");
    panel.webview.postMessage({
      type: "changeDocument",
      data: createData(getContent(document.uri)),
    });
  };
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
