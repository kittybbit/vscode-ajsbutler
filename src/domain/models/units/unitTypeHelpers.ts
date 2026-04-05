import { TySymbol } from "../../values/AjsType";

export const resolveIsRecovery = (unitType: TySymbol): boolean | undefined => {
  if (["g", "mg", "rc", "mn", "nc"].includes(unitType)) {
    return undefined;
  }

  return unitType.startsWith("r") && unitType !== "rm";
};
