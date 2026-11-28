import * as assert from "assert";
import {
  createViewerCsvExportRequest,
  createViewerDisplayAcknowledgementRequest,
  createViewerFlowPngSaveRequest,
  createViewerNavigationRequest,
  createViewerReadyRequest,
  createViewerResourceRequest,
  createViewerSaveRequest,
  createViewerSearchRequest,
  isInvalidViewerSaveRequest,
  isInvalidViewerFlowPngSaveRequest,
  parseViewerRequest,
  FLOW_PNG_MAX_BYTES,
  FLOW_PNG_SAVE,
  viewerRequestTypes,
  type ViewerRequest,
} from "../../presentation/webview/viewerRequestMessages";
import { assertPlainJsonValue } from "../support/plainJson";

const createEveryViewerRequest = (): ViewerRequest[] => [
  createViewerResourceRequest("table"),
  createViewerReadyRequest(),
  createViewerSaveRequest("csv"),
  createViewerNavigationRequest("flow", "/root/job"),
  createViewerSearchRequest("table"),
  createViewerCsvExportRequest(),
  createViewerDisplayAcknowledgementRequest("success"),
];

const createPngBytes = (): ArrayBuffer => {
  const bytes = new ArrayBuffer(33);
  const view = new DataView(bytes);
  [137, 80, 78, 71, 13, 10, 26, 10].forEach((value, index) =>
    view.setUint8(index, value),
  );
  view.setUint32(8, 13);
  [73, 72, 68, 82].forEach((value, index) => view.setUint8(12 + index, value));
  view.setUint32(16, 1);
  view.setUint32(20, 1);
  view.setUint8(24, 8);
  view.setUint8(25, 6);
  return bytes;
};

suite("Viewer request messages", () => {
  test("round-trips the exact functional and completion protocol", () => {
    const requests = createEveryViewerRequest();

    assert.deepStrictEqual(
      requests.map(({ type }) => type),
      [...viewerRequestTypes.filter((type) => type !== FLOW_PNG_SAVE)],
    );
    for (const request of requests) {
      assertPlainJsonValue(request);
      const restored = JSON.parse(JSON.stringify(request)) as unknown;
      assert.deepStrictEqual(restored, request);
      assert.deepStrictEqual(parseViewerRequest(restored), request);
    }
  });

  test("validates the bounded binary PNG save boundary", () => {
    const request = createViewerFlowPngSaveRequest(createPngBytes());
    assert.deepStrictEqual(parseViewerRequest(request), request);
    assert.strictEqual(isInvalidViewerFlowPngSaveRequest(request), false);
    assert.strictEqual(
      isInvalidViewerFlowPngSaveRequest({
        type: FLOW_PNG_SAVE,
        data: { bytes: "not binary" },
      }),
      true,
    );
    assert.strictEqual(
      parseViewerRequest({
        type: FLOW_PNG_SAVE,
        data: { bytes: createPngBytes(), destination: "/private/file.png" },
      }),
      undefined,
    );
    for (const bytes of [
      new ArrayBuffer(32),
      new ArrayBuffer(33),
      "not binary",
    ]) {
      assert.strictEqual(
        parseViewerRequest({ type: FLOW_PNG_SAVE, data: { bytes } }),
        undefined,
      );
    }
    const oversizedDimensions = createPngBytes();
    new DataView(oversizedDimensions).setUint32(16, 8193);
    assert.strictEqual(
      parseViewerRequest(createViewerFlowPngSaveRequest(oversizedDimensions)),
      undefined,
    );
  });

  test("validates original PNG byte ranges before copying them", () => {
    const bytes = createPngBytes();
    const directRequest = createViewerFlowPngSaveRequest(bytes);
    const directResult = parseViewerRequest(directRequest);
    assert.ok(directResult?.type === FLOW_PNG_SAVE);
    assert.strictEqual(directResult.data.bytes, bytes);

    const prefixLength = 5;
    const suffixLength = 7;
    const enclosing = new Uint8Array(
      prefixLength + bytes.byteLength + suffixLength,
    );
    enclosing.fill(0xff);
    enclosing.set(new Uint8Array(bytes), prefixLength);
    const offsetView = enclosing.subarray(
      prefixLength,
      prefixLength + bytes.byteLength,
    );
    const offsetResult = parseViewerRequest({
      type: FLOW_PNG_SAVE,
      data: { bytes: offsetView },
    });
    assert.ok(offsetResult?.type === FLOW_PNG_SAVE);
    assert.strictEqual(offsetResult.data.bytes.byteLength, bytes.byteLength);
    assert.deepStrictEqual(
      new Uint8Array(offsetResult.data.bytes),
      new Uint8Array(bytes),
    );
    assert.notStrictEqual(offsetResult.data.bytes, enclosing.buffer);

    const oversizedBuffer = new ArrayBuffer(FLOW_PNG_MAX_BYTES + 1);
    let sliceCalls = 0;
    Object.defineProperty(oversizedBuffer, "slice", {
      value: () => {
        sliceCalls += 1;
        throw new Error("oversized PNG data must not be copied");
      },
    });
    const oversizedView = new Uint8Array(oversizedBuffer);
    for (const oversizedBytes of [oversizedBuffer, oversizedView]) {
      const oversizedRequest = {
        type: FLOW_PNG_SAVE,
        data: { bytes: oversizedBytes },
      };
      assert.strictEqual(parseViewerRequest(oversizedRequest), undefined);
      assert.strictEqual(
        isInvalidViewerFlowPngSaveRequest(oversizedRequest),
        true,
      );
    }
    assert.strictEqual(sliceCalls, 0);
  });

  test("rejects retired, malformed, and privacy-sensitive request shapes", () => {
    class RequestEnvelope {
      readonly type = "ready";
    }

    for (const value of [
      undefined,
      { type: "unknown" },
      { type: "operation", data: "csv.copy" },
      { type: "performance", data: { operation: "render" } },
      { type: "ready", data: {} },
      { type: "ready", extra: true },
      { type: "resource", data: {} },
      { type: "resource", data: { scrollType: "table", filePath: "/private" } },
      { type: "save", data: "csv", extra: true },
      {
        type: "navigate",
        data: { targetView: "flow", absolutePath: "/root", extra: true },
      },
      { type: "search", data: { feature: "flow", query: "/private" } },
      { type: "search", data: { feature: "unknown" } },
      { type: "csv_export", data: { method: "save" } },
      { type: "csv_export", data: { method: "copy", filePath: "/private" } },
      { type: "display", data: "pending" },
      new RequestEnvelope(),
    ]) {
      assert.strictEqual(parseViewerRequest(value), undefined);
    }
  });

  test("rejects inherited object-prototype request types without throwing", () => {
    for (const type of ["__proto__", "constructor", "toString"]) {
      assert.doesNotThrow(() => {
        assert.strictEqual(parseViewerRequest({ type, data: {} }), undefined);
      });
    }
    assert.deepStrictEqual(parseViewerRequest(createViewerReadyRequest()), {
      type: "ready",
    });
  });

  test("identifies only plain save envelopes with invalid content", () => {
    assert.strictEqual(
      isInvalidViewerSaveRequest({ type: "save", data: 1 }),
      true,
    );
    assert.strictEqual(
      isInvalidViewerSaveRequest({ type: "save", data: "" }),
      false,
    );
    assert.strictEqual(
      isInvalidViewerSaveRequest({ type: "unknown", data: 1 }),
      false,
    );
    assert.strictEqual(
      isInvalidViewerSaveRequest(Object.create({ type: "save" })),
      false,
    );
  });
});
