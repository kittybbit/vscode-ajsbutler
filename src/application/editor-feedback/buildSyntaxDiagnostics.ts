import { parseAjs } from "../../domain/services/parser/AjsParser";
import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import type { Unit, UnitParameter } from "../../domain/values/Unit";

export type SyntaxDiagnosticDto = {
  line: number;
  column: number;
  length: number;
  message: string;
  severity: "error";
};

type UnitParameterDiagnosticRule = {
  key: string;
  message: string;
  isInvalid: (parameter: UnitParameter, unit: Unit) => boolean;
};

const jobEndJudgmentDiagnosticTargetTypes = new Set([
  "j",
  "rj",
  "pj",
  "rp",
  "cj",
  "rcj",
]);
const jobEndJudgmentRetryParameterKeys = ["rjs", "rje", "rec", "rei"];
const fileMonitoringDiagnosticTargetTypes = new Set(["flwj", "rflwj"]);
const eventSendingDiagnosticTargetTypes = new Set(["evsj", "revsj"]);
const eventReceivingDiagnosticTargetTypes = new Set(["evwj", "revwj"]);
const scheduleRuleDiagnosticTargetTypes = new Set(["g", "n"]);

const flattenUnits = (units: Unit[]): Unit[] =>
  units.reduce<Unit[]>(
    (allUnits, unit) => [...allUnits, unit, ...flattenUnits(unit.children)],
    [],
  );

const findParameter = (unit: Unit, key: string): UnitParameter | undefined =>
  unit.parameters.find((parameter) => parameter.key === key);

const findUnitsByTypes = (
  rootUnits: Unit[],
  targetTypes: Set<string>,
): Unit[] =>
  flattenUnits(rootUnits).filter((unit) => {
    const unitType = findParameter(unit, "ty")?.value;
    return unitType ? targetTypes.has(unitType) : false;
  });

const buildDiagnostic = (
  parameter: UnitParameter,
  message: string,
): SyntaxDiagnosticDto => ({
  line: parameter.line ?? 1,
  column: parameter.column ?? 0,
  length: parameter.length ?? parameter.key.length,
  message,
  severity: "error" as const,
});

const buildExplicitDecimalRangeRule = (
  key: string,
  minimum: number,
  maximum: number,
  message: string,
): UnitParameterDiagnosticRule => ({
  key,
  message,
  isInvalid: (parameter) =>
    parseExplicitDecimalInRange(parameter, minimum, maximum) === undefined,
});

const parseExplicitDecimalInRange = (
  parameter: UnitParameter | undefined,
  minimum: number,
  maximum: number,
): number | undefined => {
  const rawValue = parameter?.value;
  if (!rawValue || !/^\d+$/.test(rawValue)) {
    return undefined;
  }

  const numericValue = Number(rawValue);
  return numericValue >= minimum && numericValue <= maximum
    ? numericValue
    : undefined;
};

const parseExplicitHexadecimalInRange = (
  value: string | undefined,
  minimum: number,
  maximum: number,
): number | undefined => {
  if (!value || !/^[0-9a-fA-F]{1,8}$/.test(value)) {
    return undefined;
  }

  const numericValue = Number.parseInt(value, 16);
  return numericValue >= minimum && numericValue <= maximum
    ? numericValue
    : undefined;
};

const isValidExplicitColonSeparatedHexadecimalEventId = (
  parameter: UnitParameter | undefined,
): boolean => {
  const rawValue = parameter?.value;
  if (!rawValue) {
    return false;
  }

  const segments = rawValue.split(":");
  if (segments.length !== 2) {
    return false;
  }

  return segments.every(
    (segment) =>
      parseExplicitHexadecimalInRange(segment, 0x00000000, 0xffffffff) !==
      undefined,
  );
};

const isValidExplicitIpv4Address = (
  parameter: UnitParameter | undefined,
): boolean => {
  const rawValue = parameter?.value;
  if (!rawValue) {
    return false;
  }

  const octets = rawValue.split(".");
  if (octets.length !== 4) {
    return false;
  }

  return octets.every((octet) => {
    if (!/^\d+$/.test(octet)) {
      return false;
    }

    const numericValue = Number(octet);
    return numericValue >= 0 && numericValue <= 255;
  });
};

const getByteLength = (value: string): number =>
  new TextEncoder().encode(value).length;

const hasWildcard = (value: string): boolean => value.includes("*");

