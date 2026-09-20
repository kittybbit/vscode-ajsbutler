const isObjectValue = (value: unknown): value is object =>
  value !== null && typeof value === "object";

const shouldVisit = (value: unknown, seen: Set<object>): value is object =>
  isObjectValue(value) && !seen.has(value);

const assertArrayValues = (
  value: readonly unknown[],
  path: string,
  seen: Set<object>,
): void => {
  value.forEach((entry, index) =>
    assertNoUndefined(entry, `${path}[${index}]`, seen),
  );
};

const assertObjectValues = (
  value: object,
  path: string,
  seen: Set<object>,
): void => {
  Object.entries(value).forEach(([key, entry]) =>
    assertNoUndefined(entry, `${path}.${key}`, seen),
  );
};

const assertCompositeValues = (
  value: object,
  path: string,
  seen: Set<object>,
): void => {
  if (Array.isArray(value)) {
    assertArrayValues(value, path, seen);
    return;
  }
  assertObjectValues(value, path, seen);
};

/** Reject undefined members while allowing repeated and cyclic references. */
export const assertNoUndefined = (
  value: unknown,
  path = "$",
  seen = new Set<object>(),
): void => {
  if (value === undefined) {
    throw new TypeError(
      `Semantic Diff JSON has an undefined value at ${path}.`,
    );
  }
  if (!shouldVisit(value, seen)) return;
  seen.add(value);
  assertCompositeValues(value, path, seen);
};

export const requiredValue = <T>(value: T | undefined, field: string): T => {
  if (value === undefined) {
    throw new TypeError(`Semantic Diff JSON requires ${field}.`);
  }
  return value;
};

export const requiredNullable = <T>(
  value: T | null | undefined,
  field: string,
): T | null => requiredValue(value, field);

export const finiteNumber = (value: number, field: string): number => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`Semantic Diff JSON requires a finite ${field}.`);
  }
  return value;
};
