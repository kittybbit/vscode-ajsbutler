import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import { filterSemanticDiffExplorerViewModel } from "../../../../application/semantic-diff/semanticDiffExplorer";
import {
  createViewerTheme,
  viewerGlobalStyles,
} from "../../shared/viewerTheme";
import {
  getSemanticDiffExplorerLabels,
  type SemanticDiffExplorerLabels,
} from "./semanticDiffExplorerLocalization";
import {
  useSemanticDiffExplorerHost,
  type ExplorerHostState,
} from "./semanticDiffExplorerHostState";
import { MyAppContextProvider, useMyAppContext } from "../MyContexts";
import SemanticDiffExplorerContents from "./SemanticDiffExplorerContents";

type SemanticDiffExplorerThemeMode = "light" | "dark";

const ExplorerThemeShell = ({
  children,
  themeMode,
}: Readonly<{
  children: React.ReactNode;
  themeMode: SemanticDiffExplorerThemeMode;
}>): React.ReactElement => {
  const theme = createViewerTheme({ mode: themeMode });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={viewerGlobalStyles(theme)} />
      {children}
    </ThemeProvider>
  );
};

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
    <SemanticDiffExplorerContents
      viewModel={state.viewModel}
      language={language}
      themeMode={themeMode}
      outputAction={outputAction}
      calendarAction={calendarAction}
      action={sendAction}
      hostAnnouncement={announcement}
    />
  );
};

const SemanticDiffExplorerInnerApp = (): React.ReactElement => {
  const bridge = useSemanticDiffExplorerHost();
  const { isDarkMode, lang = "en" } = useMyAppContext();
  const themeMode = isDarkMode ? "dark" : "light";
  const labels = getSemanticDiffExplorerLabels(lang);
  return (
    <ExplorerThemeShell themeMode={themeMode}>
      {bridge.state ? (
        <ExplorerLoadedView
          state={bridge.state}
          language={lang}
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
      )}
    </ExplorerThemeShell>
  );
};

export const SemanticDiffExplorerApp = (): React.ReactElement => (
  <MyAppContextProvider scrollType="window">
    <SemanticDiffExplorerInnerApp />
  </MyAppContextProvider>
);

export const applyExplorerFilter = filterSemanticDiffExplorerViewModel;
export default SemanticDiffExplorerApp;
