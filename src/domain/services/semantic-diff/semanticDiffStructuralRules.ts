import type {
  AjsParameter,
  AjsRelation,
  AjsUnit,
  AjsUnitType,
} from "../../models/ajs/AjsDocument";
import type {
  SemanticDiffAttributeCategory,
  SemanticDiffJobnetIdentityKey,
  SemanticDiffRelationIdentityKey,
  SemanticDiffUnitIdentityKey,
} from "../../models/semantic-diff/SemanticDiff";

export type SemanticDiffUnitMatch = {
  before: AjsUnit;
  after: AjsUnit;
  kind: "exact" | "fingerprint";
};

export type SemanticDiffCandidateGroup = {
  fingerprint: string;
  before: AjsUnit[];
  after: AjsUnit[];
};

export type SemanticDiffUnitCorrespondence = {
  matches: SemanticDiffUnitMatch[];
  fingerprintMatches: SemanticDiffUnitMatch[];
  candidates: SemanticDiffCandidateGroup[];
  removedUnits: AjsUnit[];
  addedUnits: AjsUnit[];
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
const ignoredFingerprintParameterKeys = new Set(["unit", "el"]);

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
): string => {
  let current = unit.parentId ? unitById.get(unit.parentId) : undefined;
  while (current) {
    if (isSemanticDiffJobnetUnit(current)) {
      return current.absolutePath;
    }
    current = current.parentId ? unitById.get(current.parentId) : undefined;
  }
  return "";
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
  isSemanticDiffJobnetUnit(unit)
    ? `jobnet:${toRelativePath(unit.absolutePath, jobGroupPath)}:${unit.unitType}`
    : `unit:${semanticDiffParentJobnetPath(unit, unitById)}:${unit.name}:${unit.unitType}`;

const parameterValueKey = (parameter: AjsParameter): string =>
  `${parameter.key}=${parameter.value}`;

export const semanticDiffUnitFingerprint = (unit: AjsUnit): string =>
  [
    unit.unitType,
    unit.groupType ?? "",
    unit.permission ?? "",
    unit.jp1Username ?? "",
    unit.jp1ResourceGroup ?? "",
    sortStrings(
      unit.parameters
        .filter(
          (parameter) => !ignoredFingerprintParameterKeys.has(parameter.key),
        )
        .map(parameterValueKey),
    ).join("|"),
  ].join("::");

const matchExactUnits = (
  beforeUnits: AjsUnit[],
  afterUnits: AjsUnit[],
  beforeUnitById: Map<string, AjsUnit>,
  afterUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffUnitMatch[] => {
  const beforeByKey = groupBy(beforeUnits, (unit) =>
    unitExactKey(unit, beforeUnitById, jobGroupPath),
  );
  const afterByKey = groupBy(afterUnits, (unit) =>
    unitExactKey(unit, afterUnitById, jobGroupPath),
  );

  return [...beforeByKey.entries()].flatMap(([key, beforeMatches]) => {
    const afterMatches = afterByKey.get(key) ?? [];
    return beforeMatches.length === 1 && afterMatches.length === 1
      ? [{ before: beforeMatches[0], after: afterMatches[0], kind: "exact" }]
      : [];
  });
};

const matchFingerprintUnits = (
  beforeUnits: AjsUnit[],
  afterUnits: AjsUnit[],
): {
  matches: SemanticDiffUnitMatch[];
  candidates: SemanticDiffCandidateGroup[];
} => {
  const beforeByFingerprint = groupBy(beforeUnits, semanticDiffUnitFingerprint);
  const afterByFingerprint = groupBy(afterUnits, semanticDiffUnitFingerprint);
  const matches: SemanticDiffUnitMatch[] = [];
  const candidates: SemanticDiffCandidateGroup[] = [];

  [...beforeByFingerprint.entries()]
    .sort(([left], [right]) => compareStrings(left, right))
    .forEach(([fingerprint, beforeMatches]) => {
      const afterMatches = afterByFingerprint.get(fingerprint) ?? [];
      if (beforeMatches.length === 1 && afterMatches.length === 1) {
        matches.push({
          before: beforeMatches[0],
          after: afterMatches[0],
          kind: "fingerprint",
        });
      } else if (beforeMatches.length > 0 && afterMatches.length > 0) {
        candidates.push({
          fingerprint,
          before: beforeMatches,
          after: afterMatches,
        });
      }
    });

  return { matches, candidates };
};

const matchedIds = (
  matches: SemanticDiffUnitMatch[],
  side: "before" | "after",
): Set<string> => new Set(matches.map((match) => match[side].id));

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
  const exactMatches = matchExactUnits(
    beforeUnits,
    afterUnits,
    beforeUnitById,
    afterUnitById,
    jobGroupPath,
  );
  const exactBeforeIds = matchedIds(exactMatches, "before");
  const exactAfterIds = matchedIds(exactMatches, "after");
  const fingerprintResult = matchFingerprintUnits(
    beforeUnits.filter((unit) => !exactBeforeIds.has(unit.id)),
    afterUnits.filter((unit) => !exactAfterIds.has(unit.id)),
  );
  const matches = [...exactMatches, ...fingerprintResult.matches];
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

  return {
    matches,
    fingerprintMatches: fingerprintResult.matches,
    candidates: fingerprintResult.candidates,
    removedUnits: beforeUnits.filter(
      (unit) =>
        !matchedBeforeIds.has(unit.id) && !candidateBeforeIds.has(unit.id),
    ),
    addedUnits: afterUnits.filter(
      (unit) =>
        !matchedAfterIds.has(unit.id) && !candidateAfterIds.has(unit.id),
    ),
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

const attributeCategory = (key: string): SemanticDiffAttributeCategory => {
  if (executionEnvironmentKeys.has(key)) {
    return "execution-environment";
  }
  if (startConditionKeys.has(key)) {
    return "start-condition";
  }
  if (endControlKeys.has(key)) {
    return "end-control";
  }
  if (abnormalEndControlKeys.has(key)) {
    return "abnormal-end-control";
  }
  if (waitConditionKeys.has(key)) {
    return "wait-condition";
  }
  if (externalIntegrationKeys.has(key)) {
    return "external-integration";
  }
  if (scheduleKeys.has(key)) {
    return "schedule";
  }
  return "execution-definition";
};

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

  return sortStrings([
    ...relationPairs.before.keys(),
    ...relationPairs.after.keys(),
  ]).flatMap((pairKey): SemanticDiffRelationDecision[] => {
    const beforeRelations = relationPairs.before.get(pairKey) ?? [];
    const afterRelations = relationPairs.after.get(pairKey) ?? [];
    const beforeTypes = new Set(
      beforeRelations.map((relation) => relation.type),
    );
    const afterTypes = new Set(afterRelations.map((relation) => relation.type));
    const removed = beforeRelations
      .filter((relation) => !afterTypes.has(relation.type))
      .map((relation) => ({ kind: "removed" as const, pairKey, relation }));
    const added = afterRelations
      .filter((relation) => !beforeTypes.has(relation.type))
      .map((relation) => ({ kind: "added" as const, pairKey, relation }));
    return [...removed, ...added];
  });
};
