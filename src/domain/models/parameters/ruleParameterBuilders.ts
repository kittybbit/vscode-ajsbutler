import { Cftd, Cy, Ey, Ln, Sh, Shd, St, Sy, Wc, Wt } from "../parameters";
import { UnitEntity } from "../units/UnitEntity";
import { DEFAULTS } from "./Defaults";
import {
  buildSortedRuleParameters,
  buildSdAlignedDefaultRuleParameters,
  buildSdAlignedEmptyRuleParameters,
  resolveParameterArray,
} from "./parameterHelpers";
import { ParamInternal } from "./parameter.types";
import Rule from "./Rule";

const createScheduleRuleDefaultBuilder = <
  T extends Rule,
  P extends ParamInternal["parameter"],
>(
  parameter: P,
  mapParam: (param: ParamInternal) => T,
  defaultRawValue: string,
) => {
  return (unit: UnitEntity): Array<T | null> | undefined =>
    buildSdAlignedDefaultRuleParameters(
      {
        unit: unit,
        parameter: parameter,
        defaultRawValue: defaultRawValue,
        buildFallbackRawValue: (rule) => `${rule},${defaultRawValue}`,
      },
      mapParam,
    );
};

const createScheduleRuleEmptyBuilder = <
  T extends Rule,
  P extends ParamInternal["parameter"],
>(
  parameter: P,
  mapParam: (param: ParamInternal) => T,
) => {
  return (unit: UnitEntity): Array<T | null> | undefined =>
    buildSdAlignedEmptyRuleParameters(
      {
        unit: unit,
        parameter: parameter,
      },
      mapParam,
    );
};

const createSortedRuleBuilder = <
  T extends Rule,
  P extends ParamInternal["parameter"],
>(
  parameter: P,
  mapParam: (param: ParamInternal) => T,
) => {
  return (unit: UnitEntity): Array<T> | undefined =>
    buildSortedRuleParameters(
      resolveParameterArray({
        unit: unit,
        parameter: parameter,
      }),
      mapParam,
    );
};

// Rule-bearing parameters are primarily meaningful on jobnets (`ty=n`),
// but the split here is based on parameter structure, not owning unit type.
export const ruleParameterBuilders = {
  cftd: createScheduleRuleDefaultBuilder(
    "cftd",
    (param) => new Cftd(param),
    DEFAULTS.Cftd,
  ),
  cy: createScheduleRuleEmptyBuilder("cy", (param) => new Cy(param)),
  ey: createScheduleRuleEmptyBuilder("ey", (param) => new Ey(param)),
  ln: createSortedRuleBuilder("ln", (param) => new Ln(param)),
  sh: createScheduleRuleEmptyBuilder("sh", (param) => new Sh(param)),
  shd: createScheduleRuleDefaultBuilder(
    "shd",
    (param) => new Shd(param),
    DEFAULTS.Shd,
  ),
  st: createScheduleRuleDefaultBuilder(
    "st",
    (param) => new St(param),
    DEFAULTS.St,
  ),
  sy: createScheduleRuleEmptyBuilder("sy", (param) => new Sy(param)),
  wc: createScheduleRuleDefaultBuilder(
    "wc",
    (param) => new Wc(param),
    DEFAULTS.Wc,
  ),
  wt: createScheduleRuleDefaultBuilder(
    "wt",
    (param) => new Wt(param),
    DEFAULTS.Wt,
  ),
} as const;
