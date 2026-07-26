import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import {
  retryAbrDependencyViolationReasons,
  type DiagnosticParameterEvidence,
} from "../../domain/services/diagnostics/DiagnosticViolation";
import {
  evaluateJobEndDiagnosticViolations,
  jobEndRangeViolationReasons,
  jobEndThresholdViolationReasons,
  type JobEndDiagnosticViolationReason,
} from "../../domain/services/diagnostics/evaluateJobEndDiagnosticViolations";
import { toDiagnosticSourceRange } from "./diagnosticSourceRange";
import type { SyntaxDiagnosticDto } from "./syntaxDiagnosticTypes";
import { syntaxDiagnosticCategories } from "./syntaxDiagnosticTypes";

type JobEndDiagnosticMessageBuilder = (
  evidence: DiagnosticParameterEvidence,
) => string;

const staticMessage =
  (message: string): JobEndDiagnosticMessageBuilder =>
  () =>
    message;

const jobEndDiagnosticMessageBuilders: Readonly<
  Record<JobEndDiagnosticViolationReason, JobEndDiagnosticMessageBuilder>
> = {
  [jobEndRangeViolationReasons.invalidWarningThreshold]: staticMessage(
    "Warning threshold (wth) must be between 0 and 2147483647.",
  ),
  [jobEndRangeViolationReasons.invalidAbnormalThreshold]: staticMessage(
    "Abnormal threshold (tho) must be between 0 and 2147483647.",
  ),
  [jobEndRangeViolationReasons.invalidRetryStartCode]: staticMessage(
    "Retry start code (rjs) must be between 1 and 4294967295.",
  ),
  [jobEndRangeViolationReasons.invalidRetryEndCode]: staticMessage(
    "Retry end code (rje) must be between 1 and 4294967295.",
  ),
  [jobEndRangeViolationReasons.invalidRetryCount]: staticMessage(
    "Retry count (rec) must be between 1 and 12.",
  ),
  [jobEndRangeViolationReasons.invalidRetryInterval]: staticMessage(
    "Retry interval (rei) must be between 1 and 10.",
  ),
  [jobEndThresholdViolationReasons.warningNotLessThanAbnormal]: staticMessage(
    "Warning threshold (wth) must be less than abnormal threshold (tho).",
  ),
  [jobEndThresholdViolationReasons.abnormalNotGreaterThanWarning]:
    staticMessage(
      "Abnormal threshold (tho) must be greater than warning threshold (wth).",
    ),
  [retryAbrDependencyViolationReasons.automaticRetryRequiresCodeEndJudgment]:
    staticMessage(
      "Automatic retry (abr=y) requires end judgment (jd) to be cod.",
    ),
  [retryAbrDependencyViolationReasons.retryParameterRequiresCodeEndJudgment]: (
    evidence,
  ) =>
    `Retry parameter (${evidence.key}) requires end judgment (jd) to be cod.`,
  [retryAbrDependencyViolationReasons.retryParameterRequiresAutomaticRetry]: (
    evidence,
  ) =>
    `Retry parameter (${evidence.key}) requires automatic retry (abr) to be y.`,
};

export const buildJobEndJudgmentDiagnostics = (
  document: AjsDocument,
): SyntaxDiagnosticDto[] =>
  evaluateJobEndDiagnosticViolations(document).map((violation) => ({
    ...toDiagnosticSourceRange(
      violation.evidence,
      violation.evidence.key.length,
    ),
    message: jobEndDiagnosticMessageBuilders[violation.reason](
      violation.evidence,
    ),
    severity: "error",
    category: syntaxDiagnosticCategories.jobEndJudgment,
    ruleId: violation.ruleId,
  }));
