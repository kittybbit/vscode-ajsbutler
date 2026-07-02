import {
  createTelemetryEvent,
  telemetryEvents,
  telemetryPropertyKeys,
  type TelemetryEvent,
} from "./telemetryEvent";

export type ViewerTelemetryKind = "table" | "flow" | "unknown";

export type TelemetryHost = "desktop" | "web";

export type ViewerTelemetrySource = "command" | "navigation" | "restore";

type ViewerTelemetryStage = "openStarted" | "ready" | "closed";

const tableViewerEvents = {
  openStarted: telemetryEvents.viewerTableOpenStarted,
  ready: telemetryEvents.viewerTableReady,
  closed: telemetryEvents.viewerTableClosed,
};

const flowViewerEvents = {
  openStarted: telemetryEvents.viewerFlowOpenStarted,
  ready: telemetryEvents.viewerFlowReady,
  closed: telemetryEvents.viewerFlowClosed,
};

export const resolveViewerTelemetryKind = (
  viewType: string,
): ViewerTelemetryKind => {
  if (viewType.endsWith(".tableViewer")) {
    return "table";
  }
  if (viewType.endsWith(".flowViewer")) {
    return "flow";
  }

  return "unknown";
};

export const createViewerOpenStartedEvent = ({
  viewType,
  source,
  result,
  host,
  errorCode,
}: {
  viewType: string;
  source: ViewerTelemetrySource;
  result: "success" | "failed" | "cancelled";
  host?: TelemetryHost;
  errorCode?: string;
}): TelemetryEvent | undefined =>
  createViewerEvent({
    viewType,
    stage: "openStarted",
    source,
    result,
    host,
    errorCode,
  });

export const createViewerReadyEvent = ({
  viewType,
  source,
  result,
  host,
  unitCountBucket,
  rowCountBucket,
  nodeCountBucket,
  edgeCountBucket,
  errorCode,
}: {
  viewType: string;
  source: ViewerTelemetrySource;
  result: "success" | "failed";
  host?: TelemetryHost;
  unitCountBucket?: string;
  rowCountBucket?: string;
  nodeCountBucket?: string;
  edgeCountBucket?: string;
  errorCode?: string;
}): TelemetryEvent | undefined =>
  createViewerEvent({
    viewType,
    stage: "ready",
    source,
    result,
    host,
    unitCountBucket,
    rowCountBucket,
    nodeCountBucket,
    edgeCountBucket,
    errorCode,
  });

export const createViewerClosedEvent = ({
  viewType,
  source,
  host,
}: {
  viewType: string;
  source?: ViewerTelemetrySource;
  host?: TelemetryHost;
}): TelemetryEvent | undefined =>
  createViewerEvent({
    viewType,
    stage: "closed",
    source,
    result: "success",
    host,
  });

const createViewerEvent = ({
  viewType,
  stage,
  source,
  result,
  host,
  unitCountBucket,
  rowCountBucket,
  nodeCountBucket,
  edgeCountBucket,
  errorCode,
}: {
  viewType: string;
  stage: ViewerTelemetryStage;
  source?: ViewerTelemetrySource;
  result: string;
  host?: TelemetryHost;
  unitCountBucket?: string;
  rowCountBucket?: string;
  nodeCountBucket?: string;
  edgeCountBucket?: string;
  errorCode?: string;
}): TelemetryEvent | undefined => {
  const kind = resolveViewerTelemetryKind(viewType);
  const definition = getViewerEventDefinition(kind, stage);
  if (!definition) {
    return undefined;
  }

  return createTelemetryEvent(definition, {
    [telemetryPropertyKeys.development]: DEVELOPMENT,
    [telemetryPropertyKeys.host]: host,
    [telemetryPropertyKeys.source]: source,
    [telemetryPropertyKeys.result]: result,
    [telemetryPropertyKeys.unitCountBucket]: unitCountBucket,
    [telemetryPropertyKeys.rowCountBucket]: rowCountBucket,
    [telemetryPropertyKeys.nodeCountBucket]: nodeCountBucket,
    [telemetryPropertyKeys.edgeCountBucket]: edgeCountBucket,
    [telemetryPropertyKeys.errorCode]: errorCode,
  });
};

const getViewerEventDefinition = (
  kind: ViewerTelemetryKind,
  stage: ViewerTelemetryStage,
) => {
  switch (kind) {
    case "table":
      return tableViewerEvents[stage];
    case "flow":
      return flowViewerEvents[stage];
    default:
      return undefined;
  }
};
