import * as assert from "assert";
import { parseHashEscapedQuotedEventStringContent } from "../../domain/services/diagnostics/EventDiagnosticRules";
import {
  hasInvalidExplicitTransferSourcePath,
  hasValidExplicitTransferByteLength,
  isAbsoluteTransferFilePath,
  isExplicitTransferMacroVariable,
  parseQuotedTransferFileContent,
} from "../../domain/services/diagnostics/TransferDiagnosticRules";

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

  test("parses quoted transfer values and recognizes explicit macros", () => {
    assert.strictEqual(parseQuotedTransferFileContent('"C:/file"'), "C:/file");
    assert.strictEqual(
      parseQuotedTransferFileContent('"escaped\\"name"'),
      'escaped\\"name',
    );
    assert.strictEqual(parseQuotedTransferFileContent("bare"), undefined);
    assert.strictEqual(isExplicitTransferMacroVariable("?AJS2SRC?"), true);
    assert.strictEqual(isExplicitTransferMacroVariable("??"), false);
    assert.strictEqual(isExplicitTransferMacroVariable("?A?B?"), false);
  });

  test("preserves Windows and UNIX absolute transfer path forms", () => {
    for (const path of [
      "/var/tmp/file",
      "\\server\\file",
      "C:/file",
      "d:\\file",
    ]) {
      assert.strictEqual(isAbsoluteTransferFilePath(path), true);
      assert.strictEqual(
        hasInvalidExplicitTransferSourcePath({
          key: "ts1",
          value: `"${path}"`,
        }),
        false,
      );
    }
    assert.strictEqual(isAbsoluteTransferFilePath("relative/file"), false);
    assert.strictEqual(
      hasInvalidExplicitTransferSourcePath({
        key: "ts1",
        value: '"relative/file"',
      }),
      true,
    );
  });

  test("measures governed transfer values with UTF-8 bytes", () => {
    assert.strictEqual(
      hasValidExplicitTransferByteLength({ key: "ts1", value: '"a"' }),
      true,
    );
    assert.strictEqual(
      hasValidExplicitTransferByteLength({ key: "ts1", value: '""' }),
      false,
    );
    assert.strictEqual(
      hasValidExplicitTransferByteLength({
        key: "ts1",
        value: `"${"あ".repeat(171)}"`,
      }),
      false,
    );
    assert.strictEqual(
      hasValidExplicitTransferByteLength({
        key: "ts1",
        value: `"${"a".repeat(511)}"`,
      }),
      true,
    );
  });
});
