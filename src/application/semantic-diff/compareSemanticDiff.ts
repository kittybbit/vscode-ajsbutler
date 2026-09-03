import {
  flattenAjsUnits,
  type AjsDocument,
  type AjsRelation,
  type AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffChange,
  SemanticDiffConstraint,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffDetail,
  SemanticDiffElementKind,
  SemanticDiffIdentityDecision,
  SemanticDiffIdentityDecisionId,
  SemanticDiffInputPair,
  SemanticDiffLimitation,
  SemanticDiffRelationEndpoint,
  SemanticDiffRelationPair,
  SemanticDiffRelationReference,
  SemanticDiffResult,
  SemanticDiffScope,
  SemanticDiffSide,
  SemanticDiffTarget,
  SemanticDiffUnitReference,
  SemanticDiffUnsupportedItem,
} from "./semanticDiffDto";
import {
  createSemanticDiffDetail,
  createSemanticDiffWarning,
} from "./semanticDiffStructuredFacts";
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
) => SemanticDiffResult;

export type SemanticDiffResultParts = {
  changes?: SemanticDiffChange[];
  identityDecisions?: SemanticDiffIdentityDecision[];
  confirmationRequired?: SemanticDiffConfirmationRequiredItem[];
  unsupportedItems?: SemanticDiffUnsupportedItem[];
  limitations?: SemanticDiffLimitation[];
  scheduleComparison?: SemanticDiffResult["scheduleComparison"];
};

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
}: {
  kind: SemanticDiffChange["kind"];
  confirmationLevel: SemanticDiffChange["confirmationLevel"];
  before?: AjsUnit;
  after?: AjsUnit;
  identityDecisionId: SemanticDiffIdentityDecisionId;
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
  relationPair: null,
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
    }),
  );
  const added = addedUnits.map((unit) =>
    createUnitChange({
      kind: "added",
      confirmationLevel: "confirmed",
      after: unit,
      identityDecisionId: identityDecisionIndex.byAfter.get(unit.id)!,
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
        relationPair: null,
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

const toRelationEndpoint = (
  relation: AjsRelation,
  unitById: Map<string, AjsUnit>,
): SemanticDiffRelationEndpoint => ({
  sourceUnitPath: unitById.get(relation.sourceUnitId)?.absolutePath ?? null,
  sourceUnitId: relation.sourceUnitId,
  targetUnitPath: unitById.get(relation.targetUnitId)?.absolutePath ?? null,
  targetUnitId: relation.targetUnitId,
  type: relation.type,
});

type SemanticDiffRelationPairContext = {
  beforeUnitById: Map<string, AjsUnit>;
  afterUnitById: Map<string, AjsUnit>;
  correspondence: ReadonlyMap<string, string>;
};

type ToRelationPairInput = {
  relation: AjsRelation;
  kind: "added" | "removed";
  context: SemanticDiffRelationPairContext;
};

type SemanticDiffRelationPairEndpoints = Pick<
  SemanticDiffRelationPair,
  "before" | "after"
>;

type RelationPairEndpointBuilder = (
  relation: AjsRelation,
  context: SemanticDiffRelationPairContext,
) => SemanticDiffRelationPairEndpoints;

const relationPairEndpointBuilders: Record<
  "added" | "removed",
  RelationPairEndpointBuilder
> = {
  added: (relation, context) => ({
    before: null,
    after: toRelationEndpoint(relation, context.afterUnitById),
  }),
  removed: (relation, context) => ({
    before: toRelationEndpoint(relation, context.beforeUnitById),
    after: null,
  }),
};

const canonicalRelationUnitId = (
  unitId: string,
  kind: "added" | "removed",
  correspondence: ReadonlyMap<string, string>,
): string =>
  kind === "removed" ? (correspondence.get(unitId) ?? unitId) : unitId;

const toRelationPair = ({
  relation,
  kind,
  context,
}: ToRelationPairInput): SemanticDiffRelationPair => {
  const sourceUnitId = canonicalRelationUnitId(
    relation.sourceUnitId,
    kind,
    context.correspondence,
  );
  const targetUnitId = canonicalRelationUnitId(
    relation.targetUnitId,
    kind,
    context.correspondence,
  );
  return {
    canonicalPair: { sourceUnitId, targetUnitId, type: relation.type },
    ...relationPairEndpointBuilders[kind](relation, context),
  };
};

type CreateRelationChangesInput = {
  decisions: SemanticDiffRelationDecision[];
  relationPairContext: SemanticDiffRelationPairContext;
};

const createRelationChanges = ({
  decisions,
  relationPairContext,
}: CreateRelationChangesInput): SemanticDiffChange[] =>
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
        ? relationTarget(decision.relation, relationPairContext.beforeUnitById)
        : undefined,
    after:
      decision.kind === "added"
        ? relationTarget(decision.relation, relationPairContext.afterUnitById)
        : undefined,
    relationPair: toRelationPair({
      relation: decision.relation,
      kind: decision.kind,
      context: relationPairContext,
    }),
  }));

