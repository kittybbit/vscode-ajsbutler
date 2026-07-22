import {
  findAjsUnitParameter,
  findAjsUnitParameters,
  findParentAjsUnit,
  flattenAjsUnits,
  type AjsDocument,
  type AjsParameter,
  type AjsUnit,
} from "../../models/ajs/AjsDocument";
import { DEFAULTS } from "../../models/parameters/Defaults";
import type { DiagnosticViolation } from "./DiagnosticViolation";
import { diagnosticRuleIds } from "./DiagnosticRuleId";
import {
  hasFileCreationMonitoring,
  hasValidExplicitEndTiming,
  hasValidExplicitEventTimeoutAction,
  hasValidExplicitFileMonitoringByteLength,
  hasValidExplicitFileMonitoringCondition,
  hasWildcard,
  parseExplicitMonitoringWaitDecimalInRange,
} from "./MonitoringWaitDiagnosticRules";

export const monitoringWaitViolationReasons = {
  invalidFileNameByteLength: "invalid-file-name-byte-length",
  invalidMonitoringInterval: "invalid-monitoring-interval",
  wildcardWithShortMonitoringInterval:
    "wildcard-with-short-monitoring-interval",
  invalidMonitoringCondition: "invalid-monitoring-condition",
  fileCloseRequiresCreationMonitoring:
    "file-close-requires-creation-monitoring",
  invalidExecutionTime: "invalid-execution-time",
  invalidEventTimeoutAction: "invalid-event-timeout-action",
  executionTimeInStartCondition: "execution-time-in-start-condition",
  invalidExecutionInterval: "invalid-execution-interval",
  invalidEndTiming: "invalid-end-timing",
  endTimingOutsideStartCondition: "end-timing-outside-start-condition",
} as const;

export type MonitoringWaitViolationReason =
  (typeof monitoringWaitViolationReasons)[keyof typeof monitoringWaitViolationReasons];

export type MonitoringWaitDiagnosticViolation =
  DiagnosticViolation<MonitoringWaitViolationReason>;

const fileMonitoringTargetTypes = new Set(["flwj", "rflwj"]);
const executionIntervalControlTargetTypes = new Set(["tmwj", "rtmwj"]);
const eventReceivingTargetTypes = new Set(["evwj", "revwj"]);

const buildViolation = (
  ruleId: MonitoringWaitDiagnosticViolation["ruleId"],
  reason: MonitoringWaitViolationReason,
  evidence: AjsParameter,
): MonitoringWaitDiagnosticViolation => ({ ruleId, reason, evidence });

const isExplicitTarget = (
  unit: AjsUnit,
  targetTypes: ReadonlySet<string>,
): boolean => {
  const explicitUnitType = findAjsUnitParameter(unit, "ty")?.value;
  return explicitUnitType ? targetTypes.has(explicitUnitType) : false;
};

const evaluateAllParameters = (
  unit: AjsUnit,
  key: string,
  ruleId: MonitoringWaitDiagnosticViolation["ruleId"],
  reason: MonitoringWaitViolationReason,
  isInvalid: (parameter: AjsParameter) => boolean,
): MonitoringWaitDiagnosticViolation[] =>
  findAjsUnitParameters(unit, key).flatMap((parameter) =>
    isInvalid(parameter) ? [buildViolation(ruleId, reason, parameter)] : [],
  );

const evaluateExecutionTimeRangeViolations = (
  unit: AjsUnit,
): MonitoringWaitDiagnosticViolation[] =>
  evaluateAllParameters(
    unit,
    "fd",
    diagnosticRuleIds.waitFdContext,
    monitoringWaitViolationReasons.invalidExecutionTime,
    (parameter) =>
      parseExplicitMonitoringWaitDecimalInRange(parameter, 1, 1440) ===
      undefined,
  );

const hasStartConditionContext = (
  document: AjsDocument,
  unit: AjsUnit,
): boolean =>
  findParentAjsUnit(document, unit)?.children.some(
    (sibling) => findAjsUnitParameter(sibling, "ty")?.value === "rc",
  ) ?? false;

const evaluateExecutionTimeContextViolation = (
  document: AjsDocument,
  unit: AjsUnit,
): MonitoringWaitDiagnosticViolation[] => {
  const executionTime = findAjsUnitParameter(unit, "fd");
  return executionTime && hasStartConditionContext(document, unit)
    ? [
        buildViolation(
          diagnosticRuleIds.waitFdContext,
          monitoringWaitViolationReasons.executionTimeInStartCondition,
          executionTime,
        ),
      ]
    : [];
};

const evaluateEventTimeoutActionViolations = (
  unit: AjsUnit,
): MonitoringWaitDiagnosticViolation[] =>
  evaluateAllParameters(
    unit,
    "ets",
    diagnosticRuleIds.waitEtsValue,
    monitoringWaitViolationReasons.invalidEventTimeoutAction,
    (parameter) => !hasValidExplicitEventTimeoutAction(parameter),
  );

