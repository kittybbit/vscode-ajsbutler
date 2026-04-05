import { ParamSymbol, isParamSymbol } from "../../values/AjsType";
import { DEFAULTS } from "./Defaults";
import { ParamBase, ParamInternal } from "./parameter.types";
import Rule, { Sd } from "./Rule";

export type ParamLookupArg = ParamBase & {
  inherit?: boolean;
  defaultRawValue?: string | string[];
};

type TopParameterIndex = 1 | 2 | 3 | 4;

type TopParameterSource = {
  [key in `ts${TopParameterIndex}`]?: unknown;
} & {
  [key in `td${TopParameterIndex}`]?: unknown;
};

const rootJobnetDefaultByParameter: Partial<Record<ParamSymbol, string>> = {
  rg: DEFAULTS.Rg,
  sd: DEFAULTS.Sd,
  ncl: "n",
  ncs: "n",
  ncex: "n",
};

export const resolveRootJobnetDefaultRawValue = (
  parameter: keyof typeof rootJobnetDefaultByParameter,
  isRootJobnet: boolean,
): string | undefined =>
  isRootJobnet ? rootJobnetDefaultByParameter[parameter] : undefined;

export const resolveConnectorControlDefaultRawValue = (
  mode: "always-disabled" | "root-jobnet-only",
): string | undefined => {
  switch (mode) {
    case "always-disabled":
      return "n";
    case "root-jobnet-only":
      return "n";
  }
};

export const resolveJobnetConnectorControlDefaultRawValue = (
  isRootJobnet: boolean,
): string | undefined =>
  isRootJobnet
    ? resolveConnectorControlDefaultRawValue("root-jobnet-only")
    : undefined;

export const resolveTopDefaultRawValue = (
  unit: TopParameterSource,
  index: TopParameterIndex,
): string => {
  const hasTransferSource = Boolean(unit[`ts${index}`]);
  const hasTransferDestination = Boolean(unit[`td${index}`]);

  if (hasTransferSource && hasTransferDestination) {
    return "sav";
  }
  if (hasTransferSource) {
    return "del";
  }
  return "";
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

/** Create a parameter value map with rule numbers as keys. */
const mapByRule = <T extends Rule>(params: Array<T> | undefined) =>
  params
    ? params.reduce(
        (work, param) => {
          work[String(param.rule)] = param;
          return work;
        },
        {} as Record<string, T>,
      )
    : undefined;

export const adjustToSdItemCount = <T extends Rule>(
  sd: Array<Sd> | undefined,
  param: Array<T> | undefined,
  buildDefault: (rule: number) => T | null,
): Array<T | null> | undefined => {
  const sdMap = mapByRule(sd);
  if (sdMap === undefined) {
    return undefined;
  }
  const paramMap = mapByRule(param);
  const newParams: Array<T | null> = [];
  Object.keys(sdMap).forEach((sdRule) => {
    const rule = sdMap[sdRule].rule;
    newParams.push((paramMap && paramMap[String(rule)]) ?? buildDefault(rule));
  });
  return newParams;
};

export const buildSdAlignedParameters = <T extends Rule>(
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

export const buildSdAlignedEmptyRuleParameters = <T extends Rule>(
  arg: Omit<ParamLookupArg, "inherit" | "defaultRawValue"> & {
    sd: Array<Sd> | undefined;
  },
  mapParam: (param: ParamInternal) => T,
): Array<T | null> | undefined =>
  buildSdAlignedParameters(
    resolveParameterArray({
      unit: arg.unit,
      parameter: arg.parameter,
    }),
    arg.sd,
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

export const buildSortedRuleParameters = <T extends Rule>(
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
    rootDefaultParameter: keyof typeof rootJobnetDefaultByParameter;
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

export const buildRootJobnetRuleParameters = <T extends Rule>(
  arg: Omit<ParamLookupArg, "defaultRawValue" | "inherit"> & {
    isRootJobnet: boolean;
    rootDefaultParameter: keyof typeof rootJobnetDefaultByParameter;
  },
  mapParam: (param: ParamInternal) => T,
): Array<T> | undefined =>
  buildSortedRuleParameters(
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
