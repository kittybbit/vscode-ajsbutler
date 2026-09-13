type JsonNodeKind = "scalar" | "container" | "invalid";

type JsonNodeClassifier = (value: unknown) => JsonNodeKind;

const classifyNumber: JsonNodeClassifier = (value) =>
  Number.isFinite(value) ? "scalar" : "invalid";

const jsonNodeClassifiers: Readonly<Record<string, JsonNodeClassifier>> = {
  string: () => "scalar",
  boolean: () => "scalar",
  number: classifyNumber,
  object: () => "container",
};

const classifyJsonNode = (value: unknown): JsonNodeKind => {
  if (value === null) return "scalar";
  return (jsonNodeClassifiers[typeof value] ?? (() => "invalid"))(value);
};

export const allChecksPass = (checks: readonly (() => boolean)[]): boolean =>
  checks.every((check) => check());

const hasOnlyJsonArrayKeys = (value: unknown[], key: string): boolean => {
  const index = Number(key);
  return allChecksPass([
    () => Number.isSafeInteger(index),
    () => index >= 0,
    () => String(index) === key,
    () => index < value.length,
  ]);
};

const hasJsonArrayElements = (
  value: unknown[],
  ancestors: Set<object>,
): boolean => {
  const indexes = Object.getOwnPropertyNames(value).filter((key) =>
    hasOnlyJsonArrayKeys(value, key),
  );
  return (
    indexes.length === value.length &&
    indexes.every((key) => isJsonValue(value[Number(key)], ancestors))
  );
};

const isJsonArray = (value: unknown[], ancestors: Set<object>): boolean =>
  allChecksPass([
    () => Object.getOwnPropertySymbols(value).length === 0,
    () => hasJsonArrayElements(value, ancestors),
    () => Object.keys(value).every((key) => hasOnlyJsonArrayKeys(value, key)),
  ]);

const isJsonObject = (value: object, ancestors: Set<object>): boolean =>
  allChecksPass([
    () => Object.getPrototypeOf(value) === Object.prototype,
    () => Object.getOwnPropertySymbols(value).length === 0,
    () =>
      Object.keys(value).every((key) =>
        isJsonValue((value as Record<string, unknown>)[key], ancestors),
      ),
  ]);

const inspectJsonContainerValue = (
  value: object,
  ancestors: Set<object>,
): boolean =>
  Array.isArray(value)
    ? isJsonArray(value, ancestors)
    : isJsonObject(value, ancestors);

const inspectJsonContainer = (
  value: object,
  ancestors: Set<object>,
): boolean =>
  Object.prototype.hasOwnProperty.call(value, "toJSON")
    ? false
    : inspectJsonContainerValue(value, ancestors);

const withJsonAncestors = (
  value: object,
  ancestors: Set<object>,
  inspect: (value: object, ancestors: Set<object>) => boolean,
): boolean => {
  if (ancestors.has(value)) return false;
  ancestors.add(value);
  try {
    return inspect(value, ancestors);
  } catch {
    return false;
  } finally {
    ancestors.delete(value);
  }
};

const jsonValueValidators: Readonly<
  Record<JsonNodeKind, (value: unknown, ancestors: Set<object>) => boolean>
> = {
  scalar: () => true,
  invalid: () => false,
  container: (value, ancestors) =>
    withJsonAncestors(value as object, ancestors, inspectJsonContainer),
};

const isJsonValue = (value: unknown, ancestors = new Set<object>()): boolean =>
  jsonValueValidators[classifyJsonNode(value)](value, ancestors);

export const isScheduleImpactCalendarJsonValue = (value: unknown): boolean =>
  isJsonValue(value);

export const encodedScheduleImpactCalendarJsonBytes = (
  value: unknown,
): number | undefined => {
  try {
    const json = JSON.stringify(value);
    return json === undefined
      ? undefined
      : new TextEncoder().encode(json).byteLength;
  } catch {
    return undefined;
  }
};
