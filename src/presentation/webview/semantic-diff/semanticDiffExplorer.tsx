import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import { filterSemanticDiffExplorerViewModel } from "../../../application/semantic-diff/semanticDiffExplorer";
import {
  createSemanticDiffTheme,
  semanticDiffExplorerGlobalStyles,
} from "../shared/muiTheme";
import SemanticDiffExplorerView from "./semanticDiffExplorerView";
import {
  getSemanticDiffExplorerLabels,
  type SemanticDiffExplorerLabels,
} from "./semanticDiffExplorerLocalization";
import {
  useSemanticDiffExplorerHost,
  type ExplorerHostState,
} from "./semanticDiffExplorerHostState";
import {
  useSemanticDiffExplorerThemeMode,
  type SemanticDiffExplorerThemeMode,
} from "./semanticDiffExplorerThemeMode";

const ExplorerLoadingView = ({
  labels,
  failure,
  announcement,
  themeMode,
}: Readonly<{
  labels: SemanticDiffExplorerLabels;
  failure: string | undefined;
  announcement: string;
  themeMode: SemanticDiffExplorerThemeMode;
}>): React.ReactElement => (
  <ThemeProvider theme={createSemanticDiffTheme({ mode: themeMode })}>
    <CssBaseline />
    <GlobalStyles styles={semanticDiffExplorerGlobalStyles} />
    <Box
      component="main"
      aria-labelledby="semantic-diff-explorer-title"
      data-semantic-diff-theme-mode={themeMode}
      sx={{ p: 2 }}
    >
      <Typography component="h1" variant="h4" id="semantic-diff-explorer-title">
        {labels.title}
      </Typography>
      <Typography component="p" role="status" aria-live="polite">
        {failure ?? labels.loading}
      </Typography>
      <Typography component="div" aria-live="polite" aria-atomic="true">
        {announcement}
      </Typography>
    </Box>
  </ThemeProvider>
);

const ExplorerLoadedView = ({
  state,
  language,
  outputActionId,
  sendAction,
  announcement,
  themeMode,
}: Readonly<{
  state: ExplorerHostState;
  language: string;
  outputActionId: string | undefined;
  sendAction: (actionId: string, element?: HTMLElement) => void;
  announcement: string;
  themeMode: SemanticDiffExplorerThemeMode;
}>): React.ReactElement => {
  const outputAction = outputActionId
    ? (element?: HTMLElement): void => sendAction(outputActionId, element)
    : undefined;
  return (
    <SemanticDiffExplorerView
      viewModel={state.viewModel}
      language={language}
      themeMode={themeMode}
      outputAction={outputAction}
      action={sendAction}
      hostAnnouncement={announcement}
    />
  );
};

export const SemanticDiffExplorerApp = (): React.ReactElement => {
  const bridge = useSemanticDiffExplorerHost();
  const themeMode = useSemanticDiffExplorerThemeMode();
  const labels = getSemanticDiffExplorerLabels(bridge.language);
  return bridge.state ? (
    <ExplorerLoadedView
      state={bridge.state}
      language={bridge.language}
      outputActionId={bridge.outputActionId}
      sendAction={bridge.sendAction}
      announcement={bridge.hostAnnouncement}
      themeMode={themeMode}
    />
  ) : (
    <ExplorerLoadingView
      labels={labels}
      failure={bridge.hostFailure}
      announcement={bridge.hostAnnouncement}
      themeMode={themeMode}
    />
  );
};

export const applyExplorerFilter = filterSemanticDiffExplorerViewModel;
export default SemanticDiffExplorerApp;
