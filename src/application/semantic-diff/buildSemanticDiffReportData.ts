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
  parser?: AjsParserPort,
) => BuildSemanticDiffReportDataResult;

const toParserErrors = (
  errors: SemanticDiffParserError[],
): SemanticDiffParserError[] =>
  errors.map(({ line, column, message }) => ({ line, column, message }));

const parseContent = (parser: AjsParserPort, content: string) =>
  parser.parse(content);

const parseErrors = (
  parseResult: ReturnType<AjsParserPort["parse"]>,
): SemanticDiffParserError[] =>
  parseResult.ok === true ? [] : toParserErrors(parseResult.errors);

export const createBuildSemanticDiffReportData =
  (
    parser: AjsParserPort,
    compare: CompareSemanticDiff = compareSemanticDiff,
  ): BuildSemanticDiffReportData =>
  ({ beforeContent, afterContent }, scopedParser) => {
    const activeParser = scopedParser ?? parser;
    const beforeParse = parseContent(activeParser, beforeContent);
    const afterParse = parseContent(activeParser, afterContent);

    if (beforeParse.ok === false || afterParse.ok === false) {
      return {
        ok: false,
        errors: {
          before: parseErrors(beforeParse),
          after: parseErrors(afterParse),
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
