import { AjsRawUnit } from "../../raw/AjsRawUnit";
import {
  AjsNormalizationWarning,
  AjsUnit,
} from "../../../../domain/models/ajs/AjsDocument";
import { resolveNormalizedRelations } from "./relations";
import { buildNormalizedUnit } from "./unitBuilder";
import { resolveNormalizedUnitType } from "./unit";

export const normalizeUnitTree = (
  unit: AjsRawUnit,
  warnings: AjsNormalizationWarning[],
): AjsUnit => {
  const unitType = resolveNormalizedUnitType(unit, warnings);
  const children = unit.children.map((child) =>
    normalizeUnitTree(child, warnings),
  );
  const relations = resolveNormalizedRelations(unit, children, warnings);

  return buildNormalizedUnit({ unit, unitType, relations, children });
};
