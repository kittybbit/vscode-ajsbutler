import * as assert from "assert";
import {
  createSemanticDiffTheme,
  semanticDiffViewerOpaqueSurfaceSx,
  semanticDiffExplorerTheme,
} from "../../presentation/webview/shared/muiTheme";

suite("Semantic Diff MUI theme", () => {
  test("keeps the Explorer export backward-compatible", () => {
    assert.strictEqual(semanticDiffExplorerTheme.palette.mode, "light");
    assert.strictEqual(
      semanticDiffExplorerTheme.palette.background.default,
      "#fff",
    );
  });

  test("uses MUI standard light and dark palette values", () => {
    const lightTheme = createSemanticDiffTheme({ mode: "light" });
    const darkTheme = createSemanticDiffTheme({ mode: "dark" });

    assert.strictEqual(lightTheme.palette.mode, "light");
    assert.strictEqual(darkTheme.palette.mode, "dark");
    assert.strictEqual(lightTheme.palette.background.default, "#fff");
    assert.strictEqual(darkTheme.palette.background.default, "#121212");
    assert.strictEqual(lightTheme.palette.primary.main, "#1976d2");
    assert.strictEqual(darkTheme.palette.primary.main, "#90caf9");
    assert.notStrictEqual(
      darkTheme.palette.divider,
      lightTheme.palette.divider,
    );
    assert.ok(darkTheme.components?.MuiButton?.styleOverrides?.root);
    assert.strictEqual(
      darkTheme.components?.MuiButton?.styleOverrides?.contained,
      undefined,
    );
  });

  test("provides one opaque, forced-colors-safe sticky surface", () => {
    assert.strictEqual(
      typeof semanticDiffViewerOpaqueSurfaceSx.backgroundColor,
      "function",
    );
    assert.strictEqual(
      typeof semanticDiffViewerOpaqueSurfaceSx.borderBottom,
      "function",
    );
    assert.strictEqual(
      typeof semanticDiffViewerOpaqueSurfaceSx.boxShadow,
      "function",
    );
    assert.deepStrictEqual(
      semanticDiffViewerOpaqueSurfaceSx["@media (forced-colors: active)"],
      {
        backgroundColor: "Canvas",
        color: "CanvasText",
        borderColor: "CanvasText",
        boxShadow: "none",
      },
    );
  });
});
