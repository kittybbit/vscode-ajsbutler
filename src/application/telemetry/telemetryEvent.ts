import type { TelemetryProperties } from "./TelemetryPort";

export const telemetryPropertyKeys = {
  all: "all",
  capability: "capability",
  development: "development",
  diagnosticCategory: "diagnosticCategory",
  diagnosticCountBucket: "diagnosticCountBucket",
  diagnosticRuleId: "diagnosticRuleId",
  durationBucket: "durationBucket",
  edgeCountBucket: "edgeCountBucket",
  errorCode: "errorCode",
  expandedDepthBucket: "expandedDepthBucket",
  findingCountBucket: "findingCountBucket",
  host: "host",
  hoverTargetCategory: "hoverTargetCategory",
  httpStatusCategory: "httpStatusCategory",
  inputSizeBucket: "inputSizeBucket",
  inputStep: "inputStep",
  mode: "mode",
  nodeCountBucket: "nodeCountBucket",
  operation: "operation",
  outputSizeBucket: "outputSizeBucket",
  providerCategory: "providerCategory",
  queryLengthBucket: "queryLengthBucket",
  result: "result",
  resultCountBucket: "resultCountBucket",
  rowCountBucket: "rowCountBucket",
  safetyCategory: "safetyCategory",
  scope: "scope",
  selectedUnitType: "selectedUnitType",
  source: "source",
  stage: "stage",
  surface: "surface",
  targetUnitType: "targetUnitType",
  unitCountBucket: "unitCountBucket",
  view: "view",
  visibleColumnCountBucket: "visibleColumnCountBucket",
} as const;

export type TelemetryPropertyKey =
  (typeof telemetryPropertyKeys)[keyof typeof telemetryPropertyKeys];

export type TelemetryPropertyValue =
  | string
  | number
  | boolean
  | null
  | undefined;

export type TelemetryPropertyInput = Partial<
  Record<TelemetryPropertyKey | string, TelemetryPropertyValue>
>;

export type TelemetryEventDefinition<
  Name extends string = string,
  Key extends TelemetryPropertyKey = TelemetryPropertyKey,
> = Readonly<{
  name: Name;
  allowedProperties: readonly Key[];
}>;

export type TelemetryEvent<Name extends string = string> = Readonly<{
  name: Name;
  properties: TelemetryProperties;
}>;

const forbiddenTelemetryPropertyKeys = new Set<string>([
  "baseUrl",
  "comment",
  "command",
  "credential",
  "credentialRef",
  "definition",
  "definitionContent",
  "fileName",
  "filePath",
  "fileUri",
  "jobName",
  "location",
  "manager",
  "managerName",
  "organizationName",
  "orgName",
  "password",
  "path",
  "prompt",
  "rawError",
  "rawResponse",
  "response",
  "searchText",
  "serverName",
  "service",
  "serviceName",
  "stack",
  "stackTrace",
  "token",
  "unitName",
  "url",
  "userName",
  "username",
]);

