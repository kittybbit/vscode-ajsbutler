import { createTheme, type SxProps, type Theme } from "@mui/material/styles";

const vscodeToken = (name: string, fallback: string): string =>
  `var(--vscode-${name}, ${fallback})`;

export const semanticDiffExplorerContrastFallbacks = Object.freeze({
  background: "#1e1e1e",
  foreground: "#f8f8f2",
  mutedForeground: "#c7c7c7",
  border: "#767676",
  focus: "#4fc3f7",
  buttonBackground: "#0e639c",
  buttonForeground: "#ffffff",
});

export const semanticDiffExplorerTargetSizePx = 44;

export const semanticDiffExplorerColors = Object.freeze({
  background: vscodeToken(
    "editor-background",
    semanticDiffExplorerContrastFallbacks.background,
  ),
  foreground: vscodeToken(
    "foreground",
    semanticDiffExplorerContrastFallbacks.foreground,
  ),
  mutedForeground: vscodeToken(
    "descriptionForeground",
    semanticDiffExplorerContrastFallbacks.mutedForeground,
  ),
  border: vscodeToken(
    "widget-border",
    semanticDiffExplorerContrastFallbacks.border,
  ),
  focus: vscodeToken(
    "focusBorder",
    semanticDiffExplorerContrastFallbacks.focus,
  ),
  selection: vscodeToken("list-activeSelectionBackground", "#264f78"),
  selectionForeground: vscodeToken("list-activeSelectionForeground", "#ffffff"),
  primary: vscodeToken(
    "button-background",
    semanticDiffExplorerContrastFallbacks.buttonBackground,
  ),
  buttonForeground: vscodeToken(
    "button-foreground",
    semanticDiffExplorerContrastFallbacks.buttonForeground,
  ),
  success: vscodeToken("testing-iconPassed", "#89d185"),
  warning: vscodeToken("list-warningForeground", "#cca700"),
  error: vscodeToken("errorForeground", "#f48771"),
});

export const semanticDiffExplorerFocusSx: SxProps<Theme> = {
  "&:focus-visible": {
    outline: `2px solid ${semanticDiffExplorerColors.focus}`,
    outlineOffset: "2px",
  },
  "@media (forced-colors: active)": {
    "&:focus-visible": {
      outline: "2px solid Highlight",
      outlineOffset: "2px",
    },
  },
};

export const semanticDiffExplorerGlobalStyles = {
  html: {
    backgroundColor: semanticDiffExplorerColors.background,
  },
  body: {
    margin: 0,
    minWidth: 0,
    minHeight: "100%",
    backgroundColor: semanticDiffExplorerColors.background,
    color: semanticDiffExplorerColors.foreground,
    fontFamily: "var(--vscode-font-family, sans-serif)",
    fontSize: "var(--vscode-font-size, 13px)",
    lineHeight: 1.5,
  },
  "body.vscode-high-contrast, body.vscode-high-contrast-light, body.vscode-high-contrast-dark":
    {
      backgroundColor: "var(--vscode-editor-background, Canvas)",
      color: "var(--vscode-foreground, CanvasText)",
      "& #root": {
        backgroundColor: "var(--vscode-editor-background, Canvas)",
        color: "var(--vscode-foreground, CanvasText)",
      },
    },
  "@media (forced-colors: active)": {
    body: {
      backgroundColor: "Canvas",
      color: "CanvasText",
    },
    "#root": {
      backgroundColor: "Canvas",
      color: "CanvasText",
    },
    ".sde-state": {
      borderColor: "ButtonText",
      color: "ButtonText",
    },
    "button, select": {
      backgroundColor: "ButtonFace",
      color: "ButtonText",
      borderColor: "ButtonText",
    },
    "button:focus-visible, select:focus-visible": {
      outline: "2px solid Highlight",
      outlineOffset: "2px",
    },
  },
};

export type SemanticDiffThemeOptions = Readonly<{
  mode?: "light" | "dark";
}>;

export const semanticDiffViewerSurfaceSx: SxProps<Theme> = {
  width: "100%",
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  overflow: "hidden",
  padding: 1.25,
  background: (theme) =>
    `radial-gradient(circle at top left, ${theme.palette.primary.light}12, transparent 28%), linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
  "body.vscode-high-contrast &": {
    background: "var(--vscode-editor-background, Canvas)",
  },
  boxSizing: "border-box",
};

const semanticDiffThemePalette = {
  background: {
    default: semanticDiffExplorerContrastFallbacks.background,
    paper: semanticDiffExplorerContrastFallbacks.background,
  },
  text: {
    primary: semanticDiffExplorerContrastFallbacks.foreground,
    secondary: semanticDiffExplorerContrastFallbacks.mutedForeground,
  },
  divider: semanticDiffExplorerContrastFallbacks.border,
  // MUI derives contrast/light/dark values at theme creation and therefore
  // requires parseable fallbacks. Components use the VS Code tokens above
  // for the rendered colors; these values only keep MUI's calculations safe
  // when a host has not provided a token.
  primary: { main: "#0078d4" },
  success: { main: "#107c10" },
  warning: { main: "#9d6f00" },
  error: { main: "#d13438" },
};

export const createSemanticDiffTheme = (
  options: SemanticDiffThemeOptions = {},
): Theme =>
  createTheme({
    palette: {
      ...semanticDiffThemePalette,
      mode: options.mode ?? "light",
    },
    typography: {
      fontFamily: "var(--vscode-font-family, sans-serif)",
      fontSize: 14,
      body1: { lineHeight: 1.5 },
      body2: { lineHeight: 1.5 },
    },
    shape: { borderRadius: 4 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            minWidth: semanticDiffExplorerTargetSizePx,
            minHeight: semanticDiffExplorerTargetSizePx,
            textTransform: "none",
            whiteSpace: "normal",
            ...semanticDiffExplorerFocusSx,
          },
          contained: {
            backgroundColor: semanticDiffExplorerColors.primary,
            color: semanticDiffExplorerColors.buttonForeground,
            "&:hover": { backgroundColor: semanticDiffExplorerColors.primary },
          },
          outlined: {
            borderColor: semanticDiffExplorerColors.border,
            color: semanticDiffExplorerColors.foreground,
            "&:hover": { borderColor: semanticDiffExplorerColors.focus },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            minWidth: semanticDiffExplorerTargetSizePx,
            minHeight: semanticDiffExplorerTargetSizePx,
            ...semanticDiffExplorerFocusSx,
          },
        },
      },
      MuiNativeSelect: {
        styleOverrides: {
          select: {
            minHeight: semanticDiffExplorerTargetSizePx,
            paddingTop: 10,
            paddingBottom: 10,
            color: semanticDiffExplorerColors.foreground,
            ...semanticDiffExplorerFocusSx,
          },
        },
      },
    },
  });

export const semanticDiffExplorerTheme = createSemanticDiffTheme();
