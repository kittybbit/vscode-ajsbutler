import * as assert from "assert";
import * as vscode from "vscode";
import {
  AJS_FLOW_VIEWER_BUNDLE_SRC,
  AJS_FLOW_VIEWER_TYPE,
  AJS_TABLE_VIEWER_BUNDLE_SRC,
  AJS_TABLE_VIEWER_TYPE,
  getViewerBundleSrc,
} from "../../presentation/vscode/webview/constant";
import { mountViewerPanel } from "../../presentation/vscode/webview/mountViewerPanel";

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

  test("mounts the bundle selected for each viewer type", () => {
    const mountedBundles: string[] = [];
    const context = {} as vscode.ExtensionContext;
    const panel = {} as vscode.WebviewPanel;

    mountViewerPanel(context, panel, AJS_TABLE_VIEWER_TYPE, {
      getViewerBundleSrc: () => AJS_TABLE_VIEWER_BUNDLE_SRC,
      initReactPanel: (_context, _panel, bundle) => {
        mountedBundles.push(bundle);
      },
    });
    mountViewerPanel(context, panel, AJS_FLOW_VIEWER_TYPE, {
      getViewerBundleSrc: () => AJS_FLOW_VIEWER_BUNDLE_SRC,
      initReactPanel: (_context, _panel, bundle) => {
        mountedBundles.push(bundle);
      },
    });

    assert.deepStrictEqual(mountedBundles, [
      AJS_TABLE_VIEWER_BUNDLE_SRC,
      AJS_FLOW_VIEWER_BUNDLE_SRC,
    ]);
  });
});
