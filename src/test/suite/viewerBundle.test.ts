import * as assert from "assert";
import {
  AJS_FLOW_VIEWER_BUNDLE_SRC,
  AJS_FLOW_VIEWER_TYPE,
  AJS_TABLE_VIEWER_BUNDLE_SRC,
  AJS_TABLE_VIEWER_TYPE,
  getViewerBundleSrc,
} from "../../extension/webview/constant";

suite("Viewer bundle", () => {
  test("maps the table and flow view types to distinct bundles", () => {
    assert.strictEqual(
      getViewerBundleSrc(AJS_TABLE_VIEWER_TYPE),
      AJS_TABLE_VIEWER_BUNDLE_SRC,
    );
    assert.strictEqual(
      getViewerBundleSrc(AJS_FLOW_VIEWER_TYPE),
      AJS_FLOW_VIEWER_BUNDLE_SRC,
    );
  });

  test("rejects unknown view types", () => {
    assert.throws(
      () => getViewerBundleSrc("ajsbutler.unknownViewer"),
      /Unknown viewer bundle/,
    );
  });
});
