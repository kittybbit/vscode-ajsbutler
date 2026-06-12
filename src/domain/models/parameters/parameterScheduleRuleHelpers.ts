import { ParamBase, ParamInternal } from "./parameter.types";
import {
  resolveRootJobnetDefaultRawValue,
  type RootJobnetDefaultParameter,
} from "./parameterDefaultHelpers";
import ScheduleRule, { Sd } from "./ScheduleRule";

type ScheduleRuleParamLookupArg = ParamBase & {
  inherit?: boolean;
  defaultRawValue?: string | string[];
};

type SdAlignedScheduleParametersInput<T extends ScheduleRule> = {
  params: ParamInternal[] | undefined;
  sd: Array<Sd> | undefined;
  mapParam: (param: ParamInternal) => T;
  buildDefault: (rule: number) => T | null;
};

type ScheduleRuleParameterResolver = (
  arg: ScheduleRuleParamLookupArg,
) => ParamInternal[] | undefined;

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

export const buildSortedScheduleRuleParameters = <T extends ScheduleRule>(
  params: ParamInternal[] | undefined,
  mapParam: (param: ParamInternal) => T,
): Array<T> | undefined =>
  params ? params.map(mapParam).sort((a, b) => a.rule - b.rule) : undefined;

export const createScheduleRuleParameterHelpers = (
  resolveParameterArray: ScheduleRuleParameterResolver,
) => {
  const buildRootDefaultAwareScheduleRuleParameters = <T extends ScheduleRule>(
    arg: Omit<ScheduleRuleParamLookupArg, "defaultRawValue" | "inherit"> & {
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

  const resolveSdParameters = (
    unit: ScheduleRuleParamLookupArg["unit"] & { isRoot: boolean },
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

  const buildSdAlignedEmptyScheduleRuleParameters = <T extends ScheduleRule>(
    arg: Omit<ScheduleRuleParamLookupArg, "inherit" | "defaultRawValue">,
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

  const buildSdAlignedDefaultScheduleRuleParameters = <T extends ScheduleRule>(
    arg: Omit<ScheduleRuleParamLookupArg, "inherit"> & {
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

  return {
    buildRootDefaultAwareScheduleRuleParameters,
    buildSdAlignedDefaultScheduleRuleParameters,
    buildSdAlignedEmptyScheduleRuleParameters,
    resolveSdParameters,
  };
};
