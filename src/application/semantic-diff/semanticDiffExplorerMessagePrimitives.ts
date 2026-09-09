export type PlainRecord = Record<string, unknown>;

export const asPlainRecord = (value: unknown): PlainRecord | null => {
  const isObject = typeof value === "object" && value !== null;
  return isObject && Object.getPrototypeOf(value) === Object.prototype
    ? (value as PlainRecord)
    : null;
};

export const hasExactKeys = (
  value: PlainRecord,
  keys: readonly string[],
): boolean => {
  const actual = Object.keys(value);
  const sameLength = actual.length === keys.length;
  const containsAll = keys.every((key) => actual.includes(key));
  return sameLength && containsAll;
};

export const isFinitePositiveInteger = (value: unknown): value is number => {
  const isNumber = typeof value === "number";
  return (
    isNumber &&
    Number.isFinite(value) &&
    Number.isSafeInteger(value) &&
    value > 0
  );
};

const hasDenseArrayIndexes = (value: readonly unknown[]): boolean =>
  value.every((_, index) => Object.prototype.hasOwnProperty.call(value, index));

export const isDenseArray = (value: unknown): value is unknown[] => {
  if (!Array.isArray(value)) return false;
  return (
    Object.keys(value).length === value.length && hasDenseArrayIndexes(value)
  );
};

const isJsonScalar = (value: unknown): boolean => {
  switch (typeof value) {
    case "string":
    case "boolean":
      return true;
    case "number":
      return Number.isFinite(value);
    default:
      return false;
  }
};

const isJsonArray = (
  value: readonly unknown[],
  ancestors: ReadonlySet<object>,
): boolean => {
  if (!isDenseArray(value)) return false;
  return value.every((item) => isJsonValue(item, ancestors));
};

const isJsonObject = (
  value: PlainRecord,
  ancestors: ReadonlySet<object>,
): boolean =>
  Object.values(value).every((item) => isJsonValue(item, ancestors));

const isJsonRecordValue = (
  value: object,
  ancestors: ReadonlySet<object>,
): boolean => {
  const record = asPlainRecord(value);
  return record === null ? false : isJsonObject(record, ancestors);
};

export const isJsonValue = (
  value: unknown,
  ancestors: ReadonlySet<object> = new Set<object>(),
): boolean => {
  if (value === null) return true;
  if (typeof value !== "object") return isJsonScalar(value);
  return isJsonContainer(value, ancestors);
};

const isJsonContainer = (
  value: object,
  ancestors: ReadonlySet<object>,
): boolean => {
  if (ancestors.has(value)) return false;
  const nextAncestors = new Set(ancestors);
  nextAncestors.add(value);
  if (Array.isArray(value)) return isJsonArray(value, nextAncestors);
  return isJsonRecordValue(value, nextAncestors);
};

export const isStringArray = (value: unknown): value is string[] =>
  isDenseArray(value) && value.every((item) => typeof item === "string");

export const isNullableString = (value: unknown): value is string | null =>
  value === null || typeof value === "string";

export const isSide = (value: unknown): value is "before" | "after" | null =>
  value === null || value === "before" || value === "after";

export const isRelationType = (value: unknown): value is "seq" | "con" =>
  value === "seq" || value === "con";
