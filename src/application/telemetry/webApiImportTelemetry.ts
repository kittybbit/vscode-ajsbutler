import {
  toCountBucket,
  toDurationBucket,
  toHttpStatusCategory,
} from "./telemetryBuckets";
import {
  createTelemetryEvent,
  telemetryEvents,
  telemetryPropertyKeys,
  type TelemetryEvent,
} from "./telemetryEvent";

export type WebApiImportTelemetryHost = "desktop" | "web";

export type WebApiImportTelemetryStage =
  | "started"
  | "cancelled"
  | "failed"
  | "completed"
  | "unsupported_host";

export type WebApiImportTelemetryInputStep =
  | "base_url"
  | "manager"
  | "service_name"
  | "location"
  | "username"
  | "password";

const webApiImportEvents = {
  started: telemetryEvents.webApiImportWorkflowStarted,
  cancelled: telemetryEvents.webApiImportWorkflowCancelled,
  failed: telemetryEvents.webApiImportWorkflowFailed,
  completed: telemetryEvents.webApiImportWorkflowCompleted,
  unsupported_host: telemetryEvents.webApiImportWorkflowUnsupportedHost,
};

export const createWebApiImportWorkflowEvent = ({
  host,
  stage,
  result,
  durationMs,
  inputStep,
  errorCode,
  httpStatus,
  unitCount,
  all,
}: {
  host: WebApiImportTelemetryHost;
  stage: WebApiImportTelemetryStage;
  result: "started" | "success" | "cancelled" | "failed" | "unsupported_host";
  durationMs?: number;
  inputStep?: WebApiImportTelemetryInputStep;
  errorCode?: string;
  httpStatus?: number;
  unitCount?: number;
  all?: boolean;
}): TelemetryEvent => {
  const definition = webApiImportEvents[stage];

  return createTelemetryEvent(definition, {
    [telemetryPropertyKeys.development]: DEVELOPMENT,
    [telemetryPropertyKeys.host]: host,
    [telemetryPropertyKeys.stage]: stage,
    [telemetryPropertyKeys.result]: result,
    [telemetryPropertyKeys.durationBucket]:
      durationMs === undefined ? undefined : toDurationBucket(durationMs),
    [telemetryPropertyKeys.inputStep]: inputStep,
    [telemetryPropertyKeys.errorCode]: errorCode,
    [telemetryPropertyKeys.httpStatusCategory]:
      toHttpStatusCategory(httpStatus),
    [telemetryPropertyKeys.unitCountBucket]:
      unitCount === undefined ? undefined : toCountBucket(unitCount),
    [telemetryPropertyKeys.all]: all,
  });
};
