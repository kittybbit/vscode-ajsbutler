import * as vscode from "vscode";
import { buildUnitList } from "../../application/unit-list/buildUnitList";
import { CHANGE_DOCUMENT } from "../../shared/webviewEvents";

const postTableDocument = (
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
): void => {
  const result = buildUnitList(document.getText());
  panel.webview.postMessage({
    type: CHANGE_DOCUMENT,
    data: result.document,
  });
};

export const readyTableDocument = (
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
): void => {
  console.log(`post a message of ready. (${document.uri.toString()})`);
  postTableDocument(document, panel);
};

export function debouncedTableDocumentChangeFn(delay: number = 300) {
  const id: Map<string, NodeJS.Timeout> = new Map();
  return (document: vscode.TextDocument, panel: vscode.WebviewPanel) => {
    if (panel === undefined) {
      return;
    }
    const key = document.uri.toString();
    clearTimeout(id.get(key));
    id.set(
      key,
      setTimeout(() => {
        console.log(`post a message of changeDocument. ${key}:${id.get(key)}`);
        postTableDocument(document, panel);
      }, delay),
    );
  };
}
