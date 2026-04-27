import { Cftd, Cy, Ey, Ln, Sd, Sh, Shd, St, Sy, Wc, Wt } from "../parameters";
import { N } from "../units/N";
import { UnitEntity } from "../units/UnitEntity";
import { DEFAULTS } from "./Defaults";
import {
  buildRootDefaultAwareScheduleRuleParameters,
  buildSortedScheduleRuleParameters,
  buildSdAlignedDefaultScheduleRuleParameters,
  buildSdAlignedEmptyScheduleRuleParameters,
  resolveParameterArray,
} from "./parameterHelpers";
import { ParamInternal } from "./parameter.types";
import ScheduleRule from "./ScheduleRule";

const createScheduleRuleDefaultBuilder = <
  T extends ScheduleRule,
  P extends ParamInternal["parameter"],
>(
  parameter: P,
  mapParam: (param: ParamInternal) => T,
  defaultRawValue: string,
) => {
  return (unit: UnitEntity): Array<T | null> | undefined =>
    buildSdAlignedDefaultScheduleRuleParameters(
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
  T extends ScheduleRule,
  P extends ParamInternal["parameter"],
>(
  parameter: P,
  mapParam: (param: ParamInternal) => T,
) => {
  return (unit: UnitEntity): Array<T | null> | undefined =>
    buildSdAlignedEmptyScheduleRuleParameters(
      {
        unit: unit,
        parameter: parameter,
      },
      mapParam,
    );
};

const createRootJobnetIgnoredScheduleRuleBuilder = <
  T extends ScheduleRule,
  P extends ParamInternal["parameter"],
>(
  parameter: P,
  mapParam: (param: ParamInternal) => T,
) => {
  return (unit: UnitEntity): Array<T> | undefined => {
    if (unit instanceof N && unit.isRootJobnet) {
      return undefined;
    }
    return buildSortedScheduleRuleParameters(
      resolveParameterArray({
        unit: unit,
        parameter: parameter,
      }),
      mapParam,
    );
  };
};

const createRootDefaultAwareScheduleRuleBuilder = <
  T extends ScheduleRule,
  P extends ParamInternal["parameter"],
>(
  parameter: P,
  rootDefaultParameter: "sd",
  mapParam: (param: ParamInternal) => T,
) => {
  return (unit: N): Array<T> | undefined =>
    buildRootDefaultAwareScheduleRuleParameters(
      {
        unit: unit,
        parameter: parameter,
        isRootJobnet: unit.isRootJobnet,
        rootDefaultParameter: rootDefaultParameter,
      },
      mapParam,
    );
};

// Schedule-rule-bearing parameters are primarily meaningful on jobnets (`ty=n`),
// but the split here is based on parameter structure, not owning unit type.
export const ruleParameterBuilders = {
  cftd: createScheduleRuleDefaultBuilder(
    "cftd",
    (param) => new Cftd(param),
    DEFAULTS.Cftd,
  ),
  cy: createScheduleRuleEmptyBuilder("cy", (param) => new Cy(param)),
  ey: createScheduleRuleEmptyBuilder("ey", (param) => new Ey(param)),
  ln: createRootJobnetIgnoredScheduleRuleBuilder(
    "ln",
    (param) => new Ln(param),
  ),
  sd: createRootDefaultAwareScheduleRuleBuilder(
    "sd",
    "sd",
    (param) => new Sd(param),
  ),
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
