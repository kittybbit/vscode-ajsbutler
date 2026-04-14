import {
  AjsDocument,
  AjsUnit,
  findParentAjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type { UnitListLinkedUnitView } from "./buildUnitListView";

export const buildUnitListLinkedUnits = (
  document: AjsDocument,
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
): {
  previousUnits: UnitListLinkedUnitView[];
  nextUnits: UnitListLinkedUnitView[];
} => {
  const parent = findParentAjsUnit(document, unit);

  const previousUnits =
    parent?.relations
      .filter((dependency) => dependency.targetUnitId === unit.id)
      .flatMap((dependency) => {
        const sourceUnit = unitById.get(dependency.sourceUnitId);
        return sourceUnit
          ? [
              {
                id: sourceUnit.id,
                name: sourceUnit.name,
                absolutePath: sourceUnit.absolutePath,
                relationType: dependency.type,
              },
            ]
          : [];
      }) ?? [];

  const nextUnits =
    parent?.relations
      .filter((dependency) => dependency.sourceUnitId === unit.id)
      .flatMap((dependency) => {
        const targetUnit = unitById.get(dependency.targetUnitId);
        return targetUnit
          ? [
              {
                id: targetUnit.id,
                name: targetUnit.name,
                absolutePath: targetUnit.absolutePath,
                relationType: dependency.type,
              },
            ]
          : [];
      }) ?? [];

  return {
    previousUnits,
    nextUnits,
  };
};
