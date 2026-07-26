import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import type { AjsParserError, AjsParserPort } from "../parsing/AjsParserPort";
import { toUnitListDocumentDto, UnitListDocumentDto } from "./unitListDocument";

export type BuildUnitListResult = {
  document?: UnitListDocumentDto;
  errors: AjsParserError[];
};

export type BuildUnitList = (content: string) => BuildUnitListResult;

const buildParserErrorResult = (
  errors: AjsParserError[],
): BuildUnitListResult => ({
  errors,
});

const buildUnitListDocumentResult = (
  document: AjsDocument,
): BuildUnitListResult => ({
  document: toUnitListDocumentDto(document),
  errors: [],
});

export const createBuildUnitList =
  (parser: AjsParserPort): BuildUnitList =>
  (content) => {
    const parseResult = parser.parse(content);
    if (parseResult.ok === false) {
      return buildParserErrorResult(parseResult.errors);
    }

    return buildUnitListDocumentResult(parseResult.document);
  };
