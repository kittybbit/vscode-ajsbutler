import type { AjsGroupType } from "../ajs/AjsDocument";

export const resolveGroupType = (
  groupTypeValue: string | undefined,
): AjsGroupType | undefined =>
  groupTypeValue === "n" || groupTypeValue === "p" ? groupTypeValue : undefined;

export const resolveIsPlanning = (
  groupTypeValue: string | undefined,
): boolean => resolveGroupType(groupTypeValue) === "p";
