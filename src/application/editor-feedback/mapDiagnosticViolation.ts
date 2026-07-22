import type { DiagnosticViolation } from "../../domain/services/diagnostics/DiagnosticViolation";
import { toDiagnosticSourceRange } from "./diagnosticSourceRange";
import type {
  SyntaxDiagnosticCategory,
  SyntaxDiagnosticDto,
} from "./syntaxDiagnosticTypes";

export type DiagnosticViolationPresentation = Readonly<{
  message: string;
  category: SyntaxDiagnosticCategory;
}>;

export const createMapDiagnosticViolation =
  <TReason extends string>(
    presentations: Readonly<Record<TReason, DiagnosticViolationPresentation>>,
  ): ((violation: DiagnosticViolation<TReason>) => SyntaxDiagnosticDto) =>
  (violation) => {
    const presentation = presentations[violation.reason];

    return {
      ...toDiagnosticSourceRange(
        violation.evidence,
        violation.evidence.key.length,
      ),
      message: presentation.message,
      severity: "error",
      category: presentation.category,
      ruleId: violation.ruleId,
    };
  };
