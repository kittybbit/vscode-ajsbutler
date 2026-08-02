import * as assert from "assert";
import { createTheme } from "@mui/material/styles";
import {
  buildNodeSxProps,
  buildNodeFocusFilter,
  buildNodeHoverDecoration,
  resolveNodeBorderStyle,
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

  test("uses border patterns that do not rely on node-state color", () => {
    const state = {
      isAncestor: false,
      isCurrent: false,
      isCurrentSearchResult: false,
      isHovered: false,
      isRootJobnet: false,
      isSearchMatch: false,
      isSelected: false,
      nestedPanel: undefined,
      relationshipFocusRole: undefined,
      semanticDiffHighlight: undefined,
    };

    assert.strictEqual(
      resolveNodeBorderStyle({ ...state, isSelected: true } as never),
      "double",
    );
    assert.strictEqual(
      resolveNodeBorderStyle({ ...state, isCurrent: true } as never),
      "dashed",
    );
    assert.strictEqual(
      resolveNodeBorderStyle({ ...state, isSearchMatch: true } as never),
      "dotted",
    );
    assert.strictEqual(
      resolveNodeBorderStyle({
        ...state,
        relationshipFocusRole: "upstream",
      } as never),
      "dashed",
    );
  });

  test("keeps visual-state precedence and nested panel geometry stable", () => {
    const state = {
      isAncestor: false,
      isCurrent: false,
      isCurrentSearchResult: false,
      isHovered: false,
      isRootJobnet: false,
      isSearchMatch: false,
      isSelected: false,
      nestedPanel: undefined,
      relationshipFocusRole: undefined,
      semanticDiffHighlight: undefined,
    };

    assert.strictEqual(
      resolveNodeBorderStyle({
        ...state,
        isSelected: true,
        isCurrent: true,
        isCurrentSearchResult: true,
        semanticDiffHighlight: {
          kind: "confirmation-required",
          changeIds: [],
          confirmationIds: [],
        },
      } as never),
      "double",
    );
    assert.strictEqual(
      resolveNodeBorderStyle({
        ...state,
        relationshipFocusRole: "unrelated",
        isSelected: true,
      } as never),
      "double",
    );

    const style = buildNodeSxProps({
      ...state,
      nestedPanel: {
        panelOffsetXPx: -24,
        panelOffsetYPx: -16,
        panelWidthPx: 512,
        panelHeightPx: 384,
      },
    }) as Record<string, unknown>;
    const nestedPanelStyle = style["&::after"] as Record<string, unknown>;
    assert.strictEqual(nestedPanelStyle.left, "-24px");
    assert.strictEqual(nestedPanelStyle.top, "-16px");
    assert.strictEqual(nestedPanelStyle.width, "512px");
    assert.strictEqual(nestedPanelStyle.height, "384px");
    assert.strictEqual(nestedPanelStyle.pointerEvents, "none");
    assert.strictEqual(style.overflow, "visible");
  });
});
