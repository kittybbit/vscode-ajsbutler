import * as assert from "assert";

type PendingValue = {
  path: string;
  value: unknown;
  leaving?: boolean;
};

const isJsonScalar = (value: unknown): boolean =>
  value === null ||
  typeof value === "string" ||
  typeof value === "boolean" ||
  (typeof value === "number" && Number.isFinite(value));

export const assertPlainJsonValue = (root: unknown): void => {
  const ancestors = new WeakSet<object>();
  const pending: PendingValue[] = [{ path: "$", value: root }];

  while (pending.length > 0) {
    const current = pending.pop() as PendingValue;
    if (isJsonScalar(current.value)) {
      continue;
    }
    if (typeof current.value !== "object" || current.value === null) {
      assert.fail(`${current.path} contains a non-JSON value.`);
    }
    if (current.leaving) {
      ancestors.delete(current.value);
      continue;
    }
    if (ancestors.has(current.value)) {
      assert.fail(`${current.path} contains a circular reference.`);
    }

    const isArray = Array.isArray(current.value);
    if (
      Object.getPrototypeOf(current.value) !==
      (isArray ? Array.prototype : Object.prototype)
    ) {
      assert.fail(`${current.path} contains a non-plain object.`);
    }
    const symbolKeys = Object.getOwnPropertySymbols(current.value);
    if (symbolKeys.length > 0) {
      assert.fail(`${current.path} contains a symbol key.`);
    }

    ancestors.add(current.value);
    pending.push({ ...current, leaving: true });
    if (isArray) {
      const values = current.value as unknown[];
      const stringKeys = Object.getOwnPropertyNames(values);
      if (
        stringKeys.some(
          (key) => key !== "length" && !/^(0|[1-9]\d*)$/.test(key),
        )
      ) {
        assert.fail(`${current.path} contains a non-index array property.`);
      }
      for (let index = 0; index < values.length; index++) {
        assert.ok(
          Object.prototype.hasOwnProperty.call(values, index),
          `${current.path} contains a sparse array item.`,
        );
        const value = values[index];
        pending.push({ path: `${current.path}[${index}]`, value });
      }
      continue;
    }
    Object.entries(current.value).forEach(([key, value]) => {
      pending.push({ path: `${current.path}.${key}`, value });
    });
  }
};
