import {
  AjsDocument,
  AjsRelation,
  AjsUnit,
  findParentAjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type { UnitListLinkedUnitView } from "./buildUnitListView";

type LinkedUnitDirection = "previous" | "next";

type BuildLinkedUnitsInput = {
  relations: readonly AjsRelation[] | undefined;
  unit: AjsUnit;
  unitById: Map<string, AjsUnit>;
  direction: LinkedUnitDirection;
};

type LinkedUnitDirectionRule = {
  currentUnitId: (relation: AjsRelation) => string;
  linkedUnitId: (relation: AjsRelation) => string;
};

const linkedUnitDirectionRules: Record<
  LinkedUnitDirection,
  LinkedUnitDirectionRule
> = {
  previous: {
    currentUnitId: (relation) => relation.targetUnitId,
    linkedUnitId: (relation) => relation.sourceUnitId,
  },
  next: {
    currentUnitId: (relation) => relation.sourceUnitId,
    linkedUnitId: (relation) => relation.targetUnitId,
  },
};

const matchesLinkedUnitDirection = (
  dependency: AjsRelation,
  unitId: string,
  direction: LinkedUnitDirection,
): boolean =>
  linkedUnitDirectionRules[direction].currentUnitId(dependency) === unitId;

const relatedUnitId = (
  dependency: AjsRelation,
  direction: LinkedUnitDirection,
): string => linkedUnitDirectionRules[direction].linkedUnitId(dependency);

const toLinkedUnitView = (
  unit: AjsUnit,
  dependency: AjsRelation,
): UnitListLinkedUnitView => ({
  id: unit.id,
  name: unit.name,
  absolutePath: unit.absolutePath,
  relationType: dependency.type,
});

const buildLinkedUnitsByDirection = (
  input: BuildLinkedUnitsInput,
): UnitListLinkedUnitView[] =>
  input.relations
    ?.filter((dependency) =>
      matchesLinkedUnitDirection(dependency, input.unit.id, input.direction),
    )
    .flatMap((dependency) => {
      const relatedUnit = input.unitById.get(
        relatedUnitId(dependency, input.direction),
      );
      return relatedUnit ? [toLinkedUnitView(relatedUnit, dependency)] : [];
    }) ?? [];

export const buildUnitListLinkedUnits = (
  document: AjsDocument,
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
): {
  previousUnits: UnitListLinkedUnitView[];
  nextUnits: UnitListLinkedUnitView[];
} => {
  const parent = findParentAjsUnit(document, unit);

  return {
    previousUnits: buildLinkedUnitsByDirection({
      relations: parent?.relations,
      unit,
      unitById,
      direction: "previous",
    }),
    nextUnits: buildLinkedUnitsByDirection({
      relations: parent?.relations,
      unit,
      unitById,
      direction: "next",
    }),
  };
};
