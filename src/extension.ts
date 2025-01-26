// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AjsTableViewerProvider } from './extension/editors/AjsTableViewerProvider';
import { Ajs3v12HoverProvider } from './extension/languages/Ajs3v12HoberProvider';
import { AjsFlowViewerProvider } from './extension/editors/AjsFlowViewerProvider';
import { Diagnostic } from './extension/diagnostics/Diagnostic';
import { Extension } from './extension/Extension';
import { Telemetry } from './extension/Constants';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.info('"vscode-ajsbutler" is now active.');
	const reporter = Extension.init(context);
	Diagnostic.init();
	Ajs3v12HoverProvider.register(context);
	AjsTableViewerProvider.register(context);
	AjsFlowViewerProvider.register(context);
	reporter.sendTelemetryEvent(Telemetry.ExtensionActivate, { development: String(DEVELOPMENT) });
}

// this method is called when your extension is deactivated
export function deactivate(): void {
	const reporter = Extension.reporter;
	if (reporter) {
		reporter.sendTelemetryEvent(Telemetry.ExtensionDeactivate, { development: String(DEVELOPMENT) });
		reporter.dispose();
	}
	console.info('"vscode-ajsbutler" is deactive.')
}
