import { ParamSymbol, isParamSymbol } from "../../values/AjsType";
import { DEFAULTS } from "./Defaults";
import { ParamBase, ParamInternal } from "./parameter.types";
import ScheduleRule, { Sd } from "./ScheduleRule";

export type ParamLookupArg = ParamBase & {
  inherit?: boolean;
  defaultRawValue?: string | string[];
};

type DefaultApplicationMode = "always" | "root-jobnet-only";
type RootJobnetDefaultParameter = "rg" | "sd" | "ncl" | "ncs" | "ncex";
type ConnectorControlDefaultParameter = "ncl" | "ncs" | "ncex";

const resolveDefaultRawValue = (
  parameter: RootJobnetDefaultParameter,
): string => {
  switch (parameter) {
    case "rg":
      return DEFAULTS.Rg;
    case "sd":
      return DEFAULTS.Sd;
    case "ncl":
      return DEFAULTS.Ncl;
    case "ncs":
      return DEFAULTS.Ncs;
    case "ncex":
      return DEFAULTS.Ncex;
  }
};

const resolveScopedDefaultRawValue = (
  defaultRawValue: string,
  mode: DefaultApplicationMode,
  isRootJobnet: boolean,
): string | undefined => {
  switch (mode) {
    case "always":
      return defaultRawValue;
    case "root-jobnet-only":
      return isRootJobnet ? defaultRawValue : undefined;
  }
};

export const resolveRootJobnetDefaultRawValue = (
  parameter: RootJobnetDefaultParameter,
  isRootJobnet: boolean,
): string | undefined =>
  resolveScopedDefaultRawValue(
    resolveDefaultRawValue(parameter),
    "root-jobnet-only",
    isRootJobnet,
  );

