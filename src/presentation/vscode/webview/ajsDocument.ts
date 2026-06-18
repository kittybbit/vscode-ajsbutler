import * as vscode from "vscode";
import type { BuildUnitList } from "../../../application/unit-list/buildUnitList";
import { CHANGE_DOCUMENT } from "../../../shared/webviewEvents";

const postAjsDocument = (
  buildUnitList: BuildUnitList,
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
): void => {
  const result = buildUnitList(document.getText());
  panel.webview.postMessage({
    type: CHANGE_DOCUMENT,
    data: result.document,
  });
};

export const createReadyAjsDocument =
  (buildUnitList: BuildUnitList) =>
  (document: vscode.TextDocument, panel: vscode.WebviewPanel): void => {
    console.log(`post a message of ready. (${document.uri.toString()})`);
    postAjsDocument(buildUnitList, document, panel);
  };

export function createDebouncedAjsDocumentChange(
  buildUnitList: BuildUnitList,
  delay: number = 300,
) {
  const id = new Map<string, ReturnType<typeof setTimeout>>();
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
        postAjsDocument(buildUnitList, document, panel);
      }, delay),
    );
  };
}
