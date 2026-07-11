import type { AjsParserError, AjsParserPort } from "../parsing/AjsParserPort";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import {
  compareSemanticDiff,
  type CompareSemanticDiff,
} from "./compareSemanticDiff";
import { renderSemanticDiffMarkdown } from "./renderSemanticDiffMarkdown";

export type BuildSemanticDiffReportInput = {
  beforeContent: string;
  afterContent: string;
  language?: string;
};

export type BuildSemanticDiffReportResult =
  | {
      ok: true;
      report: string;
    }
  | {
      ok: false;
      errors: {
        before: AjsParserError[];
        after: AjsParserError[];
      };
    };

export type BuildSemanticDiffReport = (
  input: BuildSemanticDiffReportInput,
) => BuildSemanticDiffReportResult;

export const createBuildSemanticDiffReport =
  (
    parser: AjsParserPort,
    compare: CompareSemanticDiff = compareSemanticDiff,
    render: (
      changeSet: ReturnType<CompareSemanticDiff>,
      language?: string,
    ) => string = renderSemanticDiffMarkdown,
  ): BuildSemanticDiffReport =>
  ({ beforeContent, afterContent, language }) => {
    const beforeParse = parser.parse(beforeContent);
    const afterParse = parser.parse(afterContent);

    if (beforeParse.errors.length > 0 || afterParse.errors.length > 0) {
      return {
        ok: false,
        errors: {
          before: beforeParse.errors,
          after: afterParse.errors,
        },
      };
    }

    return {
      ok: true,
      report: render(
        compare({
          before: normalizeAjsDocument(beforeParse.rootUnits),
          after: normalizeAjsDocument(afterParse.rootUnits),
        }),
        language,
      ),
    };
  };
