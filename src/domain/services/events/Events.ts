import * as vscode from 'vscode';
import * as os from 'os';
import { stringify } from 'flatted';
import { MyAppResource } from '../../../ui-component/editor/MyContexts';
import { parseAjs } from '../parser/AjsParser';

export type EventType = ResourceEventType | ReadyEventType | SaveEventType;
export type ResourceEventType = { type: string, data: MyAppResource };
export type ReadyEventType = { type: string };
export type SaveEventType = { type: string, data: string };

export const createData = (document: vscode.TextDocument) => {
    const result = parseAjs(document.getText());
    if (result.errors.length > 0) {
        vscode.window.showErrorMessage('Please check syntax.', { detail: `${result.errors.length} antlr error occurs.`, modal: true });
        return [];
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

export const resourceFn = (webviewPanel: vscode.WebviewPanel) => {
    return (e: ResourceEventType) => {
        console.log('invoke resource.');
        const data: MyAppResource = {
            ...e.data as MyAppResource,
            isDarkMode: vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark,
            lang: vscode.env.language,
            os: os.platform().toLocaleLowerCase(),
        };
        webviewPanel.webview.postMessage({
            type: 'resource',
            data: data,
        });
    }
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
export const save = (e: SaveEventType) => {
    console.log('invoke save.');
    vscode.window.showSaveDialog().then(uri => {
        if (uri) {
            vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(e.data as string));
            vscode.window.showInformationMessage('The file has been saved.', { detail: uri.toString(), modal: true });
        }
    });
};