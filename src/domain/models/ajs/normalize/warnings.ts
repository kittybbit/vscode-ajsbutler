import { AjsNormalizationWarning } from "../AjsDocument";

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
  code: "invalid-relation",
  message: `Relation could not be parsed for ${unitPath}.`,
  unitPath,
});

export const buildMissingRelationTargetWarning = (
  unitPath: string,
): AjsNormalizationWarning => ({
  code: "missing-relation-target",
  message: `Relation target was not found for ${unitPath}.`,
  unitPath,
});
