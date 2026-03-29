import * as vscode from "vscode";
import { buildUnitList } from "../../application/unit-list/buildUnitList";
import { CHANGE_DOCUMENT } from "../../shared/webviewEvents";

const postFlowDocument = (
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
): void => {
  const result = buildUnitList(document.getText());
  panel.webview.postMessage({
    type: CHANGE_DOCUMENT,
    data: result.document,
  });
};

export const readyFlowDocument = (
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
): void => {
  console.log(`post a message of ready. (${document.uri.toString()})`);
  postFlowDocument(document, panel);
};

export function debouncedFlowDocumentChangeFn(delay: number = 300) {
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
        postFlowDocument(document, panel);
      }, delay),
    );
  };
}
