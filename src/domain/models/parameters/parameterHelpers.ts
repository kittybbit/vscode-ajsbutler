import { ParamSymbol, isParamSymbol } from "../../values/AjsType";
import {
  resolveRootJobnetDefaultRawValue,
  type RootJobnetDefaultParameter,
} from "./parameterDefaultHelpers";
import { ParamBase, ParamInternal } from "./parameter.types";
import { createScheduleRuleParameterHelpers } from "./parameterScheduleRuleHelpers";

export {
  resolveConnectorControlDefaultRawValue,
  resolveRootJobnetDefaultRawValue,
} from "./parameterDefaultHelpers";
export {
  adjustToSdItemCount,
  buildSdAlignedScheduleParameters,
  buildSortedScheduleRuleParameters,
} from "./parameterScheduleRuleHelpers";

export type ParamLookupArg = ParamBase & {
  inherit?: boolean;
  defaultRawValue?: string | string[];
};

type ParameterEntry = {
  parameter: ParamLookupArg["unit"]["parameters"][number];
  index: number;
};

export const buildOptionalParameter = <T>(
  arg: Omit<ParamLookupArg, "inherit">,
  mapParam: (param: ParamInternal) => T,
): T | undefined => {
  const parameter = resolveParameter(arg);
  return parameter ? mapParam(parameter) : undefined;
};

export const buildDefaultableParameter = <T>(
  arg: Omit<ParamLookupArg, "inherit"> & {
    defaultRawValue?: string;
  },
  mapParam: (param: ParamInternal) => T,
): T | undefined =>
  buildOptionalParameter(
    {
      unit: arg.unit,
      parameter: arg.parameter,
      defaultRawValue: arg.defaultRawValue,
    },
    mapParam,
  );

export const buildOptionalParameterArray = <T>(
  arg: Omit<ParamLookupArg, "inherit">,
  mapParam: (param: ParamInternal) => T,
): Array<T> | undefined => {
  const parameters = resolveParameterArray(arg);
  return parameters ? parameters.map(mapParam) : undefined;
};

export const buildRequiredParameter = <T>(
  arg: Omit<ParamLookupArg, "defaultRawValue" | "inherit">,
  mapParam: (param: ParamInternal) => T,
  buildErrorMessage: (parameter: ParamSymbol) => string,
): T => {
  const parameter = buildOptionalParameter(
    {
      unit: arg.unit,
      parameter: arg.parameter,
    },
    mapParam,
  );
  if (parameter === undefined) {
    throw new Error(buildErrorMessage(arg.parameter));
  }
  return parameter;
};

export const buildInheritedParameter = <T>(
  arg: Omit<ParamLookupArg, "inherit">,
  mapParam: (param: ParamInternal) => T,
): T | undefined => {
  const parameter = resolveParameter({
    ...arg,
    inherit: true,
  });
  return parameter ? mapParam(parameter) : undefined;
};

export const buildInheritedParameterArray = <T>(
  arg: Omit<ParamLookupArg, "inherit">,
  mapParam: (param: ParamInternal) => T,
): Array<T> | undefined => {
  const parameters = resolveParameterArray({
    ...arg,
    inherit: true,
  });
  return parameters ? parameters.map(mapParam) : undefined;
};

export const buildRootJobnetParameter = <T>(
  arg: Omit<ParamLookupArg, "defaultRawValue" | "inherit"> & {
    isRootJobnet: boolean;
    rootDefaultParameter: RootJobnetDefaultParameter;
  },
  mapParam: (param: ParamInternal) => T,
): T | undefined =>
  buildInheritedParameter(
    {
      unit: arg.unit,
      parameter: arg.parameter,
      defaultRawValue: resolveRootJobnetDefaultRawValue(
        arg.rootDefaultParameter,
        arg.isRootJobnet,
      ),
    },
    mapParam,
  );

const assertParamSymbol: (
  parameter: string,
) => asserts parameter is ParamSymbol = (parameter) => {
  if (!isParamSymbol(parameter)) {
    throw new Error(`${parameter} is not unit definition parameter.`);
  }
};

