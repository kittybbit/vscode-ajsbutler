import {
  createViewerFlowPngSaveRequest,
  createViewerSaveRequest,
  FLOW_PNG_MIME_TYPE,
} from "../../viewerRequestMessages";
import type { ViewerResourceStateDto } from "../../viewerHostMessages";
import { unitInformationMessage } from "../unitInformationLocalization";
import { createFlowPng, type FlowPngExportResult } from "./flowPngExport";
import { createFlowSvg } from "./flowSvgExport";
import type { FlowSvgExport } from "./flowSvgExport";

type ExportStatusSetter = (message: string) => void;
type FlowSvgNode = Parameters<typeof createFlowSvg>[0][number];
type FlowSvgEdge = Parameters<typeof createFlowSvg>[1][number];
type FlowImageExportFeedback = Readonly<{
  language: string;
  setExportStatus: ExportStatusSetter;
}>;

export type FlowImageExportContext = FlowImageExportFeedback &
  Readonly<{
    nodes: readonly FlowSvgNode[];
    edges: readonly FlowSvgEdge[];
  }>;

export type FlowImageSaveContext = FlowImageExportContext &
  Readonly<{ mode: ViewerResourceStateDto["flowSaveMode"] }>;

const createSvgForAction = (
  context: FlowImageExportContext,
): FlowSvgExport | undefined => {
  context.setExportStatus("");
  const result = createFlowSvg(context.nodes, context.edges);
  if (result.status !== "available") {
    context.setExportStatus(
      unitInformationMessage("flow.svg.export.failed", context.language),
    );
    return undefined;
  }
  return result.image;
};

const showSvgActionError = (
  messageKey: "flow.svg.export.failed" | "flow.svg.copy.failed",
  { language, setExportStatus }: FlowImageExportFeedback,
): void => setExportStatus(unitInformationMessage(messageKey, language));

const showPngActionError = (
  messageKey:
    | "flow.png.copy.failed"
    | "flow.png.export.failed"
    | "flow.png.export.tooLarge",
  { language, setExportStatus }: FlowImageExportFeedback,
): void => setExportStatus(unitInformationMessage(messageKey, language));

export const reportFlowPngExportFailure = (
  feedback: FlowImageExportFeedback,
): void => showPngActionError("flow.png.export.failed", feedback);

const showPngResultError = (
  result: Extract<FlowPngExportResult, { status: "unavailable" }>,
  feedback: FlowImageExportFeedback,
): void =>
  showPngActionError(
    result.reason === "dimensions-limit" ||
      result.reason === "encoded-too-large"
      ? "flow.png.export.tooLarge"
      : "flow.png.export.failed",
    feedback,
  );

const saveSvgToDesktop = (
  svg: string,
  feedback: FlowImageExportFeedback,
): void => {
  try {
    window.vscode.postMessage(createViewerSaveRequest(svg));
  } catch {
    showSvgActionError("flow.svg.export.failed", feedback);
  }
};

const revokeDownloadUrl = (objectUrl: string | undefined): void => {
  if (objectUrl) URL.revokeObjectURL(objectUrl);
};

type FlowDownloadRequest = Readonly<{
  createBlob: () => Blob;
  filename: string;
  onFailure: () => void;
}>;

const downloadFlowBlob = ({
  createBlob,
  filename,
  onFailure,
}: FlowDownloadRequest): void => {
  let objectUrl: string | undefined;
  let anchor: HTMLAnchorElement | undefined;
  try {
    objectUrl = URL.createObjectURL(createBlob());
    anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    const downloadUrl = objectUrl;
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  } catch {
    revokeDownloadUrl(objectUrl);
    onFailure();
  } finally {
    anchor?.remove();
  }
};

const downloadSvg = (svg: string, feedback: FlowImageExportFeedback): void =>
  downloadFlowBlob({
    createBlob: () => new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
    filename: "ajs-flow.svg",
    onFailure: () => showSvgActionError("flow.svg.export.failed", feedback),
  });

const saveSvgForMode = (
  svg: FlowSvgExport,
  context: FlowImageSaveContext,
): void => {
  switch (context.mode) {
    case "dialog":
      saveSvgToDesktop(svg.svg, context);
      return;
    case "download":
      downloadSvg(svg.svg, context);
      return;
    default:
      return;
  }
};

export const saveFlowSvg = (context: FlowImageSaveContext): void => {
  const svg = createSvgForAction(context);
  if (svg) saveSvgForMode(svg, context);
};

type ClipboardWriteFeedback = Readonly<{
  write: Promise<void>;
  onSuccess: () => void;
  onFailure: () => void;
}>;

const reportClipboardWrite = ({
  write,
  onSuccess,
  onFailure,
}: ClipboardWriteFeedback): void => {
  void write.then(onSuccess).catch(onFailure);
};

