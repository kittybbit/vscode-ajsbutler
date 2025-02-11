import { J } from "./J";
import { N, Rn } from "./N";
import { Qj } from "./Qj";
import { UnitEntity } from "./UnitEntities";

const DEFAULT_PRIORITY = 1;
const isN = (entity: UnitEntity | undefined): entity is N =>
  entity !== undefined && entity.ty && entity.ty.value() === "n";
const isRn = (entity: UnitEntity | undefined): entity is Rn =>
  entity !== undefined && entity.ty && entity.ty.value() === "rn";

export const priority = (unitEntity: J | N | Qj): number => {
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

  // Compare pr and ni positions if both are valid
  if (prPriority !== undefined && niPriority !== undefined) {
    if (unitEntity.pr && unitEntity.ni) {
      return unitEntity.pr.position > unitEntity.ni.position
        ? prPriority
        : niPriority;
    }
  }

  // Return valid priority from pr or ni
  if (prPriority !== undefined) return prPriority;
  if (niPriority !== undefined) return niPriority;

  // Use parent priority if available
  const parentPriority = getParentPriority();
  if (parentPriority !== undefined) return parentPriority;

  // Default priority
  return DEFAULT_PRIORITY;
};
