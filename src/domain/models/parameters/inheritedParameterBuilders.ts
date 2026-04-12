import { Cl, Md, Ni, Op, Pr, Sdd, Stt } from "../parameters";
import { UnitEntity } from "../units/UnitEntity";
import { DEFAULTS } from "./Defaults";
import {
  buildInheritedParameter,
  buildInheritedParameterArray,
} from "./parameterHelpers";
import { ParamInternal } from "./parameter.types";

const createInheritedScalarBuilder = <T, P extends ParamInternal["parameter"]>(
  parameter: P,
  mapParam: (param: ParamInternal) => T,
  defaultRawValue?: string,
) => {
  return (unit: UnitEntity): T | undefined =>
    buildInheritedParameter(
      {
        unit: unit,
        parameter: parameter,
        defaultRawValue: defaultRawValue,
      },
      mapParam,
    );
};

const createInheritedArrayBuilder = <T, P extends ParamInternal["parameter"]>(
  parameter: P,
  mapParam: (param: ParamInternal) => T,
) => {
  return (unit: UnitEntity): Array<T> | undefined =>
    buildInheritedParameterArray(
      {
        unit: unit,
        parameter: parameter,
      },
      mapParam,
    );
};

export const inheritedParameterBuilders = {
  cl: createInheritedArrayBuilder("cl", (param) => new Cl(param)),
  md: createInheritedScalarBuilder("md", (param) => new Md(param), DEFAULTS.Md),
  ni: createInheritedScalarBuilder("ni", (param) => new Ni(param), DEFAULTS.Ni),
  op: createInheritedArrayBuilder("op", (param) => new Op(param)),
  pr: createInheritedScalarBuilder("pr", (param) => new Pr(param), DEFAULTS.Pr),
  sdd: createInheritedScalarBuilder(
    "sdd",
    (param) => new Sdd(param),
    DEFAULTS.Sdd,
  ),
  stt: createInheritedScalarBuilder(
    "stt",
    (param) => new Stt(param),
    DEFAULTS.Stt,
  ),
} as const;
