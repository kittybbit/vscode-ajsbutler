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

type ParameterEntry = {
  parameter: ParamLookupArg["unit"]["parameters"][number];
  index: number;
};

type SdAlignedScheduleParametersInput<T extends ScheduleRule> = {
  params: ParamInternal[] | undefined;
  sd: Array<Sd> | undefined;
  mapParam: (param: ParamInternal) => T;
  buildDefault: (rule: number) => T | null;
};

const DEFAULT_RAW_VALUE_BY_PARAMETER: Record<
  RootJobnetDefaultParameter,
  string
> = {
  rg: DEFAULTS.Rg,
  sd: DEFAULTS.Sd,
  ncl: DEFAULTS.Ncl,
  ncs: DEFAULTS.Ncs,
  ncex: DEFAULTS.Ncex,
};

const resolveDefaultRawValue = (
  parameter: RootJobnetDefaultParameter,
): string => DEFAULT_RAW_VALUE_BY_PARAMETER[parameter];

const resolveDefaultForMode = {
  always: (defaultRawValue: string) => defaultRawValue,
  "root-jobnet-only": (defaultRawValue: string, isRootJobnet: boolean) =>
    isRootJobnet ? defaultRawValue : undefined,
} satisfies Record<
  DefaultApplicationMode,
  (defaultRawValue: string, isRootJobnet: boolean) => string | undefined
>;

const resolveScopedDefaultRawValue = (
  defaultRawValue: string,
  mode: DefaultApplicationMode,
  isRootJobnet: boolean,
): string | undefined =>
  resolveDefaultForMode[mode](defaultRawValue, isRootJobnet);

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

const normalizeSdAlignedScheduleParametersInput = <T extends ScheduleRule>(
  args:
    | [SdAlignedScheduleParametersInput<T>]
    | [
        ParamInternal[] | undefined,
        Array<Sd> | undefined,
        (param: ParamInternal) => T,
        (rule: number) => T | null,
      ],
): SdAlignedScheduleParametersInput<T> =>
  args.length === 1
    ? args[0]
    : {
        params: args[0],
        sd: args[1],
        mapParam: args[2],
        buildDefault: args[3],
      };

export const buildSdAlignedScheduleParameters = <T extends ScheduleRule>(
  ...args:
    | [SdAlignedScheduleParametersInput<T>]
    | [
        ParamInternal[] | undefined,
        Array<Sd> | undefined,
        (param: ParamInternal) => T,
        (rule: number) => T | null,
      ]
): Array<T | null> | undefined => {
  const { params, sd, mapParam, buildDefault } =
    normalizeSdAlignedScheduleParametersInput(args);
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
