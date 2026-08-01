import type { Theme } from "@mui/material/styles";

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

export const viewerThemeGlobalStyles = {
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
      color: "CanvasText",
      backgroundColor: "Canvas",
    },
    ".MuiPaper-root": {
      backgroundImage: "none",
    },
  },
};
