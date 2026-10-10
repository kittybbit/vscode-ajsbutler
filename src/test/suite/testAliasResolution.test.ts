import * as assert from "assert";
import * as path from "path";

suite("Test runtime alias resolution", () => {
  test("resolves compiled resource and generated parser aliases", () => {
    const outputRoot = path.resolve(__dirname, "../..");

    assert.strictEqual(
      require.resolve("@resource/i18n/message"),
      require.resolve(path.join(outputRoot, "resource/i18n/message")),
    );
    assert.strictEqual(
      require.resolve("@generate/parser/AjsLexer"),
      require.resolve(path.join(outputRoot, "generate/parser/AjsLexer")),
    );
    assert.ok(
      require.resolve("mocha").includes(`${path.sep}node_modules${path.sep}`),
    );
  });
});