const createConfirmationRequiredItem = ({
  id,
  target,
  reasonCode,
  relatedTargets = [],
  detail,
  constraints = [],
}: {
  id: string;
  target: SemanticDiffTarget;
  reasonCode: SemanticDiffConfirmationRequiredItem["reasonCode"];
  relatedTargets?: SemanticDiffTarget[];
  detail: SemanticDiffDetail;
  constraints?: SemanticDiffConstraint[];
}): SemanticDiffConfirmationRequiredItem => ({
  id,
  reasonCode,
  target,
  relatedTargets,
  detail,
  constraints,
  warning: null,
});

const createConstraint = (
  code: SemanticDiffConstraint["code"],
  detail: SemanticDiffDetail,
): SemanticDiffConstraint => ({
  code,
  detail,
  warning: null,
});

const parameterValues = (unit: AjsUnit, parameterKey: string): string[] =>
  semanticDiffParameterValuesByKey(unit).get(parameterKey) ?? [];

type ParameterDetailInput = {
  before: AjsUnit;
  after: AjsUnit;
  parameterKey: string;
  overrides?: {
    rawValues?: string[];
    removedSources?: string[];
  };
};

const parameterDetail = ({
  before,
  after,
  parameterKey,
  overrides = {},
}: ParameterDetailInput): SemanticDiffDetail =>
  createSemanticDiffDetail({
    unitPath: after.absolutePath,
    parameterKey,
    beforeValues: parameterValues(before, parameterKey),
    afterValues: parameterValues(after, parameterKey),
    rawValues: overrides.rawValues,
    removedSources: overrides.removedSources,
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

type UnitConfirmationEvidenceDecision = Exclude<
  SemanticDiffConfirmationEvidenceDecision,
  { kind: "conditional-relation-removed" }
>;

type UnitConfirmationSpec = {
  idSegment: string;
  constraintCodes: SemanticDiffConstraint["code"][];
};

const unitConfirmationSpecs: Record<
  UnitConfirmationEvidenceDecision["kind"],
  UnitConfirmationSpec
> = {
  "wait-release-source-changed": {
    idSegment: "wait-release-source",
    constraintCodes: ["jp1-ajs3-v13-rule-basis", "runtime-state-not-verified"],
  },
  "timeout-removed": {
    idSegment: "timeout-removed",
    constraintCodes: [
      "jp1-ajs3-v13-rule-basis",
      "runtime-state-not-verified",
      "external-state-not-verified",
    ],
  },
  "condition-judgment-changed": {
    idSegment: "condition-judgment",
    constraintCodes: ["jp1-ajs3-v13-rule-basis", "runtime-state-not-verified"],
  },
  "wait-target-changed": {
    idSegment: "wait-target",
    constraintCodes: [
      "jp1-ajs3-v13-rule-basis",
      "runtime-state-not-verified",
      "external-state-not-verified",
    ],
  },
};

type ParameterDetailOverrides = NonNullable<ParameterDetailInput["overrides"]>;

const confirmationDetailOverrides = (
  decision: UnitConfirmationEvidenceDecision,
): ParameterDetailOverrides | undefined =>
  "removedSources" in decision
    ? {
        rawValues: decision.removedSources,
        removedSources: decision.removedSources,
      }
    : undefined;

const confirmationRelatedTargets = (
  decision: UnitConfirmationEvidenceDecision,
  afterUnitById: Map<string, AjsUnit>,
): SemanticDiffTarget[] | undefined =>
  "removedSources" in decision
    ? resolveRelatedUnitsByNames(
        decision.removedSources,
        decision.match.after,
        afterUnitById,
      )
    : undefined;

type CreateUnitConfirmationInput = {
  decision: UnitConfirmationEvidenceDecision;
  relationPairContext: SemanticDiffRelationPairContext;
};

const createUnitConfirmation = ({
  decision,
  relationPairContext,
}: CreateUnitConfirmationInput): SemanticDiffConfirmationRequiredItem => {
  const unit = decision.match.after;
  const before = decision.match.before;
  const detailInput = {
    before,
    after: unit,
    parameterKey: decision.parameterKey,
  };
  const detail = parameterDetail({
    ...detailInput,
    overrides: confirmationDetailOverrides(decision),
  });
  const constraintDetail = parameterDetail(detailInput);
  const spec = unitConfirmationSpecs[decision.kind];
  return createConfirmationRequiredItem({
    id: changeId("confirm", spec.idSegment, unit.id, decision.parameterKey),
    target: unitConfirmationTarget(unit),
    reasonCode: decision.kind,
    relatedTargets: confirmationRelatedTargets(
      decision,
      relationPairContext.afterUnitById,
    ),
    detail,
    constraints: spec.constraintCodes.map((code) =>
      createConstraint(code, constraintDetail),
    ),
  });
};

type CreateConditionalRelationConfirmationInput = {
  decision: Extract<
    SemanticDiffConfirmationEvidenceDecision,
    { kind: "conditional-relation-removed" }
  >;
  relationPairContext: SemanticDiffRelationPairContext;
};

const createConditionalRelationConfirmation = ({
  decision,
  relationPairContext,
}: CreateConditionalRelationConfirmationInput): SemanticDiffConfirmationRequiredItem => {
  const relationPair = toRelationPair({
    relation: decision.relation,
    kind: "removed",
    context: relationPairContext,
  });
  const detail = createSemanticDiffDetail({ relationPair });
  return createConfirmationRequiredItem({
    id: changeId("confirm", "conditional-relation", decision.pairKey),
    target: relationTarget(
      decision.relation,
      relationPairContext.beforeUnitById,
    ),
    reasonCode: "conditional-relation-removed",
    detail,
    constraints: [
      createConstraint("jp1-ajs3-v13-rule-basis", detail),
      createConstraint("runtime-state-not-verified", detail),
    ],
  });
};

type CreateEvidenceConfirmationInput = {
  decision: SemanticDiffConfirmationEvidenceDecision;
  relationPairContext: SemanticDiffRelationPairContext;
};

const createEvidenceConfirmation = ({
  decision,
  relationPairContext,
}: CreateEvidenceConfirmationInput): SemanticDiffConfirmationRequiredItem =>
  decision.kind === "conditional-relation-removed"
    ? createConditionalRelationConfirmation({ decision, relationPairContext })
    : createUnitConfirmation({ decision, relationPairContext });

const createUnsupportedEvidenceItem = (
  decision: SemanticDiffUnsupportedEvidenceDecision,
): SemanticDiffUnsupportedItem => {
  const detail = createSemanticDiffDetail({
    unitPath: decision.match.after.absolutePath,
    parameterKey: "flwc",
    beforeValues: parameterValues(decision.match.before, "flwc"),
    afterValues: parameterValues(decision.match.after, "flwc"),
  });
  return {
    id: changeId(
      "unsupported",
      "file-monitoring-condition",
      decision.match.after.id,
    ),
    kind: "uninterpretable",
    side: "after",
    reasonCode: decision.kind,
    target: unitConfirmationTarget(decision.match.after),
    detail,
    warning: createSemanticDiffWarning({
      code: decision.kind,
      detail,
      fallbackText:
        "file monitoring condition flwc is not interpreted because it combines mutually exclusive conditions",
    }),
  };
};

const toNormalizationLimitations = (
  side: SemanticDiffSide,
  document: AjsDocument,
): SemanticDiffLimitation[] =>
  document.warnings.map((warning) => ({
    code: warning.code,
    kind: "normalization",
    side,
    unitPath: warning.unitPath ?? null,
    detail: createSemanticDiffDetail({ unitPath: warning.unitPath }),
    warning: createSemanticDiffWarning({
      code: warning.code,
      detail: createSemanticDiffDetail({ unitPath: warning.unitPath }),
      fallbackText: warning.message,
    }),
  }));

export const createSemanticDiffResult = (
  input: CompareSemanticDiffInput,
  parts: SemanticDiffResultParts = {},
  units: {
    before: AjsUnit[];
    after: AjsUnit[];
  } = {
    before: scopedUnits(input.before, input.options?.jobGroupPath),
    after: scopedUnits(input.after, input.options?.jobGroupPath),
  },
): SemanticDiffResult => {
  const result: SemanticDiffResult = {
    inputs: toInputPair(input, units.before, units.after),
    changes: parts.changes ?? [],
    identityDecisions: parts.identityDecisions ?? [],
    confirmationRequired: parts.confirmationRequired ?? [],
    unsupportedItems: parts.unsupportedItems ?? [],
    limitations: [
      ...toNormalizationLimitations("before", input.before),
      ...toNormalizationLimitations("after", input.after),
      ...(parts.limitations ?? []),
    ],
  };
  if (parts.scheduleComparison) {
    result.scheduleComparison = parts.scheduleComparison;
  }
  return result;
};

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
  const correspondenceMap = new Map(
    correspondence.matches.map((match) => [match.before.id, match.after.id]),
  );
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
    ...createRelationChanges({
      decisions: compareSemanticDiffRelations({
        beforeUnits,
        afterUnits,
        beforeUnitById,
        afterUnitById,
        matches,
      }),
      relationPairContext: {
        beforeUnitById,
        afterUnitById,
        correspondence: correspondenceMap,
      },
    }),
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
      createEvidenceConfirmation({
        decision,
        relationPairContext: {
          beforeUnitById,
          afterUnitById,
          correspondence: correspondenceMap,
        },
      }),
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

  return createSemanticDiffResult(
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
