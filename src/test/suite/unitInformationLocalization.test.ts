import * as assert from "assert";
import { localizeUnitDefinitionLabel } from "../../presentation/webview/editor/UnitDefinitionDialog";
import {
  unitInformationMessage,
  formatUnitInformationMessage,
  unitInformationParameterDefinitions,
  unitInformationTableColumnLabels,
  unitInformationUnitTypeLabel,
} from "../../presentation/webview/editor/unitInformationLocalization";

suite("Unit information localization", () => {
  test("resolves messages for English, Japanese, and fallback languages", () => {
    assert.strictEqual(
      unitInformationMessage("table.menu.menuItem1", "en"),
      "Select display columns.",
    );
    assert.strictEqual(
      unitInformationMessage("table.menu.menuItem1", "ja"),
      "表示するカラムを選択する。",
    );
    assert.strictEqual(
      unitInformationMessage("commandBuilder.common.command", "unsupported"),
      "Command",
    );
    assert.strictEqual(
      unitInformationMessage("unknown.unit-information.key", "ja"),
      "unknown.unit-information.key",
    );
    assert.strictEqual(
      localizeUnitDefinitionLabel("commandBuilder.common.command", "ja"),
      "コマンド",
    );
  });

  test("formats localized message placeholders", () => {
    assert.strictEqual(
      formatUnitInformationMessage("a11y.tree.expand", "en", {
        title: "unit tree",
      }),
      "Expand unit tree",
    );
    assert.strictEqual(
      formatUnitInformationMessage("a11y.tree.expand", "ja", {
        title: "ユニットツリー",
      }),
      "ユニットツリーを展開する",
    );
  });

  test("preserves unit type labels and safe fallback behavior", () => {
    assert.strictEqual(unitInformationUnitTypeLabel("j", "en"), "Unix job");
    assert.strictEqual(
      unitInformationUnitTypeLabel("g", "en"),
      "job {planning} group",
    );
    assert.strictEqual(
      unitInformationUnitTypeLabel("g", "en", "n"),
      "job group",
    );
    assert.strictEqual(
      unitInformationUnitTypeLabel("g", "ja", "p"),
      "プランニンググループ",
    );
    assert.strictEqual(
      unitInformationUnitTypeLabel("mqwj", "unsupported"),
      "message queue reception monitoring job",
    );
    assert.strictEqual(
      unitInformationUnitTypeLabel("mqwj", "ja"),
      " メッセージキュー受信監視ジョブ",
    );
    assert.strictEqual(
      unitInformationUnitTypeLabel("unknown", "en"),
      "unknown",
    );
  });

  test("preserves parameter and structured column resource fallback", () => {
    const japaneseParameters = unitInformationParameterDefinitions("ja");
    const fallbackParameters =
      unitInformationParameterDefinitions("unsupported");

    assert.strictEqual(japaneseParameters.sd.en, "登録日");
    assert.strictEqual(
      fallbackParameters.ty.syntax,
      "{g|mg|n|rn|rm|rr|rc|mn|j|rj|pj|rp|qj|rq|jdj|rjdj|orj|rorj|evwj|revwj|flwj|rflwj|mlwj|rmlwj|mqwj|rmqwj|mswj|rmswj|lfwj|rlfwj|ntwj|rntwj|tmwj|rtmwj|evsj|revsj|mlsj|rmlsj|mqsj|rmqsj|mssj|rmssj|cmsj|rcmsj|pwlj|rpwlj|pwrj|rpwrj|cj|rcj|cpj|rcpj|fxj|rfxj|htpj|rhtpj|nc}",
    );

    assert.strictEqual(
      unitInformationTableColumnLabels("en").group(1).column(3),
      "Unit type",
    );
    assert.strictEqual(
      unitInformationTableColumnLabels("ja").group(1).column(3),
      "ユニット種別",
    );
    assert.strictEqual(
      unitInformationTableColumnLabels("unsupported").group(20).column(1),
      "Other definition information",
    );
  });
});
