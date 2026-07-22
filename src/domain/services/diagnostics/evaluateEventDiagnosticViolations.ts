import {
  findAjsUnitParameter,
  findAjsUnitParameters,
  findParentAjsUnit,
  flattenAjsUnits,
  type AjsDocument,
  type AjsParameter,
  type AjsUnit,
} from "../../models/ajs/AjsDocument";
import {
  eventReceiveFilterViolationReasons,
  type DiagnosticViolation,
  type EventReceiveFilterViolationReason,
} from "./DiagnosticViolation";
import { diagnosticRuleIds } from "./DiagnosticRuleId";
import {
  getCanonicalEventReceivingFilterByteLength,
  hasValidExplicitEventHostLength,
  hasValidExplicitEventReceivingFilterReference,
  hasValidExplicitEventReceivingId,
  hasValidExplicitEventReceivingQuotedString,
  hasValidExplicitEventReceivingTimeoutCondition,
  hasValidExplicitEventSearchCondition,
  hasValidExplicitEventSendingId,
  hasValidExplicitEventSourceIpAddress,
  hasValidExplicitEventTimeoutAction,
  parseExplicitEventDecimalInRange,
} from "./EventDiagnosticRules";

export const eventDiagnosticViolationReasons = {
  invalidHostLength: "invalid-host-length",
  invalidSendingId: "invalid-sending-id",
  invalidArrivalCheckInterval: "invalid-arrival-check-interval",
  invalidArrivalCheckCount: "invalid-arrival-check-count",
  arrivalCheckRequiresHost: "arrival-check-requires-host",
  invalidTimeoutPeriod: "invalid-timeout-period",
  invalidHoldAttribute: "invalid-hold-attribute",
  invalidTimeoutAction: "invalid-timeout-action",
  invalidIssueSourceUserId: "invalid-issue-source-user-id",
  invalidIssueSourceGroupId: "invalid-issue-source-group-id",
  invalidIssueSourceProcessId: "invalid-issue-source-process-id",
  invalidIssueSourceUserName: "invalid-issue-source-user-name",
  invalidIssueSourceGroupName: "invalid-issue-source-group-name",
  invalidReceivingId: "invalid-receiving-id",
  invalidSourceIpAddress: "invalid-source-ip-address",
  invalidMessageFilter: "invalid-message-filter",
  invalidDetailedInformationFilter: "invalid-detailed-information-filter",
  invalidEndJudgmentCondition: "invalid-end-judgment-condition",
  invalidSearchCondition: "invalid-search-condition",
  timeoutPeriodInStartCondition: "timeout-period-in-start-condition",
  holdAttributeInStartCondition: "hold-attribute-in-start-condition",
  timeoutActionInStartCondition: "timeout-action-in-start-condition",
} as const;

export type EventDiagnosticViolationReason =
  | (typeof eventDiagnosticViolationReasons)[keyof typeof eventDiagnosticViolationReasons]
  | EventReceiveFilterViolationReason;

export type EventDiagnosticViolation =
  DiagnosticViolation<EventDiagnosticViolationReason>;

export type EventReceivingDiagnosticViolationGroup = Readonly<{
  unit: AjsUnit;
  violations: readonly EventDiagnosticViolation[];
  startConditionViolations: readonly EventDiagnosticViolation[];
}>;

type EventParameterRule = Readonly<{
  key: string;
  ruleId: EventDiagnosticViolation["ruleId"];
  reason: EventDiagnosticViolationReason;
  isInvalid: (parameter: AjsParameter, unit: AjsUnit) => boolean;
}>;

const eventSendingTargetTypes = new Set(["evsj", "revsj"]);
const eventReceivingTargetTypes = new Set(["evwj", "revwj"]);

const buildViolation = (
  ruleId: EventDiagnosticViolation["ruleId"],
  reason: EventDiagnosticViolationReason,
  evidence: AjsParameter,
): EventDiagnosticViolation => ({ ruleId, reason, evidence });

const isExplicitTarget = (
  unit: AjsUnit,
  targetTypes: ReadonlySet<string>,
): boolean => {
  const explicitUnitType = findAjsUnitParameter(unit, "ty")?.value;
  return explicitUnitType ? targetTypes.has(explicitUnitType) : false;
};

const evaluateParameterRules = (
  unit: AjsUnit,
  rules: readonly EventParameterRule[],
): EventDiagnosticViolation[] =>
  rules.flatMap((rule) =>
    findAjsUnitParameters(unit, rule.key).flatMap((parameter) =>
      rule.isInvalid(parameter, unit)
        ? [buildViolation(rule.ruleId, rule.reason, parameter)]
        : [],
    ),
  );

