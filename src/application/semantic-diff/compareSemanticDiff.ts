import {
  flattenAjsUnits,
  type AjsDocument,
  type AjsRelation,
  type AjsUnit,
  type AjsUnitType,
} from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffChange,
  SemanticDiffChangeSet,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffElementKind,
  SemanticDiffInputPair,
  SemanticDiffJobGroupInput,
  SemanticDiffLimitation,
  SemanticDiffReportSection,
  SemanticDiffSide,
  SemanticDiffTarget,
  SemanticDiffUnsupportedItem,
} from "../../domain/models/semantic-diff/SemanticDiff";
import {
  buildSemanticDiffRelationPairMaps,
  buildSemanticDiffUnitCorrespondence,
  compareSemanticDiffAttributes,
  compareSemanticDiffRelations,
  isSemanticDiffJobnetUnit,
  semanticDiffJobnetIdentityKey,
  semanticDiffParameterChangeKeys,
  semanticDiffParameterValuesByKey,
  semanticDiffParentJobnetPath,
  semanticDiffRelationIdentityKey,
  semanticDiffUnitIdentityKey,
  type SemanticDiffCandidateGroup,
  type SemanticDiffRelationDecision,
  type SemanticDiffUnitMatch,
} from "../../domain/services/semantic-diff/semanticDiffStructuralRules";
import { compareScheduleDiff } from "./compareScheduleDiff";

export type CompareSemanticDiffOptions = {
  jobGroupPath?: string;
  scheduleComparisonPeriod?: SemanticDiffComparisonPeriod;
};

export type CompareSemanticDiffInput = {
  before: AjsDocument;
  after: AjsDocument;
  options?: CompareSemanticDiffOptions;
};

export type CompareSemanticDiff = (
  input: CompareSemanticDiffInput,
) => SemanticDiffChangeSet;

export type SemanticDiffChangeSetParts = {
  changes?: SemanticDiffChange[];
  confirmationRequired?: SemanticDiffConfirmationRequiredItem[];
  unsupportedItems?: SemanticDiffUnsupportedItem[];
  limitations?: SemanticDiffLimitation[];
  scheduleComparison?: SemanticDiffChangeSet["scheduleComparison"];
  reportSections?: SemanticDiffReportSection[];
};

const runtimeConstraint =
  "Runtime history and external conditions are not verified by this comparison.";
const externalConstraint =
  "External files, events, hosts, users, permissions, and resource groups are not verified.";
const manualBasisConstraint =
  "Rule basis: JP1/AJS3 v13 unit definition parameters for relations, wait units, event receiving, file monitoring, and job end judgment.";

const eventReceivingWaitTypes = new Set<AjsUnitType>(["evwj", "revwj"]);
const fileMonitoringWaitTypes = new Set<AjsUnitType>(["flwj", "rflwj"]);
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

const toJobGroupInput = (
  side: SemanticDiffSide,
  document: AjsDocument,
  options?: CompareSemanticDiffOptions,
): SemanticDiffJobGroupInput => ({
  side,
  document,
  jobGroupPath: options?.jobGroupPath,
});

const toInputPair = (
  input: CompareSemanticDiffInput,
): SemanticDiffInputPair => ({
  before: toJobGroupInput("before", input.before, input.options),
  after: toJobGroupInput("after", input.after, input.options),
});

const sortStrings = (values: string[]): string[] => [...values].sort();

const compareStrings = (left: string, right: string): number =>
  left.localeCompare(right);

const unitSortKey = (unit: AjsUnit): string => unit.absolutePath;

const scopedUnits = (document: AjsDocument, jobGroupPath?: string): AjsUnit[] =>
  flattenAjsUnits(document.rootUnits)
    .filter(
      (unit) =>
        !jobGroupPath ||
        unit.absolutePath === jobGroupPath ||
        unit.absolutePath.startsWith(`${jobGroupPath}/`),
    )
    .sort((left, right) =>
      compareStrings(unitSortKey(left), unitSortKey(right)),
    );

const buildUnitById = (units: AjsUnit[]): Map<string, AjsUnit> =>
  new Map(units.map((unit) => [unit.id, unit]));

