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
  SemanticDiffIdentityDecision,
  SemanticDiffIdentityDecisionId,
  SemanticDiffInputPair,
  SemanticDiffLimitation,
  SemanticDiffRelationReference,
  SemanticDiffReportSection,
  SemanticDiffScope,
  SemanticDiffSide,
  SemanticDiffTarget,
  SemanticDiffUnitReference,
  SemanticDiffUnsupportedItem,
} from "./semanticDiffDto";
import type { SemanticDiffIdentityDecision as DomainSemanticDiffIdentityDecision } from "../../domain/models/semantic-diff/SemanticDiff";
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
  semanticDiffParameterValuesByKey,
  semanticDiffParentJobnetPath,
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
  identityDecisions?: SemanticDiffIdentityDecision[];
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

const toUnitReference = (unit: AjsUnit): SemanticDiffUnitReference => ({
  id: unit.id,
  name: unit.name,
  absolutePath: unit.absolutePath,
  unitType: unit.unitType,
});

const copyIdentityReferences = (
  references: DomainSemanticDiffIdentityDecision["before"],
): SemanticDiffUnitReference[] =>
  references.map((reference) => ({ ...reference }));

const copyExactIdentityDecision = (
  decision: Extract<DomainSemanticDiffIdentityDecision, { status: "exact" }>,
): SemanticDiffIdentityDecision => ({
  ...decision,
  before: copyIdentityReferences(decision.before),
  after: copyIdentityReferences(decision.after),
  evidence: {
    kind: "exact-key",
    key: { ...decision.evidence.key },
  },
});

const copyFingerprintIdentityDecision = (
  decision: Exclude<DomainSemanticDiffIdentityDecision, { status: "exact" }>,
): SemanticDiffIdentityDecision => ({
  ...decision,
  before: copyIdentityReferences(decision.before),
  after: copyIdentityReferences(decision.after),
  evidence: {
    ...decision.evidence,
    fields: decision.evidence.fields.map((field) => ({
      ...field,
      values: [...field.values],
    })),
  },
});

const toIdentityDecision = (
  decision: DomainSemanticDiffIdentityDecision,
): SemanticDiffIdentityDecision =>
  decision.status === "exact"
    ? copyExactIdentityDecision(decision)
    : copyFingerprintIdentityDecision(decision);

const identityPairKey = (beforeId: string, afterId: string): string =>
  `${beforeId}\u0000${afterId}`;

type SemanticDiffIdentityDecisionIndex = {
  byPair: Map<string, SemanticDiffIdentityDecisionId>;
  byBefore: Map<string, SemanticDiffIdentityDecisionId>;
  byAfter: Map<string, SemanticDiffIdentityDecisionId>;
};

type SemanticDiffUnitChangeContext = {
  beforeUnitById: Map<string, AjsUnit>;
  afterUnitById: Map<string, AjsUnit>;
  identityDecisionIndex: SemanticDiffIdentityDecisionIndex;
};

const buildIdentityDecisionIndex = (
  decisions: DomainSemanticDiffIdentityDecision[],
): SemanticDiffIdentityDecisionIndex => {
  const index: SemanticDiffIdentityDecisionIndex = {
    byPair: new Map(),
    byBefore: new Map(),
    byAfter: new Map(),
  };
  decisions.forEach((decision) => {
    decision.before.forEach((before) => {
      index.byBefore.set(before.id, decision.id);
      decision.after.forEach((after) => {
        index.byPair.set(identityPairKey(before.id, after.id), decision.id);
      });
    });
    decision.after.forEach((after) => index.byAfter.set(after.id, decision.id));
  });
  return index;
};

const toRelationReference = (
  relation: AjsRelation,
  unitById: Map<string, AjsUnit>,
): SemanticDiffRelationReference => ({
  sourceUnitId: relation.sourceUnitId,
  targetUnitId: relation.targetUnitId,
  type: relation.type,
  sourceUnitPath: unitById.get(relation.sourceUnitId)?.absolutePath,
  targetUnitPath: unitById.get(relation.targetUnitId)?.absolutePath,
});