const eventSendingRules: readonly EventParameterRule[] = [
  {
    key: "evhst",
    ruleId: diagnosticRuleIds.eventHostLength,
    reason: eventDiagnosticViolationReasons.invalidHostLength,
    isInvalid: (parameter) => !hasValidExplicitEventHostLength(parameter),
  },
  {
    key: "evsid",
    ruleId: diagnosticRuleIds.eventSendIdRange,
    reason: eventDiagnosticViolationReasons.invalidSendingId,
    isInvalid: (parameter) => !hasValidExplicitEventSendingId(parameter),
  },
  {
    key: "evspl",
    ruleId: diagnosticRuleIds.eventArrivalRange,
    reason: eventDiagnosticViolationReasons.invalidArrivalCheckInterval,
    isInvalid: (parameter) =>
      parseExplicitEventDecimalInRange(parameter, 3, 600) === undefined,
  },
  {
    key: "evsrc",
    ruleId: diagnosticRuleIds.eventArrivalRange,
    reason: eventDiagnosticViolationReasons.invalidArrivalCheckCount,
    isInvalid: (parameter) =>
      parseExplicitEventDecimalInRange(parameter, 0, 999) === undefined,
  },
  {
    key: "evsrt",
    ruleId: diagnosticRuleIds.eventArrivalHost,
    reason: eventDiagnosticViolationReasons.arrivalCheckRequiresHost,
    isInvalid: (parameter, unit) =>
      parameter.value === "y" && !findAjsUnitParameter(unit, "evhst"),
  },
];

const eventReceivingRules: readonly EventParameterRule[] = [
  {
    key: "etm",
    ruleId: diagnosticRuleIds.eventReceiveTimeout,
    reason: eventDiagnosticViolationReasons.invalidTimeoutPeriod,
    isInvalid: (parameter) =>
      parseExplicitEventDecimalInRange(parameter, 1, 1440) === undefined,
  },
  {
    key: "ha",
    ruleId: diagnosticRuleIds.eventReceiveTimeout,
    reason: eventDiagnosticViolationReasons.invalidHoldAttribute,
    isInvalid: (parameter) =>
      parameter.value !== "y" && parameter.value !== "n",
  },
  {
    key: "ets",
    ruleId: diagnosticRuleIds.eventReceiveTimeout,
    reason: eventDiagnosticViolationReasons.invalidTimeoutAction,
    isInvalid: (parameter) => !hasValidExplicitEventTimeoutAction(parameter),
  },
  {
    key: "evuid",
    ruleId: diagnosticRuleIds.eventReceiveNumericId,
    reason: eventDiagnosticViolationReasons.invalidIssueSourceUserId,
    isInvalid: (parameter) =>
      parseExplicitEventDecimalInRange(parameter, -1, 9999999999, true) ===
      undefined,
  },
  {
    key: "evgid",
    ruleId: diagnosticRuleIds.eventReceiveNumericId,
    reason: eventDiagnosticViolationReasons.invalidIssueSourceGroupId,
    isInvalid: (parameter) =>
      parseExplicitEventDecimalInRange(parameter, -1, 9999999999, true) ===
      undefined,
  },
  {
    key: "evpid",
    ruleId: diagnosticRuleIds.eventReceiveNumericId,
    reason: eventDiagnosticViolationReasons.invalidIssueSourceProcessId,
    isInvalid: (parameter) =>
      parseExplicitEventDecimalInRange(parameter, -1, 9999999999, true) ===
      undefined,
  },
  {
    key: "evusr",
    ruleId: diagnosticRuleIds.eventReceiveFilter,
    reason: eventDiagnosticViolationReasons.invalidIssueSourceUserName,
    isInvalid: (parameter) =>
      !hasValidExplicitEventReceivingQuotedString(parameter, 1, 20),
  },
  {
    key: "evgrp",
    ruleId: diagnosticRuleIds.eventReceiveFilter,
    reason: eventDiagnosticViolationReasons.invalidIssueSourceGroupName,
    isInvalid: (parameter) =>
      !hasValidExplicitEventReceivingQuotedString(parameter, 1, 20),
  },
  {
    key: "evhst",
    ruleId: diagnosticRuleIds.eventHostLength,
    reason: eventDiagnosticViolationReasons.invalidHostLength,
    isInvalid: (parameter) => !hasValidExplicitEventHostLength(parameter),
  },
  {
    key: "evwid",
    ruleId: diagnosticRuleIds.eventReceiveFormat,
    reason: eventDiagnosticViolationReasons.invalidReceivingId,
    isInvalid: (parameter) => !hasValidExplicitEventReceivingId(parameter),
  },
  {
    key: "evipa",
    ruleId: diagnosticRuleIds.eventReceiveFormat,
    reason: eventDiagnosticViolationReasons.invalidSourceIpAddress,
    isInvalid: (parameter) => !hasValidExplicitEventSourceIpAddress(parameter),
  },
  {
    key: "evwms",
    ruleId: diagnosticRuleIds.eventReceiveFilter,
    reason: eventDiagnosticViolationReasons.invalidMessageFilter,
    isInvalid: (parameter) =>
      !hasValidExplicitEventReceivingQuotedString(parameter, 1, 1024),
  },
  {
    key: "evdet",
    ruleId: diagnosticRuleIds.eventReceiveFilter,
    reason: eventDiagnosticViolationReasons.invalidDetailedInformationFilter,
    isInvalid: (parameter) =>
      !hasValidExplicitEventReceivingQuotedString(parameter, 1, 1024),
  },
  {
    key: "evwfr",
    ruleId: diagnosticRuleIds.eventReceiveFilter,
    reason: eventReceiveFilterViolationReasons.invalidShape,
    isInvalid: (parameter) =>
      !hasValidExplicitEventReceivingFilterReference(parameter),
  },
  {
    key: "evtmc",
    ruleId: diagnosticRuleIds.eventReceiveFilter,
    reason: eventDiagnosticViolationReasons.invalidEndJudgmentCondition,
    isInvalid: (parameter) =>
      !hasValidExplicitEventReceivingTimeoutCondition(parameter),
  },
  {
    key: "evesc",
    ruleId: diagnosticRuleIds.eventReceiveScope,
    reason: eventDiagnosticViolationReasons.invalidSearchCondition,
    isInvalid: (parameter) => !hasValidExplicitEventSearchCondition(parameter),
  },
];

