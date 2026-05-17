import type { Unit } from "../../domain/values/Unit";
import type {
  BuildSyntaxDiagnosticsOptions,
  SyntaxDiagnosticDto,
} from "./syntaxDiagnosticTypes";
import {
  buildEventReceivingDiagnostics,
  buildEventSendingDiagnostics,
  buildExecutionIntervalControlDiagnostics,
  buildFileMonitoringDiagnostics,
  buildJobEndJudgmentDiagnostics,
  buildQueueTransferFileDiagnostics,
  buildScheduleRuleDiagnostics,
  buildTransferOperationDiagnostics,
} from "./syntaxDiagnosticRuleBuilders";

export const buildSemanticSyntaxDiagnostics = (
  rootUnits: Unit[],
  options: BuildSyntaxDiagnosticsOptions = {},
): SyntaxDiagnosticDto[] => [
  ...buildScheduleRuleDiagnostics(rootUnits, options),
  ...buildJobEndJudgmentDiagnostics(rootUnits),
  ...buildFileMonitoringDiagnostics(rootUnits),
  ...buildExecutionIntervalControlDiagnostics(rootUnits),
  ...buildTransferOperationDiagnostics(rootUnits),
  ...buildQueueTransferFileDiagnostics(rootUnits),
  ...buildEventSendingDiagnostics(rootUnits),
  ...buildEventReceivingDiagnostics(rootUnits),
];
