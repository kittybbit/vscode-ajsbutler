import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import type { Unit, UnitParameter } from "../../domain/values/Unit";
import type {
  BuildSyntaxDiagnosticsOptions,
  SyntaxDiagnosticDto,
} from "./syntaxDiagnosticTypes";
import {
  buildDiagnostic,
  collectRuleDiagnostics,
  type UnitParameterDiagnosticRule,
} from "./syntaxDiagnosticCore";
import { hasInvalidExplicitThresholdOrdering } from "./syntaxDiagnosticJobEndRules";
import {
  DEFAULT_SCHEDULE_LIMIT_YEAR,
  hasInvalidExplicitWeeklyCycleScheduleCompatibility,
  isValidExplicitCycle,
  isValidExplicitDelayTime,
  isValidExplicitParentScheduleRule,
  isValidExplicitScheduleByDaysFromStart,
  isValidExplicitScheduleDate,
  isValidExplicitShiftDays,
  isValidExplicitStartTime,
  isValidExplicitWaitCount,
  isValidExplicitWaitTime,
  normalizeScheduleLimitYear,
} from "./syntaxDiagnosticScheduleRules";
import {
  eventReceivingDiagnosticTargetTypes,
  eventSendingDiagnosticTargetTypes,
  executionIntervalControlDiagnosticTargetTypes,
  fileMonitoringDiagnosticTargetTypes,
  jobEndJudgmentDiagnosticTargetTypes,
  jobEndJudgmentRetryParameterKeys,
  queueTransferFileDiagnosticTargetTypes,
  scheduleRuleDiagnosticTargetTypes,
  transferOperationDiagnosticTargetTypes,
} from "./syntaxDiagnosticTargetTypes";
import {
  findParameter,
  findParameters,
  findUnitsByTypes,
  hasStartConditionContext,
} from "./syntaxDiagnosticUnitLookup";
import {
  eventReceivingDiagnosticRules,
  eventSendingDiagnosticRules,
  executionIntervalControlDiagnosticRules,
  fileMonitoringDiagnosticRules,
  jobEndJudgmentNumericRangeRules,
  queueTransferFileDiagnosticRules,
  transferOperationDiagnosticRules,
} from "./syntaxDiagnosticRuleSets";

