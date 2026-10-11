import * as assert from "assert";
import * as path from "path";
import { selectDesktopTestTarget } from "../runTest";

suite("Desktop host target contract", () => {
  test("default selects stable and the full-suite entry", () => {
    const target = selectDesktopTestTarget([]);
    assert.strictEqual(target.version, "stable");
    assert.strictEqual(
      target.extensionTestsPath,
      path.resolve(__dirname, "desktopTestEntry"),
    );
  });

  test("minimum selects VS Code 1.75 and the shared smoke bundle", () => {
    const target = selectDesktopTestTarget(["--minimum"]);
    assert.strictEqual(target.version, "1.75.0");
    assert.strictEqual(
      target.extensionTestsPath,
      path.resolve(__dirname, "webSmoke.bundle.js"),
    );
  });

  test("unsupported or duplicate arguments fail before SDK launch", () => {
    for (const args of [
      ["--unsupported"],
      ["--minimum", "--minimum"],
      ["--minimum", "--unsupported"],
    ]) {
      assert.throws(
        () => selectDesktopTestTarget(args),
        /Unsupported Desktop test arguments/,
      );
    }
  });
});
