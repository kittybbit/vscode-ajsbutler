import * as os from "os";
import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import type { MyAppResource } from "../../shared/MyAppResource";
import { OPERATION } from "../../shared/webviewEvents";

export const postResourceMessage = (
  requestedResource: MyAppResource,
  panel: vscode.WebviewPanel,
): void => {
  console.log(`post a message of resource. (${panel.title})`);
  const data: MyAppResource = {
    ...requestedResource,
    isDarkMode:
      vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark,
    lang: vscode.env.language,
    os: os.platform().toLowerCase(),
  };
  panel.webview.postMessage({
    type: "resource",
    data,
  });
};

export const saveText = async (content: string): Promise<void> => {
  const uri = await vscode.window.showSaveDialog();
  if (!uri) {
    void vscode.window.showErrorMessage("The file has not been saved.");
    return;
  }

  await vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(content));
  void vscode.window.showInformationMessage("The file has been saved.", {
    detail: uri.toString(),
    modal: true,
  });
};

export const reportWebviewOperation = (
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
  telemetry: TelemetryPort,
  operation: string,
): void => {
  console.log(
    `post a message of operation. (${document.uri.toString()}, ${operation})`,
  );
  telemetry.trackEvent(OPERATION, {
    development: String(DEVELOPMENT),
    viewType: panel.viewType,
    operation,
  });
};