const scheduleRuleParameterDiagnosticRules = (
  rootUnits: Unit[],
): readonly UnitParameterDiagnosticRule[] => [
  {
    key: "ln",
    message:
      "Parent schedule rule (ln) must use schedule rule numbers between 1 and 144.",
    isInvalid: (parameter, currentUnit) =>
      !isValidExplicitParentScheduleRule(parameter, currentUnit, rootUnits),
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
];

const buildScheduleDateDiagnostics = (
  unit: Unit,
  options: BuildSyntaxDiagnosticsOptions,
): SyntaxDiagnosticDto[] =>
  findParameters(unit, "sd").flatMap((parameter) =>
    isValidExplicitScheduleDate(
      parameter,
      normalizeScheduleLimitYear(options.scheduleLimitYear) ??
        DEFAULT_SCHEDULE_LIMIT_YEAR,
    )
      ? []
      : [
          buildDiagnostic(
            parameter,
            "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
          ),
        ],
  );

const buildWeeklyCycleCompatibilityDiagnostics = (
  unit: Unit,
): SyntaxDiagnosticDto[] =>
  findParameters(unit, "cy").flatMap((parameter) =>
    hasInvalidExplicitWeeklyCycleScheduleCompatibility(parameter, unit)
      ? [
          buildDiagnostic(
            parameter,
            "Weekly cycle (cy=(n,w)) cannot be specified when execution-start date (sd) uses open-day (*) or closed-day (@) scheduling for the same rule.",
          ),
        ]
      : [],
  );

export const buildScheduleRuleDiagnostics = (
  rootUnits: Unit[],
  options: BuildSyntaxDiagnosticsOptions,
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, scheduleRuleDiagnosticTargetTypes).flatMap(
    (unit) => [
      ...buildScheduleDateDiagnostics(unit, options),
      ...collectRuleDiagnostics(
        unit,
        scheduleRuleParameterDiagnosticRules(rootUnits),
      ),
      ...buildWeeklyCycleCompatibilityDiagnostics(unit),
    ],
  );

const collectRetryParameterDiagnostics = (
  unit: Unit,
  buildMessage: (retryParameterKey: string) => string,
): SyntaxDiagnosticDto[] =>
  jobEndJudgmentRetryParameterKeys.flatMap((retryParameterKey) => {
    const retryParameter = findParameter(unit, retryParameterKey);
    return retryParameter
      ? [buildDiagnostic(retryParameter, buildMessage(retryParameterKey))]
      : [];
  });

type OptionalParameterDiagnosticInput = {
  parameter: UnitParameter | undefined;
  message: string;
};

type JobEndJudgmentContext = {
  unit: Unit;
  effectiveJobEndJudgment: string;
  effectiveAutomaticRetry: string;
  abrParameter: UnitParameter | undefined;
  warningThresholdParameter: UnitParameter | undefined;
  abnormalThresholdParameter: UnitParameter | undefined;
};

const collectOptionalParameterDiagnostics = (
  inputs: readonly OptionalParameterDiagnosticInput[],
): SyntaxDiagnosticDto[] =>
  inputs.flatMap(({ parameter, message }) =>
    parameter ? [buildDiagnostic(parameter, message)] : [],
  );

const shouldCheckThresholdOrdering = ({
  unit,
  effectiveJobEndJudgment,
}: JobEndJudgmentContext): boolean =>
  effectiveJobEndJudgment === DEFAULTS.Jd &&
  hasInvalidExplicitThresholdOrdering(unit);

const collectThresholdOrderingDiagnostics = (
  context: JobEndJudgmentContext,
): SyntaxDiagnosticDto[] => {
  if (!shouldCheckThresholdOrdering(context)) {
    return [];
  }

  return collectOptionalParameterDiagnostics([
    {
      parameter: context.warningThresholdParameter,
      message:
        "Warning threshold (wth) must be less than abnormal threshold (tho).",
    },
    {
      parameter: context.abnormalThresholdParameter,
      message:
        "Abnormal threshold (tho) must be greater than warning threshold (wth).",
    },
  ]);
};

const collectInvalidEndJudgmentRetryDiagnostics = (
  unit: Unit,
  abrParameter: UnitParameter | undefined,
): SyntaxDiagnosticDto[] => [
  ...(abrParameter?.value === "y"
    ? [
        buildDiagnostic(
          abrParameter,
          "Automatic retry (abr=y) requires end judgment (jd) to be cod.",
        ),
      ]
    : []),
  ...collectRetryParameterDiagnostics(
    unit,
    (retryParameterKey) =>
      `Retry parameter (${retryParameterKey}) requires end judgment (jd) to be cod.`,
  ),
];

const collectAutomaticRetryDisabledDiagnostics = (
  unit: Unit,
): SyntaxDiagnosticDto[] =>
  collectRetryParameterDiagnostics(
    unit,
    (retryParameterKey) =>
      `Retry parameter (${retryParameterKey}) requires automatic retry (abr) to be y.`,
  );

const collectJobEndJudgmentRetryGateDiagnostics = (
  context: JobEndJudgmentContext,
): SyntaxDiagnosticDto[] => {
  if (context.effectiveJobEndJudgment !== DEFAULTS.Jd) {
    return collectInvalidEndJudgmentRetryDiagnostics(
      context.unit,
      context.abrParameter,
    );
  }

  return context.effectiveAutomaticRetry === "y"
    ? []
    : collectAutomaticRetryDisabledDiagnostics(context.unit);
};

const getJobEndJudgmentContext = (unit: Unit): JobEndJudgmentContext => {
  const abrParameter = findParameter(unit, "abr");
  return {
    unit,
    effectiveJobEndJudgment: findParameter(unit, "jd")?.value ?? DEFAULTS.Jd,
    effectiveAutomaticRetry: abrParameter?.value ?? DEFAULTS.Abr,
    abrParameter,
    warningThresholdParameter: findParameter(unit, "wth"),
    abnormalThresholdParameter: findParameter(unit, "tho"),
  };
};

const buildJobEndJudgmentDiagnosticsForUnit = (
  unit: Unit,
): SyntaxDiagnosticDto[] => {
  const context = getJobEndJudgmentContext(unit);

  return [
    ...collectRuleDiagnostics(unit, jobEndJudgmentNumericRangeRules),
    ...collectThresholdOrderingDiagnostics(context),
    ...collectJobEndJudgmentRetryGateDiagnostics(context),
  ];
};

export const buildJobEndJudgmentDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, jobEndJudgmentDiagnosticTargetTypes).flatMap(
    buildJobEndJudgmentDiagnosticsForUnit,
  );

