import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import { eventReceiveFilterViolationReasons } from "../../domain/services/diagnostics/DiagnosticViolation";
import {
  evaluateEventReceivingDiagnosticViolationGroups,
  evaluateEventSendingDiagnosticViolations,
  eventDiagnosticViolationReasons,
  type EventDiagnosticViolation,
  type EventDiagnosticViolationReason,
} from "../../domain/services/diagnostics/evaluateEventDiagnosticViolations";
import {
  evaluateEventReceivingExecutionTimeContextViolations,
  evaluateEventReceivingExecutionTimeRangeViolations,
} from "../../domain/services/diagnostics/evaluateMonitoringWaitDiagnosticViolations";
import { toDiagnosticSourceRange } from "./diagnosticSourceRange";
import { mapMonitoringWaitDiagnosticViolation } from "./syntaxDiagnosticMonitoringWaitRuleBuilders";
import type { SyntaxDiagnosticDto } from "./syntaxDiagnosticTypes";

const eventDiagnosticMessages: Readonly<
  Record<EventDiagnosticViolationReason, string>
> = {
  [eventDiagnosticViolationReasons.invalidHostLength]:
    "Event host (evhst) must be between 1 and 255 bytes.",
  [eventDiagnosticViolationReasons.invalidSendingId]:
    "Event ID (evsid) must be hexadecimal within 00000000-00001FFF or 7FFF8000-7FFFFFFF.",
  [eventDiagnosticViolationReasons.invalidArrivalCheckInterval]:
    "Event arrival check interval (evspl) must be between 3 and 600.",
  [eventDiagnosticViolationReasons.invalidArrivalCheckCount]:
    "Event arrival check count (evsrc) must be between 0 and 999.",
  [eventDiagnosticViolationReasons.arrivalCheckRequiresHost]:
    "Event arrival check (evsrt=y) requires an event destination host (evhst).",
  [eventDiagnosticViolationReasons.invalidTimeoutPeriod]:
    "Event timeout period (etm) must be between 1 and 1440.",
  [eventDiagnosticViolationReasons.invalidHoldAttribute]:
    "Hold attribute (ha) must be y or n.",
  [eventDiagnosticViolationReasons.invalidTimeoutAction]:
    "Event timeout action (ets) must be one of kl, nr, wr, or an.",
  [eventDiagnosticViolationReasons.invalidIssueSourceUserId]:
    "Event issue source user ID (evuid) must be a signed decimal value between -1 and 9999999999.",
  [eventDiagnosticViolationReasons.invalidIssueSourceGroupId]:
    "Event issue source group ID (evgid) must be a signed decimal value between -1 and 9999999999.",
  [eventDiagnosticViolationReasons.invalidIssueSourceProcessId]:
    "Event issue source process ID (evpid) must be a signed decimal value between -1 and 9999999999.",
  [eventDiagnosticViolationReasons.invalidIssueSourceUserName]:
    "Event issue source user name (evusr) must be a quoted string between 1 and 20 bytes.",
  [eventDiagnosticViolationReasons.invalidIssueSourceGroupName]:
    "Event issue source group name (evgrp) must be a quoted string between 1 and 20 bytes.",
  [eventDiagnosticViolationReasons.invalidReceivingId]:
    "Event ID (evwid) must be hexadecimal in 00000000:00000000-FFFFFFFF:FFFFFFFF format.",
  [eventDiagnosticViolationReasons.invalidSourceIpAddress]:
    "Event source IP address (evipa) must be a dotted-decimal IPv4 address between 0.0.0.0 and 255.255.255.255.",
  [eventDiagnosticViolationReasons.invalidMessageFilter]:
    "Event message filter (evwms) must be a quoted string between 1 and 1024 bytes.",
  [eventDiagnosticViolationReasons.invalidDetailedInformationFilter]:
    "Detailed event information filter (evdet) must be a quoted string between 1 and 1024 bytes.",
  [eventReceiveFilterViolationReasons.invalidShape]:
    'Optional extended attribute filter (evwfr) must use optional-extended-attribute-name:"value" format.',
  [eventDiagnosticViolationReasons.invalidEndJudgmentCondition]:
    'End judgment condition (evtmc) must be n, a, n:"file-name", a:"file-name", d:"file-name", or b:"file-name" with a file name between 1 and 256 bytes.',
  [eventDiagnosticViolationReasons.invalidSearchCondition]:
    "Event search condition (evesc) must be no or between 1 and 720.",
  [eventReceiveFilterViolationReasons.aggregateByteLimitExceeded]:
    "Combined optional extended attribute filters (evwfr) must total no more than 2048 bytes in canonical evwfr=<raw-value>; form.",
  [eventDiagnosticViolationReasons.timeoutPeriodInStartCondition]:
    "Event timeout period (etm) cannot be specified for jobs defined as start conditions.",
  [eventDiagnosticViolationReasons.holdAttributeInStartCondition]:
    "Hold attribute (ha) cannot be specified for jobs defined as start conditions.",
  [eventDiagnosticViolationReasons.timeoutActionInStartCondition]:
    "Event timeout action (ets) cannot be specified for jobs defined as start conditions.",
};

const mapEventDiagnosticViolation = (
  violation: EventDiagnosticViolation,
): SyntaxDiagnosticDto => ({
  ...toDiagnosticSourceRange(violation.evidence, violation.evidence.key.length),
  message: eventDiagnosticMessages[violation.reason],
  severity: "error",
  ruleId: violation.ruleId,
});

export const buildEventSendingDiagnostics = (
  document: AjsDocument,
): SyntaxDiagnosticDto[] =>
  evaluateEventSendingDiagnosticViolations(document).map(
    mapEventDiagnosticViolation,
  );

export const buildEventReceivingDiagnostics = (
  document: AjsDocument,
): SyntaxDiagnosticDto[] =>
  evaluateEventReceivingDiagnosticViolationGroups(document).flatMap(
    ({ unit, violations, startConditionViolations }) => [
      ...evaluateEventReceivingExecutionTimeRangeViolations(unit).map(
        mapMonitoringWaitDiagnosticViolation,
      ),
      ...violations.map(mapEventDiagnosticViolation),
      ...evaluateEventReceivingExecutionTimeContextViolations(
        document,
        unit,
      ).map(mapMonitoringWaitDiagnosticViolation),
      ...startConditionViolations.map(mapEventDiagnosticViolation),
    ],
  );
