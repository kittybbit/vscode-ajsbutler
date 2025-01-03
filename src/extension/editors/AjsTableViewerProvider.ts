import * as vscode from 'vscode';
import { initReactPanel } from './ReactPanel';
import { debounceCreateDataFn, readyFn } from '../../domain/services/events/ready';
import { resourceFn } from '../../domain/services/events/resource';
import { save } from '../../domain/services/events/save';
import { EventType, ResourceEventType, SaveEventType } from '../../domain/services/events/event.types';

/**
 * Provider for JP1/AJS table viewr.
 */
export class AjsTableViewerProvider implements vscode.CustomTextEditorProvider {

    public static register(context: vscode.ExtensionContext) {
        console.info('registerd AjsTableViewerProvider');
        context.subscriptions.push(vscode.window.registerCustomEditorProvider(
            AjsTableViewerProvider.viewType,
            new AjsTableViewerProvider(context),
            {
                webviewOptions: { retainContextWhenHidden: true }
            })
        );
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

        const refreshWebview = () => {
            webviewPanel = initReactPanel(webviewPanel, this.context, './out/ajsTable/index.js');
        };

        const debounceCreateData = debounceCreateDataFn(document, webviewPanel, 500);

        // change event listener
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
            debounceCreateData(e);
        });
        const changeConfigurationSubscription = vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('workbench.colorTheme')) {
                refreshWebview();
            }
        });

        // message receiver
        const ready = readyFn(document, webviewPanel);
        const resource = resourceFn(webviewPanel);

        const onDidRecieveMessage = (e: EventType) => {
            switch (e.type) {
                case 'resource': {
                    resource(e as ResourceEventType);
                    break;
                }
                case 'ready': {// webview is ready.
                    ready();
                    break;
                }
                case 'save': {//save contents
                    save(e as SaveEventType);
                    break;
                }
            }
        };
        const recieveMessageSubscription = webviewPanel.webview.onDidReceiveMessage(onDidRecieveMessage);

        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
            changeConfigurationSubscription.dispose();
            recieveMessageSubscription.dispose();
            console.log('dispose AjsTableViewerProvider');
        });

        // initial display
        refreshWebview();
    }
}
