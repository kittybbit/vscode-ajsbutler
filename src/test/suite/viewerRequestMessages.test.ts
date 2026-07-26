import * as assert from "assert";
import {
  createViewerNavigationRequest,
  createViewerOperationRequest,
  createViewerPerformanceRequest,
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
  createViewerOperationRequest("copy.csv"),
  createViewerNavigationRequest("flow", "/root/job"),
  createViewerSearchRequest({
    surface: "table",
    action: "submitted",
    result: "matched",
    mode: "partial",
    queryLengthBucket: "2_9",
    resultCountBucket: "1",
    durationBucket: "lt100ms",
    scope: "visible_rows",
  }),
  createViewerPerformanceRequest({
    operation: "csv_export",
    result: "success",
    durationBucket: "lt100ms",
    rowCountBucket: "10_99",
  }),
];

suite("Viewer request messages", () => {
  test("inventories every builder and round-trips plain JSON", () => {
    const requests = createEveryViewerRequest();

    assert.deepStrictEqual(
      requests.map(({ type }) => type),
      viewerRequestTypes,
    );
    requests.forEach((request) => {
      assertPlainJsonValue(request);
      const restored = JSON.parse(JSON.stringify(request)) as unknown;
      assert.deepStrictEqual(restored, request);
      assert.deepStrictEqual(parseViewerRequest(restored), request);
    });
  });

  test("omits optional telemetry fields instead of owning undefined values", () => {
    const requests = [
      createViewerSearchRequest({
        surface: "flow",
        action: "cleared",
        result: "cleared",
        mode: "partial",
        scope: "current_flow_scope",
      }),
      createViewerPerformanceRequest({
        operation: "flow_render",
        result: "success",
      }),
    ];

    requests.forEach(assertPlainJsonValue);
    assert.ok(!("durationBucket" in requests[0].data));
    assert.ok(!("durationBucket" in requests[1].data));
  });

  test("rejects unknown, malformed, unbucketed, and non-plain requests", () => {
    class RequestEnvelope {
      readonly type = "ready";
    }

    for (const value of [
      undefined,
      { type: "unknown" },
      { type: "ready", data: {} },
      { type: "resource", data: {} },
      {
        type: "resource",
        data: {
          isDarkMode: true,
          lang: "ja",
          scrollType: "table",
        },
      },
      { type: "operation", data: "unknown.operation" },
      { type: "navigate", data: { targetView: "flow", absolutePath: "" } },
      {
        type: "search",
        data: {
          surface: "table",
          action: "submitted",
          result: "matched",
          mode: "partial",
          queryLengthBucket: "raw query",
          scope: "visible_rows",
        },
      },
      {
        type: "performance",
        data: {
          operation: "parse",
          result: "success",
        },
      },
      new RequestEnvelope(),
    ]) {
      assert.strictEqual(parseViewerRequest(value), undefined);
    }
  });

  test("identifies only plain save envelopes with invalid data", () => {
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
  });
});
