import * as assert from "assert";
import { parseHashEscapedQuotedEventStringContent } from "../../domain/services/diagnostics/EventDiagnosticRules";

suite("Syntax Diagnostic String Validators", () => {
  test("parses hash-escaped quoted string content", () => {
    assert.strictEqual(
      parseHashEscapedQuotedEventStringContent('"plain"'),
      "plain",
    );
    assert.strictEqual(
      parseHashEscapedQuotedEventStringContent('"quote#""'),
      'quote"',
    );
    assert.strictEqual(
      parseHashEscapedQuotedEventStringContent('"hash##"'),
      "hash#",
    );
    assert.strictEqual(
      parseHashEscapedQuotedEventStringContent('"trailing#"'),
      'trailing"',
    );
  });

  test("rejects invalid hash-escaped quoted string content", () => {
    assert.strictEqual(
      parseHashEscapedQuotedEventStringContent("plain"),
      undefined,
    );
    assert.strictEqual(
      parseHashEscapedQuotedEventStringContent('"bad#x"'),
      undefined,
    );
    assert.strictEqual(
      parseHashEscapedQuotedEventStringContent('"bad"quote"'),
      undefined,
    );
  });
});
