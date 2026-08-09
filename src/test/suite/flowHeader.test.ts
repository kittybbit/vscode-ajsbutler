import * as assert from "assert";
import { getCurrentUnitLabel } from "../../presentation/webview/editor/ajsFlow/flowHeaderPresentation";
import { createFlowTestUnit } from "../support/flowUnits";

suite("Flow Header", () => {
  test("keeps the current scope type identifiable without breadcrumbs", () => {
    assert.strictEqual(getCurrentUnitLabel(undefined), undefined);
    assert.strictEqual(
      getCurrentUnitLabel(createFlowTestUnit()),
      "ROOT JOBNET",
    );
    assert.strictEqual(
      getCurrentUnitLabel(
        createFlowTestUnit({ unitType: "n", isRootJobnet: false }),
      ),
      "N",
    );
    assert.strictEqual(
      getCurrentUnitLabel(createFlowTestUnit(), "ja"),
      "ルートジョブネット",
    );
    assert.strictEqual(
      getCurrentUnitLabel(
        createFlowTestUnit({ unitType: "n", isRootJobnet: false }),
        "ja",
      ),
      "N",
    );
  });
});
