import * as vscode from 'vscode';
import * as os from 'os';
import { initReactPanel } from './ReactPanel';
import { parseAjs } from '../../domain/services/parser/AjsParser';
import { stringify } from 'flatted';
import { MyAppResource } from '../../ui-component/editor/MyContexts';

type EventType = ResourceEventType | ReadyEventType | SaveEventType;
type ResourceEventType = { type: string, data: MyAppResource };
type ReadyEventType = { type: string };
type SaveEventType = { type: string, data: string };

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

        const createData = () => {
            const result = parseAjs(document.getText());
            if (result.errors.length > 0) {
                vscode.window.showErrorMessage('Please check syntax.', { detail: `${result.errors.length} antlr error occurs.`, modal: true });
                return [];
            }
            return stringify(result.units.filter(unit => unit.parent === undefined))
        };
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
        const resourceFn = (e: ResourceEventType) => {
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
        };
        const readyFn = () => {
            console.log('invoke ready.');
            webviewPanel.webview.postMessage({
                type: 'changeDocument',
                data: createData(),
            });
        };
        const saveFn = (e: SaveEventType) => {
            console.log('invoke save.');
            vscode.window.showSaveDialog().then(uri => {
                if (uri) {
                    vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(e.data as string));
                    vscode.window.showInformationMessage('The file has been saved.', { detail: uri.toString(), modal: true });
                }
            });
        };
        const onDidRecieveMessage = (e: EventType) => {
            switch (e.type) {
                case 'resource': {
                    resourceFn(e as ResourceEventType);
                    break;
                }
                case 'ready': {// webview is ready.
                    readyFn();
                    break;
                }
                case 'save': {//save contents
                    saveFn(e as SaveEventType);
                    break;
                }
            }
        };
        webviewPanel.webview.onDidReceiveMessage(onDidRecieveMessage);

        // initial display
        refreshWebview();
    }
}