const isValidExplicitFileMonitoringFileName = (
  parameter: UnitParameter | undefined,
): boolean => {
  const rawValue = parameter?.value;
  if (rawValue === undefined) {
    return false;
  }

  const byteLength = getByteLength(rawValue);
  return byteLength >= 1 && byteLength <= 255;
};

const isValidExplicitFileMonitoringInterval = (
  parameter: UnitParameter | undefined,
): boolean => parseExplicitDecimalInRange(parameter, 1, 600) !== undefined;

const hasInvalidWildcardWithShortMonitoringInterval = (
  parameter: UnitParameter,
  unit: Unit,
): boolean => {
  if (!hasWildcard(parameter.value)) {
    return false;
  }

  const effectiveFlwi = findParameter(unit, "flwi")?.value ?? DEFAULTS.Flwi;
  if (!/^\d+$/.test(effectiveFlwi)) {
    return false;
  }

  const monitoringInterval = Number(effectiveFlwi);
  return monitoringInterval >= 1 && monitoringInterval <= 9;
};

const collectRuleDiagnostics = (
  unit: Unit,
  rules: readonly UnitParameterDiagnosticRule[],
): SyntaxDiagnosticDto[] =>
  rules.flatMap((rule) => {
    const parameter = findParameter(unit, rule.key);
    return parameter && rule.isInvalid(parameter, unit)
      ? [buildDiagnostic(parameter, rule.message)]
      : [];
  });

type ParsedExplicitScheduleRuleValue = {
  hasExplicitRuleNumber: boolean;
  ruleNumber: number;
  value: string;
};

const parseExplicitScheduleRuleValue = (
  rawValue: string | undefined,
): ParsedExplicitScheduleRuleValue | undefined => {
  const matched = /^((\d{1,3}),)?(.+)$/.exec(rawValue ?? "");
  if (!matched) {
    return undefined;
  }

  return {
    hasExplicitRuleNumber: matched[2] !== undefined,
    ruleNumber: matched[2] === undefined ? 1 : Number(matched[2]),
    value: matched[3],
  };
};

const isValidScheduleRuleNumber = (
  parsedValue: ParsedExplicitScheduleRuleValue | undefined,
): boolean =>
  parsedValue !== undefined &&
  (!parsedValue.hasExplicitRuleNumber ||
    (parsedValue.ruleNumber >= 1 && parsedValue.ruleNumber <= 144));

const parseHourMinuteValue = (
  rawValue: string,
): { hours: number; minutes: number } | undefined => {
  const matched = /^\+?(\d{2}):(\d{2})$/.exec(rawValue);
  if (!matched) {
    return undefined;
  }

  return {
    hours: Number(matched[1]),
    minutes: Number(matched[2]),
  };
};

const isValidHourMinuteRange = (rawValue: string): boolean => {
  const parsed = parseHourMinuteValue(rawValue);
  return (
    parsed !== undefined &&
    parsed.hours >= 0 &&
    parsed.hours <= 47 &&
    parsed.minutes >= 0 &&
    parsed.minutes <= 59
  );
};

const isValidDelayMinutesRange = (rawValue: string): boolean => {
  const matched = /^[MCU](\d{1,4})$/.exec(rawValue);
  if (!matched) {
    return false;
  }

  const minutes = Number(matched[1]);
  return minutes >= 1 && minutes <= 2879;
};

const isValidWaitMinutesRange = (rawValue: string): boolean => {
  if (!/^\d{1,4}$/.test(rawValue)) {
    return false;
  }

  const minutes = Number(rawValue);
  return minutes >= 1 && minutes <= 2879;
};

const isValidExplicitParentScheduleRule = (
  parameter: UnitParameter,
  unit: Unit,
  rootUnits: readonly Unit[],
): boolean => {
  if (rootUnits.includes(unit)) {
    return true;
  }

  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  if (!isValidScheduleRuleNumber(parsed) || parsed === undefined) {
    return false;
  }

  if (!/^\d{1,3}$/.test(parsed.value)) {
    return false;
  }

  const parentRuleNumber = Number(parsed.value);
  return parentRuleNumber >= 1 && parentRuleNumber <= 144;
};

const isValidExplicitStartTime = (parameter: UnitParameter): boolean => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  return (
    isValidScheduleRuleNumber(parsed) &&
    parsed !== undefined &&
    isValidHourMinuteRange(parsed.value)
  );
};

const isValidExplicitCycle = (parameter: UnitParameter): boolean => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  if (!isValidScheduleRuleNumber(parsed) || parsed === undefined) {
    return false;
  }

  const matched = /^\((\d{1,3}),([ymwd])\)$/.exec(parsed.value);
  if (!matched) {
    return false;
  }

  const cycle = Number(matched[1]);
  const unitType = matched[2];
  const maximumByUnit = {
    y: 10,
    m: 12,
    w: 5,
    d: 31,
  } as const;
  return cycle >= 1 && cycle <= maximumByUnit[unitType];
};

