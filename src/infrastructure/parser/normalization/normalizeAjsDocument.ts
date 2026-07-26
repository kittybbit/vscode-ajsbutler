import {
  AjsDocument,
  AjsNormalizationWarning,
} from "../../../domain/models/ajs/AjsDocument";
import { AjsRawUnit } from "../raw/AjsRawUnit";
import { normalizeUnitTree } from "./normalize/unitTree";

export const normalizeAjsDocument = (rootUnits: AjsRawUnit[]): AjsDocument => {
  const warnings: AjsNormalizationWarning[] = [];
  return {
    rootUnits: rootUnits.map((rootUnit) =>
      normalizeUnitTree(rootUnit, warnings),
    ),
    warnings,
  };
};
