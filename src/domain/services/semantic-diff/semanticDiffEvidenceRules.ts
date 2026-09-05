import type {
  AjsRelation,
  AjsUnit,
  AjsUnitType,
} from "../../models/ajs/AjsDocument";
import {
  buildSemanticDiffRelationPairMaps,
  semanticDiffParameterChangeKeys,
  semanticDiffParameterValuesByKey,
  type SemanticDiffUnitMatch,
} from "./semanticDiffStructuralRules";

export type SemanticDiffConfirmationEvidenceDecision =
  | {
      kind: "wait-release-source-changed";
      match: SemanticDiffUnitMatch;
      parameterKey: string;
      removedSources: string[];
    }
  | {
      kind: "timeout-removed";
      match: SemanticDiffUnitMatch;
      parameterKey: string;
    }
  | {
      kind: "condition-judgment-changed";
      match: SemanticDiffUnitMatch;
      parameterKey: string;
    }
  | {
      kind: "wait-target-changed";
      match: SemanticDiffUnitMatch;
      parameterKey: string;
    }
  | {
      kind: "conditional-relation-removed";
      pairKey: string;
      relation: AjsRelation;
    };

export type SemanticDiffUnsupportedEvidenceDecision = {
  kind: "uninterpretable-file-monitoring-condition";
  match: SemanticDiffUnitMatch;
};

export type SemanticDiffEvidenceEvaluation = {
  confirmationDecisions: SemanticDiffConfirmationEvidenceDecision[];
  unsupportedDecisions: SemanticDiffUnsupportedEvidenceDecision[];
};

export type EvaluateSemanticDiffEvidenceInput = {
  beforeUnits: AjsUnit[];
  afterUnits: AjsUnit[];
  beforeUnitById: Map<string, AjsUnit>;
  afterUnitById: Map<string, AjsUnit>;
  matches: SemanticDiffUnitMatch[];
};

const eventReceivingWaitTypes = new Set<AjsUnitType>(["evwj", "revwj"]);
const fileMonitoringWaitTypes = new Set<AjsUnitType>(["flwj", "rflwj"]);
const supportedWaitTypes = new Set<AjsUnitType>([
  ...eventReceivingWaitTypes,
  ...fileMonitoringWaitTypes,
]);
const waitReleaseSourceKeys = new Set(["eun"]);
const conditionJudgmentKeys = new Set([
  "cond",
  "jd",
  "ej",
  "ejc",
  "ejf",
  "jdf",
  "wth",
  "tho",
  "evtmc",
]);
const fileWaitTargetKeys = new Set(["flwf", "flwc"]);
const eventWaitTargetKeys = new Set([
  "evwid",
  "evwfr",
  "evhst",
  "evwms",
  "evdet",
  "evusr",
  "evgrp",
  "evuid",
  "evgid",
  "evpid",
  "evipa",
  "evesc",
]);

const sortStrings = (values: string[]): string[] => [...values].sort();

const hasAnyParameterValue = (unit: AjsUnit, key: string): boolean =>
  (semanticDiffParameterValuesByKey(unit).get(key) ?? []).length > 0;

const changedSupportedKeys = (
  before: AjsUnit,
  after: AjsUnit,
  keys: Set<string>,
): string[] =>
  semanticDiffParameterChangeKeys(before, after).filter((key) => keys.has(key));

const removedOrChangedValues = (
  before: AjsUnit,
  after: AjsUnit,
  key: string,
): string[] => {
  const beforeValues = semanticDiffParameterValuesByKey(before).get(key) ?? [];
  const afterValues = new Set(
    semanticDiffParameterValuesByKey(after).get(key) ?? [],
  );
  return sortStrings(beforeValues.filter((value) => !afterValues.has(value)));
};

const waitReleaseSourceDecisions = (
  matches: SemanticDiffUnitMatch[],
): SemanticDiffConfirmationEvidenceDecision[] =>
  matches
    .filter(
      (match) =>
        supportedWaitTypes.has(match.before.unitType) &&
        supportedWaitTypes.has(match.after.unitType),
    )
    .flatMap((match) =>
      changedSupportedKeys(
        match.before,
        match.after,
        waitReleaseSourceKeys,
      ).map((parameterKey) => ({
        kind: "wait-release-source-changed",
        match,
        parameterKey,
        removedSources: removedOrChangedValues(
          match.before,
          match.after,
          parameterKey,
        ),
      })),
    );

const timeoutKeysForUnit = (unit: AjsUnit): string[] => {
  if (eventReceivingWaitTypes.has(unit.unitType)) {
    return ["etm"];
  }
  if (fileMonitoringWaitTypes.has(unit.unitType)) {
    return ["fd"];
  }
  return [];
};

