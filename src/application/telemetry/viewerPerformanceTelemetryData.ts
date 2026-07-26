import {
  isTelemetryCountBucket,
  isTelemetryDurationBucket,
  type TelemetryCountBucket,
  type TelemetryDurationBucket,
} from "./telemetryBuckets";

export type PerformanceTelemetryResult = "success" | "failed";

export const viewerPerformanceTelemetryOperations = [
  "flow_graph_build",
  "table_render",
  "flow_render",
  "csv_export",
] as const;

export type ViewerPerformanceTelemetryOperation =
  (typeof viewerPerformanceTelemetryOperations)[number];

export type ViewerPerformanceTelemetryData = {
  operation: ViewerPerformanceTelemetryOperation;
  result: PerformanceTelemetryResult;
  durationBucket?: TelemetryDurationBucket;
  rowCountBucket?: TelemetryCountBucket;
  nodeCountBucket?: TelemetryCountBucket;
  edgeCountBucket?: TelemetryCountBucket;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isOptionalCountBucket = (value: unknown): boolean =>
  value === undefined || isTelemetryCountBucket(value);

const isOptionalDurationBucket = (value: unknown): boolean =>
  value === undefined || isTelemetryDurationBucket(value);

export const isViewerPerformanceTelemetryData = (
  value: unknown,
): value is ViewerPerformanceTelemetryData =>
  isRecord(value) &&
  viewerPerformanceTelemetryOperations.includes(
    value.operation as ViewerPerformanceTelemetryOperation,
  ) &&
  (value.result === "success" || value.result === "failed") &&
  isOptionalDurationBucket(value.durationBucket) &&
  isOptionalCountBucket(value.rowCountBucket) &&
  isOptionalCountBucket(value.nodeCountBucket) &&
  isOptionalCountBucket(value.edgeCountBucket);
