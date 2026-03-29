import { parseAjs } from "../../domain/services/parser/AjsParser";
import { ANTLRError } from "../../domain/services/parser/SyntaxErrorListener";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { toUnitListRootDto, UnitListDocumentDto } from "./unitListDocument";

export type BuildUnitListResult = {
  document?: UnitListDocumentDto;
  errors: ANTLRError[];
};

export const buildUnitList = (content: string): BuildUnitListResult => {
  const result = parseAjs(content);
  if (result.errors.length > 0) {
    return { errors: result.errors };
  }
  const document = normalizeAjsDocument(result.rootUnits);
  return {
    document: {
      rootUnits: document.rootUnits.map(toUnitListRootDto),
    },
    errors: [],
  };
};
