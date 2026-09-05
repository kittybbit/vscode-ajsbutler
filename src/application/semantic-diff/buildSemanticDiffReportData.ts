import type { AjsParserPort } from "../parsing/AjsParserPort";
import {
  compareSemanticDiff,
  type CompareSemanticDiff,
} from "./compareSemanticDiff";
import type {
  SemanticDiffParserError,
  SemanticDiffResult,
} from "./semanticDiffDto";

export type BuildSemanticDiffReportDataInput = {
  beforeContent: string;
  afterContent: string;
};

export type BuildSemanticDiffReportDataResult =
  | {
      ok: true;
      result: SemanticDiffResult;
    }
  | {
      ok: false;
      errors: {
        before: SemanticDiffParserError[];
        after: SemanticDiffParserError[];
      };
    };

export type BuildSemanticDiffReportData = (
  input: BuildSemanticDiffReportDataInput,
) => BuildSemanticDiffReportDataResult;

const toParserErrors = (
  errors: SemanticDiffParserError[],
): SemanticDiffParserError[] =>
  errors.map(({ line, column, message }) => ({ line, column, message }));

export const createBuildSemanticDiffReportData =
  (
    parser: AjsParserPort,
    compare: CompareSemanticDiff = compareSemanticDiff,
  ): BuildSemanticDiffReportData =>
  ({ beforeContent, afterContent }) => {
    const beforeParse = parser.parse(beforeContent);
    const afterParse = parser.parse(afterContent);

    if (beforeParse.ok === false || afterParse.ok === false) {
      return {
        ok: false,
        errors: {
          before:
            beforeParse.ok === true ? [] : toParserErrors(beforeParse.errors),
          after:
            afterParse.ok === true ? [] : toParserErrors(afterParse.errors),
        },
      };
    }

    return {
      ok: true,
      result: compare({
        before: beforeParse.document,
        after: afterParse.document,
      }),
    };
  };
