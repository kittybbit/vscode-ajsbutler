import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import type { SemanticDiffScheduleImpact } from "../../../../application/semantic-diff/semanticDiffScheduleImpact";
import { getScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";
import { createScheduleImpactCalendarBridge } from "../scheduleImpactCalendarBridge";
import { viewerThemeGlobalStyles } from "../shared/viewerThemeStyles";
import {
  createSemanticDiffTheme,
  semanticDiffExplorerGlobalStyles,
} from "../../shared/muiTheme";
import ScheduleImpactCalendarContents from "./ScheduleImpactCalendarContents";

type CalendarState = Readonly<{
  sessionId: string;
  sidecar: SemanticDiffScheduleImpact;
}>;

export type ScheduleImpactCalendarAppProps = Readonly<{
  sidecar?: SemanticDiffScheduleImpact;
  language?: string;
  themeMode?: "light" | "dark";
}>;

const readLanguage = (fallback?: string): string =>
  fallback ?? document.documentElement.lang ?? "en";

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
      if (message.type === "session") {
        setState({ sessionId: message.sessionId, sidecar: message.payload });
      } else if (message.type === "failure") {
        setFailure(true);
      } else if (message.type === "close") {
        setState(undefined);
      }
    });
    bridge.sendReady();
    return () => {
      unsubscribe();
      bridge.dispose();
    };
  }, [sessionId]);
  return { state, failure };
};

const ScheduleImpactCalendarTheme = ({
  children,
  themeMode,
}: Readonly<{
  children: React.ReactNode;
  themeMode: "light" | "dark";
}>): React.ReactElement => (
  <ThemeProvider theme={createSemanticDiffTheme({ mode: themeMode })}>
    <CssBaseline />
    <GlobalStyles
      styles={{
        ...viewerThemeGlobalStyles,
        ...semanticDiffExplorerGlobalStyles,
      }}
    />
    {children}
  </ThemeProvider>
);

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
  <ScheduleImpactCalendarTheme themeMode={themeMode}>
    <ScheduleImpactCalendarContents sidecar={sidecar} language={language} />
  </ScheduleImpactCalendarTheme>
);

export const ScheduleImpactCalendarApp = ({
  sidecar: providedSidecar,
  language,
  themeMode = "light",
}: ScheduleImpactCalendarAppProps): React.ReactElement => {
  const session = useCalendarSession();
  const sidecar = providedSidecar ?? session.state?.sidecar;
  const labels = getScheduleImpactCalendarLabels(readLanguage(language));
  if (!sidecar)
    return (
      <ScheduleImpactCalendarTheme themeMode={themeMode}>
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
            {session.failure ? labels.failed : labels.title}
          </Box>
          {session.failure ? (
            <Alert severity="error" variant="outlined" role="status">
              {labels.error}
            </Alert>
          ) : (
            <Box role="status" aria-live="polite">
              {labels.loading}
            </Box>
          )}
        </Box>
      </ScheduleImpactCalendarTheme>
    );
  return (
    <ScheduleImpactCalendarTheme themeMode={themeMode}>
      <ScheduleImpactCalendarContents
        sidecar={sidecar}
        language={readLanguage(language)}
      />
    </ScheduleImpactCalendarTheme>
  );
};

export default ScheduleImpactCalendarApp;
