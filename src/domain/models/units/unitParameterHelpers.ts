import { ParamSymbol, isParamSymbol } from "../../values/AjsType";

export const resolveDefinedParams = (target: object): ParamSymbol[] => {
  let proto = Object.getPrototypeOf(target);
  let params: string[] = [];

  while (proto && proto.constructor.name !== "Object") {
    params = params.concat(Object.getOwnPropertyNames(proto));
    proto = Object.getPrototypeOf(proto);
  }

  return params
    .filter((value): value is ParamSymbol => isParamSymbol(value))
    .sort();
};