const toScope = (
  side: SemanticDiffSide,
  units: AjsUnit[],
  jobGroupPath?: string,
): SemanticDiffScope => {
  const unitById = buildUnitById(units);
  return {
    side,
    jobGroupPath,
    unitIds: units.map((unit) => unit.id),
    relations: units.flatMap((unit) =>
      unit.relations.map((relation) => toRelationReference(relation, unitById)),
    ),
  };
};

const toInputPair = (
  input: CompareSemanticDiffInput,
  beforeUnits: AjsUnit[],
  afterUnits: AjsUnit[],
): SemanticDiffInputPair => ({
  before: toScope("before", beforeUnits, input.options?.jobGroupPath),
  after: toScope("after", afterUnits, input.options?.jobGroupPath),
});

const toUnitTarget = (unit: AjsUnit): SemanticDiffTarget => ({
  kind: isSemanticDiffJobnetUnit(unit) ? "jobnet" : "unit",
  unit: toUnitReference(unit),
});

const changeId = (...parts: string[]): string => parts.join(":");

const elementKindForUnit = (
  unit: AjsUnit,
): Extract<SemanticDiffElementKind, "jobnet" | "unit"> =>
  isSemanticDiffJobnetUnit(unit) ? "jobnet" : "unit";

const createUnitChange = ({
  kind,
  confirmationLevel,
  before,
  after,
  identityDecisionId,
  summary,
  rationale,
}: {
  kind: SemanticDiffChange["kind"];
  confirmationLevel: SemanticDiffChange["confirmationLevel"];
  before?: AjsUnit;
  after?: AjsUnit;
  identityDecisionId: SemanticDiffIdentityDecisionId;
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
  summary,
  rationale,
  identityDecisionId,
  ...(before ? { before: toUnitTarget(before) } : {}),
  ...(after ? { after: toUnitTarget(after) } : {}),
});

const createFingerprintMatchChanges = (
  matches: SemanticDiffUnitMatch[],
  context: SemanticDiffUnitChangeContext,
): SemanticDiffChange[] =>
  matches.flatMap((match) => {
    const beforeParent = semanticDiffParentJobnetPath(
      match.before,
      context.beforeUnitById,
    );
    const afterParent = semanticDiffParentJobnetPath(
      match.after,
      context.afterUnitById,
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
          identityDecisionId: context.identityDecisionIndex.byPair.get(
            identityPairKey(match.before.id, match.after.id),
          )!,
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
          identityDecisionId: context.identityDecisionIndex.byPair.get(
            identityPairKey(match.before.id, match.after.id),
          )!,
          summary: `${match.before.name} moved from ${beforeParent} to ${afterParent}`,
          rationale,
        }),
      );
    }
    return changes;
  });

const createCandidateChanges = (
  candidates: SemanticDiffCandidateGroup[],
  identityDecisionIndex: SemanticDiffIdentityDecisionIndex,
): SemanticDiffChange[] =>
  candidates.flatMap((candidate) =>
    candidate.before.map((beforeUnit) =>
      createUnitChange({
        kind: "changed",
        confirmationLevel: "candidate",
        before: beforeUnit,
        identityDecisionId: identityDecisionIndex.byBefore.get(beforeUnit.id)!,
        summary: `${beforeUnit.name} has ambiguous rename or move candidates`,
        rationale: `identity fingerprint matched ${candidate.before.length} before and ${candidate.after.length} after units`,
      }),
    ),
  );

const createAddedRemovedChanges = (
  removedUnits: AjsUnit[],
  addedUnits: AjsUnit[],
  identityDecisionIndex: SemanticDiffIdentityDecisionIndex,
): SemanticDiffChange[] => {
  const removed = removedUnits.map((unit) =>
    createUnitChange({
      kind: "removed",
      confirmationLevel: "confirmed",
      before: unit,
      identityDecisionId: identityDecisionIndex.byBefore.get(unit.id)!,
      summary: `${unit.name} removed`,
    }),
  );
  const added = addedUnits.map((unit) =>
    createUnitChange({
      kind: "added",
      confirmationLevel: "confirmed",
      after: unit,
      identityDecisionId: identityDecisionIndex.byAfter.get(unit.id)!,
      summary: `${unit.name} added`,
    }),
  );
  return [...removed, ...added];
};

