import type { AjsParserError, AjsParserPort } from "../parsing/AjsParserPort";
import { toDiagnosticSourceRange } from "./diagnosticSourceRange";
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

export const mapParserErrorToSyntaxDiagnostic = (
  error: AjsParserError,
): SyntaxDiagnosticDto => ({
  ...toDiagnosticSourceRange(error, 1),
  message: error.message,
  severity: "error",
  category: syntaxDiagnosticCategories.parserSyntax,
});

export const createBuildSyntaxDiagnostics =
  (parser: AjsParserPort): BuildSyntaxDiagnostics =>
  (content, options = {}) => {
    const result = parser.parse(content);
    if (result.ok === false) {
      return result.errors.map(mapParserErrorToSyntaxDiagnostic);
    }

    return buildSemanticSyntaxDiagnostics(result.document, options);
  };
