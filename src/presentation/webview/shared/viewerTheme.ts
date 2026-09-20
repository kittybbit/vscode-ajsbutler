import { createTheme, type SxProps, type Theme } from "@mui/material/styles";

export const viewerTargetSizePx = 44;

export const viewerFocusSx: SxProps<Theme> = {
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

export const viewerSelectionSx = (
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

export const viewerFocusBorder = (theme: Theme): string =>
  `var(--vscode-focusBorder, ${theme.palette.primary.main})`;

export const viewerSelectionBorder = (theme: Theme): string =>
  `var(--vscode-list-activeSelectionBackground, ${theme.palette.secondary.main})`;

export const viewerSearchBorder = (theme: Theme): string =>
  `var(--vscode-editor-findMatchBorder, ${theme.palette.success.main})`;

export const viewerPanelBorder = (theme: Theme): string =>
  `var(--vscode-widget-border, ${theme.palette.divider})`;

export const viewerPathBorder = (theme: Theme): string =>
  `var(--vscode-textLink-foreground, ${theme.palette.info.main})`;

export const viewerFocusTargetSx = {
  "&:focus": {
    outline: (theme) => `2px solid ${viewerFocusBorder(theme)}`,
    outlineOffset: "-2px",
  },
  "@media (forced-colors: active)": {
    "&:focus": {
      outline: "2px solid Highlight",
      outlineOffset: "-2px",
    },
  },
};

export const viewerFocusIndicatorSx = {
  "&:focus-visible": {
    outline: (theme) => `2px solid ${viewerFocusBorder(theme)}`,
    outlineOffset: "-2px",
  },
  "@media (forced-colors: active)": {
    "&:focus-visible": {
      outline: "2px solid Highlight",
      outlineOffset: "-2px",
    },
  },
};

/** Shared global viewer rules with the palette-derived base taking precedence over browser defaults. */
export const viewerGlobalStyles = (theme: Theme) => ({
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
      color: "var(--vscode-foreground, CanvasText)",
      backgroundColor: "var(--vscode-editor-background, Canvas)",
      "& #root": {
        color: "var(--vscode-foreground, CanvasText)",
        backgroundColor: "var(--vscode-editor-background, Canvas)",
      },
      "& .MuiPaper-root": {
        backgroundImage: "none",
      },
    },
  "@media (forced-colors: active)": {
    body: {
      color: "CanvasText",
      backgroundColor: "Canvas",
    },
    "#root": {
      backgroundColor: "Canvas",
      color: "CanvasText",
    },
    ".MuiPaper-root": {
      backgroundImage: "none",
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

export const viewerSurfaceSx: SxProps<Theme> = {
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

/** A theme-aware opaque surface for content that stays above a scrolling view. */
export const viewerOpaqueSurfaceSx = {
  backgroundColor: (theme) => theme.palette.background.paper,
  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
  boxShadow: (theme) => theme.shadows[1],
  "body.vscode-high-contrast &": {
    backgroundColor: "Canvas",
    color: "CanvasText",
    borderColor: "CanvasText",
    boxShadow: "none",
  },
  "@media (forced-colors: active)": {
    backgroundColor: "Canvas",
    color: "CanvasText",
    borderColor: "CanvasText",
    boxShadow: "none",
  },
};

export type ViewerThemeOptions = Readonly<{
  mode?: "light" | "dark";
}>;

export const createViewerTheme = (options: ViewerThemeOptions = {}): Theme =>
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
            minWidth: viewerTargetSizePx,
            minHeight: viewerTargetSizePx,
            textTransform: "none",
            whiteSpace: "normal",
            ...viewerFocusSx,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            minWidth: viewerTargetSizePx,
            minHeight: viewerTargetSizePx,
            ...viewerFocusSx,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            minHeight: viewerTargetSizePx,
            paddingTop: 10,
            paddingBottom: 10,
            boxSizing: "border-box",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            ...viewerFocusSx,
          },
        },
      },
    },
  });
