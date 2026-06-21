import * as assert from "assert";
import {
  createResponsiveFlowPanelCollapseState,
  reduceResponsiveFlowPanelCollapseState,
} from "../../presentation/webview/editor/ajsFlow/useResponsiveFlowPanelCollapse";

suite("Responsive Flow Panel Collapse", () => {
  test("initializes collapsed only for a narrow viewport", () => {
    assert.deepStrictEqual(createResponsiveFlowPanelCollapseState(true), {
      collapsed: true,
      isNarrow: true,
    });
    assert.deepStrictEqual(createResponsiveFlowPanelCollapseState(false), {
      collapsed: false,
      isNarrow: false,
    });
  });

  test("automatically collapses when the viewport becomes narrow", () => {
    assert.deepStrictEqual(
      reduceResponsiveFlowPanelCollapseState(
        { collapsed: false, isNarrow: false },
        { type: "viewportChanged", isNarrow: true },
      ),
      { collapsed: true, isNarrow: true },
    );
  });

  test("supports manual collapse and expansion at a wide viewport", () => {
    const collapsed = reduceResponsiveFlowPanelCollapseState(
      { collapsed: false, isNarrow: false },
      { type: "collapse" },
    );
    assert.deepStrictEqual(collapsed, { collapsed: true, isNarrow: false });
    assert.deepStrictEqual(
      reduceResponsiveFlowPanelCollapseState(collapsed, { type: "expand" }),
      { collapsed: false, isNarrow: false },
    );
  });

  test("allows manual expansion while narrow until another transition", () => {
    const expanded = reduceResponsiveFlowPanelCollapseState(
      { collapsed: true, isNarrow: true },
      { type: "expand" },
    );
    assert.deepStrictEqual(expanded, { collapsed: false, isNarrow: true });
    assert.strictEqual(
      reduceResponsiveFlowPanelCollapseState(expanded, {
        type: "viewportChanged",
        isNarrow: true,
      }),
      expanded,
    );
  });

  test("keeps the user's collapse choice when the viewport becomes wide", () => {
    assert.deepStrictEqual(
      reduceResponsiveFlowPanelCollapseState(
        { collapsed: true, isNarrow: true },
        { type: "viewportChanged", isNarrow: false },
      ),
      { collapsed: true, isNarrow: false },
    );
  });
});
