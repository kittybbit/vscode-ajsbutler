import * as vscode from "vscode";
import {
  createViewerResourceStateMessage,
  type ViewerResourceStateDto,
} from "../../webview/viewerHostMessages";
import type { ViewerResourceRequestData } from "../../webview/viewerRequestMessages";

const RESOURCE_ERROR_MESSAGE = "Viewer resources could not be loaded.";
const SAVE_ERROR_MESSAGE = "The file could not be saved.";

type SaveLocationResult =
  | { kind: "selected"; uri: vscode.Uri }
  | { kind: "cancelled" }
  | { kind: "failed" };

const showErrorMessageSafely = (message: string): void => {
  try {
    void Promise.resolve(vscode.window.showErrorMessage(message)).catch(
      () => undefined,
    );
  } catch {
    // A notification failure must not replace the host-safe outcome.
  }
};

const showInformationMessageSafely = (
  message: string,
  options: vscode.MessageOptions,
): void => {
  try {
    void Promise.resolve(
      vscode.window.showInformationMessage(message, options),
    ).catch(() => undefined);
  } catch {
    // A notification failure must not replace the completed host operation.
  }
};

export const postResourceMessage = (
  requestedResource: ViewerResourceRequestData,
  panel: vscode.WebviewPanel,
): void => {
  console.log(`post a message of resource. (${panel.title})`);
  try {
    const data: ViewerResourceStateDto = {
      ...requestedResource,
      isDarkMode:
        vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark,
      lang: vscode.env.language,
    };
    void Promise.resolve(
      panel.webview.postMessage(createViewerResourceStateMessage(data)),
    ).catch(() => showErrorMessageSafely(RESOURCE_ERROR_MESSAGE));
  } catch {
    showErrorMessageSafely(RESOURCE_ERROR_MESSAGE);
  }
};

export const saveText = async (content: string): Promise<boolean> => {
  const location = await selectSaveLocation();
  switch (location.kind) {
    case "selected": {
      const saved = await writeSaveFile(location.uri, content);
      if (saved) showSaveComplete(location.uri);
      return saved;
    }
    case "cancelled":
      showErrorMessageSafely("The file has not been saved.");
      return false;
    case "failed":
      return false;
  }
};

const selectSaveLocation = async (): Promise<SaveLocationResult> => {
  try {
    const uri = await vscode.window.showSaveDialog();
    return uri ? { kind: "selected", uri } : { kind: "cancelled" };
  } catch {
    showErrorMessageSafely(SAVE_ERROR_MESSAGE);
    return { kind: "failed" };
  }
};

const writeSaveFile = async (
  uri: vscode.Uri,
  content: string,
): Promise<boolean> => {
  try {
    await vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(content));
    return true;
  } catch {
    showErrorMessageSafely(SAVE_ERROR_MESSAGE);
    return false;
  }
};

const showSaveComplete = (uri: vscode.Uri): void => {
  let detail: string;
  try {
    detail = uri.toString();
  } catch {
    detail = "";
  }
  showInformationMessageSafely("The file has been saved.", {
    detail,
    modal: true,
  });
};
