import { AjsNormalizationWarning } from "./AjsDocument";

export const buildMissingUnitTypeWarning = (
  unitPath: string,
): AjsNormalizationWarning => ({
  code: "missing-unit-type",
  message: `Unit type could not be resolved for ${unitPath}.`,
  unitPath,
});

export const buildInvalidRelationWarning = (
  unitPath: string,
): AjsNormalizationWarning => ({
  code: "invalid-dependency",
  message: `Dependency could not be parsed for ${unitPath}.`,
  unitPath,
});

export const buildMissingRelationTargetWarning = (
  unitPath: string,
): AjsNormalizationWarning => ({
  code: "missing-dependency-target",
  message: `Dependency target was not found for ${unitPath}.`,
  unitPath,
});
