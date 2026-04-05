import { Ar } from "../parameters";
import type { UnitEntity } from "./UnitEntity";

export type UnitRelationLink = {
  unitEntity: UnitEntity | undefined;
  relationType: string | undefined;
};

const resolveSiblingRelations = (
  unitEntity: UnitEntity,
  match: (relation: Ar) => boolean,
): Ar[] =>
  (unitEntity.parent?.params<Ar[] | undefined>("ar") ?? []).filter(match);

export const findPreviousRelations = (unitEntity: UnitEntity): Ar[] =>
  resolveSiblingRelations(
    unitEntity,
    (relation) => relation.t === unitEntity.name,
  );

export const findNextRelations = (unitEntity: UnitEntity): Ar[] =>
  resolveSiblingRelations(
    unitEntity,
    (relation) => relation.f === unitEntity.name,
  );

const mapRelationTargets = (
  unitEntity: UnitEntity,
  relations: Ar[],
  resolveSiblingName: (relation: Ar) => string | undefined,
): UnitRelationLink[] =>
  relations.map((relation) => ({
    unitEntity: unitEntity.parent?.children.find(
      (child) => child.name === resolveSiblingName(relation),
    ),
    relationType: relation.relationType,
  }));

export const findPreviousUnits = (unitEntity: UnitEntity): UnitRelationLink[] =>
  mapRelationTargets(
    unitEntity,
    findPreviousRelations(unitEntity),
    (relation) => relation.f,
  );

export const findNextUnits = (unitEntity: UnitEntity): UnitRelationLink[] =>
  mapRelationTargets(
    unitEntity,
    findNextRelations(unitEntity),
    (relation) => relation.t,
  );
