import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import {
  evaluateQueueTransferDiagnosticViolations,
  evaluateTransferOperationDiagnosticViolations,
  transferViolationReasons,
  type TransferDiagnosticViolation,
} from "../../domain/services/diagnostics/evaluateTransferDiagnosticViolations";
import { toDiagnosticSourceRange } from "./diagnosticSourceRange";
import type { SyntaxDiagnosticDto } from "./syntaxDiagnosticTypes";

const getTransferFileIndex = (key: string): string =>
  /\d+$/.exec(key)?.[0] ?? "";

const getTransferDiagnosticMessage = (
  violation: TransferDiagnosticViolation,
): string => {
  const key = violation.evidence.key;
  const index = getTransferFileIndex(key);

  switch (violation.reason) {
    case transferViolationReasons.invalidSourceByteLength:
      return `Transfer source file name (${key}) must be between 1 and 511 bytes.`;
    case transferViolationReasons.invalidDestinationByteLength:
      return `Transfer destination file name (${key}) must be between 1 and 511 bytes.`;
    case transferViolationReasons.invalidSourceForm:
      return `Transfer source file name (${key}) must be quoted, or use a macro-variable form allowed by the unit class and effective jty=q.`;
    case transferViolationReasons.invalidDestinationForm:
      return `Transfer destination file name (${key}) must be quoted, or use a macro-variable form allowed by the unit class and effective jty=q.`;
    case transferViolationReasons.invalidSourcePath:
      return `Transfer source file name (${key}) must use a full path when specified as a quoted transfer-file value.`;
    case transferViolationReasons.destinationRequiresSource:
      return `Transfer destination file name (${key}) requires transfer source file name (ts${index}).`;
    case transferViolationReasons.operationRequiresSource:
      return `Transfer operation (${key}) requires transfer source file name (ts${index}).`;
    case transferViolationReasons.customPcParameterProhibited:
      return `Transfer-file parameter (${key}) cannot be specified for custom PC jobs.`;
  }
};

const mapTransferDiagnosticViolation = (
  violation: TransferDiagnosticViolation,
): SyntaxDiagnosticDto => ({
  ...toDiagnosticSourceRange(violation.evidence, violation.evidence.key.length),
  message: getTransferDiagnosticMessage(violation),
  severity: "error",
  ruleId: violation.ruleId,
});

export const buildTransferOperationDiagnostics = (
  document: AjsDocument,
): SyntaxDiagnosticDto[] =>
  evaluateTransferOperationDiagnosticViolations(document).map(
    mapTransferDiagnosticViolation,
  );

export const buildQueueTransferFileDiagnostics = (
  document: AjsDocument,
): SyntaxDiagnosticDto[] =>
  evaluateQueueTransferDiagnosticViolations(document).map(
    mapTransferDiagnosticViolation,
  );
