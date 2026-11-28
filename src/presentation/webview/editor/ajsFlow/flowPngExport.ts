import {
  FLOW_PNG_MAX_BYTES,
  FLOW_PNG_MAX_DIMENSION,
  FLOW_PNG_MAX_PIXELS,
} from "../../viewerRequestMessages";

export type FlowPngDimensions = Readonly<{
  width: number;
  height: number;
}>;

export type FlowPngDimensionResult =
  | Readonly<{ status: "dimensions"; dimensions: FlowPngDimensions }>
  | Readonly<{
      status: "unavailable";
      reason: "invalid-geometry" | "dimensions-limit";
    }>;

export type FlowPngExportResult =
  | Readonly<{ status: "available"; blob: Blob; dimensions: FlowPngDimensions }>
  | Readonly<{
      status: "unavailable";
      reason:
        | "invalid-geometry"
        | "dimensions-limit"
        | "rasterization-failed"
        | "encoded-too-large";
    }>;

export type FlowPngRasterPlatform = Readonly<{
  createImage: () => HTMLImageElement;
  createCanvas: () => HTMLCanvasElement;
  createObjectURL: (blob: Blob) => string;
  revokeObjectURL: (url: string) => void;
}>;

export type FlowPngExportRequest = Readonly<{
  svg: string;
  width: number;
  height: number;
  platform?: FlowPngRasterPlatform;
}>;

const browserRasterPlatform: FlowPngRasterPlatform = {
  createImage: () => new Image(),
  createCanvas: () => document.createElement("canvas"),
  createObjectURL: (blob) => URL.createObjectURL(blob),
  revokeObjectURL: (url) => URL.revokeObjectURL(url),
};

const isPositiveFiniteDimension = (value: number): boolean =>
  Number.isFinite(value) && value > 0;

const exceedsFlowPngLimits = (dimensions: FlowPngDimensions): boolean =>
  dimensions.width > FLOW_PNG_MAX_DIMENSION ||
  dimensions.height > FLOW_PNG_MAX_DIMENSION ||
  dimensions.width * dimensions.height > FLOW_PNG_MAX_PIXELS;

export const getFlowPngDimensions = (
  width: number,
  height: number,
): FlowPngDimensionResult => {
  if (
    [width, height].some((dimension) => !isPositiveFiniteDimension(dimension))
  ) {
    return { status: "unavailable", reason: "invalid-geometry" };
  }
  const dimensions = { width: Math.ceil(width), height: Math.ceil(height) };
  if (exceedsFlowPngLimits(dimensions)) {
    return { status: "unavailable", reason: "dimensions-limit" };
  }
  return { status: "dimensions", dimensions };
};

const encodePng = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("PNG encoding failed.")),
      "image/png",
    );
  });

type RasterResources = {
  image?: HTMLImageElement;
  canvas?: HTMLCanvasElement;
  objectUrl?: string;
};

type CreateEncodedPngInput = Readonly<{
  svg: string;
  dimensions: FlowPngDimensions;
  platform: FlowPngRasterPlatform;
  resources: RasterResources;
}>;

const hasDecodedImageDimensions = (image: HTMLImageElement): boolean =>
  isPositiveFiniteDimension(image.naturalWidth) &&
  isPositiveFiniteDimension(image.naturalHeight);

const getCanvasContext = (
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D => {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("PNG canvas context is unavailable.");
  return context;
};

const createEncodedPng = async ({
  svg,
  dimensions,
  platform,
  resources,
}: CreateEncodedPngInput): Promise<Blob> => {
  resources.objectUrl = platform.createObjectURL(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
  );
  resources.image = platform.createImage();
  resources.image.src = resources.objectUrl;
  await resources.image.decode();
  if (!hasDecodedImageDimensions(resources.image)) {
    throw new Error("SVG image has invalid dimensions.");
  }
  resources.canvas = platform.createCanvas();
  resources.canvas.width = dimensions.width;
  resources.canvas.height = dimensions.height;
  const context = getCanvasContext(resources.canvas);
  context.drawImage(resources.image, 0, 0, dimensions.width, dimensions.height);
  return encodePng(resources.canvas);
};

const safelyRelease = (release: () => void): void => {
  try {
    release();
  } catch {
    // Cleanup must not replace the rasterization result.
  }
};

const releaseIfPresent = <T>(
  resource: T | undefined,
  release: (resource: T) => void,
): void => {
  if (resource) safelyRelease(() => release(resource));
};

const releaseRasterResources = (
  resources: RasterResources,
  platform: FlowPngRasterPlatform,
): void => {
  releaseIfPresent(resources.image, (image) => (image.src = ""));
  releaseIfPresent(resources.canvas, (canvas) => {
    canvas.width = 0;
    canvas.height = 0;
  });
  releaseIfPresent(resources.objectUrl, (objectUrl) =>
    platform.revokeObjectURL(objectUrl),
  );
};

const createRasterResult = (
  blob: Blob,
  dimensions: FlowPngDimensions,
): FlowPngExportResult => {
  if (blob.size > FLOW_PNG_MAX_BYTES) {
    return { status: "unavailable", reason: "encoded-too-large" };
  }
  return blob.type === "image/png"
    ? { status: "available", blob, dimensions }
    : { status: "unavailable", reason: "rasterization-failed" };
};

const rasterizeFlowSvg = async (
  svg: string,
  dimensions: FlowPngDimensions,
  platform: FlowPngRasterPlatform,
): Promise<FlowPngExportResult> => {
  const resources: RasterResources = {};
  try {
    const blob = await createEncodedPng({
      svg,
      dimensions,
      platform,
      resources,
    });
    return createRasterResult(blob, dimensions);
  } catch {
    return { status: "unavailable", reason: "rasterization-failed" };
  } finally {
    releaseRasterResources(resources, platform);
  }
};

export const createFlowPng = async ({
  svg,
  width,
  height,
  platform = browserRasterPlatform,
}: FlowPngExportRequest): Promise<FlowPngExportResult> => {
  const dimensionResult = getFlowPngDimensions(width, height);
  if (dimensionResult.status !== "dimensions") return dimensionResult;
  const result = await rasterizeFlowSvg(
    svg,
    dimensionResult.dimensions,
    platform,
  );
  return result.status === "available"
    ? { ...result, dimensions: dimensionResult.dimensions }
    : result;
};