const writeSvgToClipboard = (
  svg: string,
  context: FlowImageExportContext,
  clipboard: Clipboard,
): void => {
  try {
    reportClipboardWrite({
      write: clipboard.writeText(svg),
      onSuccess: () =>
        context.setExportStatus(
          unitInformationMessage("flow.svg.copy.success", context.language),
        ),
      onFailure: () => showSvgActionError("flow.svg.copy.failed", context),
    });
  } catch {
    showSvgActionError("flow.svg.copy.failed", context);
  }
};

export const copyFlowSvg = (context: FlowImageExportContext): void => {
  const clipboard = navigator.clipboard;
  context.setExportStatus("");
  if (typeof clipboard?.writeText !== "function") {
    context.setExportStatus(
      unitInformationMessage("flow.svg.copy.unavailable", context.language),
    );
    return;
  }
  const svg = createSvgForAction(context);
  if (svg) writeSvgToClipboard(svg.svg, context, clipboard);
};

const downloadPng = (blob: Blob, feedback: FlowImageExportFeedback): void =>
  downloadFlowBlob({
    createBlob: () => blob,
    filename: "ajs-flow.png",
    onFailure: () => showPngActionError("flow.png.export.failed", feedback),
  });

const savePngToDesktop = async (
  blob: Blob,
  context: FlowImageExportFeedback,
): Promise<void> => {
  try {
    const bytes = await blob.arrayBuffer();
    window.vscode.postMessage(createViewerFlowPngSaveRequest(bytes));
  } catch {
    showPngActionError("flow.png.export.failed", context);
  }
};

const savePngForMode = async (
  blob: Blob,
  context: FlowImageSaveContext,
): Promise<void> => {
  switch (context.mode) {
    case "dialog":
      await savePngToDesktop(blob, context);
      return;
    case "download":
      downloadPng(blob, context);
      return;
    default:
      showPngActionError("flow.png.export.failed", context);
  }
};

export const saveFlowPng = async (
  context: FlowImageSaveContext,
): Promise<void> => {
  const image = createSvgForAction(context);
  if (!image) return;
  const result = await createFlowPng({
    svg: image.svg,
    width: image.width,
    height: image.height,
  });
  if (result.status !== "available") {
    showPngResultError(result, context);
    return;
  }
  await savePngForMode(result.blob, context);
};

type PngRasterFailure = Extract<FlowPngExportResult, { status: "unavailable" }>;

type PngRasterization = Readonly<{
  blob: Promise<Blob>;
  getFailure: () => PngRasterFailure | undefined;
}>;

const canWritePng = (
  clipboard: Clipboard | undefined,
): clipboard is Clipboard =>
  typeof ClipboardItem !== "undefined" &&
  typeof clipboard?.write === "function";

const createPngRasterization = (image: FlowSvgExport): PngRasterization => {
  let failure: PngRasterFailure | undefined;
  const blob = createFlowPng({
    svg: image.svg,
    width: image.width,
    height: image.height,
  }).then((result) => {
    if (result.status === "available") return result.blob;
    failure = result;
    throw new Error("PNG rasterization failed.");
  });
  void blob.catch(() => undefined);
  return { blob, getFailure: () => failure };
};

const startPngClipboardWrite = (
  clipboard: Clipboard,
  rasterization: PngRasterization["blob"],
): Promise<void> => {
  try {
    return clipboard.write([
      new ClipboardItem({ [FLOW_PNG_MIME_TYPE]: rasterization }),
    ]);
  } catch (error) {
    return Promise.reject(error);
  }
};

const reportPngClipboardFailure = (
  rasterFailure: PngRasterFailure | undefined,
  context: FlowImageExportContext,
): void => {
  if (rasterFailure) showPngResultError(rasterFailure, context);
  else showPngActionError("flow.png.copy.failed", context);
};

const finishPngClipboardWrite = (
  rasterization: PngRasterization["blob"],
  complete: () => void,
): void => {
  void Promise.allSettled([rasterization]).then(complete);
};

export const copyFlowPng = (
  context: FlowImageExportContext,
  complete: () => void,
): void => {
  context.setExportStatus("");
  const clipboard = navigator.clipboard;
  if (!canWritePng(clipboard)) {
    context.setExportStatus(
      unitInformationMessage("flow.png.copy.unavailable", context.language),
    );
    complete();
    return;
  }
  const image = createSvgForAction(context);
  if (!image) {
    complete();
    return;
  }
  const rasterization = createPngRasterization(image);
  const write = startPngClipboardWrite(clipboard, rasterization.blob);
  void write
    .then(
      () =>
        context.setExportStatus(
          unitInformationMessage("flow.png.copy.success", context.language),
        ),
      () => reportPngClipboardFailure(rasterization.getFailure(), context),
    )
    .finally(() => finishPngClipboardWrite(rasterization.blob, complete));
};
