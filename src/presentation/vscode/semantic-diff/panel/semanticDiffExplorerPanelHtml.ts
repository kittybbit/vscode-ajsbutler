import * as vscode from "vscode";
import { v4 as uuid } from "uuid";
import type {
  SemanticDiffExplorerActionId,
  SemanticDiffExplorerSessionId,
} from "../../../../application/semantic-diff/semanticDiffExplorer";
import { SEMANTIC_DIFF_EXPLORER_BUNDLE_SRC } from "./semanticDiffExplorerConstants";

type ExplorerHtmlOptions = Readonly<{
  context: vscode.ExtensionContext;
  panel: vscode.WebviewPanel;
  sessionId: SemanticDiffExplorerSessionId;
  outputActionId: SemanticDiffExplorerActionId;
}>;

const htmlEscape = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

export const buildSemanticDiffExplorerHtml = (
  options: ExplorerHtmlOptions,
): string => {
  const { context, panel, sessionId, outputActionId } = options;
  const nonce = uuid();
  const bundleUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(
      context.extensionUri,
      SEMANTIC_DIFF_EXPLORER_BUNDLE_SRC,
    ),
  );
  const title = htmlEscape(panel.title);
  const session = htmlEscape(sessionId);
  const actionId = htmlEscape(outputActionId);
  return `<!DOCTYPE html>
<html lang="${htmlEscape(vscode.env.language)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${panel.webview.cspSource} 'nonce-${nonce}'; style-src ${panel.webview.cspSource} 'unsafe-inline';">
<style>
html,body,#root{width:100%;height:100%;margin:0;padding:0}body{box-sizing:border-box;font-family:var(--vscode-font-family, sans-serif)}*,*:before,*:after{box-sizing:inherit}
</style>
</head>
<body data-semantic-diff-session-id="${session}" data-semantic-diff-output-action-id="${actionId}">
<div id="root"></div>
<script nonce="${nonce}" src="${bundleUri}"></script>
</body>
</html>`;
};
