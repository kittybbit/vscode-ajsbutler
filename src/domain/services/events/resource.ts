import * as vscode from 'vscode';
import * as os from 'os';
import { MyAppResource } from '../../../ui-component/editor/MyContexts';
import { ResourceEventType } from './event.types';

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