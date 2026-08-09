import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import type {
  DiagnoseAjsDefinitionOptions,
  SyntaxDiagnosticCategory,
  SyntaxDiagnosticDto,
} from "./syntaxDiagnosticTypes";
import { syntaxDiagnosticCategories } from "./syntaxDiagnosticTypes";
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

const withDiagnosticCategory = (
  diagnostics: SyntaxDiagnosticDto[],
  category: SyntaxDiagnosticCategory,
): SyntaxDiagnosticDto[] =>
  diagnostics.map((diagnostic) => ({
    ...diagnostic,
    category,
  }));

export const buildSemanticSyntaxDiagnostics = (
  document: AjsDocument,
  options: DiagnoseAjsDefinitionOptions = {},
): SyntaxDiagnosticDto[] => [
  ...buildScheduleRuleDiagnostics(document, options),
  ...buildJobEndJudgmentDiagnostics(document),
  ...withDiagnosticCategory(
    buildFileMonitoringDiagnostics(document),
    syntaxDiagnosticCategories.fileMonitoring,
  ),
  ...withDiagnosticCategory(
    buildExecutionIntervalControlDiagnostics(document),
    syntaxDiagnosticCategories.executionIntervalControl,
  ),
  ...withDiagnosticCategory(
    buildTransferOperationDiagnostics(document),
    syntaxDiagnosticCategories.transferOperation,
  ),
  ...withDiagnosticCategory(
    buildQueueTransferFileDiagnostics(document),
    syntaxDiagnosticCategories.queueTransferFile,
  ),
  ...withDiagnosticCategory(
    buildEventSendingDiagnostics(document),
    syntaxDiagnosticCategories.eventSending,
  ),
  ...withDiagnosticCategory(
    buildEventReceivingDiagnostics(document),
    syntaxDiagnosticCategories.eventReceiving,
  ),
];
