import {
  createTelemetryEvent,
  telemetryEvents,
  telemetryPropertyKeys,
  type TelemetryEvent,
  type TelemetryEventDefinition,
} from "./telemetryEvent";
import type { TelemetryHost } from "./viewerTelemetry";

export type SearchTelemetrySurface = "table" | "flow";
export type SearchTelemetryAction = "submitted" | "navigated" | "cleared";
export type SearchTelemetryResult = "matched" | "no_match" | "cleared";
export type SearchTelemetryMode = "partial";
export type SearchTelemetryScope = "visible_rows" | "current_flow_scope";

const searchEvents: Record<
  SearchTelemetrySurface,
  Record<SearchTelemetryAction, TelemetryEventDefinition>
> = {
  table: {
    submitted: telemetryEvents.searchTableSubmitted,
    navigated: telemetryEvents.searchTableNavigated,
    cleared: telemetryEvents.searchTableCleared,
  },
  flow: {
    submitted: telemetryEvents.searchFlowSubmitted,
    navigated: telemetryEvents.searchFlowNavigated,
    cleared: telemetryEvents.searchFlowCleared,
  },
};

export const createSearchTelemetryEvent = ({
  surface,
  action,
  result,
  host,
  mode,
  queryLengthBucket,
  resultCountBucket,
  durationBucket,
  scope,
}: {
  surface: SearchTelemetrySurface;
  action: SearchTelemetryAction;
  result: SearchTelemetryResult;
  host?: TelemetryHost;
  mode: SearchTelemetryMode;
  queryLengthBucket?: string;
  resultCountBucket?: string;
  durationBucket?: string;
  scope: SearchTelemetryScope;
}): TelemetryEvent =>
  createTelemetryEvent(searchEvents[surface][action], {
    [telemetryPropertyKeys.development]: DEVELOPMENT,
    [telemetryPropertyKeys.host]: host,
    [telemetryPropertyKeys.surface]: surface,
    [telemetryPropertyKeys.mode]: mode,
    [telemetryPropertyKeys.result]: result,
    [telemetryPropertyKeys.queryLengthBucket]: queryLengthBucket,
    [telemetryPropertyKeys.resultCountBucket]: resultCountBucket,
    [telemetryPropertyKeys.durationBucket]: durationBucket,
    [telemetryPropertyKeys.scope]: scope,
  });
