import type { AjsParserPort } from "../parsing/AjsParserPort";
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
    if (result.ok === false) {
      return result.errors.map((error) => ({
        line: error.line,
        column: error.column,
        length: 1,
        message: error.message,
        severity: "error" as const,
        category: syntaxDiagnosticCategories.parserSyntax,
      }));
    }

    return buildSemanticSyntaxDiagnostics(result.document, options);
  };
