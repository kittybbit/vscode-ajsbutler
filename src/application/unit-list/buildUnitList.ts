import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { Unit } from "../../domain/values/Unit";
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
  rootUnits: Unit[],
): BuildUnitListResult => ({
  document: toUnitListDocumentDto(normalizeAjsDocument(rootUnits)),
  errors: [],
});

export const createBuildUnitList =
  (parser: AjsParserPort): BuildUnitList =>
  (content) => {
    const parseResult = parser.parse(content);
    if (parseResult.errors.length > 0) {
      return buildParserErrorResult(parseResult.errors);
    }

    return buildUnitListDocumentResult(parseResult.rootUnits);
  };
