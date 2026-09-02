import type {
  AjsParameter,
  AjsRelation,
  AjsUnit,
  AjsUnitType,
} from "../../models/ajs/AjsDocument";
import type {
  SemanticDiffAttributeCategory,
  SemanticDiffIdentityDecision,
  SemanticDiffIdentityEvidence,
  SemanticDiffIdentityFingerprintEvidence,
  SemanticDiffIdentityUnitReference,
  SemanticDiffJobnetIdentityKey,
  SemanticDiffRelationIdentityKey,
  SemanticDiffUnitIdentityKey,
} from "../../models/semantic-diff/SemanticDiff";
import {
  createSemanticDiffIdentityFingerprint,
  semanticDiffLegacyUnitFingerprint,
  semanticDiffUnitIdentityStrategy,
  type SemanticDiffIdentityFingerprint,
} from "./semanticDiffIdentity";

export {
  createSemanticDiffIdentityFingerprint,
  semanticDiffUnitIdentityFingerprint,
  semanticDiffUnitIdentityStrategy,
} from "./semanticDiffIdentity";
export type { SemanticDiffIdentityFingerprint } from "./semanticDiffIdentity";
export type {
  SemanticDiffIdentityDecision,
  SemanticDiffIdentityDecisionId,
  SemanticDiffIdentityDecisionRule,
  SemanticDiffIdentityDecisionStatus,
  SemanticDiffIdentityEvidence,
  SemanticDiffIdentityExactKey,
  SemanticDiffIdentityExactKeyEvidence,
  SemanticDiffIdentityField,
  SemanticDiffIdentityFingerprintEvidence,
  SemanticDiffIdentityStrategyId,
  SemanticDiffIdentityUnitReference,
} from "../../models/semantic-diff/SemanticDiff";

export type SemanticDiffUnitMatch = {
  before: AjsUnit;
  after: AjsUnit;
  kind: "exact" | "fingerprint";
};

export type SemanticDiffCandidateGroup = {
  fingerprint: string;
  evidence: SemanticDiffIdentityFingerprintEvidence;
  before: AjsUnit[];
  after: AjsUnit[];
};

export type SemanticDiffUnitCorrespondence = {
  matches: SemanticDiffUnitMatch[];
  fingerprintMatches: SemanticDiffUnitMatch[];
  candidates: SemanticDiffCandidateGroup[];
  removedUnits: AjsUnit[];
  addedUnits: AjsUnit[];
  identityDecisions: SemanticDiffIdentityDecision[];
};

export type SemanticDiffAttributeDecision = {
  key: string;
  category: SemanticDiffAttributeCategory;
};

export type SemanticDiffRelationDecision = {
  kind: "added" | "removed";
  pairKey: string;
  relation: AjsRelation;
};

const jobnetTypes = new Set<AjsUnitType>(["n", "rn", "rm", "rr"]);
const executionEnvironmentKeys = new Set(["eu", "un", "rg", "qu"]);
const startConditionKeys = new Set(["eun", "cond", "ar"]);
const endControlKeys = new Set(["ej", "ejc", "ejf", "jdf"]);
const abnormalEndControlKeys = new Set(["ab", "abr", "rec"]);
const waitConditionKeys = new Set([
  "evwid",
  "evwfr",
  "evhst",
  "evwms",
  "evdet",
  "evtmc",
  "evesc",
  "flwf",
  "flwc",
  "wkp",
  "wt",
  "fd",
  "etm",
  "wth",
]);
const externalIntegrationKeys = new Set([
  "evhst",
  "evsrc",
  "evsid",
  "evusr",
  "mqmgr",
  "mqque",
  "mladr",
  "ntsrc",
]);
const scheduleKeys = new Set(["sd", "st", "cy", "sh", "sc"]);

const sortStrings = (values: string[]): string[] => [...values].sort();

const compareStrings = (left: string, right: string): number =>
  left.localeCompare(right);

const compareOrdinal = (left: string, right: string): number =>
  Number(left > right) - Number(left < right);

