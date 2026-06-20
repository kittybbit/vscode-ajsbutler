import * as assert from "assert";
import { buildNodeHoverDecoration } from "../../presentation/webview/editor/ajsFlow/nodes/nodeSxProps";

suite("Flow Node Style", () => {
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
});
