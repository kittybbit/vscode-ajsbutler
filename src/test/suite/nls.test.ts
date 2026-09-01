import * as assert from "assert";
import {
  ajsTableColumnLabels,
  localeString,
  paramDefinitionLang,
  unitTypeLabel,
} from "../../domain/services/i18n/nls";
import { ParameterSyntaxResourceAdapter } from "../../infrastructure/i18n/ParameterSyntaxResourceAdapter";
import { semanticDiffReportText } from "../../presentation/semantic-diff/semanticDiffReportText";

suite("NLS", () => {
  test("falls back to English message resources for unsupported languages", () => {
    assert.strictEqual(
      localeString("commandBuilder.common.command", "unsupported"),
      "Command",
    );
  });

  test("resolves semantic diff report resources for regional Japanese", () => {
    assert.strictEqual(
      semanticDiffReportText("report.title", "ja-JP"),
      "意味差分レポート",
    );
    assert.strictEqual(
      semanticDiffReportText("report.title", "fr"),
      "Semantic Diff Report",
    );
  });

  test("resolves typed semantic diff identity labels", () => {
    assert.strictEqual(
      semanticDiffReportText("identity.rule.one-to-one-fingerprint", "en"),
      "one-to-one fingerprint match",
    );
    assert.strictEqual(
      semanticDiffReportText("identity.rule.one-to-one-fingerprint", "ja-JP"),
      "一対一フィンガープリント一致",
    );
    assert.strictEqual(
      semanticDiffReportText("identity.strategy.command-text-v1", "ja"),
      "コマンドテキスト",
    );
    assert.strictEqual(
      semanticDiffReportText("identity.strategy.file-monitor-v1", "fr"),
      "file monitoring",
    );
  });

  test("falls back to English parameter definitions for unsupported languages", () => {
    assert.strictEqual(
      paramDefinitionLang("unsupported").ty.syntax,
      "{g|mg|n|rn|rm|rr|rc|mn|j|rj|pj|rp|qj|rq|jdj|rjdj|orj|rorj|evwj|revwj|flwj|rflwj|mlwj|rmlwj|mqwj|rmqwj|mswj|rmswj|lfwj|rlfwj|ntwj|rntwj|tmwj|rtmwj|evsj|revsj|mlsj|rmlsj|mqsj|rmqsj|mssj|rmssj|cmsj|rcmsj|pwlj|rpwlj|pwrj|rpwrj|cj|rcj|cpj|rcpj|fxj|rfxj|htpj|rhtpj|nc}",
    );
  });

  test("resolves hover parameter syntax with localized and English fallback resources", () => {
    const adapter = new ParameterSyntaxResourceAdapter();

    for (const language of ["en", "ja", "ja-JP", "unsupported"]) {
      assert.strictEqual(
        adapter.findSyntax("ty", language),
        paramDefinitionLang(language).ty.syntax,
      );
      assert.strictEqual(
        adapter.findSyntax("sd", language),
        paramDefinitionLang(language).sd.syntax,
      );
    }
    assert.strictEqual(adapter.findSyntax("not-a-param", "en"), undefined);
  });

  test("resolves table column labels through structured accessors", () => {
    assert.strictEqual(
      ajsTableColumnLabels("en").group(1).label,
      "Unit definition information",
    );
    assert.strictEqual(
      ajsTableColumnLabels("en").group(1).column(3),
      "Unit type",
    );
    assert.strictEqual(
      ajsTableColumnLabels("ja").group(1).column(3),
      "ユニット種別",
    );
    assert.strictEqual(
      ajsTableColumnLabels("en").group(10).subgroup(1).label,
      "Start day",
    );
    assert.strictEqual(
      ajsTableColumnLabels("en").group(10).subgroup(1).column(2),
      "Year/Month",
    );
    assert.strictEqual(
      ajsTableColumnLabels("ja").group(15).subgroup(4).column(3),
      "自動削除",
    );
    assert.strictEqual(
      ajsTableColumnLabels("unsupported").group(20).column(1),
      "Other definition information",
    );
  });

  test("resolves unit type labels without exposing raw resource shapes", () => {
    assert.strictEqual(unitTypeLabel("j", "en"), "Unix job");
    assert.strictEqual(unitTypeLabel("g", "en", "n"), "job group");
    assert.strictEqual(unitTypeLabel("g", "en", "p"), "planning group");
    assert.strictEqual(unitTypeLabel("g", "ja", "p"), "プランニンググループ");
  });

  test("falls back safely for generic groups and unknown unit types", () => {
    assert.strictEqual(unitTypeLabel("g", "en"), "job {planning} group");
    assert.strictEqual(unitTypeLabel("unknown", "en"), "unknown");
  });

  test("falls back to English unit type definitions for unsupported languages", () => {
    assert.strictEqual(
      unitTypeLabel("g", "unsupported", "p"),
      "planning group",
    );
    assert.strictEqual(
      unitTypeLabel("mqwj", "unsupported"),
      "message queue reception monitoring job",
    );
  });

  test("resolves the corrected English message queue monitoring job label", () => {
    assert.strictEqual(
      unitTypeLabel("mqwj", "en"),
      "message queue reception monitoring job",
    );
  });

  test("preserves Japanese unit type labels", () => {
    assert.strictEqual(unitTypeLabel("j", "ja"), "UNIXジョブ");
    assert.strictEqual(
      unitTypeLabel("mqwj", "ja"),
      " メッセージキュー受信監視ジョブ",
    );
    assert.strictEqual(unitTypeLabel("nc", "ja"), "ジョブネットコネクタ");
  });
});
