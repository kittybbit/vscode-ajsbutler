import {
  isTelemetryCountBucket,
  isTelemetryDurationBucket,
  type TelemetryCountBucket,
  type TelemetryDurationBucket,
} from "./telemetryBuckets";

export type SearchTelemetrySurface = "table" | "flow";
export type SearchTelemetryAction = "submitted" | "navigated" | "cleared";
export type SearchTelemetryResult = "matched" | "no_match" | "cleared";
export type SearchTelemetryMode = "partial";
export type SearchTelemetryScope = "visible_rows" | "current_flow_scope";

export type SearchTelemetryData = {
  surface: SearchTelemetrySurface;
  action: SearchTelemetryAction;
  result: SearchTelemetryResult;
  mode: SearchTelemetryMode;
  queryLengthBucket?: TelemetryCountBucket;
  resultCountBucket?: TelemetryCountBucket;
  durationBucket?: TelemetryDurationBucket;
  scope: SearchTelemetryScope;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isOptionalCountBucket = (value: unknown): boolean =>
  value === undefined || isTelemetryCountBucket(value);

const isOptionalDurationBucket = (value: unknown): boolean =>
  value === undefined || isTelemetryDurationBucket(value);

export const isSearchTelemetryData = (
  value: unknown,
): value is SearchTelemetryData =>
  isRecord(value) &&
  (value.surface === "table" || value.surface === "flow") &&
  (value.action === "submitted" ||
    value.action === "navigated" ||
    value.action === "cleared") &&
  (value.result === "matched" ||
    value.result === "no_match" ||
    value.result === "cleared") &&
  value.mode === "partial" &&
  isOptionalCountBucket(value.queryLengthBucket) &&
  isOptionalCountBucket(value.resultCountBucket) &&
  isOptionalDurationBucket(value.durationBucket) &&
  (value.scope === "visible_rows" || value.scope === "current_flow_scope");
