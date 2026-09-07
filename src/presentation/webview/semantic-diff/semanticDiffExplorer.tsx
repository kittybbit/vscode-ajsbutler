import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import { filterSemanticDiffExplorerViewModel } from "../../../application/semantic-diff/semanticDiffExplorer";
import {
  semanticDiffExplorerGlobalStyles,
  semanticDiffExplorerTheme,
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

const ExplorerLoadingView = ({
  labels,
  failure,
  announcement,
}: Readonly<{
  labels: SemanticDiffExplorerLabels;
  failure: string | undefined;
  announcement: string;
}>): React.ReactElement => (
  <ThemeProvider theme={semanticDiffExplorerTheme}>
    <CssBaseline />
    <GlobalStyles styles={semanticDiffExplorerGlobalStyles} />
    <Box
      component="main"
      aria-labelledby="semantic-diff-explorer-title"
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
}: Readonly<{
  state: ExplorerHostState;
  language: string;
  outputActionId: string | undefined;
  sendAction: (actionId: string, element?: HTMLElement) => void;
  announcement: string;
}>): React.ReactElement => {
  const outputAction = outputActionId
    ? (element?: HTMLElement): void => sendAction(outputActionId, element)
    : undefined;
  return (
    <SemanticDiffExplorerView
      viewModel={state.viewModel}
      language={language}
      outputAction={outputAction}
      action={sendAction}
      hostAnnouncement={announcement}
    />
  );
};

export const SemanticDiffExplorerApp = (): React.ReactElement => {
  const bridge = useSemanticDiffExplorerHost();
  const labels = getSemanticDiffExplorerLabels(bridge.language);
  return bridge.state ? (
    <ExplorerLoadedView
      state={bridge.state}
      language={bridge.language}
      outputActionId={bridge.outputActionId}
      sendAction={bridge.sendAction}
      announcement={bridge.hostAnnouncement}
    />
  ) : (
    <ExplorerLoadingView
      labels={labels}
      failure={bridge.hostFailure}
      announcement={bridge.hostAnnouncement}
    />
  );
};

export const applyExplorerFilter = filterSemanticDiffExplorerViewModel;
export default SemanticDiffExplorerApp;