const evaluateFileMonitoringViolationsForUnit = (
  document: AjsDocument,
  unit: AjsUnit,
): MonitoringWaitDiagnosticViolation[] => {
  const effectiveMonitoringInterval =
    findAjsUnitParameter(unit, "flwi")?.value ?? DEFAULTS.Flwi;
  const parsedMonitoringInterval = /^\d+$/.test(effectiveMonitoringInterval)
    ? Number(effectiveMonitoringInterval)
    : undefined;
  const hasShortMonitoringInterval =
    parsedMonitoringInterval !== undefined &&
    parsedMonitoringInterval >= 1 &&
    parsedMonitoringInterval <= 9;
  const effectiveMonitoringCondition =
    findAjsUnitParameter(unit, "flwc")?.value ?? DEFAULTS.Flwc;

  return [
    ...evaluateAllParameters(
      unit,
      "flwf",
      diagnosticRuleIds.stringFamilyConstraint,
      monitoringWaitViolationReasons.invalidFileNameByteLength,
      (parameter) => !hasValidExplicitFileMonitoringByteLength(parameter),
    ),
    ...evaluateAllParameters(
      unit,
      "flwi",
      diagnosticRuleIds.stringFamilyConstraint,
      monitoringWaitViolationReasons.invalidMonitoringInterval,
      (parameter) =>
        parseExplicitMonitoringWaitDecimalInRange(parameter, 1, 600) ===
        undefined,
    ),
    ...evaluateAllParameters(
      unit,
      "flwf",
      diagnosticRuleIds.stringFamilyConstraint,
      monitoringWaitViolationReasons.wildcardWithShortMonitoringInterval,
      (parameter) => hasWildcard(parameter) && hasShortMonitoringInterval,
    ),
    ...evaluateAllParameters(
      unit,
      "flwc",
      diagnosticRuleIds.fileMonitorCondition,
      monitoringWaitViolationReasons.invalidMonitoringCondition,
      (parameter) => !hasValidExplicitFileMonitoringCondition(parameter),
    ),
    ...evaluateAllParameters(
      unit,
      "flco",
      diagnosticRuleIds.fileMonitorOutput,
      monitoringWaitViolationReasons.fileCloseRequiresCreationMonitoring,
      () => !hasFileCreationMonitoring(effectiveMonitoringCondition),
    ),
    ...evaluateExecutionTimeRangeViolations(unit),
    ...evaluateEventTimeoutActionViolations(unit),
    ...evaluateExecutionTimeContextViolation(document, unit),
  ];
};

const evaluateExecutionIntervalViolationsForUnit = (
  document: AjsDocument,
  unit: AjsUnit,
): MonitoringWaitDiagnosticViolation[] => {
  const endTiming = findAjsUnitParameter(unit, "etn");

  return [
    ...evaluateAllParameters(
      unit,
      "tmitv",
      diagnosticRuleIds.intervalControlRange,
      monitoringWaitViolationReasons.invalidExecutionInterval,
      (parameter) =>
        parseExplicitMonitoringWaitDecimalInRange(parameter, 1, 1440) ===
        undefined,
    ),
    ...evaluateAllParameters(
      unit,
      "etn",
      diagnosticRuleIds.intervalControlRange,
      monitoringWaitViolationReasons.invalidEndTiming,
      (parameter) => !hasValidExplicitEndTiming(parameter),
    ),
    ...evaluateExecutionTimeRangeViolations(unit),
    ...evaluateEventTimeoutActionViolations(unit),
    ...evaluateExecutionTimeContextViolation(document, unit),
    ...(endTiming?.value === "y" && !hasStartConditionContext(document, unit)
      ? [
          buildViolation(
            diagnosticRuleIds.intervalControlEndContext,
            monitoringWaitViolationReasons.endTimingOutsideStartCondition,
            endTiming,
          ),
        ]
      : []),
  ];
};

export const evaluateFileMonitoringDiagnosticViolations = (
  document: AjsDocument,
): MonitoringWaitDiagnosticViolation[] =>
  flattenAjsUnits(document.rootUnits)
    .filter((unit) => isExplicitTarget(unit, fileMonitoringTargetTypes))
    .flatMap((unit) => evaluateFileMonitoringViolationsForUnit(document, unit));

export const evaluateExecutionIntervalControlDiagnosticViolations = (
  document: AjsDocument,
): MonitoringWaitDiagnosticViolation[] =>
  flattenAjsUnits(document.rootUnits)
    .filter((unit) =>
      isExplicitTarget(unit, executionIntervalControlTargetTypes),
    )
    .flatMap((unit) =>
      evaluateExecutionIntervalViolationsForUnit(document, unit),
    );

export const evaluateEventReceivingExecutionTimeRangeViolations = (
  unit: AjsUnit,
): MonitoringWaitDiagnosticViolation[] =>
  isExplicitTarget(unit, eventReceivingTargetTypes)
    ? evaluateExecutionTimeRangeViolations(unit)
    : [];

export const evaluateEventReceivingExecutionTimeContextViolations = (
  document: AjsDocument,
  unit: AjsUnit,
): MonitoringWaitDiagnosticViolation[] =>
  isExplicitTarget(unit, eventReceivingTargetTypes)
    ? evaluateExecutionTimeContextViolation(document, unit)
    : [];
