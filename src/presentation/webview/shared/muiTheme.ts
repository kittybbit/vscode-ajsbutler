import { createTheme, type SxProps, type Theme } from "@mui/material/styles";

export const semanticDiffExplorerTargetSizePx = 44;

export const semanticDiffExplorerFocusSx: SxProps<Theme> = {
  "&:focus-visible": {
    outline: (theme) => `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },
  "@media (forced-colors: active)": {
    "&:focus-visible": {
      outline: "2px solid Highlight",
      outlineOffset: "2px",
    },
  },
};

export const semanticDiffExplorerSelectionSx = (
  selected: boolean,
): {
  borderLeft: string;
  borderLeftColor: string;
  "@media (forced-colors: active)": { borderLeftColor: string };
} => ({
  borderLeft: "4px solid",
  borderLeftColor: selected ? "primary.main" : "transparent",
  "@media (forced-colors: active)": {
    borderLeftColor: selected ? "Highlight" : "transparent",
  },
});

export const semanticDiffExplorerGlobalStyles = (theme: Theme) => ({
  html: {
    backgroundColor: theme.palette.background.default,
  },
  body: {
    margin: 0,
    minWidth: 0,
    minHeight: "100%",
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    fontFamily: "var(--vscode-font-family, sans-serif)",
    fontSize: "var(--vscode-font-size, 13px)",
    lineHeight: 1.5,
  },
  "body.vscode-high-contrast, body.vscode-high-contrast-light, body.vscode-high-contrast-dark":
    {
      backgroundColor: "Canvas",
      color: "CanvasText",
      "& #root": {
        backgroundColor: "Canvas",
        color: "CanvasText",
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
});

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
    background: "Canvas",
  },
  "@media (forced-colors: active)": {
    background: "Canvas",
  },
  boxSizing: "border-box",
};

export type SemanticDiffThemeOptions = Readonly<{
  mode?: "light" | "dark";
}>;

export const createSemanticDiffTheme = (
  options: SemanticDiffThemeOptions = {},
): Theme =>
  createTheme({
    palette: {
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
            ...semanticDiffExplorerFocusSx,
          },
        },
      },
    },
  });

export const semanticDiffExplorerTheme = createSemanticDiffTheme();
