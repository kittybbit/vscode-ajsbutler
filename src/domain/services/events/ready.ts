import * as vscode from "vscode";
import { CHANGE_DOCUMENT } from "./constant";
import { toJsonData } from "../../models/converter";

export const ready = (
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
) => {
  console.log(`post a message of ready. (${document.uri.toString()})`);
  panel.webview.postMessage({
    type: CHANGE_DOCUMENT,
    data: toJsonData(document.uri),
  });
};
