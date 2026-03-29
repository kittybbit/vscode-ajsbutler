import { TySymbol } from "../../values/AjsType";

export type AjsUnitType = TySymbol;
export type AjsGroupType = "n" | "p";
export type AjsDependencyType = "seq" | "con";

export type AjsDependency = {
  sourceUnitId: string;
  targetUnitId: string;
  type: AjsDependencyType;
};

export type AjsNormalizationWarning = {
  code: string;
  message: string;
  unitPath?: string;
};

export type AjsUnit = {
  id: string;
  name: string;
  unitAttribute: string;
  permission?: string;
  jp1Username?: string;
  jp1ResourceGroup?: string;
  unitType: AjsUnitType;
  groupType?: AjsGroupType;
  comment?: string;
  absolutePath: string;
  depth: number;
  parentId?: string;
  isRoot: boolean;
  isRecovery?: boolean;
  isRootJobnet: boolean;
  hasSchedule: boolean;
  hasWaitedFor: boolean;
  layout: {
    h: number;
    v: number;
  };
  parameters: Array<{ key: string; value: string }>;
  dependencies: AjsDependency[];
  children: AjsUnit[];
};

export type AjsDocument = {
  rootUnits: AjsUnit[];
  warnings: AjsNormalizationWarning[];
};

export const flattenAjsUnits = (units: AjsUnit[]): AjsUnit[] =>
  units.reduce<AjsUnit[]>(
    (allUnits, unit) => [...allUnits, unit, ...flattenAjsUnits(unit.children)],
    [],
  );

export const findAjsUnitById = (
  document: AjsDocument,
  unitId: string,
): AjsUnit | undefined =>
  flattenAjsUnits(document.rootUnits).find((unit) => unit.id === unitId);
