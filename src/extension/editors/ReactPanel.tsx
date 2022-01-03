import * as vscode from 'vscode';
import { v4 } from 'uuid';

export function initReactPanel(
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext,
    bundle: string): vscode.WebviewPanel {

    panel.webview.options = {
        enableScripts: true,
        localResourceRoots: [
            vscode.Uri.file(context.extensionPath)
        ]
    };
    panel.webview.html = _getHtmlForWebview(panel, context, bundle);

    return panel;
}

function _getHtmlForWebview(
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext,
    bundle: string): string {

    const nonce = v4();

    return `
<!DOCTYPE html>
<html lang="${vscode.env.language}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
    <title>${panel.title}</title>
    <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'none';
                img-src ${panel.webview.cspSource};
                script-src ${panel.webview.cspSource} 'nonce-${nonce}';
                style-src ${panel.webview.cspSource} 'unsafe-inline';
                child-src ${panel.webview.cspSource};
                ">
    <base href="${panel.webview.asWebviewUri(vscode.Uri.file(context.extensionPath))}/">
    <script nonce=${nonce} src="./public/ReactEventBridge.js"></script>
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script nonce=${nonce} src="${bundle}"> </script>
</body>
</html>`;
}