const toUnitTarget = (
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffTarget => ({
  kind: isSemanticDiffJobnetUnit(unit) ? "jobnet" : "unit",
  unit,
  identityKey: isSemanticDiffJobnetUnit(unit)
    ? semanticDiffJobnetIdentityKey(unit, jobGroupPath)
    : semanticDiffUnitIdentityKey(unit, unitById),
});

const changeId = (...parts: string[]): string => parts.join(":");

const elementKindForUnit = (unit: AjsUnit): SemanticDiffElementKind =>
  isSemanticDiffJobnetUnit(unit) ? "jobnet" : "unit";

const createUnitChange = ({
  kind,
  confirmationLevel,
  before,
  after,
  beforeUnitById,
  afterUnitById,
  jobGroupPath,
  summary,
  rationale,
}: {
  kind: SemanticDiffChange["kind"];
  confirmationLevel: SemanticDiffChange["confirmationLevel"];
  before?: AjsUnit;
  after?: AjsUnit;
  beforeUnitById: Map<string, AjsUnit>;
  afterUnitById: Map<string, AjsUnit>;
  jobGroupPath?: string;
  summary: string;
  rationale?: string;
}): SemanticDiffChange => ({
  id: changeId(
    "unit",
    kind,
    before?.absolutePath ?? "",
    after?.absolutePath ?? "",
  ),
  kind,
  elementKind: elementKindForUnit(before ?? after!),
  confirmationLevel,
  before: before
    ? toUnitTarget(before, beforeUnitById, jobGroupPath)
    : undefined,
  after: after ? toUnitTarget(after, afterUnitById, jobGroupPath) : undefined,
  summary,
  rationale,
});

const createFingerprintMatchChanges = (
  matches: SemanticDiffUnitMatch[],
  beforeUnitById: Map<string, AjsUnit>,
  afterUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffChange[] =>
  matches.flatMap((match) => {
    const beforeParent = semanticDiffParentJobnetPath(
      match.before,
      beforeUnitById,
    );
    const afterParent = semanticDiffParentJobnetPath(
      match.after,
      afterUnitById,
    );
    const renamed = match.before.name !== match.after.name;
    const moved = beforeParent !== afterParent;
    const rationale = "one-to-one identity fingerprint match";
    const changes: SemanticDiffChange[] = [];

    if (renamed) {
      changes.push(
        createUnitChange({
          kind: "renamed",
          confirmationLevel: "confirmed",
          before: match.before,
          after: match.after,
          beforeUnitById,
          afterUnitById,
          jobGroupPath,
          summary: `${match.before.name} renamed to ${match.after.name}`,
          rationale,
        }),
      );
    }
    if (moved) {
      changes.push(
        createUnitChange({
          kind: "moved",
          confirmationLevel: "confirmed",
          before: match.before,
          after: match.after,
          beforeUnitById,
          afterUnitById,
          jobGroupPath,
          summary: `${match.before.name} moved from ${beforeParent} to ${afterParent}`,
          rationale,
        }),
      );
    }
    return changes;
  });

const createCandidateChanges = (
  candidates: SemanticDiffCandidateGroup[],
  beforeUnitById: Map<string, AjsUnit>,
  afterUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffChange[] =>
  candidates.flatMap((candidate) =>
    candidate.before.map((beforeUnit) =>
      createUnitChange({
        kind: "changed",
        confirmationLevel: "candidate",
        before: beforeUnit,
        after: candidate.after[0],
        beforeUnitById,
        afterUnitById,
        jobGroupPath,
        summary: `${beforeUnit.name} has ambiguous rename or move candidates`,
        rationale: `identity fingerprint matched ${candidate.before.length} before and ${candidate.after.length} after units`,
      }),
    ),
  );

const createAddedRemovedChanges = (
  removedUnits: AjsUnit[],
  addedUnits: AjsUnit[],
  beforeUnitById: Map<string, AjsUnit>,
  afterUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffChange[] => {
  const removed = removedUnits.map((unit) =>
    createUnitChange({
      kind: "removed",
      confirmationLevel: "confirmed",
      before: unit,
      beforeUnitById,
      afterUnitById,
      jobGroupPath,
      summary: `${unit.name} removed`,
    }),
  );
  const added = addedUnits.map((unit) =>
    createUnitChange({
      kind: "added",
      confirmationLevel: "confirmed",
      after: unit,
      beforeUnitById,
      afterUnitById,
      jobGroupPath,
      summary: `${unit.name} added`,
    }),
  );
  return [...removed, ...added];
};

const createAttributeChanges = (
  matches: SemanticDiffUnitMatch[],
): SemanticDiffChange[] =>
  matches.flatMap((match) =>
    compareSemanticDiffAttributes(match.before, match.after).map(
      (decision) => ({
        id: changeId(
          "attribute",
          decision.key,
          match.before.id,
          match.after.id,
        ),
        kind: "changed",
        elementKind: "attribute",
        confirmationLevel: "confirmed",
        before: {
          kind: "attribute",
          unit: match.before,
          parameterKey: decision.key,
          category: decision.category,
        },
        after: {
          kind: "attribute",
          unit: match.after,
          parameterKey: decision.key,
          category: decision.category,
        },
        attributeCategory: decision.category,
        summary: `${match.before.name} ${decision.key} changed`,
        rationale:
          match.kind === "exact"
            ? "exact identity match"
            : "one-to-one identity fingerprint match",
      }),
    ),
  );

const relationTarget = (
  relation: AjsRelation,
  unitById: Map<string, AjsUnit>,
): SemanticDiffTarget => ({
  kind: "relation",
  relation,
  sourceUnit: unitById.get(relation.sourceUnitId),
  targetUnit: unitById.get(relation.targetUnitId),
  identityKey: semanticDiffRelationIdentityKey(relation),
});

const createRelationChanges = (
  decisions: SemanticDiffRelationDecision[],
  beforeUnitById: Map<string, AjsUnit>,
  afterUnitById: Map<string, AjsUnit>,
): SemanticDiffChange[] =>
  decisions.map((decision) => ({
    id: changeId(
      "relation",
      decision.kind,
      decision.pairKey,
      decision.relation.type,
    ),
    kind: decision.kind,
    elementKind: "relation",
    confirmationLevel: "confirmed",
    before:
      decision.kind === "removed"
        ? relationTarget(decision.relation, beforeUnitById)
        : undefined,
    after:
      decision.kind === "added"
        ? relationTarget(decision.relation, afterUnitById)
        : undefined,
    summary: `${decision.pairKey} relation ${decision.kind}`,
  }));

const hasAnyParameterValue = (unit: AjsUnit, key: string): boolean =>
  (semanticDiffParameterValuesByKey(unit).get(key) ?? []).length > 0;

const changedSupportedKeys = (
  before: AjsUnit,
  after: AjsUnit,
  keys: Set<string>,
): string[] =>
  semanticDiffParameterChangeKeys(before, after).filter((key) => keys.has(key));

const createConfirmationRequiredItem = ({
  id,
  target,
  changeContent,
  rationale,
  relatedTargets = [],
  constraints = [],
}: {
  id: string;
  target: SemanticDiffTarget;
  changeContent: string;
  rationale: string;
  relatedTargets?: SemanticDiffTarget[];
  constraints?: string[];
}): SemanticDiffConfirmationRequiredItem => ({
  id,
  target,
  changeContent,
  rationale,
  relatedTargets,
  constraints: [manualBasisConstraint, ...constraints],
});

const unitConfirmationTarget = (
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffTarget => toUnitTarget(unit, unitById, jobGroupPath);

const resolveRelatedUnitsByNames = (
  names: string[],
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffTarget[] => {
  const parentPath = unit.parentId ? `${unit.parentId}/` : "";
  return sortStrings(names)
    .map((name) => unitById.get(`${parentPath}${name}`))
    .filter((relatedUnit): relatedUnit is AjsUnit => relatedUnit !== undefined)
    .map((relatedUnit) => toUnitTarget(relatedUnit, unitById, jobGroupPath));
};

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

const createWaitReleaseSourceConfirmations = (
  matches: SemanticDiffUnitMatch[],
  afterUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffConfirmationRequiredItem[] =>
  matches.flatMap((match) =>
    changedSupportedKeys(match.before, match.after, waitReleaseSourceKeys).map(
      (key) => {
        const removedSources = removedOrChangedValues(
          match.before,
          match.after,
          key,
        );
        return createConfirmationRequiredItem({
          id: changeId("confirm", "wait-release-source", match.after.id, key),
          target: unitConfirmationTarget(
            match.after,
            afterUnitById,
            jobGroupPath,
          ),
          changeContent: `${match.after.name} wait release source changed`,
          rationale:
            "a previously available within-job-group release source may no longer release this wait",
          relatedTargets: resolveRelatedUnitsByNames(
            removedSources,
            match.after,
            afterUnitById,
            jobGroupPath,
          ),
          constraints: [runtimeConstraint],
        });
      },
    ),
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

const createTimeoutRemovalConfirmations = (
  matches: SemanticDiffUnitMatch[],
  afterUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffConfirmationRequiredItem[] =>
  matches.flatMap((match) =>
    timeoutKeysForUnit(match.before)
      .filter(
        (key) =>
          hasAnyParameterValue(match.before, key) &&
          !hasAnyParameterValue(match.after, key),
      )
      .map((key) =>
        createConfirmationRequiredItem({
          id: changeId("confirm", "timeout-removed", match.after.id, key),
          target: unitConfirmationTarget(
            match.after,
            afterUnitById,
            jobGroupPath,
          ),
          changeContent: `${match.after.name} explicit timeout ${key} removed`,
          rationale:
            "removing a previously explicit wait timeout may leave a wait unresolved for longer than before",
          constraints: [runtimeConstraint, externalConstraint],
        }),
      ),
  );

const createConditionJudgmentConfirmations = (
  matches: SemanticDiffUnitMatch[],
  afterUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffConfirmationRequiredItem[] =>
  matches.flatMap((match) =>
    changedSupportedKeys(match.before, match.after, conditionJudgmentKeys).map(
      (key) =>
        createConfirmationRequiredItem({
          id: changeId("confirm", "condition-judgment", match.after.id, key),
          target: unitConfirmationTarget(
            match.after,
            afterUnitById,
            jobGroupPath,
          ),
          changeContent: `${match.after.name} ${key} condition or judgment changed`,
          rationale:
            "a previously established start, end, or branch path may no longer be available",
          constraints: [runtimeConstraint],
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

const createWaitTargetConfirmations = (
  matches: SemanticDiffUnitMatch[],
  afterUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffConfirmationRequiredItem[] =>
  matches.flatMap((match) => {
    const targetKeys = waitTargetKeysForUnit(match.before);
    if (!targetKeys) {
      return [];
    }
    return changedSupportedKeys(match.before, match.after, targetKeys).map(
      (key) =>
        createConfirmationRequiredItem({
          id: changeId("confirm", "wait-target", match.after.id, key),
          target: unitConfirmationTarget(
            match.after,
            afterUnitById,
            jobGroupPath,
          ),
          changeContent: `${match.after.name} wait target ${key} changed`,
          rationale:
            "the compared definition now waits for a different file, event, or event filter",
          constraints: [runtimeConstraint, externalConstraint],
        }),
    );
  });

const createConditionalRelationConfirmations = (
  beforeUnits: AjsUnit[],
  afterUnits: AjsUnit[],
  beforeUnitById: Map<string, AjsUnit>,
  afterUnitById: Map<string, AjsUnit>,
  matches: SemanticDiffUnitMatch[],
): SemanticDiffConfirmationRequiredItem[] => {
  const relationPairs = buildSemanticDiffRelationPairMaps({
    beforeUnits,
    afterUnits,
    beforeUnitById,
    afterUnitById,
    matches,
  });

  return [...relationPairs.before.entries()].flatMap(
    ([pairKey, beforeRelations]) => {
      const afterTypes = new Set(
        (relationPairs.after.get(pairKey) ?? []).map(
          (relation) => relation.type,
        ),
      );
      return beforeRelations
        .filter((relation) => relation.type === "con")
        .filter((relation) => !afterTypes.has(relation.type))
        .map((relation) =>
          createConfirmationRequiredItem({
            id: changeId("confirm", "conditional-relation", pairKey),
            target: relationTarget(relation, beforeUnitById),
            changeContent: `${pairKey} conditional relation removed or changed`,
            rationale:
              "a previously conditional branch path may no longer be available",
            constraints: [runtimeConstraint],
          }),
        );
    },
  );
};

const hasUninterpretableFileMonitoringCondition = (unit: AjsUnit): boolean =>
  (semanticDiffParameterValuesByKey(unit).get("flwc") ?? []).some((value) => {
    const conditions = new Set(
      value.split(":").filter((condition) => condition.length > 0),
    );
    return conditions.has("s") && conditions.has("m");
  });

const createUnsupportedConditionItems = (
  matches: SemanticDiffUnitMatch[],
  afterUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffUnsupportedItem[] =>
  matches
    .filter((match) =>
      [match.before, match.after].some(
        hasUninterpretableFileMonitoringCondition,
      ),
    )
    .map((match) => ({
      id: changeId("unsupported", "file-monitoring-condition", match.after.id),
      kind: "uninterpretable",
      side: "after",
      target: unitConfirmationTarget(match.after, afterUnitById, jobGroupPath),
      message:
        "file monitoring condition flwc is not interpreted because it combines mutually exclusive conditions",
    }));

const createConfirmationRequiredItems = (
  beforeUnits: AjsUnit[],
  afterUnits: AjsUnit[],
  beforeUnitById: Map<string, AjsUnit>,
  afterUnitById: Map<string, AjsUnit>,
  matches: SemanticDiffUnitMatch[],
  jobGroupPath?: string,
): SemanticDiffConfirmationRequiredItem[] =>
  [
    ...createConditionalRelationConfirmations(
      beforeUnits,
      afterUnits,
      beforeUnitById,
      afterUnitById,
      matches,
    ),
    ...createWaitReleaseSourceConfirmations(
      matches,
      afterUnitById,
      jobGroupPath,
    ),
    ...createTimeoutRemovalConfirmations(matches, afterUnitById, jobGroupPath),
    ...createConditionJudgmentConfirmations(
      matches,
      afterUnitById,
      jobGroupPath,
    ),
    ...createWaitTargetConfirmations(matches, afterUnitById, jobGroupPath),
  ].sort((left, right) => compareStrings(left.id, right.id));

const toNormalizationLimitations = (
  side: SemanticDiffSide,
  document: AjsDocument,
): SemanticDiffLimitation[] =>
  document.warnings.map((warning) => ({
    code: warning.code,
    kind: "normalization",
    side,
    message: warning.message,
    unitPath: warning.unitPath,
    warning,
  }));

export const createSemanticDiffChangeSet = (
  input: CompareSemanticDiffInput,
  parts: SemanticDiffChangeSetParts = {},
): SemanticDiffChangeSet => ({
  inputs: toInputPair(input),
  changes: parts.changes ?? [],
  confirmationRequired: parts.confirmationRequired ?? [],
  unsupportedItems: parts.unsupportedItems ?? [],
  limitations: [
    ...toNormalizationLimitations("before", input.before),
    ...toNormalizationLimitations("after", input.after),
    ...(parts.limitations ?? []),
  ],
  scheduleComparison: parts.scheduleComparison,
  reportSections: parts.reportSections ?? [],
});

export const compareSemanticDiff: CompareSemanticDiff = (input) => {
  const beforeUnits = scopedUnits(input.before, input.options?.jobGroupPath);
  const afterUnits = scopedUnits(input.after, input.options?.jobGroupPath);
  const beforeUnitById = buildUnitById(beforeUnits);
  const afterUnitById = buildUnitById(afterUnits);
  const correspondence = buildSemanticDiffUnitCorrespondence({
    beforeUnits,
    afterUnits,
    beforeUnitById,
    afterUnitById,
    jobGroupPath: input.options?.jobGroupPath,
  });
  const matches = correspondence.matches;
  const changes = [
    ...createFingerprintMatchChanges(
      correspondence.fingerprintMatches,
      beforeUnitById,
      afterUnitById,
      input.options?.jobGroupPath,
    ),
    ...createCandidateChanges(
      correspondence.candidates,
      beforeUnitById,
      afterUnitById,
      input.options?.jobGroupPath,
    ),
    ...createAddedRemovedChanges(
      correspondence.removedUnits,
      correspondence.addedUnits,
      beforeUnitById,
      afterUnitById,
      input.options?.jobGroupPath,
    ),
    ...createAttributeChanges(matches),
    ...createRelationChanges(
      compareSemanticDiffRelations({
        beforeUnits,
        afterUnits,
        beforeUnitById,
        afterUnitById,
        matches,
      }),
      beforeUnitById,
      afterUnitById,
    ),
  ];
  const confirmationRequired = createConfirmationRequiredItems(
    beforeUnits,
    afterUnits,
    beforeUnitById,
    afterUnitById,
    matches,
    input.options?.jobGroupPath,
  );
  const unsupportedItems = createUnsupportedConditionItems(
    matches,
    afterUnitById,
    input.options?.jobGroupPath,
  );
  const scheduleDiff = compareScheduleDiff({
    beforeUnits,
    afterUnits,
    beforeUnitById,
    afterUnitById,
    matches,
    period: input.options?.scheduleComparisonPeriod,
    toUnitTarget: (unit, unitById) =>
      toUnitTarget(unit, unitById, input.options?.jobGroupPath),
  });

  return createSemanticDiffChangeSet(input, {
    changes: changes.sort((left, right) => compareStrings(left.id, right.id)),
    confirmationRequired: [
      ...confirmationRequired,
      ...scheduleDiff.confirmationRequired,
    ].sort((left, right) => compareStrings(left.id, right.id)),
    unsupportedItems: [
      ...unsupportedItems,
      ...scheduleDiff.unsupportedItems,
    ].sort((left, right) => compareStrings(left.id, right.id)),
    limitations: scheduleDiff.limitations,
    scheduleComparison: scheduleDiff.scheduleComparison,
  });
};
