import * as assert from "assert";
import { parseHashEscapedQuotedStringLiteralContent } from "../../application/editor-feedback/syntaxDiagnosticStringValidators";

suite("Syntax Diagnostic String Validators", () => {
  test("parses hash-escaped quoted string content", () => {
    assert.strictEqual(
      parseHashEscapedQuotedStringLiteralContent('"plain"'),
      "plain",
    );
    assert.strictEqual(
      parseHashEscapedQuotedStringLiteralContent('"quote#""'),
      'quote"',
    );
    assert.strictEqual(
      parseHashEscapedQuotedStringLiteralContent('"hash##"'),
      "hash#",
    );
    assert.strictEqual(
      parseHashEscapedQuotedStringLiteralContent('"trailing#"'),
      'trailing"',
    );
  });

  test("rejects invalid hash-escaped quoted string content", () => {
    assert.strictEqual(
      parseHashEscapedQuotedStringLiteralContent("plain"),
      undefined,
    );
    assert.strictEqual(
      parseHashEscapedQuotedStringLiteralContent('"bad#x"'),
      undefined,
    );
    assert.strictEqual(
      parseHashEscapedQuotedStringLiteralContent('"bad"quote"'),
      undefined,
    );
  });
});