const createAttributeChanges = (
  matches: SemanticDiffUnitMatch[],
  identityDecisionIndex: SemanticDiffIdentityDecisionIndex,
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
        identityDecisionId: identityDecisionIndex.byPair.get(
          identityPairKey(match.before.id, match.after.id),
        )!,
        before: {
          kind: "attribute",
          unit: toUnitReference(match.before),
          parameterKey: decision.key,
          category: decision.category,
          values:
            semanticDiffParameterValuesByKey(match.before).get(decision.key) ??
            [],
        },
        after: {
          kind: "attribute",
          unit: toUnitReference(match.after),
          parameterKey: decision.key,
          category: decision.category,
          values:
            semanticDiffParameterValuesByKey(match.after).get(decision.key) ??
            [],
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
  relation: toRelationReference(relation, unitById),
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

const unitConfirmationTarget = (unit: AjsUnit): SemanticDiffTarget =>
  toUnitTarget(unit);

const resolveRelatedUnitsByNames = (
  names: string[],
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
): SemanticDiffTarget[] => {
  const parentPath = unit.parentId ? `${unit.parentId}/` : "";
  return sortStrings(names)
    .map((name) => unitById.get(`${parentPath}${name}`))
    .filter((relatedUnit): relatedUnit is AjsUnit => relatedUnit !== undefined)
    .map((relatedUnit) => toUnitTarget(relatedUnit));
};

const createEvidenceConfirmation = (
  decision: SemanticDiffConfirmationEvidenceDecision,
  beforeUnitById: Map<string, AjsUnit>,
  afterUnitById: Map<string, AjsUnit>,
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
  const target = unitConfirmationTarget(unit);
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
): SemanticDiffUnsupportedItem => ({
  id: changeId(
    "unsupported",
    "file-monitoring-condition",
    decision.match.after.id,
  ),
  kind: "uninterpretable",
  side: "after",
  target: unitConfirmationTarget(decision.match.after),
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
  }));

export const createSemanticDiffChangeSet = (
  input: CompareSemanticDiffInput,
  parts: SemanticDiffChangeSetParts = {},
  units: {
    before: AjsUnit[];
    after: AjsUnit[];
  } = {
    before: scopedUnits(input.before, input.options?.jobGroupPath),
    after: scopedUnits(input.after, input.options?.jobGroupPath),
  },
): SemanticDiffChangeSet => ({
  inputs: toInputPair(input, units.before, units.after),
  changes: parts.changes ?? [],
  confirmationRequired: parts.confirmationRequired ?? [],
  unsupportedItems: parts.unsupportedItems ?? [],
  limitations: [
    ...toNormalizationLimitations("before", input.before),
    ...toNormalizationLimitations("after", input.after),
    ...(parts.limitations ?? []),
  ],
  identityDecisions: parts.identityDecisions ?? [],
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
  const identityDecisionIndex = buildIdentityDecisionIndex(
    correspondence.identityDecisions,
  );
  const identityDecisions =
    correspondence.identityDecisions.map(toIdentityDecision);
  const changes = [
    ...createFingerprintMatchChanges(correspondence.fingerprintMatches, {
      beforeUnitById,
      afterUnitById,
      identityDecisionIndex,
    }),
    ...createCandidateChanges(correspondence.candidates, identityDecisionIndex),
    ...createAddedRemovedChanges(
      correspondence.removedUnits,
      correspondence.addedUnits,
      identityDecisionIndex,
    ),
    ...createAttributeChanges(matches, identityDecisionIndex),
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
      createEvidenceConfirmation(decision, beforeUnitById, afterUnitById),
    )
    .sort((left, right) => compareStrings(left.id, right.id));
  const unsupportedItems = evidence.unsupportedDecisions.map(
    createUnsupportedEvidenceItem,
  );
  const scheduleDiff = compareScheduleDiff({
    beforeUnits,
    afterUnits,
    matches,
    period: input.options?.scheduleComparisonPeriod,
    toUnitTarget,
  });

  return createSemanticDiffChangeSet(
    input,
    {
      changes: changes.sort((left, right) => compareStrings(left.id, right.id)),
      identityDecisions,
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
    },
    { before: beforeUnits, after: afterUnits },
  );
};
