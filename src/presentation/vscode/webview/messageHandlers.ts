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

type FlowImageSaveFormat = "svg" | "png";

type FlowImageSaveMessages = Readonly<{
  cancelled: "flow.svg.save.cancelled" | "flow.png.save.cancelled";
  sourceConflict:
    | "flow.svg.save.sourceConflict"
    | "flow.png.save.sourceConflict";
  extension: "flow.svg.save.extension" | "flow.png.save.extension";
  failed: "flow.svg.save.failed" | "flow.png.save.failed";
  complete: "flow.svg.save.complete" | "flow.png.save.complete";
}>;

const flowImageSaveMessages: Record<
  FlowImageSaveFormat,
  FlowImageSaveMessages
> = {
  svg: {
    cancelled: "flow.svg.save.cancelled",
    sourceConflict: "flow.svg.save.sourceConflict",
    extension: "flow.svg.save.extension",
    failed: "flow.svg.save.failed",
    complete: "flow.svg.save.complete",
  },
  png: {
    cancelled: "flow.png.save.cancelled",
    sourceConflict: "flow.png.save.sourceConflict",
    extension: "flow.png.save.extension",
    failed: "flow.png.save.failed",
    complete: "flow.png.save.complete",
  },
};

const flowImageSaveFilters = {
  svg: { "SVG image": ["svg"] },
  png: { "PNG image": ["png"] },
} satisfies Record<FlowImageSaveFormat, vscode.SaveDialogOptions["filters"]>;

const selectFlowImageSaveLocation = async (
  format: FlowImageSaveFormat,
): Promise<SaveLocationResult> => {
  try {
    const uri = await vscode.window.showSaveDialog({
      filters: flowImageSaveFilters[format],
    });
    return uri ? { kind: "selected", uri } : { kind: "cancelled" };
  } catch {
    showErrorMessageSafely(
      localizedMessage(flowImageSaveMessages[format].failed),
    );
    return { kind: "failed" };
  }
};

type FlowImageSaveRequest = Readonly<{
  location: SaveLocationResult;
  content: string | Uint8Array;
  format: FlowImageSaveFormat;
  sourceUri: vscode.Uri;
}>;

const getFlowImageDestinationError = (
  destination: vscode.Uri,
  sourceUri: vscode.Uri,
  format: FlowImageSaveFormat,
):
  | FlowImageSaveMessages["sourceConflict"]
  | FlowImageSaveMessages["extension"]
  | undefined => {
  const messages = flowImageSaveMessages[format];
  if (sameUri(destination, sourceUri)) return messages.sourceConflict;
  return destination.path.toLowerCase().endsWith(`.${format}`)
    ? undefined
    : messages.extension;
};

const writeFlowImageFile = (
  destination: vscode.Uri,
  content: FlowImageSaveRequest["content"],
  format: FlowImageSaveFormat,
): Promise<boolean> => {
  const errorMessage = localizedMessage(flowImageSaveMessages[format].failed);
  return typeof content === "string"
    ? writeSaveFile(destination, content, errorMessage)
    : writeBinarySaveFile(destination, content, errorMessage);
};

const saveFlowImageToDestination = async (
  request: FlowImageSaveRequest & { destination: vscode.Uri },
): Promise<boolean> => {
  const { content, format, sourceUri, destination } = request;
  const destinationError = getFlowImageDestinationError(
    destination,
    sourceUri,
    format,
  );
  if (destinationError) {
    showErrorMessageSafely(localizedMessage(destinationError));
    return false;
  }
  const saved = await writeFlowImageFile(destination, content, format);
  if (saved) {
    showInformationMessageSafely(
      localizedMessage(flowImageSaveMessages[format].complete),
      { detail: "", modal: false },
    );
  }
  return saved;
};

const saveFlowImage = async (
  request: FlowImageSaveRequest,
): Promise<boolean> => {
  const { location, format } = request;
  switch (location.kind) {
    case "cancelled":
      showInformationMessageSafely(
        localizedMessage(flowImageSaveMessages[format].cancelled),
        { detail: "", modal: false },
      );
      return false;
    case "failed":
      return false;
    case "selected":
      return saveFlowImageToDestination({
        ...request,
        destination: location.uri,
      });
  }
};

export const saveFlowSvgFile = async (
  content: string,
  sourceUri: vscode.Uri,
): Promise<boolean> =>
  saveFlowImage({
    location: await selectFlowImageSaveLocation("svg"),
    content,
    format: "svg",
    sourceUri,
  });

export const saveFlowPngFile = async (
  bytes: ArrayBuffer,
  sourceUri: vscode.Uri,
): Promise<boolean> =>
  saveFlowImage({
    location: await selectFlowImageSaveLocation("png"),
    content: new Uint8Array(bytes),
    format: "png",
    sourceUri,
  });

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

const writeBinarySaveFile = async (
  uri: vscode.Uri,
  content: Uint8Array,
  errorMessage = localizedMessage("flow.png.save.failed"),
): Promise<boolean> => {
  try {
    await vscode.workspace.fs.writeFile(uri, content);
    return true;
  } catch {
    showErrorMessageSafely(errorMessage);
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
