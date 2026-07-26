import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import {
  evaluateExecutionIntervalControlDiagnosticViolations,
  evaluateFileMonitoringDiagnosticViolations,
  monitoringWaitViolationReasons,
  type MonitoringWaitDiagnosticViolation,
  type MonitoringWaitViolationReason,
} from "../../domain/services/diagnostics/evaluateMonitoringWaitDiagnosticViolations";
import { toDiagnosticSourceRange } from "./diagnosticSourceRange";
import type { SyntaxDiagnosticDto } from "./syntaxDiagnosticTypes";

const monitoringWaitDiagnosticMessages: Readonly<
  Record<MonitoringWaitViolationReason, string>
> = {
  [monitoringWaitViolationReasons.invalidFileNameByteLength]:
    "Monitored file name (flwf) must be between 1 and 255 bytes.",
  [monitoringWaitViolationReasons.invalidMonitoringInterval]:
    "Monitoring interval (flwi) must be between 1 and 600.",
  [monitoringWaitViolationReasons.wildcardWithShortMonitoringInterval]:
    "Monitored file name (flwf) cannot use wildcard (*) when monitoring interval (flwi) is between 1 and 9.",
  [monitoringWaitViolationReasons.invalidMonitoringCondition]:
    "File monitoring condition (flwc) must use c, c:d, c:d:s, or c:d:m.",
  [monitoringWaitViolationReasons.fileCloseRequiresCreationMonitoring]:
    "File close option (flco) requires file creation monitoring (flwc=c).",
  [monitoringWaitViolationReasons.invalidExecutionTime]:
    "Execution time (fd) must be between 1 and 1440.",
  [monitoringWaitViolationReasons.invalidEventTimeoutAction]:
    "Event timeout action (ets) must be one of kl, nr, wr, or an.",
  [monitoringWaitViolationReasons.executionTimeInStartCondition]:
    "Execution time (fd) cannot be specified for jobs defined as start conditions.",
  [monitoringWaitViolationReasons.invalidExecutionInterval]:
    "Execution interval (tmitv) must be between 1 and 1440.",
  [monitoringWaitViolationReasons.invalidEndTiming]:
    "End timing (etn) must be y or n.",
  [monitoringWaitViolationReasons.endTimingOutsideStartCondition]:
    "End timing (etn=y) can be specified only for execution-interval control jobs defined as start conditions.",
};

export const mapMonitoringWaitDiagnosticViolation = (
  violation: MonitoringWaitDiagnosticViolation,
): SyntaxDiagnosticDto => ({
  ...toDiagnosticSourceRange(violation.evidence, violation.evidence.key.length),
  message: monitoringWaitDiagnosticMessages[violation.reason],
  severity: "error",
  ruleId: violation.ruleId,
});

export const buildFileMonitoringDiagnostics = (
  document: AjsDocument,
): SyntaxDiagnosticDto[] =>
  evaluateFileMonitoringDiagnosticViolations(document).map(
    mapMonitoringWaitDiagnosticViolation,
  );

export const buildExecutionIntervalControlDiagnostics = (
  document: AjsDocument,
): SyntaxDiagnosticDto[] =>
  evaluateExecutionIntervalControlDiagnosticViolations(document).map(
    mapMonitoringWaitDiagnosticViolation,
  );
