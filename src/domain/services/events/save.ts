import * as vscode from 'vscode';
import { SaveEventType } from './event.types';

export const save = (e: SaveEventType) => {
    console.log('invoke save.');
    vscode.window.showSaveDialog().then(uri => {
        if (uri) {
            vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(e.data as string));
            vscode.window.showInformationMessage('The file has been saved.', { detail: uri.toString(), modal: true });
        }
    });
};