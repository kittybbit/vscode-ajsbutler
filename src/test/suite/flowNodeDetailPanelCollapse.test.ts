import * as assert from "assert";
import {
  createFlowNodeDetailPanelCollapseState,
  reduceFlowNodeDetailPanelCollapseState,
} from "../../presentation/webview/editor/ajsFlow/useFlowNodeDetailPanelCollapse";

suite("Flow Node Detail Panel Collapse", () => {
  test("initializes collapsed only for a narrow viewport", () => {
    assert.deepStrictEqual(createFlowNodeDetailPanelCollapseState(true), {
      collapsed: true,
      isNarrow: true,
    });
    assert.deepStrictEqual(createFlowNodeDetailPanelCollapseState(false), {
      collapsed: false,
      isNarrow: false,
    });
  });

  test("automatically collapses when the viewport becomes narrow", () => {
    assert.deepStrictEqual(
      reduceFlowNodeDetailPanelCollapseState(
        { collapsed: false, isNarrow: false },
        { type: "viewportChanged", isNarrow: true },
      ),
      { collapsed: true, isNarrow: true },
    );
  });

  test("supports manual collapse and expansion at a wide viewport", () => {
    const collapsed = reduceFlowNodeDetailPanelCollapseState(
      { collapsed: false, isNarrow: false },
      { type: "collapse" },
    );
    assert.deepStrictEqual(collapsed, { collapsed: true, isNarrow: false });
    assert.deepStrictEqual(
      reduceFlowNodeDetailPanelCollapseState(collapsed, { type: "expand" }),
      { collapsed: false, isNarrow: false },
    );
  });

  test("allows manual expansion while narrow until another transition", () => {
    const expanded = reduceFlowNodeDetailPanelCollapseState(
      { collapsed: true, isNarrow: true },
      { type: "expand" },
    );
    assert.deepStrictEqual(expanded, { collapsed: false, isNarrow: true });
    assert.strictEqual(
      reduceFlowNodeDetailPanelCollapseState(expanded, {
        type: "viewportChanged",
        isNarrow: true,
      }),
      expanded,
    );
  });

  test("keeps the user's collapse choice when the viewport becomes wide", () => {
    assert.deepStrictEqual(
      reduceFlowNodeDetailPanelCollapseState(
        { collapsed: true, isNarrow: true },
        { type: "viewportChanged", isNarrow: false },
      ),
      { collapsed: true, isNarrow: false },
    );
  });
});
