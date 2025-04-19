import * as vscode from "vscode";

import { toJsonData } from "../../models/converter";
import { CHANGE_DOCUMENT } from "./constant";

export const changeFn = (
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
) => {
  if (panel === undefined) {
    return;
  }
  const key = document.uri.toString();
  console.log(`post a message of changeDocument. ${key}`);
  panel.webview.postMessage({
    type: CHANGE_DOCUMENT,
    data: toJsonData(document.uri),
  });
};

export function debouncedChangeFn(delay: number = 300) {
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
        panel.webview.postMessage({
          type: CHANGE_DOCUMENT,
          data: toJsonData(document.uri),
        });
      }, delay),
    );
  };
}