const timeoutRemovalDecisions = (
  matches: SemanticDiffUnitMatch[],
): SemanticDiffConfirmationEvidenceDecision[] =>
  matches.flatMap((match) =>
    timeoutKeysForUnit(match.before)
      .filter(
        (parameterKey) =>
          hasAnyParameterValue(match.before, parameterKey) &&
          !hasAnyParameterValue(match.after, parameterKey),
      )
      .map((parameterKey) => ({
        kind: "timeout-removed",
        match,
        parameterKey,
      })),
  );

const conditionJudgmentDecisions = (
  matches: SemanticDiffUnitMatch[],
): SemanticDiffConfirmationEvidenceDecision[] =>
  matches.flatMap((match) =>
    changedSupportedKeys(match.before, match.after, conditionJudgmentKeys).map(
      (parameterKey) => ({
        kind: "condition-judgment-changed",
        match,
        parameterKey,
      }),
    ),
  );

const waitTargetKeysForUnit = (unit: AjsUnit): Set<string> | undefined => {
  if (fileMonitoringWaitTypes.has(unit.unitType)) {
    return fileWaitTargetKeys;
  }
  if (eventReceivingWaitTypes.has(unit.unitType)) {
    return eventWaitTargetKeys;
  }
  return undefined;
};

const waitTargetDecisions = (
  matches: SemanticDiffUnitMatch[],
): SemanticDiffConfirmationEvidenceDecision[] =>
  matches.flatMap((match) => {
    const targetKeys = waitTargetKeysForUnit(match.before);
    if (!targetKeys) {
      return [];
    }
    return changedSupportedKeys(match.before, match.after, targetKeys)
      .filter(
        (parameterKey) =>
          parameterKey !== "flwc" ||
          ![match.before, match.after].some(
            hasUninterpretableFileMonitoringCondition,
          ),
      )
      .map((parameterKey) => ({
        kind: "wait-target-changed",
        match,
        parameterKey,
      }));
  });

const conditionalRelationDecisions = (
  input: EvaluateSemanticDiffEvidenceInput,
): SemanticDiffConfirmationEvidenceDecision[] => {
  const relationPairs = buildSemanticDiffRelationPairMaps(input);
  const correspondenceResolvedBeforeUnitIds = new Set(
    input.matches.map((match) => match.before.id),
  );
  return [...relationPairs.before.entries()].flatMap(
    ([pairKey, beforeRelations]) => {
      const afterTypes = new Set(
        (relationPairs.after.get(pairKey) ?? []).map(
          (relation) => relation.type,
        ),
      );
      return (
        beforeRelations
          // A removed relation is review evidence only when both endpoints
          // still correspond to units in the after definition. A relation
          // attached to a removed unit is covered by the structural removal;
          // it is not evidence that an existing start path was tightened.
          .filter((relation) =>
            [relation.sourceUnitId, relation.targetUnitId].every((unitId) =>
              correspondenceResolvedBeforeUnitIds.has(unitId),
            ),
          )
          .filter((relation) => relation.type === "con")
          .filter((relation) => !afterTypes.has(relation.type))
          .map((relation) => ({
            kind: "conditional-relation-removed" as const,
            pairKey,
            relation,
          }))
      );
    },
  );
};

const hasUninterpretableFileMonitoringCondition = (unit: AjsUnit): boolean =>
  fileMonitoringWaitTypes.has(unit.unitType) &&
  (semanticDiffParameterValuesByKey(unit).get("flwc") ?? []).some((value) => {
    const conditions = new Set(
      value.split(":").filter((condition) => condition.length > 0),
    );
    return conditions.has("s") && conditions.has("m");
  });

const unsupportedEvidenceDecisions = (
  matches: SemanticDiffUnitMatch[],
): SemanticDiffUnsupportedEvidenceDecision[] =>
  matches
    .filter((match) =>
      [match.before, match.after].some(
        hasUninterpretableFileMonitoringCondition,
      ),
    )
    .map((match) => ({
      kind: "uninterpretable-file-monitoring-condition",
      match,
    }));

export const evaluateSemanticDiffEvidence = (
  input: EvaluateSemanticDiffEvidenceInput,
): SemanticDiffEvidenceEvaluation => ({
  confirmationDecisions: [
    ...conditionalRelationDecisions(input),
    ...waitReleaseSourceDecisions(input.matches),
    ...timeoutRemovalDecisions(input.matches),
    ...conditionJudgmentDecisions(input.matches),
    ...waitTargetDecisions(input.matches),
  ],
  unsupportedDecisions: unsupportedEvidenceDecisions(input.matches),
});