const isValidExplicitShiftDays = (parameter: UnitParameter): boolean => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  if (!isValidScheduleRuleNumber(parsed) || parsed === undefined) {
    return false;
  }

  if (!/^\d{1,3}$/.test(parsed.value)) {
    return false;
  }

  const shiftDays = Number(parsed.value);
  return shiftDays >= 1 && shiftDays <= 31;
};

const isValidOptionalOneToThirtyOne = (rawValue: string | undefined): boolean =>
  rawValue === undefined ||
  (/^\d{1,2}$/.test(rawValue) &&
    Number(rawValue) >= 1 &&
    Number(rawValue) <= 31);

const isValidExplicitScheduleByDaysFromStart = (
  parameter: UnitParameter,
): boolean => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  if (!isValidScheduleRuleNumber(parsed) || parsed === undefined) {
    return false;
  }

  const segments = parsed.value.split(",");
  const scheduleType = segments[0];
  if (
    !["no", "be", "af", "db", "da"].includes(scheduleType) ||
    segments.some((segment) => segment.length === 0)
  ) {
    return false;
  }

  if (scheduleType === "no") {
    return segments.length === 1;
  }

  if (scheduleType === "db" || scheduleType === "da") {
    return segments.length <= 2 && isValidOptionalOneToThirtyOne(segments[1]);
  }

  return (
    segments.length <= 3 &&
    isValidOptionalOneToThirtyOne(segments[1]) &&
    isValidOptionalOneToThirtyOne(segments[2])
  );
};

const isValidExplicitDelayTime = (parameter: UnitParameter): boolean => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  if (!isValidScheduleRuleNumber(parsed) || parsed === undefined) {
    return false;
  }

  return (
    isValidHourMinuteRange(parsed.value) ||
    isValidDelayMinutesRange(parsed.value)
  );
};

const isValidExplicitWaitCount = (parameter: UnitParameter): boolean => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  if (!isValidScheduleRuleNumber(parsed) || parsed === undefined) {
    return false;
  }

  if (parsed.value === "no" || parsed.value === "un") {
    return true;
  }

  if (!/^\d{1,3}$/.test(parsed.value)) {
    return false;
  }

  const waitCount = Number(parsed.value);
  return waitCount >= 1 && waitCount <= 999;
};

const isValidExplicitWaitTime = (parameter: UnitParameter): boolean => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  if (!isValidScheduleRuleNumber(parsed) || parsed === undefined) {
    return false;
  }

  return (
    parsed.value === "no" ||
    parsed.value === "un" ||
    isValidHourMinuteRange(parsed.value) ||
    isValidWaitMinutesRange(parsed.value)
  );
};

const jobEndJudgmentNumericRangeRules = [
  buildExplicitDecimalRangeRule(
    "wth",
    0,
    2147483647,
    "Warning threshold (wth) must be between 0 and 2147483647.",
  ),
  buildExplicitDecimalRangeRule(
    "tho",
    0,
    2147483647,
    "Abnormal threshold (tho) must be between 0 and 2147483647.",
  ),
  buildExplicitDecimalRangeRule(
    "rjs",
    1,
    4294967295,
    "Retry start code (rjs) must be between 1 and 4294967295.",
  ),
  buildExplicitDecimalRangeRule(
    "rje",
    1,
    4294967295,
    "Retry end code (rje) must be between 1 and 4294967295.",
  ),
  buildExplicitDecimalRangeRule(
    "rec",
    1,
    12,
    "Retry count (rec) must be between 1 and 12.",
  ),
  buildExplicitDecimalRangeRule(
    "rei",
    1,
    10,
    "Retry interval (rei) must be between 1 and 10.",
  ),
] as const;

