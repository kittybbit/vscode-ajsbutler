import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import type { SemanticDiffScheduleImpact } from "../../../../application/semantic-diff/semanticDiffScheduleImpact";
import { getScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";
import { MyAppContextProvider, useMyAppContext } from "../MyContexts";
import { createScheduleImpactCalendarBridge } from "./scheduleImpactCalendarBridge";
import {
  createViewerTheme,
  viewerGlobalStyles,
} from "../../shared/viewerTheme";
import ScheduleImpactCalendarContents from "./ScheduleImpactCalendarContents";

type CalendarState = Readonly<{
  sessionId: string;
  sidecar: SemanticDiffScheduleImpact;
}>;

type CalendarSessionMessage = Parameters<
  Parameters<
    ReturnType<typeof createScheduleImpactCalendarBridge>["onMessage"]
  >[0]
>[0];

const applyCalendarSessionMessage = (
  message: CalendarSessionMessage,
  setState: React.Dispatch<React.SetStateAction<CalendarState | undefined>>,
  setFailure: React.Dispatch<React.SetStateAction<boolean>>,
): void => {
  switch (message.type) {
    case "session":
      setState({ sessionId: message.sessionId, sidecar: message.payload });
      return;
    case "failure":
      setFailure(true);
      return;
    case "close":
      setState(undefined);
      return;
  }
};

export type ScheduleImpactCalendarAppProps = Readonly<{
  sidecar?: SemanticDiffScheduleImpact;
}>;

const useCalendarSession = (): Readonly<{
  state: CalendarState | undefined;
  failure: boolean;
}> => {
  const sessionId = document.body.dataset.scheduleImpactCalendarSessionId;
  const [state, setState] = useState<CalendarState | undefined>();
  const [failure, setFailure] = useState(false);
  useEffect(() => {
    if (!sessionId) {
      setFailure(true);
      return undefined;
    }
    const bridge = createScheduleImpactCalendarBridge(sessionId);
    const unsubscribe = bridge.onMessage((message) => {
      applyCalendarSessionMessage(message, setState, setFailure);
    });
    bridge.sendReady();
    return () => {
      unsubscribe();
      bridge.dispose();
    };
  }, [sessionId]);
  return { state, failure };
};

const CalendarThemeShell = ({
  children,
  themeMode,
}: Readonly<{
  children: React.ReactNode;
  themeMode: "light" | "dark";
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

/** Compatibility seam for supplied-sidecar component tests and callers. */
export const ScheduleImpactCalendarView = ({
  sidecar,
  language = "en",
  themeMode = "light",
}: Readonly<{
  sidecar: SemanticDiffScheduleImpact;
  language?: string;
  themeMode?: "light" | "dark";
}>): React.ReactElement => (
  <CalendarThemeShell themeMode={themeMode}>
    <ScheduleImpactCalendarContents sidecar={sidecar} language={language} />
  </CalendarThemeShell>
);

const ScheduleImpactCalendarInnerApp = ({
  providedSidecar,
}: Readonly<{
  providedSidecar?: SemanticDiffScheduleImpact;
}>): React.ReactElement => {
  const { isDarkMode, lang = "en" } = useMyAppContext();
  const session = useCalendarSession();
  const sidecar = providedSidecar ?? session.state?.sidecar;
  const themeMode = isDarkMode ? "dark" : "light";
  const labels = getScheduleImpactCalendarLabels(lang);
  return sidecar ? (
    <CalendarThemeShell themeMode={themeMode}>
      <ScheduleImpactCalendarContents sidecar={sidecar} language={lang} />
    </CalendarThemeShell>
  ) : (
    <CalendarThemeShell themeMode={themeMode}>
      <CalendarLoadingState labels={labels} failed={session.failure} />
    </CalendarThemeShell>
  );
};

const CalendarLoadingState = ({
  labels,
  failed,
}: Readonly<{
  labels: ReturnType<typeof getScheduleImpactCalendarLabels>;
  failed: boolean;
}>): React.ReactElement => (
  <Box
    component="main"
    aria-labelledby="schedule-impact-calendar-title"
    sx={{ p: 2 }}
  >
    <Box
      component="h1"
      id="schedule-impact-calendar-title"
      sx={{ typography: "h4" }}
    >
      {failed ? labels.failed : labels.title}
    </Box>
    {failed ? (
      <Alert severity="error" variant="outlined" role="status">
        {labels.error}
      </Alert>
    ) : (
      <Box role="status" aria-live="polite">
        {labels.loading}
      </Box>
    )}
  </Box>
);

export const ScheduleImpactCalendarApp = ({
  sidecar,
}: ScheduleImpactCalendarAppProps = {}): React.ReactElement => (
  <MyAppContextProvider scrollType="window">
    <ScheduleImpactCalendarInnerApp providedSidecar={sidecar} />
  </MyAppContextProvider>
);

export default ScheduleImpactCalendarApp;
