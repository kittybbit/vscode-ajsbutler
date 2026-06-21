import * as assert from "assert";
import { createTheme } from "@mui/material/styles";
import {
  buildNodeFocusFilter,
  buildNodeHoverDecoration,
} from "../../presentation/webview/editor/ajsFlow/nodes/nodeSxProps";
import {
  createFlowNodeGeometryPx,
  flowNodeGeometryEm,
  flowNodeHandleTop,
} from "../../presentation/webview/editor/ajsFlow/nodes/flowNodeGeometry";
import { createFlowGraphMetrics } from "../../presentation/webview/editor/ajsFlow/flowGraphPosition";

suite("Flow Node Style", () => {
  test("uses one landscape geometry for cards, layout, and handles", () => {
    assert.ok(flowNodeGeometryEm.width > flowNodeGeometryEm.height);
    assert.deepStrictEqual(createFlowNodeGeometryPx(16), {
      width: 168,
      height: 116,
    });
    assert.deepStrictEqual(
      {
        width: createFlowGraphMetrics(16).width,
        height: createFlowGraphMetrics(16).height,
      },
      createFlowNodeGeometryPx(16),
    );
    assert.strictEqual(flowNodeHandleTop, "50%");
  });

  test("adds an independent outline without moving the hovered node", () => {
    assert.deepStrictEqual(buildNodeHoverDecoration(true), {
      outlineWidth: "2px",
      outlineStyle: "solid",
      outlineOffset: "3px",
    });
  });

  test("removes synchronized hover decoration without changing other states", () => {
    assert.deepStrictEqual(buildNodeHoverDecoration(false), {
      outlineWidth: "0px",
      outlineStyle: "solid",
      outlineOffset: "3px",
    });
  });

  test("distinguishes relationship focus directions with theme colors", () => {
    const theme = createTheme();
    assert.ok(
      buildNodeFocusFilter("upstream", theme).includes(theme.palette.info.main),
    );
    assert.ok(
      buildNodeFocusFilter("downstream", theme).includes(
        theme.palette.success.main,
      ),
    );
    assert.ok(
      buildNodeFocusFilter("both", theme).includes(theme.palette.warning.main),
    );
    assert.strictEqual(buildNodeFocusFilter("unrelated", theme), "none");
  });
});