export const telemetryEvents = {
  extensionLifecycleActivated: {
    name: "extension.lifecycle.activated",
    allowedProperties: [
      telemetryPropertyKeys.development,
      telemetryPropertyKeys.host,
      telemetryPropertyKeys.result,
    ],
  },
  extensionLifecycleDeactivated: {
    name: "extension.lifecycle.deactivated",
    allowedProperties: [
      telemetryPropertyKeys.development,
      telemetryPropertyKeys.host,
      telemetryPropertyKeys.result,
    ],
  },
  extensionTelemetryInitialized: {
    name: "extension.lifecycle.telemetry_initialized",
    allowedProperties: [
      telemetryPropertyKeys.development,
      telemetryPropertyKeys.host,
      telemetryPropertyKeys.result,
      telemetryPropertyKeys.errorCode,
    ],
  },
  viewerTableOpenStarted: {
    name: "viewer.table.open_started",
    allowedProperties: [
      telemetryPropertyKeys.development,
      telemetryPropertyKeys.host,
      telemetryPropertyKeys.source,
      telemetryPropertyKeys.result,
      telemetryPropertyKeys.errorCode,
    ],
  },
  viewerTableReady: {
    name: "viewer.table.ready",
    allowedProperties: [
      telemetryPropertyKeys.development,
      telemetryPropertyKeys.host,
      telemetryPropertyKeys.source,
      telemetryPropertyKeys.result,
      telemetryPropertyKeys.unitCountBucket,
      telemetryPropertyKeys.rowCountBucket,
      telemetryPropertyKeys.errorCode,
    ],
  },
  viewerTableClosed: {
    name: "viewer.table.closed",
    allowedProperties: [
      telemetryPropertyKeys.development,
      telemetryPropertyKeys.host,
      telemetryPropertyKeys.source,
      telemetryPropertyKeys.result,
    ],
  },
  viewerFlowOpenStarted: {
    name: "viewer.flow.open_started",
    allowedProperties: [
      telemetryPropertyKeys.development,
      telemetryPropertyKeys.host,
      telemetryPropertyKeys.source,
      telemetryPropertyKeys.result,
      telemetryPropertyKeys.errorCode,
    ],
  },
  viewerFlowReady: {
    name: "viewer.flow.ready",
    allowedProperties: [
      telemetryPropertyKeys.development,
      telemetryPropertyKeys.host,
      telemetryPropertyKeys.source,
      telemetryPropertyKeys.result,
      telemetryPropertyKeys.nodeCountBucket,
      telemetryPropertyKeys.edgeCountBucket,
      telemetryPropertyKeys.errorCode,
    ],
  },
  viewerFlowClosed: {
    name: "viewer.flow.closed",
    allowedProperties: [
      telemetryPropertyKeys.development,
      telemetryPropertyKeys.host,
      telemetryPropertyKeys.source,
      telemetryPropertyKeys.result,
    ],
  },
  webApiImportWorkflowStarted: {
    name: "webapi_import.workflow.started",
    allowedProperties: [
      telemetryPropertyKeys.development,
      telemetryPropertyKeys.host,
      telemetryPropertyKeys.stage,
      telemetryPropertyKeys.result,
    ],
  },
  webApiImportWorkflowCancelled: {
    name: "webapi_import.workflow.cancelled",
    allowedProperties: [
      telemetryPropertyKeys.development,
      telemetryPropertyKeys.host,
      telemetryPropertyKeys.stage,
      telemetryPropertyKeys.result,
      telemetryPropertyKeys.durationBucket,
      telemetryPropertyKeys.inputStep,
    ],
  },
  webApiImportWorkflowFailed: {
    name: "webapi_import.workflow.failed",
    allowedProperties: [
      telemetryPropertyKeys.development,
      telemetryPropertyKeys.host,
      telemetryPropertyKeys.stage,
      telemetryPropertyKeys.result,
      telemetryPropertyKeys.durationBucket,
      telemetryPropertyKeys.errorCode,
      telemetryPropertyKeys.httpStatusCategory,
    ],
  },
  webApiImportWorkflowCompleted: {
    name: "webapi_import.workflow.completed",
    allowedProperties: [
      telemetryPropertyKeys.development,
      telemetryPropertyKeys.host,
      telemetryPropertyKeys.stage,
      telemetryPropertyKeys.result,
      telemetryPropertyKeys.durationBucket,
      telemetryPropertyKeys.unitCountBucket,
      telemetryPropertyKeys.all,
    ],
  },
  webApiImportWorkflowUnsupportedHost: {
    name: "webapi_import.workflow.unsupported_host",
    allowedProperties: [
      telemetryPropertyKeys.development,
      telemetryPropertyKeys.host,
      telemetryPropertyKeys.stage,
      telemetryPropertyKeys.result,
      telemetryPropertyKeys.durationBucket,
      telemetryPropertyKeys.errorCode,
    ],
  },
} as const satisfies Record<string, TelemetryEventDefinition>;

export const createTelemetryEvent = <Name extends string>(
  definition: TelemetryEventDefinition<Name>,
  inputProperties: TelemetryPropertyInput = {},
): TelemetryEvent<Name> => ({
  name: definition.name,
  properties: allowTelemetryProperties(
    definition.allowedProperties,
    inputProperties,
  ),
});

export const allowTelemetryProperties = (
  allowedProperties: readonly TelemetryPropertyKey[],
  inputProperties: TelemetryPropertyInput,
): TelemetryProperties => {
  const allowed = new Set<string>(allowedProperties);
  const properties: TelemetryProperties = {};

  for (const [key, value] of Object.entries(inputProperties)) {
    if (!allowed.has(key) || forbiddenTelemetryPropertyKeys.has(key)) {
      continue;
    }

    if (value === undefined || value === null) {
      continue;
    }

    properties[key] = String(value);
  }

  return properties;
};
