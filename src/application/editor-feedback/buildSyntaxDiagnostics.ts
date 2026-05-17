import { parseAjs } from "../../domain/services/parser/AjsParser";
import { buildSemanticSyntaxDiagnostics } from "./syntaxDiagnosticRules";
import type {
  BuildSyntaxDiagnosticsOptions,
  SyntaxDiagnosticDto,
} from "./syntaxDiagnosticTypes";

export type {
  BuildSyntaxDiagnosticsOptions,
  SyntaxDiagnosticDto,
} from "./syntaxDiagnosticTypes";

export const buildSyntaxDiagnostics = (
  content: string,
  options: BuildSyntaxDiagnosticsOptions = {},
): SyntaxDiagnosticDto[] => {
  const result = parseAjs(content);
  const syntaxDiagnostics = result.errors.map((error) => ({
    line: error.line,
    column: error.charPositionInLine,
    length: 1,
    message: error.msg,
    severity: "error" as const,
  }));
  if (syntaxDiagnostics.length > 0) {
    return syntaxDiagnostics;
  }

  return [
    ...syntaxDiagnostics,
    ...buildSemanticSyntaxDiagnostics(result.rootUnits, options),
  ];
};
