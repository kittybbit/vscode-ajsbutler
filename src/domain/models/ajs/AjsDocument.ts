import { ParamSymbol, TySymbol } from "../../values/AjsType";

export type AjsUnitType = TySymbol;
export type AjsGroupType = "n" | "p";
export type AjsRelationType = "seq" | "con";

export type AjsRelation = {
  sourceUnitId: string;
  targetUnitId: string;
  type: AjsRelationType;
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
  parameters: Array<{ key: string; value: string; position?: number }>;
  relations: AjsRelation[];
  children: AjsUnit[];
};

export type AjsDocument = {
  rootUnits: AjsUnit[];
  warnings: AjsNormalizationWarning[];
};

export type AjsParameter = AjsUnit["parameters"][number];

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

export const findAjsUnitParameters = (
  unit: AjsUnit,
  key: ParamSymbol,
): AjsParameter[] =>
  unit.parameters.filter((parameter) => parameter.key === key);

// This helper intentionally preserves the first-hit behavior that existing
// application mappings already used for single-value fields. Callers that need
// repeated values or duplicate-aware interpretation must use
// `findAjsUnitParameters(...)` instead of this convenience accessor.
export const findAjsUnitParameter = (
  unit: AjsUnit,
  key: ParamSymbol,
): AjsParameter | undefined =>
  unit.parameters.find((parameter) => parameter.key === key);

export const findAjsUnitParameterValue = (
  unit: AjsUnit,
  key: ParamSymbol,
): string | undefined => findAjsUnitParameter(unit, key)?.value;

export const findAjsUnitParameterValues = (
  unit: AjsUnit,
  key: ParamSymbol,
): string[] =>
  findAjsUnitParameters(unit, key).map((parameter) => parameter.value);

export const findParentAjsUnit = (
  document: AjsDocument,
  unit: AjsUnit,
): AjsUnit | undefined =>
  unit.parentId ? findAjsUnitById(document, unit.parentId) : undefined;

export const findAjsUnitAncestors = (
  document: AjsDocument,
  unit: AjsUnit,
): AjsUnit[] => {
  const ancestors: AjsUnit[] = [];
  let current = findParentAjsUnit(document, unit);
  while (current) {
    ancestors.push(current);
    current = findParentAjsUnit(document, current);
  }
  return ancestors;
};

export const findInheritedAjsUnitParameters = (
  document: AjsDocument,
  unit: AjsUnit,
  key: ParamSymbol,
): AjsParameter[] | undefined => {
  for (const ancestor of findAjsUnitAncestors(document, unit)) {
    const parameters = findAjsUnitParameters(ancestor, key);
    if (parameters.length > 0) {
      return parameters;
    }
  }
  return undefined;
};

export const findInheritedAjsUnitParameter = (
  document: AjsDocument,
  unit: AjsUnit,
  key: ParamSymbol,
): AjsParameter | undefined =>
  findInheritedAjsUnitParameters(document, unit, key)?.[0];

export const findInheritedAjsUnitParameterValue = (
  document: AjsDocument,
  unit: AjsUnit,
  key: ParamSymbol,
): string | undefined =>
  findInheritedAjsUnitParameter(document, unit, key)?.value;

export const findRootJobnet = (document: AjsDocument): AjsUnit | undefined =>
  flattenAjsUnits(document.rootUnits).find(
    (unit) => unit.unitType === "n" && unit.isRootJobnet,
  );
