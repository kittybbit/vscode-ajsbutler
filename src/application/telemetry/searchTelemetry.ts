import {
  createTelemetryEvent,
  telemetryEvents,
  telemetryPropertyKeys,
  type TelemetryEvent,
  type TelemetryEventDefinition,
} from "./telemetryEvent";
import type { TelemetryHost } from "./viewerTelemetry";
import type {
  SearchTelemetryAction,
  SearchTelemetryData,
  SearchTelemetrySurface,
} from "./searchTelemetryData";

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
}: SearchTelemetryData & {
  host?: TelemetryHost;
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