const groupBy = <T>(
  values: T[],
  getKey: (value: T) => string,
): Map<string, T[]> => {
  const groups = new Map<string, T[]>();
  values.forEach((value) => {
    const key = getKey(value);
    groups.set(key, [...(groups.get(key) ?? []), value]);
  });
  return groups;
};

export const isSemanticDiffJobnetUnit = (unit: AjsUnit): boolean =>
  jobnetTypes.has(unit.unitType);

export const semanticDiffParentJobnetPath = (
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
): string =>
  ancestorUnits(unit.parentId, unitById).find(isSemanticDiffJobnetUnit)
    ?.absolutePath ?? "";

const ancestorUnits = (
  unitId: string | undefined,
  unitById: Map<string, AjsUnit>,
): AjsUnit[] => {
  const unit = unitId ? unitById.get(unitId) : undefined;
  return unit ? [unit, ...ancestorUnits(unit.parentId, unitById)] : [];
};

const toRelativePath = (absolutePath: string, jobGroupPath?: string): string =>
  jobGroupPath && absolutePath.startsWith(jobGroupPath)
    ? absolutePath.slice(jobGroupPath.length).replace(/^\//, "")
    : absolutePath.replace(/^\//, "");

export const semanticDiffJobnetIdentityKey = (
  unit: AjsUnit,
  jobGroupPath?: string,
): SemanticDiffJobnetIdentityKey => ({
  kind: "jobnet",
  jobGroupRelativePath: toRelativePath(unit.absolutePath, jobGroupPath),
  unitType: unit.unitType,
});

export const semanticDiffUnitIdentityKey = (
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
): SemanticDiffUnitIdentityKey => ({
  kind: "unit",
  parentJobnetPath: semanticDiffParentJobnetPath(unit, unitById),
  unitName: unit.name,
  unitType: unit.unitType,
});

const unitExactKey = (
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): string =>
  JSON.stringify(
    isSemanticDiffJobnetUnit(unit)
      ? semanticDiffJobnetIdentityKey(unit, jobGroupPath)
      : semanticDiffUnitIdentityKey(unit, unitById),
  );

/**
 * Preserve the historical fallback representation while exposing the
 * selected strategy's unambiguous grouping key for supported forms.
 */
export const semanticDiffUnitFingerprint = (unit: AjsUnit): string =>
  semanticDiffUnitIdentityStrategy(unit) === "legacy-all-parameters-v1"
    ? semanticDiffLegacyUnitFingerprint(unit)
    : createSemanticDiffIdentityFingerprint(unit).fingerprint;

const matchExactUnits = (
  beforeUnits: AjsUnit[],
  afterUnits: AjsUnit[],
  context: {
    beforeUnitById: Map<string, AjsUnit>;
    afterUnitById: Map<string, AjsUnit>;
    jobGroupPath?: string;
  },
): SemanticDiffUnitMatch[] => {
  const beforeByKey = groupBy(beforeUnits, (unit) =>
    unitExactKey(unit, context.beforeUnitById, context.jobGroupPath),
  );
  const afterByKey = groupBy(afterUnits, (unit) =>
    unitExactKey(unit, context.afterUnitById, context.jobGroupPath),
  );

  const uniqueMatch = (
    beforeMatches: AjsUnit[],
    afterMatches: AjsUnit[],
  ): SemanticDiffUnitMatch[] => {
    if (beforeMatches.length !== 1 || afterMatches.length !== 1) {
      return [];
    }
    return [
      {
        before: beforeMatches[0],
        after: afterMatches[0],
        kind: "exact",
      },
    ];
  };

  return [...beforeByKey.entries()]
    .flatMap(([key, beforeMatches]) =>
      uniqueMatch(beforeMatches, afterByKey.get(key) ?? []),
    )
    .sort(
      (left, right) =>
        compareUnits(left.before, right.before) ||
        compareUnits(left.after, right.after),
    );
};

type FingerprintMatchContext = {
  beforeIdentityById: Map<string, SemanticDiffIdentityFingerprint>;
  afterIdentityById: Map<string, SemanticDiffIdentityFingerprint>;
};

type FingerprintGroupResult = {
  match: SemanticDiffUnitMatch | undefined;
  candidate: SemanticDiffCandidateGroup | undefined;
};

const oneToOneFingerprintMatch = (
  beforeMatches: AjsUnit[],
  afterMatches: AjsUnit[],
): SemanticDiffUnitMatch | undefined => {
  if (beforeMatches.length !== 1 || afterMatches.length !== 1) {
    return undefined;
  }
  return {
    before: beforeMatches[0],
    after: afterMatches[0],
    kind: "fingerprint",
  };
};

const ambiguousFingerprintCandidate = (input: {
  fingerprint: string;
  beforeMatches: AjsUnit[];
  afterMatches: AjsUnit[];
  context: FingerprintMatchContext;
}): SemanticDiffCandidateGroup | undefined => {
  const { fingerprint, beforeMatches, afterMatches, context } = input;
  const evidence = context.beforeIdentityById.get(
    beforeMatches[0]?.id ?? "",
  )?.evidence;
  if (!evidence || afterMatches.length === 0) {
    return undefined;
  }
  return {
    fingerprint,
    evidence,
    before: [...beforeMatches].sort(compareUnits),
    after: [...afterMatches].sort(compareUnits),
  };
};

const classifyFingerprintGroup = (input: {
  fingerprint: string;
  beforeMatches: AjsUnit[];
  afterMatches: AjsUnit[];
  context: FingerprintMatchContext;
}): FingerprintGroupResult => {
  const match = oneToOneFingerprintMatch(
    input.beforeMatches,
    input.afterMatches,
  );
  return {
    match,
    candidate: match ? undefined : ambiguousFingerprintCandidate(input),
  };
};

const matchFingerprintUnits = (
  beforeUnits: AjsUnit[],
  afterUnits: AjsUnit[],
  context: FingerprintMatchContext,
): {
  matches: SemanticDiffUnitMatch[];
  candidates: SemanticDiffCandidateGroup[];
} => {
  const beforeByFingerprint = groupBy(
    beforeUnits,
    (unit) => context.beforeIdentityById.get(unit.id)?.fingerprint ?? "",
  );
  const afterByFingerprint = groupBy(
    afterUnits,
    (unit) => context.afterIdentityById.get(unit.id)?.fingerprint ?? "",
  );
  const groupResults = [...beforeByFingerprint.entries()]
    .sort(([left], [right]) => compareOrdinal(left, right))
    .map(([fingerprint, beforeMatches]) =>
      classifyFingerprintGroup({
        fingerprint,
        beforeMatches,
        afterMatches: afterByFingerprint.get(fingerprint) ?? [],
        context,
      }),
    );
  const matches = groupResults.flatMap(({ match }) => (match ? [match] : []));
  const candidates = groupResults.flatMap(({ candidate }) =>
    candidate ? [candidate] : [],
  );

  return {
    matches: matches.sort(
      (left, right) =>
        compareUnits(left.before, right.before) ||
        compareUnits(left.after, right.after),
    ),
    candidates: candidates.sort((left, right) =>
      compareOrdinal(left.fingerprint, right.fingerprint),
    ),
  };
};

const matchedIds = (
  matches: SemanticDiffUnitMatch[],
  side: "before" | "after",
): Set<string> => new Set(matches.map((match) => match[side].id));

const identityReference = (
  unit: AjsUnit,
): SemanticDiffIdentityUnitReference => ({
  id: unit.id,
  name: unit.name,
  absolutePath: unit.absolutePath,
  unitType: String(unit.unitType),
});

const compareIdentityReferences = (
  left: SemanticDiffIdentityUnitReference,
  right: SemanticDiffIdentityUnitReference,
): number =>
  [
    [left.absolutePath, right.absolutePath],
    [left.unitType, right.unitType],
    [left.name, right.name],
    [left.id, right.id],
  ]
    .map(([leftValue, rightValue]) => compareOrdinal(leftValue, rightValue))
    .find((comparison) => comparison !== 0) ?? 0;

const compareUnits = (left: AjsUnit, right: AjsUnit): number =>
  compareIdentityReferences(identityReference(left), identityReference(right));

const sortedIdentityReferences = (
  units: AjsUnit[],
): SemanticDiffIdentityUnitReference[] =>
  units.map(identityReference).sort(compareIdentityReferences);

const encodeIdentityComponent = (value: string): string =>
  `${value.length}:${value}`;

const encodeIdentityArray = (values: string[]): string =>
  `${values.length}[${values.map(encodeIdentityComponent).join("")}]`;

const identityDecisionId = ({
  rule,
  status,
  evidence,
  before,
  after,
}: {
  rule: string;
  status: string;
  evidence: SemanticDiffIdentityEvidence;
  before: SemanticDiffIdentityUnitReference[];
  after: SemanticDiffIdentityUnitReference[];
}): string => {
  const evidenceMarker =
    evidence.kind === "fingerprint" ? evidence.strategyId : evidence.key.kind;
  const referenceEncoding = (
    reference: SemanticDiffIdentityUnitReference,
  ): string =>
    encodeIdentityArray([
      reference.absolutePath,
      reference.unitType,
      reference.name,
      reference.id,
    ]);
  return `identity:v1:${encodeIdentityArray([
    rule,
    status,
    evidence.kind,
    evidenceMarker,
    encodeIdentityArray(before.map(referenceEncoding)),
    encodeIdentityArray(after.map(referenceEncoding)),
  ])}`;
};

const exactIdentityDecision = (
  match: SemanticDiffUnitMatch,
  beforeUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffIdentityDecision => {
  const before = sortedIdentityReferences([match.before]);
  const after = sortedIdentityReferences([match.after]);
  const key = isSemanticDiffJobnetUnit(match.before)
    ? semanticDiffJobnetIdentityKey(match.before, jobGroupPath)
    : semanticDiffUnitIdentityKey(match.before, beforeUnitById);
  const evidence: SemanticDiffIdentityEvidence = {
    kind: "exact-key",
    key,
  };
  return {
    id: identityDecisionId({
      rule: "exact-key",
      status: "exact",
      evidence,
      before,
      after,
    }),
    status: "exact",
    rule: "exact-key",
    before,
    after,
    evidence,
  };
};

const fingerprintIdentityDecision = (
  match: SemanticDiffUnitMatch,
  identityById: Map<string, SemanticDiffIdentityFingerprint>,
): SemanticDiffIdentityDecision => {
  const before = sortedIdentityReferences([match.before]);
  const after = sortedIdentityReferences([match.after]);
  const evidence = identityById.get(match.before.id)?.evidence;
  if (!evidence) {
    throw new Error(`Missing identity fingerprint for ${match.before.id}`);
  }
  return {
    id: identityDecisionId({
      rule: "one-to-one-fingerprint",
      status: "fingerprint-confirmed",
      evidence,
      before,
      after,
    }),
    status: "fingerprint-confirmed",
    rule: "one-to-one-fingerprint",
    before,
    after,
    evidence,
  };
};

const candidateIdentityDecision = (
  candidate: SemanticDiffCandidateGroup,
): SemanticDiffIdentityDecision => {
  const before = sortedIdentityReferences(candidate.before);
  const after = sortedIdentityReferences(candidate.after);
  return {
    id: identityDecisionId({
      rule: "ambiguous-fingerprint",
      status: "candidate",
      evidence: candidate.evidence,
      before,
      after,
    }),
    status: "candidate",
    rule: "ambiguous-fingerprint",
    before,
    after,
    evidence: candidate.evidence,
  };
};

const removedIdentityDecision = (
  unit: AjsUnit,
  identityById: Map<string, SemanticDiffIdentityFingerprint>,
): SemanticDiffIdentityDecision => {
  const before = sortedIdentityReferences([unit]);
  const after: SemanticDiffIdentityUnitReference[] = [];
  const evidence = identityById.get(unit.id);
  if (!evidence) {
    throw new Error(`Missing identity fingerprint for ${unit.id}`);
  }
  return {
    id: identityDecisionId({
      rule: "unmatched-before",
      status: "removed",
      evidence: evidence.evidence,
      before,
      after,
    }),
    status: "removed",
    rule: "unmatched-before",
    before,
    after,
    evidence: evidence.evidence,
  };
};

const addedIdentityDecision = (
  unit: AjsUnit,
  identityById: Map<string, SemanticDiffIdentityFingerprint>,
): SemanticDiffIdentityDecision => {
  const before: SemanticDiffIdentityUnitReference[] = [];
  const after = sortedIdentityReferences([unit]);
  const evidence = identityById.get(unit.id);
  if (!evidence) {
    throw new Error(`Missing identity fingerprint for ${unit.id}`);
  }
  return {
    id: identityDecisionId({
      rule: "unmatched-after",
      status: "added",
      evidence: evidence.evidence,
      before,
      after,
    }),
    status: "added",
    rule: "unmatched-after",
    before,
    after,
    evidence: evidence.evidence,
  };
};

const identityDecisionStatusOrder: Record<
  SemanticDiffIdentityDecision["status"],
  number
> = {
  exact: 0,
  "fingerprint-confirmed": 1,
  candidate: 2,
  removed: 3,
  added: 4,
};

const sortIdentityDecisions = (
  decisions: SemanticDiffIdentityDecision[],
): SemanticDiffIdentityDecision[] =>
  [...decisions].sort((left, right) => {
    const statusComparison =
      identityDecisionStatusOrder[left.status] -
      identityDecisionStatusOrder[right.status];
    return statusComparison !== 0
      ? statusComparison
      : compareOrdinal(left.id, right.id);
  });

export const buildSemanticDiffUnitCorrespondence = ({
  beforeUnits,
  afterUnits,
  beforeUnitById,
  afterUnitById,
  jobGroupPath,
}: {
  beforeUnits: AjsUnit[];
  afterUnits: AjsUnit[];
  beforeUnitById: Map<string, AjsUnit>;
  afterUnitById: Map<string, AjsUnit>;
  jobGroupPath?: string;
}): SemanticDiffUnitCorrespondence => {
  const beforeIdentityById = new Map(
    beforeUnits.map((unit) => [
      unit.id,
      createSemanticDiffIdentityFingerprint(unit),
    ]),
  );
  const afterIdentityById = new Map(
    afterUnits.map((unit) => [
      unit.id,
      createSemanticDiffIdentityFingerprint(unit),
    ]),
  );
  const exactMatches = matchExactUnits(beforeUnits, afterUnits, {
    beforeUnitById,
    afterUnitById,
    jobGroupPath,
  });
  const exactBeforeIds = matchedIds(exactMatches, "before");
  const exactAfterIds = matchedIds(exactMatches, "after");
  const fingerprintResult = matchFingerprintUnits(
    beforeUnits.filter((unit) => !exactBeforeIds.has(unit.id)),
    afterUnits.filter((unit) => !exactAfterIds.has(unit.id)),
    { beforeIdentityById, afterIdentityById },
  );
  const matches = [...exactMatches, ...fingerprintResult.matches].sort(
    (left, right) =>
      compareUnits(left.before, right.before) ||
      compareUnits(left.after, right.after),
  );
  const matchedBeforeIds = matchedIds(matches, "before");
  const matchedAfterIds = matchedIds(matches, "after");
  const candidateBeforeIds = new Set(
    fingerprintResult.candidates.flatMap((candidate) =>
      candidate.before.map((unit) => unit.id),
    ),
  );
  const candidateAfterIds = new Set(
    fingerprintResult.candidates.flatMap((candidate) =>
      candidate.after.map((unit) => unit.id),
    ),
  );

  const identityDecisions = sortIdentityDecisions([
    ...exactMatches.map((match) =>
      exactIdentityDecision(match, beforeUnitById, jobGroupPath),
    ),
    ...fingerprintResult.matches.map((match) =>
      fingerprintIdentityDecision(match, beforeIdentityById),
    ),
    ...fingerprintResult.candidates.map(candidateIdentityDecision),
    ...beforeUnits
      .filter(
        (unit) =>
          !matchedBeforeIds.has(unit.id) && !candidateBeforeIds.has(unit.id),
      )
      .map((unit) => removedIdentityDecision(unit, beforeIdentityById)),
    ...afterUnits
      .filter(
        (unit) =>
          !matchedAfterIds.has(unit.id) && !candidateAfterIds.has(unit.id),
      )
      .map((unit) => addedIdentityDecision(unit, afterIdentityById)),
  ]);

  return {
    matches,
    fingerprintMatches: fingerprintResult.matches,
    candidates: fingerprintResult.candidates,
    removedUnits: beforeUnits
      .filter(
        (unit) =>
          !matchedBeforeIds.has(unit.id) && !candidateBeforeIds.has(unit.id),
      )
      .sort(compareUnits),
    addedUnits: afterUnits
      .filter(
        (unit) =>
          !matchedAfterIds.has(unit.id) && !candidateAfterIds.has(unit.id),
      )
      .sort(compareUnits),
    identityDecisions,
  };
};

export const semanticDiffParameterValuesByKey = (
  unit: AjsUnit,
): Map<string, string[]> => {
  const values = new Map<string, string[]>();
  unit.parameters.forEach((parameter) => {
    values.set(parameter.key, [
      ...(values.get(parameter.key) ?? []),
      parameter.value,
    ]);
  });
  return values;
};

const valuesEqual = (beforeValues: string[], afterValues: string[]): boolean =>
  sortStrings(beforeValues).join("\u0000") ===
  sortStrings(afterValues).join("\u0000");

export const semanticDiffParameterChangeKeys = (
  before: AjsUnit,
  after: AjsUnit,
): string[] => {
  const beforeValues = semanticDiffParameterValuesByKey(before);
  const afterValues = semanticDiffParameterValuesByKey(after);
  return sortStrings([
    ...new Set([...beforeValues.keys(), ...afterValues.keys()]),
  ]).filter(
    (key) =>
      !valuesEqual(beforeValues.get(key) ?? [], afterValues.get(key) ?? []),
  );
};

const scalarAttributeChangeKeys = (before: AjsUnit, after: AjsUnit): string[] =>
  [
    ["unitAttribute", before.unitAttribute, after.unitAttribute],
    ["permission", before.permission ?? "", after.permission ?? ""],
    ["jp1Username", before.jp1Username ?? "", after.jp1Username ?? ""],
    [
      "jp1ResourceGroup",
      before.jp1ResourceGroup ?? "",
      after.jp1ResourceGroup ?? "",
    ],
    ["comment", before.comment ?? "", after.comment ?? ""],
  ]
    .filter(([, beforeValue, afterValue]) => beforeValue !== afterValue)
    .map(([key]) => key);

const categorizedAttributeKeys: Array<{
  category: Exclude<SemanticDiffAttributeCategory, "execution-definition">;
  keys: Set<string>;
}> = [
  { category: "execution-environment", keys: executionEnvironmentKeys },
  { category: "start-condition", keys: startConditionKeys },
  { category: "end-control", keys: endControlKeys },
  { category: "abnormal-end-control", keys: abnormalEndControlKeys },
  { category: "wait-condition", keys: waitConditionKeys },
  { category: "external-integration", keys: externalIntegrationKeys },
  { category: "schedule", keys: scheduleKeys },
];

const attributeCategory = (key: string): SemanticDiffAttributeCategory =>
  categorizedAttributeKeys.find(({ keys }) => keys.has(key))?.category ??
  "execution-definition";

export const compareSemanticDiffAttributes = (
  before: AjsUnit,
  after: AjsUnit,
): SemanticDiffAttributeDecision[] =>
  sortStrings([
    ...scalarAttributeChangeKeys(before, after),
    ...semanticDiffParameterChangeKeys(before, after),
  ]).map((key) => ({ key, category: attributeCategory(key) }));

export const semanticDiffRelationIdentityKey = (
  relation: AjsRelation,
): SemanticDiffRelationIdentityKey => ({
  kind: "relation",
  sourceUnitId: relation.sourceUnitId,
  targetUnitId: relation.targetUnitId,
  relationType: relation.type,
});

const relationSortKey = (relation: AjsRelation): string =>
  `${relation.sourceUnitId}->${relation.targetUnitId}:${relation.type}`;

const scopedRelations = (
  units: AjsUnit[],
  unitById: Map<string, AjsUnit>,
): AjsRelation[] =>
  units
    .flatMap((unit) => unit.relations)
    .filter(
      (relation) =>
        unitById.has(relation.sourceUnitId) &&
        unitById.has(relation.targetUnitId),
    )
    .sort((left, right) =>
      compareStrings(relationSortKey(left), relationSortKey(right)),
    );

const relationPairKey = (
  relation: AjsRelation,
  correspondence?: Map<string, string>,
): string | undefined => {
  const sourceUnitId =
    correspondence?.get(relation.sourceUnitId) ?? relation.sourceUnitId;
  const targetUnitId =
    correspondence?.get(relation.targetUnitId) ?? relation.targetUnitId;
  return sourceUnitId && targetUnitId
    ? `${sourceUnitId}->${targetUnitId}`
    : undefined;
};

const relationMapByPair = (
  relations: AjsRelation[],
  correspondence?: Map<string, string>,
): Map<string, AjsRelation[]> => {
  const relationsByPair = new Map<string, AjsRelation[]>();
  relations.forEach((relation) => {
    const key = relationPairKey(relation, correspondence);
    if (key) {
      relationsByPair.set(key, [...(relationsByPair.get(key) ?? []), relation]);
    }
  });
  return relationsByPair;
};

export const buildSemanticDiffRelationPairMaps = ({
  beforeUnits,
  afterUnits,
  beforeUnitById,
  afterUnitById,
  matches,
}: {
  beforeUnits: AjsUnit[];
  afterUnits: AjsUnit[];
  beforeUnitById: Map<string, AjsUnit>;
  afterUnitById: Map<string, AjsUnit>;
  matches: SemanticDiffUnitMatch[];
}): {
  before: Map<string, AjsRelation[]>;
  after: Map<string, AjsRelation[]>;
} => {
  const correspondence = new Map(
    matches.map((match) => [match.before.id, match.after.id]),
  );
  return {
    before: relationMapByPair(
      scopedRelations(beforeUnits, beforeUnitById),
      correspondence,
    ),
    after: relationMapByPair(scopedRelations(afterUnits, afterUnitById)),
  };
};

export const compareSemanticDiffRelations = ({
  beforeUnits,
  afterUnits,
  beforeUnitById,
  afterUnitById,
  matches,
}: {
  beforeUnits: AjsUnit[];
  afterUnits: AjsUnit[];
  beforeUnitById: Map<string, AjsUnit>;
  afterUnitById: Map<string, AjsUnit>;
  matches: SemanticDiffUnitMatch[];
}): SemanticDiffRelationDecision[] => {
  const relationPairs = buildSemanticDiffRelationPairMaps({
    beforeUnits,
    afterUnits,
    beforeUnitById,
    afterUnitById,
    matches,
  });

  const pairKeys = new Set([
    ...relationPairs.before.keys(),
    ...relationPairs.after.keys(),
  ]);
  return sortStrings([...pairKeys]).flatMap(
    (pairKey): SemanticDiffRelationDecision[] => {
      const beforeRelations = relationPairs.before.get(pairKey) ?? [];
      const afterRelations = relationPairs.after.get(pairKey) ?? [];
      const beforeTypes = new Set(
        beforeRelations.map((relation) => relation.type),
      );
      const afterTypes = new Set(
        afterRelations.map((relation) => relation.type),
      );
      const removed = beforeRelations
        .filter((relation) => !afterTypes.has(relation.type))
        .map((relation) => ({ kind: "removed" as const, pairKey, relation }));
      const added = afterRelations
        .filter((relation) => !beforeTypes.has(relation.type))
        .map((relation) => ({ kind: "added" as const, pairKey, relation }));
      return [...removed, ...added];
    },
  );
};