const findParameterEntries = (
  unit: ParamLookupArg["unit"],
  parameter: ParamSymbol,
): ParameterEntry[] =>
  unit.parameters
    .map((parameter, index) => ({ parameter, index }))
    .filter((entry) => entry.parameter.key === parameter);

const toParamInternal = (
  arg: ParamLookupArg,
  entry: ParameterEntry,
  inherited: boolean,
): ParamInternal => ({
  unit: arg.unit,
  parameter: arg.parameter as ParamSymbol,
  inherited: inherited,
  rawValue: entry.parameter.value,
  position: inherited ? -1 : entry.index,
});

const resolveOwnParameterArray = (
  arg: ParamLookupArg,
): ParamInternal[] | undefined => {
  const actualParams = findParameterEntries(
    arg.unit,
    arg.parameter as ParamSymbol,
  ).map((entry) => toParamInternal(arg, entry, false));
  return actualParams.length > 0 ? actualParams : undefined;
};

const findInheritedParameterEntries = (
  unit: ParamLookupArg["unit"] | undefined,
  parameter: ParamSymbol,
): ParameterEntry[] | undefined => {
  if (unit === undefined) {
    return undefined;
  }
  const entries = findParameterEntries(unit, parameter);
  return entries.length > 0
    ? entries
    : findInheritedParameterEntries(unit.parent, parameter);
};

const resolveInheritedParameterArray = (
  arg: ParamLookupArg,
): ParamInternal[] | undefined =>
  findInheritedParameterEntries(
    arg.unit.parent,
    arg.parameter as ParamSymbol,
  )?.map((entry) => toParamInternal(arg, entry, true));

const toDefaultParamInternal = (
  arg: ParamLookupArg,
  defaultRawValue: string,
): ParamInternal => ({
  unit: arg.unit,
  parameter: arg.parameter as ParamSymbol,
  inherited: false,
  defaultRawValue: defaultRawValue,
  position: -1,
});

const normalizeDefaultRawValues = (
  defaultRawValue: ParamLookupArg["defaultRawValue"],
): string[] | undefined => {
  if (Array.isArray(defaultRawValue)) {
    return defaultRawValue;
  }
  if (!defaultRawValue) {
    return undefined;
  }
  return [defaultRawValue];
};

const resolveDefaultParameterArray = (
  arg: ParamLookupArg,
): ParamInternal[] | undefined =>
  normalizeDefaultRawValues(arg.defaultRawValue)?.map((rawValue) =>
    toDefaultParamInternal(arg, rawValue),
  );

export const resolveParameterArray = (
  arg: ParamLookupArg,
): ParamInternal[] | undefined => {
  assertParamSymbol(arg.parameter);
  return (
    resolveOwnParameterArray(arg) ??
    (arg.inherit ? resolveInheritedParameterArray(arg) : undefined) ??
    resolveDefaultParameterArray(arg)
  );
};

export const resolveParameter = (
  arg: ParamLookupArg,
): ParamInternal | undefined => {
  const params = resolveParameterArray(arg);
  if (params === undefined) {
    return undefined;
  }
  if (params.length === 1) {
    return params[0];
  }
  throw new Error(`unexpected array. (${arg.parameter})`);
};

const scheduleRuleParameterHelpers = createScheduleRuleParameterHelpers(
  resolveParameterArray,
);

export const buildRootDefaultAwareScheduleRuleParameters =
  scheduleRuleParameterHelpers.buildRootDefaultAwareScheduleRuleParameters;
export const buildSdAlignedDefaultScheduleRuleParameters =
  scheduleRuleParameterHelpers.buildSdAlignedDefaultScheduleRuleParameters;
export const buildSdAlignedEmptyScheduleRuleParameters =
  scheduleRuleParameterHelpers.buildSdAlignedEmptyScheduleRuleParameters;
export const resolveSdParameters =
  scheduleRuleParameterHelpers.resolveSdParameters;