const fileMonitoringDiagnosticRules: readonly UnitParameterDiagnosticRule[] = [
  {
    key: "flwf",
    message: "Monitored file name (flwf) must be between 1 and 255 bytes.",
    isInvalid: (parameter) => !isValidExplicitFileMonitoringFileName(parameter),
  },
  {
    key: "flwi",
    message: "Monitoring interval (flwi) must be between 1 and 600.",
    isInvalid: (parameter) => !isValidExplicitFileMonitoringInterval(parameter),
  },
  {
    key: "flwf",
    message:
      "Monitored file name (flwf) cannot use wildcard (*) when monitoring interval (flwi) is between 1 and 9.",
    isInvalid: (parameter, unit) =>
      hasInvalidWildcardWithShortMonitoringInterval(parameter, unit),
  },
  {
    key: "flwc",
    message: "File monitoring condition (flwc) cannot specify both s and m.",
    isInvalid: (parameter) => {
      const flwcConditions = splitFileMonitoringConditions(parameter.value);
      return flwcConditions.has("s") && flwcConditions.has("m");
    },
  },
  {
    key: "flco",
    message:
      "File close option (flco) requires file creation monitoring (flwc=c).",
    isInvalid: (_parameter, unit) => {
      const effectiveFlwc = findParameter(unit, "flwc")?.value ?? DEFAULTS.Flwc;
      return !splitFileMonitoringConditions(effectiveFlwc).has("c");
    },
  },
];

const eventSendingDiagnosticRules: readonly UnitParameterDiagnosticRule[] = [
  {
    key: "evsid",
    message:
      "Event ID (evsid) must be hexadecimal within 00000000-00001FFF or 7FFF8000-7FFFFFFF.",
    isInvalid: (parameter) =>
      parseExplicitHexadecimalInRange(
        parameter.value,
        0x00000000,
        0x00001fff,
      ) === undefined &&
      parseExplicitHexadecimalInRange(
        parameter.value,
        0x7fff8000,
        0x7fffffff,
      ) === undefined,
  },
  buildExplicitDecimalRangeRule(
    "evspl",
    3,
    600,
    "Event arrival check interval (evspl) must be between 3 and 600.",
  ),
  buildExplicitDecimalRangeRule(
    "evsrc",
    0,
    999,
    "Event arrival check count (evsrc) must be between 0 and 999.",
  ),
  {
    key: "evsrt",
    message:
      "Event arrival check (evsrt=y) requires an event destination host (evhst).",
    isInvalid: (parameter, unit) =>
      (parameter.value ?? DEFAULTS.Evsrt) === "y" &&
      !findParameter(unit, "evhst"),
  },
];

const eventReceivingDiagnosticRules: readonly UnitParameterDiagnosticRule[] = [
  {
    key: "evwid",
    message:
      "Event ID (evwid) must be hexadecimal in 00000000:00000000-FFFFFFFF:FFFFFFFF format.",
    isInvalid: (parameter) =>
      !isValidExplicitColonSeparatedHexadecimalEventId(parameter),
  },
  {
    key: "evipa",
    message:
      "Event source IP address (evipa) must be a dotted-decimal IPv4 address between 0.0.0.0 and 255.255.255.255.",
    isInvalid: (parameter) => !isValidExplicitIpv4Address(parameter),
  },
  {
    key: "evesc",
    message: "Event search condition (evesc) must be no or between 1 and 720.",
    isInvalid: (parameter) => !isValidExplicitEventSearchCondition(parameter),
  },
];

const buildScheduleRuleDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, scheduleRuleDiagnosticTargetTypes).flatMap(
    (unit) =>
      collectRuleDiagnostics(unit, [
        {
          key: "ln",
          message:
            "Parent schedule rule (ln) must use schedule rule numbers between 1 and 144.",
          isInvalid: (parameter, currentUnit) =>
            !isValidExplicitParentScheduleRule(
              parameter,
              currentUnit,
              rootUnits,
            ),
        },
        {
          key: "st",
          message:
            "Start time (st) must use schedule rule numbers 1..144 and times between 00:00 and 47:59.",
          isInvalid: (parameter) => !isValidExplicitStartTime(parameter),
        },
        {
          key: "cy",
          message:
            "Cycle value (cy) must use schedule rule numbers 1..144 and cycle ranges y=1..10, m=1..12, w=1..5, or d=1..31.",
          isInvalid: (parameter) => !isValidExplicitCycle(parameter),
        },
        {
          key: "shd",
          message:
            "Maximum shift days (shd) must use schedule rule numbers 1..144 and values between 1 and 31.",
          isInvalid: (parameter) => !isValidExplicitShiftDays(parameter),
        },
        {
          key: "cftd",
          message:
            "Days-from-start rule (cftd) must use schedule rule numbers 1..144 with valid no/be/af/db/da ranges.",
          isInvalid: (parameter) =>
            !isValidExplicitScheduleByDaysFromStart(parameter),
        },
        {
          key: "sy",
          message:
            "Start delay time (sy) must use schedule rule numbers 1..144 and either 00:00-47:59 or M/C/U minutes between 1 and 2879.",
          isInvalid: (parameter) => !isValidExplicitDelayTime(parameter),
        },
        {
          key: "ey",
          message:
            "End delay time (ey) must use schedule rule numbers 1..144 and either 00:00-47:59 or M/C/U minutes between 1 and 2879.",
          isInvalid: (parameter) => !isValidExplicitDelayTime(parameter),
        },
        {
          key: "wc",
          message:
            "Start-condition count (wc) must use schedule rule numbers 1..144 and values no, un, or 1..999.",
          isInvalid: (parameter) => !isValidExplicitWaitCount(parameter),
        },
        {
          key: "wt",
          message:
            "Monitoring end time (wt) must use schedule rule numbers 1..144 and values no, un, 00:00-47:59, or 1..2879 minutes.",
          isInvalid: (parameter) => !isValidExplicitWaitTime(parameter),
        },
      ]),
  );

const buildJobEndJudgmentDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, jobEndJudgmentDiagnosticTargetTypes).flatMap(
    (unit) => {
      const diagnostics = collectRuleDiagnostics(
        unit,
        jobEndJudgmentNumericRangeRules,
      );
      const abrParameter = findParameter(unit, "abr");
      const effectiveJobEndJudgment =
        findParameter(unit, "jd")?.value ?? DEFAULTS.Jd;
      const effectiveAutomaticRetry = abrParameter?.value ?? DEFAULTS.Abr;

      if (effectiveJobEndJudgment !== DEFAULTS.Jd) {
        if (abrParameter?.value === "y") {
          diagnostics.push(
            buildDiagnostic(
              abrParameter,
              "Automatic retry (abr=y) requires end judgment (jd) to be cod.",
            ),
          );
        }

        for (const retryParameterKey of jobEndJudgmentRetryParameterKeys) {
          const retryParameter = findParameter(unit, retryParameterKey);
          if (!retryParameter) {
            continue;
          }

          diagnostics.push(
            buildDiagnostic(
              retryParameter,
              `Retry parameter (${retryParameterKey}) requires end judgment (jd) to be cod.`,
            ),
          );
        }

        return diagnostics;
      }

      if (effectiveAutomaticRetry === "y") {
        return diagnostics;
      }

      for (const retryParameterKey of jobEndJudgmentRetryParameterKeys) {
        const retryParameter = findParameter(unit, retryParameterKey);
        if (!retryParameter) {
          continue;
        }

        diagnostics.push(
          buildDiagnostic(
            retryParameter,
            `Retry parameter (${retryParameterKey}) requires automatic retry (abr) to be y.`,
          ),
        );
      }

      return diagnostics;
    },
  );

const splitFileMonitoringConditions = (value: string): Set<string> =>
  new Set(value.split(":").filter((condition) => condition.length > 0));

const buildFileMonitoringDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, fileMonitoringDiagnosticTargetTypes).flatMap(
    (unit) => collectRuleDiagnostics(unit, fileMonitoringDiagnosticRules),
  );

const buildEventSendingDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, eventSendingDiagnosticTargetTypes).flatMap(
    (unit) => collectRuleDiagnostics(unit, eventSendingDiagnosticRules),
  );

const isValidExplicitEventSearchCondition = (
  parameter: UnitParameter | undefined,
): boolean => {
  const rawValue = parameter?.value;
  if (!rawValue) {
    return false;
  }

  if (rawValue === "no") {
    return true;
  }

  return parseExplicitDecimalInRange(parameter, 1, 720) !== undefined;
};

const buildEventReceivingDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, eventReceivingDiagnosticTargetTypes).flatMap(
    (unit) => collectRuleDiagnostics(unit, eventReceivingDiagnosticRules),
  );

export const buildSyntaxDiagnostics = (
  content: string,
): SyntaxDiagnosticDto[] => {
  const result = parseAjs(content);
  const syntaxDiagnostics = result.errors.map((error) => ({
    line: error.line,
    column: error.charPositionInLine,
    length: 1,
    message: error.msg,
    severity: "error" as const,
  }));
  if (syntaxDiagnostics.length > 0) {
    return syntaxDiagnostics;
  }

  return [
    ...syntaxDiagnostics,
    ...buildScheduleRuleDiagnostics(result.rootUnits),
    ...buildJobEndJudgmentDiagnostics(result.rootUnits),
    ...buildFileMonitoringDiagnostics(result.rootUnits),
    ...buildEventSendingDiagnostics(result.rootUnits),
    ...buildEventReceivingDiagnostics(result.rootUnits),
  ];
};
