import * as assert from "assert";
import { createTheme } from "@mui/material/styles";
import {
  createViewerTheme,
  viewerFocusBorder,
  viewerGlobalStyles,
  viewerOpaqueSurfaceSx,
  viewerPanelBorder,
  viewerSearchBorder,
  viewerTargetSizePx,
} from "../../presentation/webview/shared/viewerTheme";

suite("Viewer theme", () => {
  test("uses standard light and dark MUI palettes", () => {
    const lightTheme = createViewerTheme({ mode: "light" });
    const darkTheme = createViewerTheme({ mode: "dark" });

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
    assert.strictEqual(viewerTargetSizePx, 44);
  });

  test("uses VS Code tokens with MUI fallbacks", () => {
    const theme = createTheme();

    assert.strictEqual(
      viewerFocusBorder(theme),
      `var(--vscode-focusBorder, ${theme.palette.primary.main})`,
    );
    assert.strictEqual(
      viewerPanelBorder(theme),
      `var(--vscode-widget-border, ${theme.palette.divider})`,
    );
    assert.strictEqual(
      viewerSearchBorder(theme),
      `var(--vscode-editor-findMatchBorder, ${theme.palette.success.main})`,
    );
  });

  test("preserves global typography and contrast rules", () => {
    const styles = viewerGlobalStyles(createViewerTheme());
    const highContrast =
      styles[
        "body.vscode-high-contrast, body.vscode-high-contrast-light, body.vscode-high-contrast-dark"
      ];
    const forcedColors = styles["@media (forced-colors: active)"];

    assert.strictEqual(
      styles.body.fontFamily,
      "var(--vscode-font-family, sans-serif)",
    );
    assert.ok(highContrast);
    assert.ok(forcedColors);
    assert.strictEqual(
      forcedColors?.["button, select"]?.backgroundColor,
      "ButtonFace",
    );
    assert.strictEqual(
      forcedColors?.[".MuiPaper-root"]?.backgroundImage,
      "none",
    );
  });

  test("provides one opaque forced-colors-safe surface", () => {
    assert.strictEqual(
      typeof viewerOpaqueSurfaceSx.backgroundColor,
      "function",
    );
    assert.strictEqual(typeof viewerOpaqueSurfaceSx.borderBottom, "function");
    assert.strictEqual(typeof viewerOpaqueSurfaceSx.boxShadow, "function");
    assert.deepStrictEqual(
      viewerOpaqueSurfaceSx["@media (forced-colors: active)"],
      {
        backgroundColor: "Canvas",
        color: "CanvasText",
        borderColor: "CanvasText",
        boxShadow: "none",
      },
    );
  });
});
