import type { DiagnosticSourceRange } from "./syntaxDiagnosticTypes";

export type DiagnosticSourceEvidence = Readonly<{
  line?: number;
  column?: number;
  length?: number;
}>;

export const toDiagnosticSourceRange = (
  evidence: DiagnosticSourceEvidence,
  fallbackLength: number,
): DiagnosticSourceRange => ({
  line: evidence.line ?? 1,
  column: evidence.column ?? 0,
  length: evidence.length ?? fallbackLength,
});
