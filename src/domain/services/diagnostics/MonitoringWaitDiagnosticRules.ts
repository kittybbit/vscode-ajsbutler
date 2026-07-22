import type { AjsParameter } from "../../models/ajs/AjsDocument";

const eventTimeoutActions = new Set(["kl", "nr", "wr", "an"]);

export const parseExplicitMonitoringWaitDecimalInRange = (
  parameter: AjsParameter,
  minimum: number,
  maximum: number,
): number | undefined => {
  if (!/^\d+$/.test(parameter.value)) {
    return undefined;
  }

  const value = Number(parameter.value);
  return value >= minimum && value <= maximum ? value : undefined;
};

const selectQuotedContentOrRawValue = (value: string): string =>
  value.length >= 2 && value.startsWith('"') && value.endsWith('"')
    ? value.slice(1, -1)
    : value;

export const hasValidExplicitFileMonitoringByteLength = (
  parameter: AjsParameter,
): boolean => {
  const value = selectQuotedContentOrRawValue(parameter.value);
  const byteLength = new TextEncoder().encode(value).length;
  return byteLength >= 1 && byteLength <= 255;
};

export const hasValidExplicitFileMonitoringCondition = (
  parameter: AjsParameter,
): boolean => /^c(?::d(?::[sm])?)?$/.test(parameter.value);

export const hasWildcard = (parameter: AjsParameter): boolean =>
  parameter.value.includes("*");

export const hasFileCreationMonitoring = (value: string): boolean =>
  new Set(value.split(":").filter((condition) => condition.length > 0)).has(
    "c",
  );

export const hasValidExplicitEventTimeoutAction = (
  parameter: AjsParameter,
): boolean => eventTimeoutActions.has(parameter.value);

export const hasValidExplicitEndTiming = (parameter: AjsParameter): boolean =>
  parameter.value === "y" || parameter.value === "n";
