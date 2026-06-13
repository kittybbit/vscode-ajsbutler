import type { Ni, Pr } from "../parameters/PlainString";
import type { N, Rn } from "./N";
import type { UnitEntity } from "./UnitEntity";

const DEFAULT_PRIORITY = 1;

export interface PrioritizableUnit {
  readonly pr: Pr | undefined;
  readonly ni: Ni | undefined;
  readonly parent: UnitEntity | undefined;
  readonly priority: number;
}

const isN = (entity: UnitEntity | undefined): entity is N =>
  entity !== undefined && entity.ty && entity.ty.value() === "n";

const isRn = (entity: UnitEntity | undefined): entity is Rn =>
  entity !== undefined && entity.ty && entity.ty.value() === "rn";

type ExplicitPrioritySource = {
  readonly value: number;
  readonly position: number;
};

const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

const getPrPrioritySource = (
  pr: Pr | undefined,
): ExplicitPrioritySource | undefined => {
  const value = pr?.inherited === false ? pr.value() : undefined;
  return value === undefined
    ? undefined
    : { value: Number(value), position: pr.position };
};

const getNiPrioritySource = (
  ni: Ni | undefined,
): ExplicitPrioritySource | undefined =>
  ni === undefined || ni.inherited
    ? undefined
    : { value: ni.priority, position: ni.position };

const laterPrioritySource = (
  prioritySources: readonly (ExplicitPrioritySource | undefined)[],
): ExplicitPrioritySource | undefined =>
  prioritySources.filter(isDefined).sort((a, b) => b.position - a.position)[0];

const getParentPriority = (
  parent: UnitEntity | undefined,
): number | undefined =>
  isN(parent) || isRn(parent) ? parent.priority : undefined;

export const resolveUnitPriority = (unitEntity: PrioritizableUnit): number => {
  const explicitPriority = laterPrioritySource([
    getPrPrioritySource(unitEntity.pr),
    getNiPrioritySource(unitEntity.ni),
  ]);

  return (
    explicitPriority?.value ??
    getParentPriority(unitEntity.parent) ??
    DEFAULT_PRIORITY
  );
};
