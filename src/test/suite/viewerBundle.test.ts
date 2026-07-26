import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import {
  AJS_FLOW_VIEWER_BUNDLE_SRC,
  AJS_FLOW_VIEWER_TYPE,
  AJS_TABLE_VIEWER_BUNDLE_SRC,
  AJS_TABLE_VIEWER_TYPE,
  getViewerBundleSrc,
} from "../../presentation/vscode/webview/constant";

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

  test("uses browser platform data in both search-enabled viewer bundles", () => {
    const repositoryRoot = path.resolve(__dirname, "../../..");

    for (const bundleSource of [
      AJS_TABLE_VIEWER_BUNDLE_SRC,
      AJS_FLOW_VIEWER_BUNDLE_SRC,
    ]) {
      const bundle = fs.readFileSync(
        path.resolve(repositoryRoot, bundleSource),
        "utf8",
      );
      assert.match(bundle, /navigator\.platform/u);
    }
  });
});
