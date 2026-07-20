import type { AjsParserError, AjsParserPort } from "../parsing/AjsParserPort";
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

    if (beforeParse.ok === false || afterParse.ok === false) {
      return {
        ok: false,
        errors: {
          before: beforeParse.ok === true ? [] : beforeParse.errors,
          after: afterParse.ok === true ? [] : afterParse.errors,
        },
      };
    }

    return {
      ok: true,
      report: render(
        compare({
          before: beforeParse.document,
          after: afterParse.document,
        }),
        language,
      ),
    };
  };
