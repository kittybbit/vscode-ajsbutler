import { Ty } from "../parameters";
import { UnitEntity } from "../units/UnitEntity";
import { buildRequiredParameter } from "./parameterHelpers";
import { ParamInternal } from "./parameter.types";

const createRequiredScalarBuilder = <T, P extends ParamInternal["parameter"]>(
  parameter: P,
  mapParam: (param: ParamInternal) => T,
  buildErrorMessage: (parameter: P) => string,
) => {
  return (unit: UnitEntity): T =>
    buildRequiredParameter(
      {
        unit: unit,
        parameter: parameter,
      },
      mapParam,
      (missingParameter) => buildErrorMessage(missingParameter as P),
    );
};

export const requiredScalarParameterBuilders = {
  ty: createRequiredScalarBuilder(
    "ty",
    (param) => new Ty(param),
    () => "Ty parameter should be specified.",
  ),
} as const;
