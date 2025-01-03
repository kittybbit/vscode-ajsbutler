import * as vscode from 'vscode';
import { stringify } from 'flatted';
import { parseAjs } from '../parser/AjsParser';

export const createData = (document: vscode.TextDocument) => {
    const result = parseAjs(document.getText());
    if (result.errors.length > 0) {
        return undefined;
    }
    return stringify(result.rootUnits)
};

export const debounceCreateDataFn = (document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, delay: number = 0) => {
    let id: NodeJS.Timeout;
    return (e: vscode.TextDocumentChangeEvent) => {
        if (e.document.uri.toString() === document.uri.toString()) {
            clearInterval(id);
            id = setTimeout(() => {
                console.log('invoke change text document.');
                webviewPanel.webview.postMessage({
                    type: 'changeDocument',
                    data: createData(document),
                });
            }, delay);
        }
    };
};

export const readyFn = (document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel) => {
    return () => {
        console.log('invoke ready.');
        webviewPanel.webview.postMessage({
            type: 'changeDocument',
            data: createData(document),
        });
    }
};