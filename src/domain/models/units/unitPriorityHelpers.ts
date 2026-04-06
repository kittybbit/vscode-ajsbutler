import type { Ni, Pr } from "../parameters/PlainString";
import type { J } from "./J";
import type { N, Rn } from "./N";
import type { Qj } from "./Qj";
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

export const resolveUnitPriority = (unitEntity: PrioritizableUnit): number => {
  const getPrPriority = (): number | undefined => {
    if (unitEntity.pr && !unitEntity.pr.inherited) {
      const prValue = unitEntity.pr.value();
      return prValue !== undefined ? Number(prValue) : undefined;
    }
    return undefined;
  };

  const getNiPriority = (): number | undefined => {
    if (unitEntity.ni && !unitEntity.ni.inherited) {
      return unitEntity.ni.priority;
    }
    return undefined;
  };

  const getParentPriority = (): number | undefined => {
    const parent = unitEntity.parent;
    if (isN(parent) || isRn(parent)) {
      return parent.priority;
    }
    return undefined;
  };

  const prPriority = getPrPriority();
  const niPriority = getNiPriority();

  if (prPriority !== undefined && niPriority !== undefined) {
    if (unitEntity.pr && unitEntity.ni) {
      return unitEntity.pr.position > unitEntity.ni.position
        ? prPriority
        : niPriority;
    }
  }

  if (prPriority !== undefined) return prPriority;
  if (niPriority !== undefined) return niPriority;

  const parentPriority = getParentPriority();
  if (parentPriority !== undefined) return parentPriority;

  return DEFAULT_PRIORITY;
};