export const buildFileMonitoringDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, fileMonitoringDiagnosticTargetTypes).flatMap(
    (unit) => [
      ...collectRuleDiagnostics(unit, fileMonitoringDiagnosticRules),
      ...collectStartConditionDisabledParameterDiagnostics(unit, [
        {
          key: "fd",
          message:
            "Execution time (fd) cannot be specified for jobs defined as start conditions.",
        },
      ]),
    ],
  );

export const buildExecutionIntervalControlDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(
    rootUnits,
    executionIntervalControlDiagnosticTargetTypes,
  ).flatMap((unit) => {
    const diagnostics = [
      ...collectRuleDiagnostics(unit, executionIntervalControlDiagnosticRules),
      ...collectStartConditionDisabledParameterDiagnostics(unit, [
        {
          key: "fd",
          message:
            "Execution time (fd) cannot be specified for jobs defined as start conditions.",
        },
      ]),
    ];
    const endTimingParameter = findParameter(unit, "etn");

    if (endTimingParameter?.value === "y" && !hasStartConditionContext(unit)) {
      diagnostics.push(
        buildDiagnostic(
          endTimingParameter,
          "End timing (etn=y) can be specified only for execution-interval control jobs defined as start conditions.",
        ),
      );
    }

    return diagnostics;
  });

export const buildTransferOperationDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, transferOperationDiagnosticTargetTypes).flatMap(
    (unit) => collectRuleDiagnostics(unit, transferOperationDiagnosticRules),
  );

export const buildQueueTransferFileDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, queueTransferFileDiagnosticTargetTypes).flatMap(
    (unit) => collectRuleDiagnostics(unit, queueTransferFileDiagnosticRules),
  );

export const buildEventSendingDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, eventSendingDiagnosticTargetTypes).flatMap(
    (unit) => collectRuleDiagnostics(unit, eventSendingDiagnosticRules),
  );

const collectStartConditionDisabledParameterDiagnostics = (
  unit: Unit,
  parameterMessages: readonly { key: string; message: string }[],
): SyntaxDiagnosticDto[] =>
  hasStartConditionContext(unit)
    ? collectOptionalParameterDiagnostics(
        parameterMessages.map(({ key, message }) => ({
          parameter: findParameter(unit, key),
          message,
        })),
      )
    : [];

export const buildEventReceivingDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, eventReceivingDiagnosticTargetTypes).flatMap(
    (unit) => {
      const diagnostics = [
        ...collectRuleDiagnostics(unit, eventReceivingDiagnosticRules),
        ...collectStartConditionDisabledParameterDiagnostics(unit, [
          {
            key: "fd",
            message:
              "Execution time (fd) cannot be specified for jobs defined as start conditions.",
          },
        ]),
      ];

      const invalidStartConditionParameters =
        collectStartConditionDisabledParameterDiagnostics(unit, [
          {
            key: "etm",
            message:
              "Event timeout period (etm) cannot be specified for jobs defined as start conditions.",
          },
          {
            key: "ha",
            message:
              "Hold attribute (ha) cannot be specified for jobs defined as start conditions.",
          },
          {
            key: "ets",
            message:
              "Event timeout action (ets) cannot be specified for jobs defined as start conditions.",
          },
        ]);

      diagnostics.push(...invalidStartConditionParameters);

      return diagnostics;
    },
  );
