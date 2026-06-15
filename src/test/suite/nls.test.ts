import * as assert from "assert";
import {
  localeString,
  paramDefinitionLang,
  unitTypeLabel,
} from "../../domain/services/i18n/nls";

suite("NLS", () => {
  test("falls back to English message resources for unsupported languages", () => {
    assert.strictEqual(
      localeString("commandBuilder.common.command", "unsupported"),
      "Command",
    );
  });

  test("falls back to English parameter definitions for unsupported languages", () => {
    assert.strictEqual(
      paramDefinitionLang("unsupported").ty.syntax,
      "{g|mg|n|rn|rm|rr|rc|mn|j|rj|pj|rp|qj|rq|jdj|rjdj|orj|rorj|evwj|revwj|flwj|rflwj|mlwj|rmlwj|mqwj|rmqwj|mswj|rmswj|lfwj|rlfwj|ntwj|rntwj|tmwj|rtmwj|evsj|revsj|mlsj|rmlsj|mqsj|rmqsj|mssj|rmssj|cmsj|rcmsj|pwlj|rpwlj|pwrj|rpwrj|cj|rcj|cpj|rcpj|fxj|rfxj|htpj|rhtpj|nc}",
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

  test("resolves the corrected English message queue monitoring job label", () => {
    assert.strictEqual(
      unitTypeLabel("mqwj", "en"),
      "message queue reception monitoring job",
    );
  });
});
