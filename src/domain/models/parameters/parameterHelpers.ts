import { ParamSymbol, isParamSymbol } from "../../values/AjsType";
import { DEFAULTS } from "./Defaults";
import { ParamBase, ParamInternal } from "./parameter.types";
import Rule, { Sd } from "./Rule";

export type ParamLookupArg = ParamBase & {
  inherit?: boolean;
  defaultRawValue?: string | string[];
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
