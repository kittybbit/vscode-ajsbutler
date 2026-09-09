import type { SemanticDiffSourcePosition } from "./AjsParserWithSourceIndexPort";

export const isPlainRecord = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const hasExactKeys = (
  value: unknown,
  keys: readonly string[],
): value is Record<string, unknown> => {
  if (!isPlainRecord(value)) return false;
  const ownKeys = Object.keys(value);
  if (ownKeys.length !== keys.length) return false;
  return keys.every((key) => Object.prototype.hasOwnProperty.call(value, key));
};

export const isNonNegativeInteger = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  Number.isInteger(value) &&
  value >= 0;

export const compareSourcePositions = (
  left: SemanticDiffSourcePosition,
  right: SemanticDiffSourcePosition,
): number => left.line - right.line || left.character - right.character;
