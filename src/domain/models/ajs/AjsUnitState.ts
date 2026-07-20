import type { TySymbol } from "../../values/AjsType";
import type { AjsGroupType, AjsUnitLayout } from "./AjsDocument";

const DEFAULT_LAYOUT: AjsUnitLayout = { h: 0, v: 0 };

export const resolveAjsGroupType = (
  groupTypeValue: string | undefined,
): AjsGroupType | undefined =>
  groupTypeValue === "n" || groupTypeValue === "p" ? groupTypeValue : undefined;

export const resolveAjsUnitDepth = (absolutePath: string): number =>
  absolutePath.split("/").filter(Boolean).length - 1;

export const resolveAjsUnitIsRecovery = (
  unitType: TySymbol,
): boolean | undefined => {
  if (["g", "mg", "rc", "mn", "nc"].includes(unitType)) {
    return undefined;
  }

  return unitType.startsWith("r") && unitType !== "rm";
};

export const resolveAjsUnitIsRootJobnet = (
  parentUnitType: string | undefined,
): boolean => parentUnitType !== "n";

export const resolveAjsUnitLayout = (
  unitName: string,
  layoutValues: string[],
): AjsUnitLayout => {
  const layoutParameter = layoutValues.find(
    (value) => value.split(",")[0]?.trim() === unitName,
  );
  const hv = layoutParameter?.match(/\+(\d+)\+(\d+)/);

  return hv ? { h: Number(hv[1]), v: Number(hv[2]) } : DEFAULT_LAYOUT;
};

export const resolveAjsUnitHasSchedule = (scheduleValues: string[]): boolean =>
  scheduleValues.some((value) => !/^(\d+,)?ud$/.test(value.trim()));

export const resolveAjsUnitHasWaitedFor = (
  waitedUnitNames: string[] | undefined,
): boolean => (waitedUnitNames ?? []).some((unitName) => unitName.length > 0);
