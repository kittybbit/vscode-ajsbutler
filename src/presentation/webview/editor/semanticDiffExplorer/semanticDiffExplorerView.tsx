import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import { filterSemanticDiffExplorerViewModel } from "../../../../application/semantic-diff/semanticDiffExplorer";
import {
  createViewerTheme,
  viewerGlobalStyles,
} from "../../shared/viewerTheme";
import SemanticDiffExplorerContents, {
  type SemanticDiffExplorerContentsProps,
} from "./SemanticDiffExplorerContents";
import {
  flattenSemanticDiffExplorerTree,
  focusExplorerRowAfterVirtualizedScroll,
} from "./semanticDiffExplorerTree";

export type SemanticDiffExplorerViewProps = Readonly<{
  viewModel: SemanticDiffExplorerContentsProps["viewModel"];
  language?: string;
  themeMode?: SemanticDiffExplorerContentsProps["themeMode"];
  outputAction?: (element?: HTMLElement) => void;
  calendarAction?: (element?: HTMLElement) => void;
  action?: (actionId: string, element?: HTMLElement) => void;
  hostAnnouncement?: string;
  virtualizedScrollToIndex?: (index: number) => void;
}>;

/**
 * Compatibility wrapper for direct view consumers. The production App owns
 * the theme boundary; this wrapper keeps the direct View API self-contained.
 */
export const SemanticDiffExplorerView = ({
  viewModel,
  language = "en",
  themeMode = "light",
  outputAction,
  calendarAction,
  action,
  hostAnnouncement,
  virtualizedScrollToIndex,
}: SemanticDiffExplorerViewProps): React.ReactElement => {
  const theme = createViewerTheme({ mode: themeMode });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={viewerGlobalStyles(theme)} />
      <SemanticDiffExplorerContents
        viewModel={viewModel}
        language={language}
        themeMode={themeMode}
        outputAction={outputAction}
        calendarAction={calendarAction}
        action={action}
        hostAnnouncement={hostAnnouncement}
        virtualizedScrollToIndex={virtualizedScrollToIndex}
      />
    </ThemeProvider>
  );
};

export {
  flattenSemanticDiffExplorerTree,
  focusExplorerRowAfterVirtualizedScroll,
};
export const applyExplorerFilter = filterSemanticDiffExplorerViewModel;
export default SemanticDiffExplorerView;
