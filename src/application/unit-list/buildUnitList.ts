import { parseAjs } from "../../domain/services/parser/AjsParser";
import { ANTLRError } from "../../domain/services/parser/SyntaxErrorListener";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { Unit } from "../../domain/values/Unit";
import { toUnitListDocumentDto, UnitListDocumentDto } from "./unitListDocument";

export type BuildUnitListResult = {
  document?: UnitListDocumentDto;
  errors: ANTLRError[];
};

const buildParserErrorResult = (errors: ANTLRError[]): BuildUnitListResult => ({
  errors,
});

const buildUnitListDocumentResult = (
  rootUnits: Unit[],
): BuildUnitListResult => ({
  document: toUnitListDocumentDto(normalizeAjsDocument(rootUnits)),
  errors: [],
});

export const buildUnitList = (content: string): BuildUnitListResult => {
  const parseResult = parseAjs(content);
  if (parseResult.errors.length > 0) {
    return buildParserErrorResult(parseResult.errors);
  }

  return buildUnitListDocumentResult(parseResult.rootUnits);
};
