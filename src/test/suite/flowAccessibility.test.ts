import * as assert from "assert";
import {
  flowAriaLabelConfig,
  flowSpatialDirectionLabel,
} from "../../presentation/webview/editor/ajsFlow/flowAccessibility";

suite("Flow accessibility labels", () => {
  test("localizes spatial directions", () => {
    assert.strictEqual(flowSpatialDirectionLabel("left", "en"), "left");
    assert.strictEqual(flowSpatialDirectionLabel("down", "ja"), "下");
  });

  test("describes the revised keyboard map in both languages", () => {
    const english = flowAriaLabelConfig("en");
    const japanese = flowAriaLabelConfig("ja");

    assert.match(
      english["node.a11yDescription.default"] ?? "",
      /Shift\+Down.*Enter.*Escape.*D.*L.*Tab.*Shift\+Tab/,
    );
    assert.match(
      japanese["node.a11yDescription.default"] ?? "",
      /Shift\+下.*Enter.*Escape.*D.*L.*Tab.*Shift\+Tab/,
    );
    assert.doesNotMatch(
      english["node.a11yDescription.default"] ?? "",
      /predecessor|successor/i,
    );
    assert.doesNotMatch(
      english["node.a11yDescription.default"] ?? "",
      /drag|delet|relationship.*tab/i,
    );
    assert.strictEqual(
      english["edge.a11yDescription.default"],
      "Edges are visual only and cannot be selected.",
    );
  });
});
