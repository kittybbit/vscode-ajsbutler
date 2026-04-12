import { Rg } from "../parameters";
import { N } from "../units/N";
import { buildRootJobnetParameter } from "./parameterHelpers";
import { ParamInternal } from "./parameter.types";

const createRootJobnetScalarBuilder = <T, P extends ParamInternal["parameter"]>(
  parameter: P,
  rootDefaultParameter: "rg",
  mapParam: (param: ParamInternal) => T,
) => {
  return (unit: N): T | undefined =>
    buildRootJobnetParameter(
      {
        unit: unit,
        parameter: parameter,
        isRootJobnet: unit.isRootJobnet,
        rootDefaultParameter: rootDefaultParameter,
      },
      mapParam,
    );
};

export const rootJobnetParameterBuilders = {
  rg: createRootJobnetScalarBuilder("rg", "rg", (param) => new Rg(param)),
} as const;
