import * as assert from "assert";
import { decodeEncodedString } from "../../domain/models/parameters/encodedStringHelpers";

suite("Encoded String Helpers", () => {
  test("decodes quoted and escaped encoded strings", () => {
    assert.strictEqual(decodeEncodedString(undefined), undefined);
    assert.strictEqual(decodeEncodedString('"plain"'), "plain");
    assert.strictEqual(decodeEncodedString('"a#""'), 'a"');
    assert.strictEqual(decodeEncodedString('"a##b"'), "a#b");
    assert.strictEqual(decodeEncodedString('"a#"#"##b"'), 'a""#b');
  });
});
