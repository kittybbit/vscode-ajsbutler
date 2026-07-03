import type { AjsParserPort } from "../parsing/AjsParserPort";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { buildSemanticSyntaxDiagnostics } from "./syntaxDiagnosticRules";
import { syntaxDiagnosticCategories } from "./syntaxDiagnosticTypes";
import type {
  BuildSyntaxDiagnosticsOptions,
  SyntaxDiagnosticDto,
} from "./syntaxDiagnosticTypes";

export type {
  BuildSyntaxDiagnosticsOptions,
  SyntaxDiagnosticDto,
} from "./syntaxDiagnosticTypes";

export type BuildSyntaxDiagnostics = (
  content: string,
  options?: BuildSyntaxDiagnosticsOptions,
) => SyntaxDiagnosticDto[];

export const createBuildSyntaxDiagnostics =
  (parser: AjsParserPort): BuildSyntaxDiagnostics =>
  (content, options = {}) => {
    const result = parser.parse(content);
    const syntaxDiagnostics = result.errors.map((error) => ({
      line: error.line,
      column: error.column,
      length: 1,
      message: error.message,
      severity: "error" as const,
      category: syntaxDiagnosticCategories.parserSyntax,
    }));
    if (syntaxDiagnostics.length > 0) {
      return syntaxDiagnostics;
    }

    return [
      ...syntaxDiagnostics,
      ...buildSemanticSyntaxDiagnostics(
        normalizeAjsDocument(result.rootUnits),
        options,
      ),
    ];
  };
