import * as assert from "assert";
import {
  createSemanticDiffTheme,
  semanticDiffExplorerTheme,
} from "../../presentation/webview/shared/muiTheme";

suite("Semantic Diff MUI theme", () => {
  test("keeps the Explorer export backward-compatible", () => {
    assert.strictEqual(semanticDiffExplorerTheme.palette.mode, "light");
    assert.strictEqual(
      semanticDiffExplorerTheme.palette.background.default,
      "#1e1e1e",
    );
  });

  test("creates the shared theme for both viewer modes", () => {
    const lightTheme = createSemanticDiffTheme({ mode: "light" });
    const darkTheme = createSemanticDiffTheme({ mode: "dark" });

    assert.strictEqual(lightTheme.palette.mode, "light");
    assert.strictEqual(darkTheme.palette.mode, "dark");
    assert.strictEqual(darkTheme.palette.divider, lightTheme.palette.divider);
    assert.ok(darkTheme.components?.MuiButton?.styleOverrides?.root);
  });
});
