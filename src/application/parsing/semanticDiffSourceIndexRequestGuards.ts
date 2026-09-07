import type { SemanticDiffSourceLookupRequest } from "./AjsParserWithSourceIndexPort";
import {
  hasExactKeys,
  isPlainRecord,
} from "./semanticDiffSourceIndexPrimitives";

const isAttributeLookupRequest = (
  value: Record<string, unknown>,
): value is Extract<
  SemanticDiffSourceLookupRequest,
  { targetKind: "attribute" }
> =>
  hasExactKeys(value, [
    "sourceIndexId",
    "unitId",
    "targetKind",
    "parameterKey",
  ]) &&
  typeof value.parameterKey === "string" &&
  value.parameterKey.length > 0;

const isUnitLookupRequest = (
  value: Record<string, unknown>,
): value is Exclude<
  SemanticDiffSourceLookupRequest,
  { targetKind: "attribute" }
> =>
  hasExactKeys(value, ["sourceIndexId", "unitId", "targetKind"]) &&
  (value.targetKind === "unit" ||
    value.targetKind === "jobnet" ||
    value.targetKind === "jobgroup");

const hasLookupRequestBase = (value: Record<string, unknown>): boolean => {
  if (typeof value.sourceIndexId !== "string") return false;
  if (typeof value.unitId !== "string") return false;
  return typeof value.targetKind === "string";
};

const isLookupTarget = (value: Record<string, unknown>): boolean =>
  value.targetKind === "attribute"
    ? isAttributeLookupRequest(value)
    : isUnitLookupRequest(value);

export const isLookupRequest = (
  value: unknown,
): value is SemanticDiffSourceLookupRequest => {
  if (!isPlainRecord(value) || !hasLookupRequestBase(value)) return false;
  return isLookupTarget(value);
};

const hasLookupRequestIdentity = (value: Record<string, unknown>): boolean =>
  typeof value.sourceIndexId === "string" && typeof value.unitId === "string";

const hasMissingParameterKeyShape = (
  value: Record<string, unknown>,
): boolean => {
  const hasBaseKeys = hasExactKeys(value, [
    "sourceIndexId",
    "unitId",
    "targetKind",
  ]);
  const hasParameterKey = hasExactKeys(value, [
    "sourceIndexId",
    "unitId",
    "targetKind",
    "parameterKey",
  ]);
  const hasExpectedShape = hasBaseKeys || hasParameterKey;
  const hasInvalidValue =
    typeof value.parameterKey !== "string" || value.parameterKey.length === 0;
  return hasExpectedShape && hasInvalidValue;
};

export const isAttributeRequestMissingParameterKey = (
  value: unknown,
): boolean => {
  if (!isPlainRecord(value)) return false;
  return isMissingAttributeKey(value);
};

const isMissingAttributeKey = (value: Record<string, unknown>): boolean => {
  if (value.targetKind !== "attribute") return false;
  if (!hasLookupRequestIdentity(value)) return false;
  return hasMissingParameterKeyShape(value);
};
