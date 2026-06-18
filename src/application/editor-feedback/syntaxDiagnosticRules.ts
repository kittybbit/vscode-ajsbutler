import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
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
  document: AjsDocument,
  options: BuildSyntaxDiagnosticsOptions = {},
): SyntaxDiagnosticDto[] => [
  ...buildScheduleRuleDiagnostics(document, options),
  ...buildJobEndJudgmentDiagnostics(document),
  ...buildFileMonitoringDiagnostics(document),
  ...buildExecutionIntervalControlDiagnostics(document),
  ...buildTransferOperationDiagnostics(document),
  ...buildQueueTransferFileDiagnostics(document),
  ...buildEventSendingDiagnostics(document),
  ...buildEventReceivingDiagnostics(document),
];
