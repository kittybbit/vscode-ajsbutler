import type { ValidatedTelemetryEvent } from "./TelemetryPort";

export type TelemetryHost = "desktop" | "web";
export type ViewerFeature = "table" | "flow";
export type TelemetryResult = "success" | "failed" | "cancelled";
export type ExportMethod = "copy" | "save";

const enumValues = {
  host: ["desktop", "web"],
  feature: ["table", "flow"],
  result: ["success", "failed", "cancelled"],
  viewerResult: ["success", "failed"],
  method: ["copy", "save"],
} as const;

const eventProperties = {
  "extension.activated": { host: enumValues.host },
  "viewer.open_completed": {
    feature: enumValues.feature,
    host: enumValues.host,
    result: enumValues.viewerResult,
  },
  "search.executed": { feature: enumValues.feature },
  "csv.exported": { method: enumValues.method },
  "webapi_import.completed": { result: enumValues.result },
  "semantic_diff.completed": { result: enumValues.result },
  "semantic_diff.exported": { method: enumValues.method },
} as const;

type TelemetryEventName = keyof typeof eventProperties;

type EventPropertyValues = {
  "extension.activated": { host: TelemetryHost };
  "viewer.open_completed": {
    feature: ViewerFeature;
    host: TelemetryHost;
    result: "success" | "failed";
  };
  "search.executed": { feature: ViewerFeature };
  "csv.exported": { method: ExportMethod };
  "webapi_import.completed": { result: TelemetryResult };
  "semantic_diff.completed": { result: TelemetryResult };
  "semantic_diff.exported": { method: ExportMethod };
};

type TelemetryEvent<Name extends TelemetryEventName = TelemetryEventName> =
  ValidatedTelemetryEvent<Name>;

const createEvent = <Name extends TelemetryEventName>(
  name: Name,
  properties: EventPropertyValues[Name],
): TelemetryEvent<Name> =>
  ({ name, properties }) as unknown as TelemetryEvent<Name>;

export const createExtensionActivatedEvent = (
  host: TelemetryHost,
): TelemetryEvent<"extension.activated"> =>
  createEvent("extension.activated", { host });

export const createViewerOpenCompletedEvent = ({
  feature,
  host,
  result,
}: EventPropertyValues["viewer.open_completed"]): TelemetryEvent<"viewer.open_completed"> =>
  createEvent("viewer.open_completed", { feature, host, result });

export const createSearchExecutedEvent = (
  feature: ViewerFeature,
): TelemetryEvent<"search.executed"> =>
  createEvent("search.executed", { feature });

export const createCsvExportedEvent = (
  method: ExportMethod,
): TelemetryEvent<"csv.exported"> => createEvent("csv.exported", { method });

export const createWebApiImportCompletedEvent = (
  result: TelemetryResult,
): TelemetryEvent<"webapi_import.completed"> =>
  createEvent("webapi_import.completed", { result });

export const createSemanticDiffCompletedEvent = (
  result: TelemetryResult,
): TelemetryEvent<"semantic_diff.completed"> =>
  createEvent("semantic_diff.completed", { result });

export const createSemanticDiffExportedEvent = (
  method: ExportMethod,
): TelemetryEvent<"semantic_diff.exported"> =>
  createEvent("semantic_diff.exported", { method });

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  Object.getPrototypeOf(value) === Object.prototype;

const hasExactKeys = (
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean => {
  const ownKeys = Reflect.ownKeys(value);
  return (
    ownKeys.length === keys.length &&
    ownKeys.every((key) => typeof key === "string" && keys.includes(key))
  );
};

const readDataProperty = (
  value: Record<string, unknown>,
  key: string,
): unknown => {
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  return descriptor && "value" in descriptor ? descriptor.value : undefined;
};

const isEnumValue = (
  values: readonly string[],
  value: unknown,
): value is string => typeof value === "string" && values.includes(value);

const isEventProperties = (
  name: TelemetryEventName,
  value: unknown,
): value is Record<string, string> => {
  if (!isPlainRecord(value)) return false;
  const fields = eventProperties[name] as Record<string, readonly string[]>;
  const keys = Object.keys(fields);
  return (
    hasExactKeys(value, keys) &&
    keys.every((key) => isEnumValue(fields[key], readDataProperty(value, key)))
  );
};

type TelemetryEventEnvelope = {
  name: TelemetryEventName;
  properties: unknown;
};

const parseTelemetryEventName = (
  value: unknown,
): TelemetryEventName | undefined =>
  typeof value === "string" && Object.hasOwn(eventProperties, value)
    ? (value as TelemetryEventName)
    : undefined;

const isTelemetryEventEnvelope = (
  value: unknown,
): value is Record<string, unknown> =>
  isPlainRecord(value) && hasExactKeys(value, ["name", "properties"]);

const parseTelemetryEventEnvelope = (
  value: unknown,
): TelemetryEventEnvelope | undefined => {
  if (!isTelemetryEventEnvelope(value)) return undefined;
  const name = parseTelemetryEventName(readDataProperty(value, "name"));
  if (!name) return undefined;
  return { name, properties: readDataProperty(value, "properties") };
};

/** Rebuilds only one of the seven exact event shapes from untrusted input. */
export const parseTelemetryEvent = (
  value: unknown,
): TelemetryEvent | undefined => {
  const envelope = parseTelemetryEventEnvelope(value);
  if (!envelope || !isEventProperties(envelope.name, envelope.properties)) {
    return undefined;
  }
  return createEvent(envelope.name, envelope.properties as never);
};
