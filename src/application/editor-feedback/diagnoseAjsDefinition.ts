import type { AjsParserError, AjsParserPort } from "../parsing/AjsParserPort";
import { toDiagnosticSourceRange } from "./diagnosticSourceRange";
import { buildSemanticSyntaxDiagnostics } from "./syntaxDiagnosticRules";
import { syntaxDiagnosticCategories } from "./syntaxDiagnosticTypes";
import type {
  DiagnoseAjsDefinitionOptions,
  SyntaxDiagnosticDto,
} from "./syntaxDiagnosticTypes";

export type {
  DiagnoseAjsDefinitionOptions,
  SyntaxDiagnosticDto,
} from "./syntaxDiagnosticTypes";

export type DiagnoseAjsDefinition = (
  content: string,
  options?: DiagnoseAjsDefinitionOptions,
) => SyntaxDiagnosticDto[];

export const mapParserErrorToSyntaxDiagnostic = (
  error: AjsParserError,
): SyntaxDiagnosticDto => ({
  ...toDiagnosticSourceRange(error, 1),
  message: error.message,
  severity: "error",
  category: syntaxDiagnosticCategories.parserSyntax,
});

export const createDiagnoseAjsDefinition =
  (parser: AjsParserPort): DiagnoseAjsDefinition =>
  (content, options = {}) => {
    const result = parser.parse(content);
    if (result.ok === false) {
      return result.errors.map(mapParserErrorToSyntaxDiagnostic);
    }

    return buildSemanticSyntaxDiagnostics(result.document, options);
  };
