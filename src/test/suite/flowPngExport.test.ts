import * as assert from "assert";
import {
  createFlowPng,
  getFlowPngDimensions,
  type FlowPngRasterPlatform,
} from "../../presentation/webview/editor/ajsFlow/flowPngExport";

const createRasterPlatform = (
  options: {
    decode?: () => Promise<void>;
    blob?: Blob | null;
  } = {},
) => {
  const observations = {
    createdUrlFrom: undefined as Blob | undefined,
    revokedUrls: [] as string[],
    drawnDimensions: undefined as number[] | undefined,
    releasedCanvasDimensions: undefined as number[] | undefined,
  };
  const image = {
    src: "",
    naturalWidth: 200,
    naturalHeight: 100,
    decode: options.decode ?? (() => Promise.resolve()),
  } as HTMLImageElement;
  const context = {
    drawImage: (_image: HTMLImageElement, ...dimensions: number[]) => {
      observations.drawnDimensions = dimensions;
    },
  } as unknown as CanvasRenderingContext2D;
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => context,
    toBlob: (callback: BlobCallback) =>
      callback(
        options.blob === undefined
          ? new Blob(["encoded"], { type: "image/png" })
          : options.blob,
      ),
  } as unknown as HTMLCanvasElement;
  const platform: FlowPngRasterPlatform = {
    createImage: () => image,
    createCanvas: () => canvas,
    createObjectURL: (blob) => {
      observations.createdUrlFrom = blob;
      return "blob:flow-image";
    },
    revokeObjectURL: (url) => observations.revokedUrls.push(url),
  };
  return {
    platform,
    observations,
    image,
    canvas,
  };
};

suite("Flow PNG export", () => {
  test("rounds dimensions and enforces both side and area limits", () => {
    assert.deepStrictEqual(getFlowPngDimensions(12.1, 9.2), {
      status: "dimensions",
      dimensions: { width: 13, height: 10 },
    });
    assert.deepStrictEqual(getFlowPngDimensions(8192, 2048), {
      status: "dimensions",
      dimensions: { width: 8192, height: 2048 },
    });
    assert.deepStrictEqual(getFlowPngDimensions(8193, 1), {
      status: "unavailable",
      reason: "dimensions-limit",
    });
    assert.deepStrictEqual(getFlowPngDimensions(4096, 4097), {
      status: "unavailable",
      reason: "dimensions-limit",
    });
    for (const [width, height] of [
      [0, 10],
      [-1, 10],
      [Number.NaN, 10],
      [10, Number.POSITIVE_INFINITY],
    ]) {
      assert.deepStrictEqual(getFlowPngDimensions(width, height), {
        status: "unavailable",
        reason: "invalid-geometry",
      });
    }
  });

  test("rasterizes the SVG at its padded dimensions and releases resources", async () => {
    const { platform, observations, image, canvas } = createRasterPlatform();
    const result = await createFlowPng({
      svg: "<svg/>",
      width: 250,
      height: 125,
      platform,
    });

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.deepStrictEqual(result.dimensions, { width: 250, height: 125 });
    assert.strictEqual(result.blob.type, "image/png");
    assert.strictEqual(
      observations.createdUrlFrom?.type,
      "image/svg+xml;charset=utf-8",
    );
    assert.deepStrictEqual(observations.drawnDimensions, [0, 0, 250, 125]);
    assert.strictEqual(image.src, "");
    assert.deepStrictEqual([canvas.width, canvas.height], [0, 0]);
    assert.deepStrictEqual(observations.revokedUrls, ["blob:flow-image"]);
  });

  test("does not allocate a canvas for invalid or oversized geometry", async () => {
    const { platform } = createRasterPlatform();
    const result = await createFlowPng({
      svg: "<svg/>",
      width: 8193,
      height: 1,
      platform,
    });
    assert.deepStrictEqual(result, {
      status: "unavailable",
      reason: "dimensions-limit",
    });
  });

  test("cleans up after decode, encode, and output-size failures", async () => {
    const decodeFailure = createRasterPlatform({
      decode: () => Promise.reject(new Error("decode failed")),
    });
    assert.deepStrictEqual(
      await createFlowPng({
        svg: "<svg/>",
        width: 20,
        height: 10,
        platform: decodeFailure.platform,
      }),
      { status: "unavailable", reason: "rasterization-failed" },
    );
    assert.strictEqual(decodeFailure.image.src, "");
    assert.deepStrictEqual(decodeFailure.observations.revokedUrls, [
      "blob:flow-image",
    ]);

    const encodeFailure = createRasterPlatform({ blob: null });
    assert.deepStrictEqual(
      await createFlowPng({
        svg: "<svg/>",
        width: 20,
        height: 10,
        platform: encodeFailure.platform,
      }),
      { status: "unavailable", reason: "rasterization-failed" },
    );
    assert.deepStrictEqual(encodeFailure.observations.revokedUrls, [
      "blob:flow-image",
    ]);

    const oversized = createRasterPlatform({
      blob: { type: "image/png", size: 32 * 1024 * 1024 + 1 } as Blob,
    });
    assert.deepStrictEqual(
      await createFlowPng({
        svg: "<svg/>",
        width: 20,
        height: 10,
        platform: oversized.platform,
      }),
      { status: "unavailable", reason: "encoded-too-large" },
    );
    assert.deepStrictEqual(oversized.observations.revokedUrls, [
      "blob:flow-image",
    ]);
  });
});