const evaluateFilterAggregateViolation = (
  unit: AjsUnit,
): EventDiagnosticViolation[] => {
  let aggregateBytes = 0;
  for (const parameter of findAjsUnitParameters(unit, "evwfr")) {
    aggregateBytes += getCanonicalEventReceivingFilterByteLength(parameter);
    if (aggregateBytes > 2048) {
      return [
        buildViolation(
          diagnosticRuleIds.eventReceiveFilter,
          eventReceiveFilterViolationReasons.aggregateByteLimitExceeded,
          parameter,
        ),
      ];
    }
  }

  return [];
};

const hasStartConditionContext = (
  document: AjsDocument,
  unit: AjsUnit,
): boolean =>
  findParentAjsUnit(document, unit)?.children.some(
    (sibling) => findAjsUnitParameter(sibling, "ty")?.value === "rc",
  ) ?? false;

const startConditionParameterReasons = [
  {
    key: "etm",
    reason: eventDiagnosticViolationReasons.timeoutPeriodInStartCondition,
  },
  {
    key: "ha",
    reason: eventDiagnosticViolationReasons.holdAttributeInStartCondition,
  },
  {
    key: "ets",
    reason: eventDiagnosticViolationReasons.timeoutActionInStartCondition,
  },
] as const;

const evaluateStartConditionViolations = (
  document: AjsDocument,
  unit: AjsUnit,
): EventDiagnosticViolation[] =>
  hasStartConditionContext(document, unit)
    ? startConditionParameterReasons.flatMap(({ key, reason }) => {
        const parameter = findAjsUnitParameter(unit, key);
        return parameter
          ? [
              buildViolation(
                diagnosticRuleIds.eventReceiveTimeout,
                reason,
                parameter,
              ),
            ]
          : [];
      })
    : [];

export const evaluateEventSendingDiagnosticViolations = (
  document: AjsDocument,
): EventDiagnosticViolation[] =>
  flattenAjsUnits(document.rootUnits)
    .filter((unit) => isExplicitTarget(unit, eventSendingTargetTypes))
    .flatMap((unit) => evaluateParameterRules(unit, eventSendingRules));

export const evaluateEventReceivingDiagnosticViolationGroups = (
  document: AjsDocument,
): EventReceivingDiagnosticViolationGroup[] =>
  flattenAjsUnits(document.rootUnits)
    .filter((unit) => isExplicitTarget(unit, eventReceivingTargetTypes))
    .map((unit) => ({
      unit,
      violations: [
        ...evaluateParameterRules(unit, eventReceivingRules),
        ...evaluateFilterAggregateViolation(unit),
      ],
      startConditionViolations: evaluateStartConditionViolations(
        document,
        unit,
      ),
    }));
