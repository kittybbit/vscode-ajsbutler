import * as vscode from "vscode";
import {
  createViewerResourceStateMessage,
  type ViewerResourceStateDto,
} from "../../webview/viewerHostMessages";
import type { ViewerResourceRequestData } from "../../webview/viewerRequestMessages";
import { AJS_FLOW_VIEWER_TYPE } from "./constant";
import { en } from "../../../resource/i18n/message_en";
import { ja } from "../../../resource/i18n/message_ja";

const RESOURCE_ERROR_MESSAGE = "Viewer resources could not be loaded.";
const SAVE_ERROR_MESSAGE = "The file could not be saved.";

const getSaveModeForUiKind = (
  uiKind: vscode.UIKind,
): ViewerResourceStateDto["flowSaveMode"] =>
  uiKind === vscode.UIKind.Web ? "download" : "dialog";

const getFlowSaveMode = (
  panel: vscode.WebviewPanel,
): ViewerResourceStateDto["flowSaveMode"] =>
  panel.viewType === AJS_FLOW_VIEWER_TYPE
    ? getSaveModeForUiKind(vscode.env.uiKind)
    : undefined;

const createViewerResourceState = (
  requestedResource: ViewerResourceRequestData,
  panel: vscode.WebviewPanel,
): ViewerResourceStateDto => {
  const flowSaveMode = getFlowSaveMode(panel);
  return {
    ...requestedResource,
    isDarkMode:
      vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark,
    lang: vscode.env.language,
    ...(flowSaveMode === undefined ? {} : { flowSaveMode }),
  };
};

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
    const data = createViewerResourceState(requestedResource, panel);
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

const localizedMessage = (key: keyof typeof en): string =>
  vscode.env.language.toLowerCase().startsWith("ja") ? ja[key] : en[key];

const normalizeFilePath = (path: string): string => {
  return path.replace(/\\/g, "/").normalize("NFC").toLowerCase();
};

const normalizeFileUriPath = (uri: vscode.Uri): string => {
  const root = uri.with({ path: "/", query: "", fragment: "" });
  const normalized = vscode.Uri.joinPath(
    root,
    ...uri.path.split("/").filter((segment) => segment.length > 0),
  );
  return normalizeFilePath(normalized.path);
};

const sameUri = (left: vscode.Uri, right: vscode.Uri): boolean => {
  if (left.scheme.toLowerCase() !== right.scheme.toLowerCase()) return false;
  if (left.scheme.toLowerCase() === "file") {
    return sameFileUri(left, right);
  }
  return sameProviderUri(left, right);
};

const sameFileUri = (left: vscode.Uri, right: vscode.Uri): boolean =>
  left.authority.normalize("NFC").toLowerCase() ===
    right.authority.normalize("NFC").toLowerCase() &&
  normalizeFileUriPath(left) === normalizeFileUriPath(right);

const sameProviderUri = (left: vscode.Uri, right: vscode.Uri): boolean =>
  [
    left.authority.normalize("NFC") === right.authority.normalize("NFC"),
    left.path.normalize("NFC") === right.path.normalize("NFC"),
    left.query === right.query,
    left.fragment === right.fragment,
  ].every(Boolean);

const getSvgSaveDestinationError = (
  destination: vscode.Uri,
  sourceUri: vscode.Uri,
): "flow.svg.save.sourceConflict" | "flow.svg.save.extension" | undefined => {
  if (sameUri(destination, sourceUri)) return "flow.svg.save.sourceConflict";
  if (!/\.svg$/i.test(destination.path)) return "flow.svg.save.extension";
  return undefined;
};

const selectSvgSaveLocation = async (): Promise<SaveLocationResult> => {
  try {
    const uri = await vscode.window.showSaveDialog({
      filters: { "SVG image": ["svg"] },
    });
    return uri ? { kind: "selected", uri } : { kind: "cancelled" };
  } catch {
    showErrorMessageSafely(localizedMessage("flow.svg.save.failed"));
    return { kind: "failed" };
  }
};

export const saveSvg = async (
  content: string,
  sourceUri: vscode.Uri,
): Promise<boolean> =>
  saveSelectedSvg(await selectSvgSaveLocation(), content, sourceUri);

const saveSelectedSvg = async (
  location: SaveLocationResult,
  content: string,
  sourceUri: vscode.Uri,
): Promise<boolean> => {
  switch (location.kind) {
    case "cancelled":
      showInformationMessageSafely(
        localizedMessage("flow.svg.save.cancelled"),
        {
          detail: "",
          modal: false,
        },
      );
      return false;
    case "failed":
      return false;
    case "selected":
      return saveSvgToDestination(location.uri, content, sourceUri);
  }
};

const saveSvgToDestination = async (
  destination: vscode.Uri,
  content: string,
  sourceUri: vscode.Uri,
): Promise<boolean> => {
  const destinationError = getSvgSaveDestinationError(destination, sourceUri);
  if (destinationError) {
    showErrorMessageSafely(localizedMessage(destinationError));
    return false;
  }
  const saved = await writeSaveFile(
    destination,
    content,
    localizedMessage("flow.svg.save.failed"),
  );
  if (saved) showSvgSaveComplete();
  return saved;
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
  errorMessage = SAVE_ERROR_MESSAGE,
): Promise<boolean> => {
  try {
    await vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(content));
    return true;
  } catch {
    showErrorMessageSafely(errorMessage);
    return false;
  }
};

const showSvgSaveComplete = (): void =>
  showInformationMessageSafely(localizedMessage("flow.svg.save.complete"), {
    detail: "",
    modal: false,
  });

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
