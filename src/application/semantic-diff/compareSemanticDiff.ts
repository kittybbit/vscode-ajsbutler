import {
  flattenAjsUnits,
  type AjsDocument,
  type AjsRelation,
  type AjsUnit,
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
  evaluateSemanticDiffEvidence,
  type SemanticDiffConfirmationEvidenceDecision,
  type SemanticDiffUnsupportedEvidenceDecision,
} from "../../domain/services/semantic-diff/semanticDiffEvidenceRules";
import {
  buildSemanticDiffUnitCorrespondence,
  compareSemanticDiffAttributes,
  compareSemanticDiffRelations,
  isSemanticDiffJobnetUnit,
  semanticDiffJobnetIdentityKey,
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

const createEvidenceConfirmation = (
  decision: SemanticDiffConfirmationEvidenceDecision,
  beforeUnitById: Map<string, AjsUnit>,
  afterUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffConfirmationRequiredItem => {
  if (decision.kind === "conditional-relation-removed") {
    return createConfirmationRequiredItem({
      id: changeId("confirm", "conditional-relation", decision.pairKey),
      target: relationTarget(decision.relation, beforeUnitById),
      changeContent: `${decision.pairKey} conditional relation removed or changed`,
      rationale:
        "a previously conditional branch path may no longer be available",
      constraints: [runtimeConstraint],
    });
  }

  const unit = decision.match.after;
  const target = unitConfirmationTarget(unit, afterUnitById, jobGroupPath);
  switch (decision.kind) {
    case "wait-release-source-changed":
      return createConfirmationRequiredItem({
        id: changeId(
          "confirm",
          "wait-release-source",
          unit.id,
          decision.parameterKey,
        ),
        target,
        changeContent: `${unit.name} wait release source changed`,
        rationale:
          "a previously available within-job-group release source may no longer release this wait",
        relatedTargets: resolveRelatedUnitsByNames(
          decision.removedSources,
          unit,
          afterUnitById,
          jobGroupPath,
        ),
        constraints: [runtimeConstraint],
      });
    case "timeout-removed":
      return createConfirmationRequiredItem({
        id: changeId(
          "confirm",
          "timeout-removed",
          unit.id,
          decision.parameterKey,
        ),
        target,
        changeContent: `${unit.name} explicit timeout ${decision.parameterKey} removed`,
        rationale:
          "removing a previously explicit wait timeout may leave a wait unresolved for longer than before",
        constraints: [runtimeConstraint, externalConstraint],
      });
    case "condition-judgment-changed":
      return createConfirmationRequiredItem({
        id: changeId(
          "confirm",
          "condition-judgment",
          unit.id,
          decision.parameterKey,
        ),
        target,
        changeContent: `${unit.name} ${decision.parameterKey} condition or judgment changed`,
        rationale:
          "a previously established start, end, or branch path may no longer be available",
        constraints: [runtimeConstraint],
      });
    case "wait-target-changed":
      return createConfirmationRequiredItem({
        id: changeId("confirm", "wait-target", unit.id, decision.parameterKey),
        target,
        changeContent: `${unit.name} wait target ${decision.parameterKey} changed`,
        rationale:
          "the compared definition now waits for a different file, event, or event filter",
        constraints: [runtimeConstraint, externalConstraint],
      });
  }
};

const createUnsupportedEvidenceItem = (
  decision: SemanticDiffUnsupportedEvidenceDecision,
  afterUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffUnsupportedItem => ({
  id: changeId(
    "unsupported",
    "file-monitoring-condition",
    decision.match.after.id,
  ),
  kind: "uninterpretable",
  side: "after",
  target: unitConfirmationTarget(
    decision.match.after,
    afterUnitById,
    jobGroupPath,
  ),
  message:
    "file monitoring condition flwc is not interpreted because it combines mutually exclusive conditions",
});

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
  const evidence = evaluateSemanticDiffEvidence({
    beforeUnits,
    afterUnits,
    beforeUnitById,
    afterUnitById,
    matches,
  });
  const confirmationRequired = evidence.confirmationDecisions
    .map((decision) =>
      createEvidenceConfirmation(
        decision,
        beforeUnitById,
        afterUnitById,
        input.options?.jobGroupPath,
      ),
    )
    .sort((left, right) => compareStrings(left.id, right.id));
  const unsupportedItems = evidence.unsupportedDecisions.map((decision) =>
    createUnsupportedEvidenceItem(
      decision,
      afterUnitById,
      input.options?.jobGroupPath,
    ),
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
