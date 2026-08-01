import * as assert from "assert";
import { createTheme } from "@mui/material/styles";
import {
  viewerFocusBorder,
  viewerPanelBorder,
  viewerSearchBorder,
  viewerThemeGlobalStyles,
} from "../../presentation/webview/editor/shared/viewerThemeStyles";

suite("Viewer theme styles", () => {
  test("uses VS Code theme tokens with MUI fallbacks", () => {
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

  test("covers VS Code high-contrast classes and forced-colors mode", () => {
    assert.ok(
      viewerThemeGlobalStyles[
        "body.vscode-high-contrast, body.vscode-high-contrast-light, body.vscode-high-contrast-dark"
      ],
    );
    assert.ok(viewerThemeGlobalStyles["@media (forced-colors: active)"]);
  });
});
