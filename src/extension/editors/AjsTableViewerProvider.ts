import * as vscode from 'vscode';
import * as os from 'os';
import fs from 'fs';
import { initReactPanel } from './ReactPanel';
import { parseAjs } from '../../domain/services/parser/AjsParser';
import { stringify } from 'flatted';
import { MyAppResource } from '../../component/editor/MyContexts';

/**
 * Provider for JP1/AJS table viewr.
 */
export class AjsTableViewerProvider implements vscode.CustomTextEditorProvider {

    public static register(context: vscode.ExtensionContext) {
        console.info('registerd AjsTableViewerProvider');
        const provider = new AjsTableViewerProvider(context);
        const disposable = vscode.window.registerCustomEditorProvider(AjsTableViewerProvider.viewType, provider);
        context.subscriptions.push(disposable);
        context.subscriptions.push(
            vscode.commands.registerCommand('ajsbutler.openTableViewer', () => {
                const uri = vscode.window.activeTextEditor?.document.uri;
                vscode.commands.executeCommand('vscode.openWith', uri, AjsTableViewerProvider.viewType, vscode.ViewColumn.Two);
            })
        );
    }

    private static readonly viewType = 'ajsbutler.tableViewer';

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        /* token: vscode.CancellationToken */
    ): Promise<void> {

        const context = this.context;

        const refreshWebview = () => {
            webviewPanel = initReactPanel(webviewPanel, context, './out/index.js');
        }

        const createData = () => stringify(parseAjs(document.getText()).filter(unit => unit.parent === undefined));
        const debounceCreateData = (delay: number = 0) => {
            let id: NodeJS.Timeout;
            return (e: vscode.TextDocumentChangeEvent) => {
                if (e.document.uri.toString() === document.uri.toString()) {
                    clearInterval(id);
                    id = setTimeout(() => {
                        console.log('invoke change text document.');
                        webviewPanel.webview.postMessage({
                            type: 'changeDocument',
                            data: createData(),
                        });
                    }, delay);
                }
            };
        };

        // change event listener
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(debounceCreateData(500));
        const changeConfigurationSubscription = vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('workbench.colorTheme')) {
                refreshWebview();
            }
        })
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
            changeConfigurationSubscription.dispose();
        });

        // message receiver
        webviewPanel.webview.onDidReceiveMessage(e => {
            switch (e.type) {
                case 'resource': {
                    console.log('invoke resource.');
                    const data: MyAppResource = {
                        ...e.data,
                        isDarkMode: vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark,
                        lang: vscode.env.language,
                        os: os.platform(),
                    };
                    webviewPanel.webview.postMessage({
                        type: 'resource',
                        data: data,
                    });
                    break;
                }
                case 'ready': {// webview is ready.
                    console.log('invoke ready.');
                    webviewPanel.webview.postMessage({
                        type: 'changeDocument',
                        data: createData(),
                    });
                    break;
                }
                case 'save': {//save contents
                    console.log('invoke save.');
                    vscode.window.showSaveDialog().then(uri => {
                        if (uri) {
                            fs.writeFileSync(uri.fsPath, e.data);
                            vscode.window.showInformationMessage('The file has been saved.', { modal: true });
                        }
                    });
                    break;
                }
            }
        });

        // initial display
        refreshWebview();
    }
}
