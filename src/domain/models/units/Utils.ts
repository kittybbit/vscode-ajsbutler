import { J } from "./J";
import { N, Rn } from "./N";
import { Qj } from "./Qj";

export const priority = (unitEntity: J | N | Qj): number => {
    const getPrPriority = (): number | undefined => {
        if (unitEntity.pr && !unitEntity.pr.inherited) {
            return Number(unitEntity.pr.value());
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
        if (parent && (parent.ty.value() === 'n' || parent.ty.value() === 'rn')) {
            return (parent as N | Rn).priority;
        }
        return undefined;
    };

    const prPriority = getPrPriority();
    const niPriority = getNiPriority();

    // Compare pr and ni positions if both are valid
    if (prPriority !== undefined && niPriority !== undefined) {
        return unitEntity.pr!.position > unitEntity.ni!.position ? prPriority : niPriority;
    }

    // Return valid priority from pr or ni
    if (prPriority !== undefined) return prPriority;
    if (niPriority !== undefined) return niPriority;

    // Use parent priority if available
    const parentPriority = getParentPriority();
    if (parentPriority !== undefined) return parentPriority;

    // Default priority
    return 1;
};