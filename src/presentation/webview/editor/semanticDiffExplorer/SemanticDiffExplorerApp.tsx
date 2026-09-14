import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import { filterSemanticDiffExplorerViewModel } from "../../../../application/semantic-diff/semanticDiffExplorer";
import {
  createSemanticDiffTheme,
  semanticDiffExplorerGlobalStyles,
} from "../../shared/muiTheme";
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
import SemanticDiffExplorerContents from "./SemanticDiffExplorerContents";

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
    <Stack
      component="main"
      aria-labelledby="semantic-diff-explorer-title"
      data-semantic-diff-theme-mode={themeMode}
      spacing={1}
      sx={{ minHeight: "100vh", p: 2 }}
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
    </Stack>
  </ThemeProvider>
);

const ExplorerLoadedView = ({
  state,
  language,
  outputActionId,
  calendarActionId,
  sendAction,
  announcement,
  themeMode,
}: Readonly<{
  state: ExplorerHostState;
  language: string;
  outputActionId: string | undefined;
  calendarActionId: string | undefined;
  sendAction: (actionId: string, element?: HTMLElement) => void;
  announcement: string;
  themeMode: SemanticDiffExplorerThemeMode;
}>): React.ReactElement => {
  const outputAction = outputActionId
    ? (element?: HTMLElement): void => sendAction(outputActionId, element)
    : undefined;
  const calendarAction = calendarActionId
    ? (element?: HTMLElement): void => sendAction(calendarActionId, element)
    : undefined;
  return (
    <ThemeProvider theme={createSemanticDiffTheme({ mode: themeMode })}>
      <CssBaseline />
      <GlobalStyles styles={semanticDiffExplorerGlobalStyles} />
      <SemanticDiffExplorerContents
        viewModel={state.viewModel}
        language={language}
        themeMode={themeMode}
        outputAction={outputAction}
        calendarAction={calendarAction}
        action={sendAction}
        hostAnnouncement={announcement}
      />
    </ThemeProvider>
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
      calendarActionId={bridge.calendarActionId}
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
