import * as vscode from "vscode";
import { v4 } from "uuid";

export function initReactPanel(
  panel: vscode.WebviewPanel,
  context: vscode.ExtensionContext,
  bundle: string,
  viewType: string,
): void {
  panel.webview.options = {
    enableScripts: true,
    localResourceRoots: [context.extensionUri],
  };
  panel.webview.html = _getHtmlForWebview(panel, context, bundle, viewType);
}

function _getHtmlForWebview(
  panel: vscode.WebviewPanel,
  context: vscode.ExtensionContext,
  bundle: string,
  viewType: string,
): string {
  const nonce = v4();

  return `
<!DOCTYPE html>
<html lang='${vscode.env.language}'>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1,shrink-to-fit=no'>
    <title>${panel.title}</title>
    <meta
        http-equiv='Content-Security-Policy'
        content="default-src 'none';
                frame-src ${panel.webview.cspSource} https://file+.vscode-resource.vscode-cdn.net/;
                img-src ${panel.webview.cspSource};
                script-src ${panel.webview.cspSource} 'nonce-${nonce}' 'wasm-unsafe-eval';
                style-src ${panel.webview.cspSource} 'unsafe-inline';
                child-src ${panel.webview.cspSource};
                ">
    <base href='${panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "/"))}'>
    <script nonce='${nonce}' src='./public/ReactEventBridge.js'></script>
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <input type="hidden" id="viewType" value="${viewType}" />
    <div id='root'></div>
    <script nonce=${nonce} src='${bundle}'></script>
</body>
</html>`;
}
