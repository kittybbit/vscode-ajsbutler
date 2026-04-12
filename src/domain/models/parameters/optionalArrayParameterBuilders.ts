import { Ar, El, Env, Eun, Jpoif, Mladr, Mlsbj, Mltxt } from "../parameters";
import { UnitEntity } from "../units/UnitEntity";
import { buildOptionalParameterArray } from "./parameterHelpers";
import { ParamInternal } from "./parameter.types";

const createOptionalArrayBuilder = <T, P extends ParamInternal["parameter"]>(
  parameter: P,
  mapParam: (param: ParamInternal) => T,
) => {
  return (unit: UnitEntity): Array<T> | undefined =>
    buildOptionalParameterArray(
      {
        unit: unit,
        parameter: parameter,
      },
      mapParam,
    );
};

export const optionalArrayParameterBuilders = {
  ar: createOptionalArrayBuilder("ar", (param) => new Ar(param)),
  el: createOptionalArrayBuilder("el", (param) => new El(param)),
  env: createOptionalArrayBuilder("env", (param) => new Env(param)),
  eun: createOptionalArrayBuilder("eun", (param) => new Eun(param)),
  jpoif: createOptionalArrayBuilder("jpoif", (param) => new Jpoif(param)),
  mladr: createOptionalArrayBuilder("mladr", (param) => new Mladr(param)),
  mlsbj: createOptionalArrayBuilder("mlsbj", (param) => new Mlsbj(param)),
  mltxt: createOptionalArrayBuilder("mltxt", (param) => new Mltxt(param)),
} as const;
