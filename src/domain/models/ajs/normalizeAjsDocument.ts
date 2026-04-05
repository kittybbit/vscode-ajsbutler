import { Unit } from "../../values/Unit";
import { AjsDocument, AjsNormalizationWarning } from "./AjsDocument";
import { normalizeUnitTree } from "./normalizeDocumentTreeHelpers";

export const normalizeAjsDocument = (rootUnits: Unit[]): AjsDocument => {
  const warnings: AjsNormalizationWarning[] = [];
  return {
    rootUnits: rootUnits.map((rootUnit) =>
      normalizeUnitTree(rootUnit, warnings),
    ),
    warnings,
  };
};