export const resolveConnectorControlDefaultRawValue = (
  parameter: ConnectorControlDefaultParameter,
  mode: DefaultApplicationMode,
  isRootJobnet = true,
): string | undefined => {
  return resolveScopedDefaultRawValue(
    resolveDefaultRawValue(parameter),
    mode,
    isRootJobnet,
  );
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

/** Create a parameter value map with schedule rule numbers as keys. */
const mapByScheduleRule = <T extends ScheduleRule>(
  params: Array<T> | undefined,
) =>
  params
    ? params.reduce(
        (work, param) => {
          work[String(param.rule)] = param;
          return work;
        },
        {} as Record<string, T>,
      )
    : undefined;

export const adjustToSdItemCount = <T extends ScheduleRule>(
  sd: Array<Sd> | undefined,
  param: Array<T> | undefined,
  buildDefault: (rule: number) => T | null,
): Array<T | null> | undefined => {
  const sdMap = mapByScheduleRule(sd);
  if (sdMap === undefined) {
    return undefined;
  }
  const paramMap = mapByScheduleRule(param);
  const newParams: Array<T | null> = [];
  Object.keys(sdMap).forEach((sdRule) => {
    const rule = sdMap[sdRule].rule;
    newParams.push((paramMap && paramMap[String(rule)]) ?? buildDefault(rule));
  });
  return newParams;
};

export const buildSdAlignedScheduleParameters = <T extends ScheduleRule>(
  params: ParamInternal[] | undefined,
  sd: Array<Sd> | undefined,
  mapParam: (param: ParamInternal) => T,
  buildDefault: (rule: number) => T | null,
): Array<T | null> | undefined => {
  const values = params
    ? params.map(mapParam).sort((a, b) => a.rule - b.rule)
    : undefined;
  return adjustToSdItemCount(sd, values, buildDefault);
};

export const resolveSdParameters = (
  unit: ParamLookupArg["unit"] & { isRoot: boolean },
): Array<Sd> | undefined =>
  buildRootDefaultAwareScheduleRuleParameters(
    {
      unit: unit,
      parameter: "sd",
      isRootJobnet: unit.isRoot,
      rootDefaultParameter: "sd",
    },
    (param) => new Sd(param),
  );

export const buildSdAlignedEmptyScheduleRuleParameters = <
  T extends ScheduleRule,
>(
  arg: Omit<ParamLookupArg, "inherit" | "defaultRawValue">,
  mapParam: (param: ParamInternal) => T,
): Array<T | null> | undefined =>
  buildSdAlignedScheduleParameters(
    resolveParameterArray({
      unit: arg.unit,
      parameter: arg.parameter,
    }),
    resolveSdParameters(arg.unit),
    mapParam,
    (rule) =>
      mapParam({
        unit: arg.unit,
        parameter: arg.parameter,
        rawValue: `${rule},`,
        inherited: false,
        position: -1,
      }),
  );

export const buildSdAlignedDefaultScheduleRuleParameters = <
  T extends ScheduleRule,
>(
  arg: Omit<ParamLookupArg, "inherit"> & {
    buildFallbackRawValue: (rule: number) => string;
  },
  mapParam: (param: ParamInternal) => T,
): Array<T | null> | undefined =>
  buildSdAlignedScheduleParameters(
    resolveParameterArray({
      unit: arg.unit,
      parameter: arg.parameter,
      defaultRawValue: arg.defaultRawValue,
    }),
    resolveSdParameters(arg.unit),
    mapParam,
    (rule) =>
      mapParam({
        unit: arg.unit,
        parameter: arg.parameter,
        defaultRawValue: arg.buildFallbackRawValue(rule),
        inherited: false,
        position: -1,
      }),
  );

export const buildSortedScheduleRuleParameters = <T extends ScheduleRule>(
  params: ParamInternal[] | undefined,
  mapParam: (param: ParamInternal) => T,
): Array<T> | undefined =>
  params ? params.map(mapParam).sort((a, b) => a.rule - b.rule) : undefined;

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

export const buildRootDefaultAwareScheduleRuleParameters = <
  T extends ScheduleRule,
>(
  arg: Omit<ParamLookupArg, "defaultRawValue" | "inherit"> & {
    isRootJobnet: boolean;
    rootDefaultParameter: RootJobnetDefaultParameter;
  },
  mapParam: (param: ParamInternal) => T,
): Array<T> | undefined =>
  buildSortedScheduleRuleParameters(
    resolveParameterArray({
      unit: arg.unit,
      parameter: arg.parameter,
      defaultRawValue: resolveRootJobnetDefaultRawValue(
        arg.rootDefaultParameter,
        arg.isRootJobnet,
      ),
    }),
    mapParam,
  );

export const resolveParameterArray = (
  arg: ParamLookupArg,
): ParamInternal[] | undefined => {
  if (!isParamSymbol(arg.parameter)) {
    throw new Error(`${arg.parameter} is not unit definition parameter.`);
  }

  const actualParams = arg.unit.parameters
    .map((parameter, index) => ({ parameter, index }))
    .filter((entry) => entry.parameter.key === arg.parameter)
    .map((entry) => ({
      unit: arg.unit,
      parameter: arg.parameter,
      inherited: false,
      rawValue: entry.parameter.value,
      position: entry.index,
    }));
  if (actualParams.length > 0) {
    return actualParams;
  }

  if (arg.inherit) {
    let parent = arg.unit.parent;
    while (parent) {
      const inheritedParams = parent.parameters
        .map((parameter, index) => ({ parameter, index }))
        .filter((entry) => entry.parameter.key === arg.parameter)
        .map((entry) => ({
          unit: arg.unit,
          parameter: arg.parameter,
          inherited: true,
          rawValue: entry.parameter.value,
          position: -1,
        }));
      if (inheritedParams.length > 0) {
        return inheritedParams;
      }
      parent = parent.parent;
    }
  }

  if (Array.isArray(arg.defaultRawValue)) {
    return arg.defaultRawValue.map((rawValue) => ({
      unit: arg.unit,
      parameter: arg.parameter,
      inherited: false,
      defaultRawValue: rawValue,
      position: -1,
    }));
  }

  if (arg.defaultRawValue) {
    return [
      {
        unit: arg.unit,
        parameter: arg.parameter,
        inherited: false,
        defaultRawValue: arg.defaultRawValue,
        position: -1,
      },
    ];
  }

  return undefined;
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
