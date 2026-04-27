import { resolveParameter, type ParamLookupArg } from "./parameterHelpers";
import type { ParamInternal } from "./parameter.types";

type TopParameterIndex = 1 | 2 | 3 | 4;

type TopParameterSource = {
  [key in `ts${TopParameterIndex}`]?: unknown;
} & {
  [key in `td${TopParameterIndex}`]?: unknown;
};

export const resolveTopDefaultRawValue = (
  unit: TopParameterSource,
  index: TopParameterIndex,
): string | undefined => {
  const hasTransferSource = Boolean(unit[`ts${index}`]);
  const hasTransferDestination = Boolean(unit[`td${index}`]);

  if (hasTransferSource && hasTransferDestination) {
    return "sav";
  }
  if (hasTransferSource) {
    return "del";
  }
  return undefined;
};

export const buildTopParameter = <T>(
  arg: Omit<ParamLookupArg, "defaultRawValue"> & {
    unit: TopParameterSource & ParamLookupArg["unit"];
    index: TopParameterIndex;
  },
  mapParam: (param: ParamInternal) => T,
): T | undefined => {
  const parameter = resolveParameter({
    unit: arg.unit,
    parameter: arg.parameter,
    defaultRawValue: resolveTopDefaultRawValue(arg.unit, arg.index),
  });
  return parameter ? mapParam(parameter) : undefined;
};
