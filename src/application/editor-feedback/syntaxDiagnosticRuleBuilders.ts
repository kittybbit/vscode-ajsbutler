import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import type { Unit } from "../../domain/values/Unit";
import type {
  BuildSyntaxDiagnosticsOptions,
  SyntaxDiagnosticDto,
} from "./syntaxDiagnosticTypes";
import {
  buildDiagnostic,
  collectRuleDiagnostics,
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

export const buildScheduleRuleDiagnostics = (
  rootUnits: Unit[],
  options: BuildSyntaxDiagnosticsOptions,
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, scheduleRuleDiagnosticTargetTypes).flatMap(
    (unit) => [
      ...findParameters(unit, "sd").flatMap((parameter) =>
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
      ),
      ...collectRuleDiagnostics(unit, [
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
      ...findParameters(unit, "cy").flatMap((parameter) =>
        hasInvalidExplicitWeeklyCycleScheduleCompatibility(parameter, unit)
          ? [
              buildDiagnostic(
                parameter,
                "Weekly cycle (cy=(n,w)) cannot be specified when execution-start date (sd) uses open-day (*) or closed-day (@) scheduling for the same rule.",
              ),
            ]
          : [],
      ),
    ],
  );

export const buildJobEndJudgmentDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, jobEndJudgmentDiagnosticTargetTypes).flatMap(
    (unit) => {
      const diagnostics = collectRuleDiagnostics(
        unit,
        jobEndJudgmentNumericRangeRules,
      );
      const abrParameter = findParameter(unit, "abr");
      const warningThresholdParameter = findParameter(unit, "wth");
      const abnormalThresholdParameter = findParameter(unit, "tho");
      const effectiveJobEndJudgment =
        findParameter(unit, "jd")?.value ?? DEFAULTS.Jd;
      const effectiveAutomaticRetry = abrParameter?.value ?? DEFAULTS.Abr;

      if (
        effectiveJobEndJudgment === DEFAULTS.Jd &&
        hasInvalidExplicitThresholdOrdering(unit)
      ) {
        if (warningThresholdParameter) {
          diagnostics.push(
            buildDiagnostic(
              warningThresholdParameter,
              "Warning threshold (wth) must be less than abnormal threshold (tho).",
            ),
          );
        }

        if (abnormalThresholdParameter) {
          diagnostics.push(
            buildDiagnostic(
              abnormalThresholdParameter,
              "Abnormal threshold (tho) must be greater than warning threshold (wth).",
            ),
          );
        }
      }

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
): SyntaxDiagnosticDto[] => {
  if (!hasStartConditionContext(unit)) {
    return [];
  }

  return parameterMessages.flatMap(({ key, message }) => {
    const parameter = findParameter(unit, key);
    return parameter ? [buildDiagnostic(parameter, message)] : [];
  });
};

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
