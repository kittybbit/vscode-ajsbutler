import {
  createTelemetryEvent,
  telemetryEvents,
  telemetryPropertyKeys,
  type TelemetryEvent,
  type TelemetryEventDefinition,
} from "./telemetryEvent";
import type { TelemetryHost } from "./viewerTelemetry";

export type PerformanceTelemetryOperation =
  | "parse"
  | "unit_list_build"
  | "flow_graph_build"
  | "table_render"
  | "flow_render"
  | "csv_export";

export type PerformanceTelemetryResult = "success" | "failed";

const performanceEvents: Record<
  PerformanceTelemetryOperation,
  TelemetryEventDefinition
> = {
  parse: telemetryEvents.performanceParseCompleted,
  unit_list_build: telemetryEvents.performanceUnitListBuildCompleted,
  flow_graph_build: telemetryEvents.performanceFlowGraphBuildCompleted,
  table_render: telemetryEvents.performanceTableRenderReady,
  flow_render: telemetryEvents.performanceFlowRenderReady,
  csv_export: telemetryEvents.performanceCsvExportCompleted,
};

export const createPerformanceTelemetryEvent = ({
  operation,
  result,
  host,
  durationBucket,
  unitCountBucket,
  rowCountBucket,
  nodeCountBucket,
  edgeCountBucket,
  diagnosticCountBucket,
  errorCode,
}: {
  operation: PerformanceTelemetryOperation;
  result: PerformanceTelemetryResult;
  host?: TelemetryHost;
  durationBucket?: string;
  unitCountBucket?: string;
  rowCountBucket?: string;
  nodeCountBucket?: string;
  edgeCountBucket?: string;
  diagnosticCountBucket?: string;
  errorCode?: string;
}): TelemetryEvent =>
  createTelemetryEvent(performanceEvents[operation], {
    [telemetryPropertyKeys.development]: DEVELOPMENT,
    [telemetryPropertyKeys.host]: host,
    [telemetryPropertyKeys.operation]: operation,
    [telemetryPropertyKeys.result]: result,
    [telemetryPropertyKeys.durationBucket]: durationBucket,
    [telemetryPropertyKeys.unitCountBucket]: unitCountBucket,
    [telemetryPropertyKeys.rowCountBucket]: rowCountBucket,
    [telemetryPropertyKeys.nodeCountBucket]: nodeCountBucket,
    [telemetryPropertyKeys.edgeCountBucket]: edgeCountBucket,
    [telemetryPropertyKeys.diagnosticCountBucket]: diagnosticCountBucket,
    [telemetryPropertyKeys.errorCode]: errorCode,
  });
