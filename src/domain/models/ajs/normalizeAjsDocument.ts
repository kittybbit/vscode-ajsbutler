import { Unit } from "../../values/Unit";
import { AjsDocument, AjsNormalizationWarning, AjsUnit } from "./AjsDocument";
import { resolveNormalizedRelations } from "./normalizeRelationHelpers";
import { buildNormalizedUnit } from "./normalizeUnitBuilderHelpers";
import { resolveNormalizedUnitType } from "./normalizeUnitHelpers";

const normalizeUnit = (
  unit: Unit,
  warnings: AjsNormalizationWarning[],
): AjsUnit => {
  const unitType = resolveNormalizedUnitType(unit, warnings);
  const children = unit.children.map((child) => normalizeUnit(child, warnings));
  const relations = resolveNormalizedRelations(unit, children, warnings);

  return buildNormalizedUnit(unit, unitType, relations, children);
};

export const normalizeAjsDocument = (rootUnits: Unit[]): AjsDocument => {
  const warnings: AjsNormalizationWarning[] = [];
  return {
    rootUnits: rootUnits.map((rootUnit) => normalizeUnit(rootUnit, warnings)),
    warnings,
  };
};
