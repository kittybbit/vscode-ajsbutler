import * as assert from "assert";
import {
  createViewerCsvExportRequest,
  createViewerDisplayAcknowledgementRequest,
  createViewerNavigationRequest,
  createViewerReadyRequest,
  createViewerResourceRequest,
  createViewerSaveRequest,
  createViewerSearchRequest,
  isInvalidViewerSaveRequest,
  parseViewerRequest,
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

suite("Viewer request messages", () => {
  test("round-trips the exact functional and completion protocol", () => {
    const requests = createEveryViewerRequest();

    assert.deepStrictEqual(
      requests.map(({ type }) => type),
      viewerRequestTypes,
    );
    for (const request of requests) {
      assertPlainJsonValue(request);
      const restored = JSON.parse(JSON.stringify(request)) as unknown;
      assert.deepStrictEqual(restored, request);
      assert.deepStrictEqual(parseViewerRequest(restored), request);
    }
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
