import {
  Ar,
  Cl,
  El,
  Env,
  Eun,
  Jpoif,
  Mladr,
  Mlsbj,
  Mltxt,
  Op,
} from "../parameters";
import { UnitEntity } from "../units/UnitEntity";
import {
  buildInheritedParameterArray,
  buildOptionalParameterArray,
} from "./parameterHelpers";
import { ParamInternal } from "./parameter.types";

type OptionalArrayBuilderOptions = {
  inherit?: boolean;
};

const createOptionalArrayBuilder = <T, P extends ParamInternal["parameter"]>(
  parameter: P,
  mapParam: (param: ParamInternal) => T,
  options: OptionalArrayBuilderOptions = {},
) => {
  return (unit: UnitEntity): Array<T> | undefined =>
    (options.inherit
      ? buildInheritedParameterArray
      : buildOptionalParameterArray)(
      {
        unit: unit,
        parameter: parameter,
      },
      mapParam,
    );
};

export const optionalArrayParameterBuilders = {
  ar: createOptionalArrayBuilder("ar", (param) => new Ar(param)),
  cl: createOptionalArrayBuilder("cl", (param) => new Cl(param), {
    inherit: true,
  }),
  el: createOptionalArrayBuilder("el", (param) => new El(param)),
  env: createOptionalArrayBuilder("env", (param) => new Env(param)),
  eun: createOptionalArrayBuilder("eun", (param) => new Eun(param)),
  jpoif: createOptionalArrayBuilder("jpoif", (param) => new Jpoif(param)),
  mladr: createOptionalArrayBuilder("mladr", (param) => new Mladr(param)),
  mlsbj: createOptionalArrayBuilder("mlsbj", (param) => new Mlsbj(param)),
  mltxt: createOptionalArrayBuilder("mltxt", (param) => new Mltxt(param)),
  op: createOptionalArrayBuilder("op", (param) => new Op(param), {
    inherit: true,
  }),
} as const;
