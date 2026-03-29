import { parseAjs } from "../../domain/services/parser/AjsParser";
import { ANTLRError } from "../../domain/services/parser/SyntaxErrorListener";
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
  return {
    document: {
      rootUnits: result.rootUnits.map(toUnitListRootDto),
    },
    errors: [],
  };
};
