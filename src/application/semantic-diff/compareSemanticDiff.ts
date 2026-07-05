import {
  flattenAjsUnits,
  type AjsDocument,
  type AjsParameter,
  type AjsRelation,
  type AjsUnit,
  type AjsUnitType,
} from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffAttributeCategory,
  SemanticDiffChange,
  SemanticDiffChangeSet,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffElementKind,
  SemanticDiffInputPair,
  SemanticDiffJobnetIdentityKey,
  SemanticDiffJobGroupInput,
  SemanticDiffLimitation,
  SemanticDiffRelationIdentityKey,
  SemanticDiffReportSection,
  SemanticDiffSide,
  SemanticDiffTarget,
  SemanticDiffUnitIdentityKey,
  SemanticDiffUnsupportedItem,
} from "../../domain/models/semantic-diff/SemanticDiff";

export type CompareSemanticDiffOptions = {
  jobGroupPath?: string;
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
  reportSections?: SemanticDiffReportSection[];
};

type UnitMatch = {
  before: AjsUnit;
  after: AjsUnit;
  kind: "exact" | "fingerprint";
};

type CandidateGroup = {
  fingerprint: string;
  before: AjsUnit[];
  after: AjsUnit[];
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
  "flwf",
  "flwc",
  "wkp",
  "wt",
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

const isJobnetUnit = (unit: AjsUnit): boolean => jobnetTypes.has(unit.unitType);

const sortStrings = (values: string[]): string[] => [...values].sort();

const compareStrings = (left: string, right: string): number =>
  left.localeCompare(right);

const unitSortKey = (unit: AjsUnit): string => unit.absolutePath;

const relationSortKey = (relation: AjsRelation): string =>
  `${relation.sourceUnitId}->${relation.targetUnitId}:${relation.type}`;

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

const findParentJobnetPath = (
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
): string => {
  let current = unit.parentId ? unitById.get(unit.parentId) : undefined;
  while (current) {
    if (isJobnetUnit(current)) {
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

const toJobnetIdentityKey = (
  unit: AjsUnit,
  jobGroupPath?: string,
): SemanticDiffJobnetIdentityKey => ({
  kind: "jobnet",
  jobGroupRelativePath: toRelativePath(unit.absolutePath, jobGroupPath),
  unitType: unit.unitType,
});

const toUnitIdentityKey = (
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
): SemanticDiffUnitIdentityKey => ({
  kind: "unit",
  parentJobnetPath: findParentJobnetPath(unit, unitById),
  unitName: unit.name,
  unitType: unit.unitType,
});

const toUnitTarget = (
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffTarget => ({
  kind: isJobnetUnit(unit) ? "jobnet" : "unit",
  unit,
  identityKey: isJobnetUnit(unit)
    ? toJobnetIdentityKey(unit, jobGroupPath)
    : toUnitIdentityKey(unit, unitById),
});

const unitExactKey = (
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): string =>
  isJobnetUnit(unit)
    ? `jobnet:${toRelativePath(unit.absolutePath, jobGroupPath)}:${unit.unitType}`
    : `unit:${findParentJobnetPath(unit, unitById)}:${unit.name}:${unit.unitType}`;

const parameterValueKey = (parameter: AjsParameter): string =>
  `${parameter.key}=${parameter.value}`;

const parameterFingerprint = (parameters: AjsParameter[]): string =>
  sortStrings(
    parameters
      .filter(
        (parameter) => !ignoredFingerprintParameterKeys.has(parameter.key),
      )
      .map(parameterValueKey),
  ).join("|");

const unitFingerprint = (unit: AjsUnit): string =>
  [
    unit.unitType,
    unit.groupType ?? "",
    unit.permission ?? "",
    unit.jp1Username ?? "",
    unit.jp1ResourceGroup ?? "",
    parameterFingerprint(unit.parameters),
  ].join("::");

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

const matchExactUnits = (
  beforeUnits: AjsUnit[],
  afterUnits: AjsUnit[],
  beforeUnitById: Map<string, AjsUnit>,
  afterUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): UnitMatch[] => {
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

const buildBeforeMatchedIdSet = (matches: UnitMatch[]): Set<string> =>
  new Set(matches.map((match) => match.before.id));

const buildAfterMatchedIdSet = (matches: UnitMatch[]): Set<string> =>
  new Set(matches.map((match) => match.after.id));

const matchFingerprintUnits = (
  beforeUnits: AjsUnit[],
  afterUnits: AjsUnit[],
): {
  matches: UnitMatch[];
  candidates: CandidateGroup[];
} => {
  const beforeByFingerprint = groupBy(beforeUnits, unitFingerprint);
  const afterByFingerprint = groupBy(afterUnits, unitFingerprint);
  const matches: UnitMatch[] = [];
  const candidates: CandidateGroup[] = [];

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

const parameterValuesByKey = (unit: AjsUnit): Map<string, string[]> => {
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

const parameterChangeKeys = (before: AjsUnit, after: AjsUnit): string[] => {
  const beforeValues = parameterValuesByKey(before);
  const afterValues = parameterValuesByKey(after);
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

const changedAttributeKeys = (before: AjsUnit, after: AjsUnit): string[] =>
  sortStrings([
    ...scalarAttributeChangeKeys(before, after),
    ...parameterChangeKeys(before, after),
  ]);

const changeId = (...parts: string[]): string => parts.join(":");

const elementKindForUnit = (unit: AjsUnit): SemanticDiffElementKind =>
  isJobnetUnit(unit) ? "jobnet" : "unit";

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
  matches: UnitMatch[],
  beforeUnitById: Map<string, AjsUnit>,
  afterUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffChange[] =>
  matches.flatMap((match) => {
    const beforeParent = findParentJobnetPath(match.before, beforeUnitById);
    const afterParent = findParentJobnetPath(match.after, afterUnitById);
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
  candidates: CandidateGroup[],
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
  beforeUnits: AjsUnit[],
  afterUnits: AjsUnit[],
  matches: UnitMatch[],
  candidates: CandidateGroup[],
  beforeUnitById: Map<string, AjsUnit>,
  afterUnitById: Map<string, AjsUnit>,
  jobGroupPath?: string,
): SemanticDiffChange[] => {
  const beforeMatchedIds = buildBeforeMatchedIdSet(matches);
  const afterMatchedIds = buildAfterMatchedIdSet(matches);
  const candidateBeforeIds = new Set(
    candidates.flatMap((candidate) => candidate.before.map((unit) => unit.id)),
  );
  const candidateAfterIds = new Set(
    candidates.flatMap((candidate) => candidate.after.map((unit) => unit.id)),
  );
  const removed = beforeUnits
    .filter(
      (unit) =>
        !beforeMatchedIds.has(unit.id) && !candidateBeforeIds.has(unit.id),
    )
    .map((unit) =>
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
  const added = afterUnits
    .filter(
      (unit) =>
        !afterMatchedIds.has(unit.id) && !candidateAfterIds.has(unit.id),
    )
    .map((unit) =>
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

const createAttributeChanges = (matches: UnitMatch[]): SemanticDiffChange[] =>
  matches.flatMap((match) =>
    changedAttributeKeys(match.before, match.after).map((key) => ({
      id: changeId("attribute", key, match.before.id, match.after.id),
      kind: "changed",
      elementKind: "attribute",
      confirmationLevel: "confirmed",
      before: {
        kind: "attribute",
        unit: match.before,
        parameterKey: key,
        category: attributeCategory(key),
      },
      after: {
        kind: "attribute",
        unit: match.after,
        parameterKey: key,
        category: attributeCategory(key),
      },
      attributeCategory: attributeCategory(key),
      summary: `${match.before.name} ${key} changed`,
      rationale:
        match.kind === "exact"
          ? "exact identity match"
          : "one-to-one identity fingerprint match",
    })),
  );

const relationIdentityKey = (
  relation: AjsRelation,
): SemanticDiffRelationIdentityKey => ({
  kind: "relation",
  sourceUnitId: relation.sourceUnitId,
  targetUnitId: relation.targetUnitId,
  relationType: relation.type,
});

const relationTarget = (
  relation: AjsRelation,
  unitById: Map<string, AjsUnit>,
): SemanticDiffTarget => ({
  kind: "relation",
  relation,
  sourceUnit: unitById.get(relation.sourceUnitId),
  targetUnit: unitById.get(relation.targetUnitId),
  identityKey: relationIdentityKey(relation),
});

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

const buildUnitCorrespondence = (matches: UnitMatch[]): Map<string, string> =>
  new Map(matches.map((match) => [match.before.id, match.after.id]));

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

const createRelationChanges = (
  beforeUnits: AjsUnit[],
  afterUnits: AjsUnit[],
  beforeUnitById: Map<string, AjsUnit>,
  afterUnitById: Map<string, AjsUnit>,
  matches: UnitMatch[],
): SemanticDiffChange[] => {
  const beforeRelationsByPair = relationMapByPair(
    scopedRelations(beforeUnits, beforeUnitById),
    buildUnitCorrespondence(matches),
  );
  const afterRelationsByPair = relationMapByPair(
    scopedRelations(afterUnits, afterUnitById),
  );

  return sortStrings([
    ...beforeRelationsByPair.keys(),
    ...afterRelationsByPair.keys(),
  ]).flatMap((pairKey): SemanticDiffChange[] => {
    const beforeRelations = beforeRelationsByPair.get(pairKey) ?? [];
    const afterRelations = afterRelationsByPair.get(pairKey) ?? [];
    const beforeTypes = new Set(
      beforeRelations.map((relation) => relation.type),
    );
    const afterTypes = new Set(afterRelations.map((relation) => relation.type));

    const removed = beforeRelations
      .filter((relation) => !afterTypes.has(relation.type))
      .map(
        (relation): SemanticDiffChange => ({
          id: changeId("relation", "removed", pairKey, relation.type),
          kind: "removed",
          elementKind: "relation",
          confirmationLevel: "confirmed",
          before: relationTarget(relation, beforeUnitById),
          summary: `${pairKey} relation removed`,
        }),
      );
    const added = afterRelations
      .filter((relation) => !beforeTypes.has(relation.type))
      .map(
        (relation): SemanticDiffChange => ({
          id: changeId("relation", "added", pairKey, relation.type),
          kind: "added",
          elementKind: "relation",
          confirmationLevel: "confirmed",
          after: relationTarget(relation, afterUnitById),
          summary: `${pairKey} relation added`,
        }),
      );

    return [...removed, ...added];
  });
};

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
  reportSections: parts.reportSections ?? [],
});

export const compareSemanticDiff: CompareSemanticDiff = (input) => {
  const beforeUnits = scopedUnits(input.before, input.options?.jobGroupPath);
  const afterUnits = scopedUnits(input.after, input.options?.jobGroupPath);
  const beforeUnitById = buildUnitById(beforeUnits);
  const afterUnitById = buildUnitById(afterUnits);
  const exactMatches = matchExactUnits(
    beforeUnits,
    afterUnits,
    beforeUnitById,
    afterUnitById,
    input.options?.jobGroupPath,
  );
  const exactBeforeMatchedIds = buildBeforeMatchedIdSet(exactMatches);
  const exactAfterMatchedIds = buildAfterMatchedIdSet(exactMatches);
  const unmatchedBeforeUnits = beforeUnits.filter(
    (unit) => !exactBeforeMatchedIds.has(unit.id),
  );
  const unmatchedAfterUnits = afterUnits.filter(
    (unit) => !exactAfterMatchedIds.has(unit.id),
  );
  const fingerprintResult = matchFingerprintUnits(
    unmatchedBeforeUnits,
    unmatchedAfterUnits,
  );
  const matches = [...exactMatches, ...fingerprintResult.matches];
  const changes = [
    ...createFingerprintMatchChanges(
      fingerprintResult.matches,
      beforeUnitById,
      afterUnitById,
      input.options?.jobGroupPath,
    ),
    ...createCandidateChanges(
      fingerprintResult.candidates,
      beforeUnitById,
      afterUnitById,
      input.options?.jobGroupPath,
    ),
    ...createAddedRemovedChanges(
      beforeUnits,
      afterUnits,
      matches,
      fingerprintResult.candidates,
      beforeUnitById,
      afterUnitById,
      input.options?.jobGroupPath,
    ),
    ...createAttributeChanges(matches),
    ...createRelationChanges(
      beforeUnits,
      afterUnits,
      beforeUnitById,
      afterUnitById,
      matches,
    ),
  ];

  return createSemanticDiffChangeSet(input, {
    changes: changes.sort((left, right) => compareStrings(left.id, right.id)),
  });
};
