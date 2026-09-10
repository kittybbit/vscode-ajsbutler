import type { AjsDocument, AjsUnit } from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffDetail,
  SemanticDiffIdentityDecision,
  SemanticDiffResult,
  SemanticDiffScheduleRun,
  SemanticDiffSide,
  SemanticDiffUnsupportedReason,
} from "./semanticDiffDto";
import type {
  SemanticDiffScheduleEvaluation,
  SemanticDiffScheduleUnsupportedDecision,
} from "../../domain/services/semantic-diff/semanticDiffScheduleRules";

export type SemanticDiffScheduleImpactRootOutcome =
  | "supported-runs"
  | "valid-no-runs"
  | "partial"
  | "uncalculated";

export type SemanticDiffScheduleImpactRunState =
  | "unchanged"
  | "added"
  | "removed"
  | "changed-time";

export type SemanticDiffScheduleImpactIssueKind =
  | "invalid"
  | "missing-context"
  | "unsupported"
  | "uncalculated";

export type SemanticDiffScheduleImpactRun = Readonly<{
  id: string;
  side: SemanticDiffSide;
  unitId: string;
  unitPath: string;
  unitName: string;
  rule: number;
  date: string;
  time: string;
  occurrenceOrdinal: number;
  sourceChangeRef: Readonly<{
    id: string;
    occurrenceOrdinal: number;
  }> | null;
}>;

export type SemanticDiffScheduleImpactIssue = Readonly<{
  id: string;
  occurrenceOrdinal: number;
  kind: SemanticDiffScheduleImpactIssueKind;
  side: SemanticDiffSide | null;
  rootId: string | null;
  reasonCode: string;
  targetKind: string;
  targetId: string | null;
  targetPath: string | null;
  parameterKey: string | null;
  detail: SemanticDiffDetail;
}>;

export type SemanticDiffScheduleImpactRootSide = Readonly<{
  side: SemanticDiffSide;
  unitId: string;
  unitPath: string;
  unitName: string;
  outcome: SemanticDiffScheduleImpactRootOutcome;
  runs: readonly SemanticDiffScheduleImpactRun[];
  issueIds: readonly string[];
}>;

export type SemanticDiffScheduleImpactRootMatchKind =
  | "exact"
  | "fingerprint"
  | "added"
  | "removed"
  | "added-root-scope"
  | "removed-root-scope";

export type SemanticDiffScheduleImpactRoot = Readonly<{
  id: string;
  matchKind: SemanticDiffScheduleImpactRootMatchKind;
  canonicalPath: string;
  identityDecisionId: string | null;
  before: SemanticDiffScheduleImpactRootSide | null;
  after: SemanticDiffScheduleImpactRootSide | null;
  scopeTransition: Readonly<{
    kind: "removed-root-scope" | "added-root-scope";
    counterpartPath: string;
    identityDecisionId: string;
  }> | null;
}>;

export type SemanticDiffScheduleImpactCandidate = Readonly<{
  id: string;
  unitId: string;
  unitName: string;
  unitPath: string;
}>;

export type SemanticDiffScheduleImpactCandidateGroup = Readonly<{
  id: string;
  before: readonly SemanticDiffScheduleImpactCandidate[];
  after: readonly SemanticDiffScheduleImpactCandidate[];
}>;

export type SemanticDiffScheduleImpactTimelineItem = Readonly<{
  id: string;
  state: SemanticDiffScheduleImpactRunState;
  side: SemanticDiffSide | "pair";
  rootId: string;
  date: string;
  time: string;
  rule: number;
  occurrenceOrdinal: number;
  before: SemanticDiffScheduleImpactRun | null;
  after: SemanticDiffScheduleImpactRun | null;
  sourceChangeRef: Readonly<{
    id: string;
    occurrenceOrdinal: number;
  }> | null;
}>;

export type SemanticDiffScheduleImpact = Readonly<{
  period: SemanticDiffComparisonPeriod;
  roots: readonly SemanticDiffScheduleImpactRoot[];
  candidateGroups: readonly SemanticDiffScheduleImpactCandidateGroup[];
  timelineItems: readonly SemanticDiffScheduleImpactTimelineItem[];
  issues: readonly SemanticDiffScheduleImpactIssue[];
}>;

export type SemanticDiffScheduleImpactRootStatus = Readonly<{
  rootId: string;
  side: SemanticDiffSide;
  outcome: SemanticDiffScheduleImpactRootOutcome;
  issueIds: readonly string[];
}>;

export type ScheduleProjectionFacts =
  | Readonly<{ kind: "not-requested" }>
  | Readonly<{
      kind: "invalid";
      period: SemanticDiffComparisonPeriod;
      issues: readonly SemanticDiffScheduleImpactIssue[];
    }>
  | Readonly<{
      kind: "evaluated";
      period: SemanticDiffComparisonPeriod;
      before: Readonly<{
        rootProjections: readonly SemanticDiffScheduleImpactRootSide[];
        statuses: readonly SemanticDiffScheduleImpactRootStatus[];
        issues: readonly SemanticDiffScheduleImpactIssue[];
      }>;
      after: Readonly<{
        rootProjections: readonly SemanticDiffScheduleImpactRootSide[];
        statuses: readonly SemanticDiffScheduleImpactRootStatus[];
        issues: readonly SemanticDiffScheduleImpactIssue[];
      }>;
      correspondence: readonly SemanticDiffScheduleImpactRoot[];
      candidateGroups?: readonly SemanticDiffScheduleImpactCandidateGroup[];
    }>;

export type BuildSemanticDiffScheduleImpactInput = Readonly<{
  result: SemanticDiffResult;
  before: AjsDocument;
  after: AjsDocument;
  scheduleEvaluation: SemanticDiffScheduleEvaluation;
}>;

const compareOrdinal = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const compareNumbers = (left: number, right: number): number => left - right;

const utf8Length = (value: string): number =>
  new TextEncoder().encode(value).byteLength;

const lengthPrefix = (value: string): string => `${utf8Length(value)}:${value}`;

/** Encode every sidecar identity using length-prefixed UTF-8 components. */
export const encodeSemanticDiffScheduleImpactId = (
  ...components: readonly (string | number)[]
): string => {
  components.forEach((component) => {
    if (
      typeof component === "number" &&
      (!Number.isSafeInteger(component) || component < 0)
    ) {
      throw new RangeError(
        "Schedule-impact numeric identity components must be finite non-negative integers",
      );
    }
  });
  return components
    .map((component) => lengthPrefix(String(component)))
    .join("");
};

export const encodeScheduleImpactId = encodeSemanticDiffScheduleImpactId;

const deepFreeze = <T>(value: T): T => {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }
  Object.values(value as Record<string, unknown>).forEach((child) => {
    deepFreeze(child);
  });
  return Object.freeze(value);
};

const isRootJobnet = (unit: AjsUnit): boolean =>
  unit.unitType === "n" && unit.isRootJobnet === true;

const unitsById = (document: AjsDocument): Map<string, AjsUnit> => {
  const units = new Map<string, AjsUnit>();
  const visit = (children: readonly AjsUnit[]): void => {
    children.forEach((unit) => {
      units.set(unit.id, unit);
      visit(unit.children);
    });
  };
  visit(document.rootUnits);
  return units;
};

const unitsByPath = (document: AjsDocument): Map<string, AjsUnit> => {
  const units = new Map<string, AjsUnit>();
  const visit = (children: readonly AjsUnit[]): void => {
    children.forEach((unit) => {
      units.set(unit.absolutePath, unit);
      visit(unit.children);
    });
  };
  visit(document.rootUnits);
  return units;
};

const rootUnits = (document: AjsDocument, jobGroupPath?: string): AjsUnit[] => {
  const roots: AjsUnit[] = [];
  const visit = (children: readonly AjsUnit[]): void => {
    children.forEach((unit) => {
      if (
        isRootJobnet(unit) &&
        (!jobGroupPath || isWithinRoot(unit.absolutePath, jobGroupPath))
      ) {
        roots.push(unit);
      }
      visit(unit.children);
    });
  };
  visit(document.rootUnits);
  return roots.sort((left, right) =>
    compareOrdinal(left.absolutePath, right.absolutePath),
  );
};

const isWithinRoot = (path: string, rootPath: string): boolean =>
  path === rootPath || path.startsWith(`${rootPath}/`);

const owningRoot = (
  roots: readonly AjsUnit[],
  path: string,
): AjsUnit | undefined =>
  [...roots]
    .filter((root) => isWithinRoot(path, root.absolutePath))
    .sort(
      (left, right) =>
        right.absolutePath.length - left.absolutePath.length ||
        compareOrdinal(left.absolutePath, right.absolutePath),
    )[0];

const identityDecisionsByUnit = (
  decisions: readonly SemanticDiffIdentityDecision[],
): {
  before: Map<string, SemanticDiffIdentityDecision>;
  after: Map<string, SemanticDiffIdentityDecision>;
} => {
  const before = new Map<string, SemanticDiffIdentityDecision>();
  const after = new Map<string, SemanticDiffIdentityDecision>();
  decisions.forEach((decision) => {
    decision.before.forEach((unit) => before.set(unit.id, decision));
    decision.after.forEach((unit) => after.set(unit.id, decision));
  });
  return { before, after };
};

type SourceKeyRootContext = Pick<
  SemanticDiffScheduleImpactRoot,
  "id" | "scopeTransition" | "matchKind" | "identityDecisionId"
>;

type SourceKeyForRun = (
  root: SourceKeyRootContext,
  side: SemanticDiffSide,
  run: { unitId?: string; unitPath: string },
) => string;

const createSourceKeyForRun = (result: SemanticDiffResult): SourceKeyForRun => {
  const identity = identityDecisionsByUnit(result.identityDecisions);
  const identityByPath = {
    before: new Map<string, SemanticDiffIdentityDecision>(),
    after: new Map<string, SemanticDiffIdentityDecision>(),
  };
  result.identityDecisions.forEach((decision) => {
    decision.before.forEach((reference) =>
      identityByPath.before.set(reference.absolutePath, decision),
    );
    decision.after.forEach((reference) =>
      identityByPath.after.set(reference.absolutePath, decision),
    );
  });
  return (root, side, run) => {
    const decision =
      (run.unitId ? identity[side].get(run.unitId) : undefined) ??
      identityByPath[side].get(run.unitPath);
    const matchedIdentity =
      !root.scopeTransition &&
      decision &&
      (decision.status === "exact" ||
        decision.status === "fingerprint-confirmed");
    const matchedRootFallback =
      !root.scopeTransition &&
      !decision &&
      (root.matchKind === "exact" || root.matchKind === "fingerprint");
    if (matchedIdentity) {
      const sideReferences = decision[side];
      const sourceReference =
        sideReferences.find(
          (reference) =>
            reference.id === run.unitId ||
            reference.absolutePath === run.unitPath,
        ) ?? sideReferences[0];
      return encodeSemanticDiffScheduleImpactId(
        "matched-source",
        decision.id,
        decision.after[0]?.absolutePath ??
          decision.before[0]?.absolutePath ??
          sourceReference?.absolutePath ??
          run.unitPath,
      );
    }
    if (matchedRootFallback) {
      return encodeSemanticDiffScheduleImpactId(
        "matched-source",
        root.identityDecisionId ?? root.id,
        run.unitPath,
      );
    }
    return encodeSemanticDiffScheduleImpactId(
      "one-sided-source",
      side,
      run.unitId ?? run.unitPath,
      run.unitPath,
    );
  };
};

const identityMatchKind = (
  decision: SemanticDiffIdentityDecision,
): "exact" | "fingerprint" =>
  decision.status === "exact" ? "exact" : "fingerprint";

const candidateGroups = (
  decisions: readonly SemanticDiffIdentityDecision[],
  beforeUnits: ReadonlyMap<string, AjsUnit>,
  afterUnits: ReadonlyMap<string, AjsUnit>,
): SemanticDiffScheduleImpactCandidateGroup[] =>
  decisions
    .filter((decision) => decision.status === "candidate")
    .map((decision) => {
      const before = decision.before
        .map((reference) => beforeUnits.get(reference.id))
        .filter(
          (unit): unit is AjsUnit => unit !== undefined && isRootJobnet(unit),
        )
        .map((reference) => ({
          id: reference.id,
          unitId: reference.id,
          unitName: reference.name,
          unitPath: reference.absolutePath,
        }))
        .sort(
          (left, right) =>
            compareOrdinal(left.unitPath, right.unitPath) ||
            compareOrdinal(left.unitId, right.unitId) ||
            compareOrdinal(left.unitName, right.unitName),
        );
      const after = decision.after
        .map((reference) => afterUnits.get(reference.id))
        .filter(
          (unit): unit is AjsUnit => unit !== undefined && isRootJobnet(unit),
        )
        .map((reference) => ({
          id: reference.id,
          unitId: reference.id,
          unitName: reference.name,
          unitPath: reference.absolutePath,
        }))
        .sort(
          (left, right) =>
            compareOrdinal(left.unitPath, right.unitPath) ||
            compareOrdinal(left.unitId, right.unitId) ||
            compareOrdinal(left.unitName, right.unitName),
        );
      if (before.length === 0 && after.length === 0) return undefined;
      const canonicalPath = after[0]?.unitPath ?? before[0]!.unitPath;
      return {
        id: encodeSemanticDiffScheduleImpactId(
          "candidate-group",
          "pair",
          canonicalPath,
          "",
          "",
          "fingerprint",
          0,
        ),
        before,
        after,
      };
    })
    .filter((group) => group !== undefined)
    .sort((left, right) => compareOrdinal(left.id, right.id));

type IndexedRun = SemanticDiffScheduleRun & {
  unitId?: string;
  occurrenceOrdinal: number;
  sourceKey: string;
};

type ScheduleRun = SemanticDiffScheduleRun & { unitId?: string };

const indexedRuns = (
  root: SourceKeyRootContext,
  side: SemanticDiffSide,
  runs: readonly ScheduleRun[],
  sourceKeyForRun: SourceKeyForRun,
): IndexedRun[] => {
  const grouped = new Map<string, ScheduleRun[]>();
  [...runs]
    .sort(
      (left, right) =>
        compareOrdinal(left.date, right.date) ||
        compareNumbers(left.rule, right.rule) ||
        compareOrdinal(left.time, right.time) ||
        compareOrdinal(left.unitPath, right.unitPath) ||
        compareOrdinal(left.unitName, right.unitName),
    )
    .forEach((run) => {
      const key = encodeSemanticDiffScheduleImpactId(
        sourceKeyForRun(root, side, {
          unitId: run.unitId,
          unitPath: run.unitPath,
        }),
        run.date,
        run.rule,
      );
      grouped.set(key, [...(grouped.get(key) ?? []), run]);
    });
  return [...grouped.entries()]
    .sort(([left], [right]) => compareOrdinal(left, right))
    .flatMap(([sourceKey, values]) =>
      values.map((run, occurrenceOrdinal) => ({
        ...run,
        occurrenceOrdinal,
        sourceKey,
      })),
    );
};

const issueKind = (
  decision: Pick<SemanticDiffScheduleUnsupportedDecision, "reason" | "status">,
): SemanticDiffScheduleImpactIssueKind => {
  const carriesProjectionStatus =
    decision.reason === "calendar-selection" ||
    decision.reason === "closed-day-substitution";
  if (carriesProjectionStatus && decision.status === "missing-context") {
    return "missing-context";
  }
  if (carriesProjectionStatus && decision.status === "invalid") {
    return "invalid";
  }
  const reasonCode = decision.reason;
  if (
    reasonCode === "invalid-start-time" ||
    reasonCode === "invalid-calendar-day" ||
    reasonCode === "unsupported-schedule-date"
  ) {
    return "invalid";
  }
  if (
    reasonCode === "missing-start-time" ||
    reasonCode === "unpaired-start-time"
  ) {
    return "uncalculated";
  }
  return "unsupported";
};

const issueKindOrder: Record<SemanticDiffScheduleImpactIssueKind, number> = {
  invalid: 0,
  "missing-context": 1,
  unsupported: 2,
  uncalculated: 3,
};

const cloneDetail = (detail: SemanticDiffDetail): SemanticDiffDetail => ({
  ...detail,
  relationPair: detail.relationPair
    ? {
        canonicalPair: { ...detail.relationPair.canonicalPair },
        before: detail.relationPair.before
          ? { ...detail.relationPair.before }
          : null,
        after: detail.relationPair.after
          ? { ...detail.relationPair.after }
          : null,
      }
    : null,
  period: detail.period ? { ...detail.period } : null,
  beforeValues: [...detail.beforeValues],
  afterValues: [...detail.afterValues],
  rawValues: [...detail.rawValues],
  removedSources: [...detail.removedSources],
});

const unsupportedReason = (
  reason: string,
): reason is SemanticDiffUnsupportedReason => reason.length > 0;

const detailForUnsupported = (
  result: SemanticDiffResult,
  decision: SemanticDiffScheduleUnsupportedDecision,
): SemanticDiffDetail => {
  const item = result.unsupportedItems.find(
    (candidateItem) =>
      candidateItem.side === decision.side &&
      candidateItem.reasonCode === decision.reason &&
      candidateItem.target?.kind === "jobnet" &&
      candidateItem.target.unit.id === decision.unit.id &&
      candidateItem.detail.parameterKey === decision.parameter.key &&
      candidateItem.detail.rawValues.includes(decision.parameter.value),
  );
  if (item) return item.detail;
  return {
    unitPath: decision.unit.absolutePath,
    parameterKey: decision.parameter.key,
    relationPair: null,
    scheduleRule: decision.scheduleRule ?? null,
    period: result.scheduleComparison?.period ?? null,
    beforeValues: [],
    afterValues: [],
    rawValues: [decision.parameter.value],
    removedSources: [],
  };
};

const detailOrderingKey = (detail: SemanticDiffDetail): string =>
  JSON.stringify({
    parameterKey: detail.parameterKey,
    rawValues: detail.rawValues,
    beforeValues: detail.beforeValues,
    afterValues: detail.afterValues,
    removedSources: detail.removedSources,
  });

const issueTargetKind = (
  decision: SemanticDiffScheduleUnsupportedDecision,
): string =>
  ["n", "rn", "rm", "rr"].includes(decision.unit.unitType) ? "jobnet" : "unit";

const issueId = (input: {
  side: SemanticDiffSide | null;
  rootId: string | null;
  kind: SemanticDiffScheduleImpactIssueKind;
  reasonCode: string;
  targetKind: string;
  targetId: string | null;
  targetPath: string | null;
  parameterKey: string | null;
  occurrenceOrdinal: number;
}): string =>
  encodeSemanticDiffScheduleImpactId(
    "issue",
    input.side ?? "none",
    input.rootId ?? "none",
    "",
    "",
    encodeSemanticDiffScheduleImpactId(
      input.kind,
      input.reasonCode,
      input.targetKind,
      input.targetId ?? "none",
      input.targetPath ?? "none",
      input.parameterKey ?? "null",
    ),
    input.occurrenceOrdinal,
  );

const runWithId = (input: {
  run: IndexedRun;
  side: SemanticDiffSide;
  rootId: string;
  unitId: string;
  sourceChangeRef: Readonly<{ id: string; occurrenceOrdinal: number }> | null;
}): SemanticDiffScheduleImpactRun => ({
  id: encodeSemanticDiffScheduleImpactId(
    "run",
    input.side,
    input.rootId,
    input.run.sourceKey,
    input.run.date,
    input.run.time,
    input.run.rule,
    input.run.occurrenceOrdinal,
  ),
  side: input.side,
  unitId: input.unitId,
  unitPath: input.run.unitPath,
  unitName: input.run.unitName,
  rule: input.run.rule,
  date: input.run.date,
  time: input.run.time,
  occurrenceOrdinal: input.run.occurrenceOrdinal,
  sourceChangeRef: input.sourceChangeRef,
});

const scheduleRunsBySide = (
  evaluation: Extract<SemanticDiffScheduleEvaluation, { kind: "evaluated" }>,
  sourceUnitsByPath: {
    before: ReadonlyMap<string, AjsUnit>;
    after: ReadonlyMap<string, AjsUnit>;
  },
): {
  before: ScheduleRun[];
  after: ScheduleRun[];
} => {
  const before: ScheduleRun[] = [];
  const after: ScheduleRun[] = [];
  const pairedBeforePaths = new Set<string>();
  const pairedAfterPaths = new Set<string>();
  evaluation.pairEvaluations.forEach((pair) => {
    pairedBeforePaths.add(pair.before.unit.absolutePath);
    pairedBeforePaths.add(pair.after.unit.absolutePath);
    pairedAfterPaths.add(pair.after.unit.absolutePath);
    pairedAfterPaths.add(pair.before.unit.absolutePath);
    before.push(
      ...pair.before.runs.map((run) => ({
        ...run,
        unitId: pair.before.unit.id,
      })),
    );
    after.push(
      ...pair.after.runs.map((run) => ({ ...run, unitId: pair.after.unit.id })),
    );
  });
  evaluation.runDecisions.forEach((decision) => {
    if (
      decision.kind === "removed" &&
      !pairedBeforePaths.has(decision.before.unitPath)
    ) {
      before.push({
        ...decision.before,
        unitId: sourceUnitsByPath.before.get(decision.before.unitPath)?.id,
      });
    }
    if (
      decision.kind === "added" &&
      !pairedAfterPaths.has(decision.after.unitPath)
    ) {
      after.push({
        ...decision.after,
        unitId: sourceUnitsByPath.after.get(decision.after.unitPath)?.id,
      });
    }
  });
  return { before, after };
};

const scheduleIssues = (
  result: SemanticDiffResult,
  evaluation: Extract<SemanticDiffScheduleEvaluation, { kind: "evaluated" }>,
  rootsBySide: { before: AjsUnit[]; after: AjsUnit[] },
  rootIdsByPath: { before: Map<string, string>; after: Map<string, string> },
  excludedUnitIds: ReadonlySet<string>,
  excludedRootPaths: ReadonlySet<string>,
): {
  before: SemanticDiffScheduleImpactIssue[];
  after: SemanticDiffScheduleImpactIssue[];
} => {
  const bySide: {
    before: SemanticDiffScheduleImpactIssue[];
    after: SemanticDiffScheduleImpactIssue[];
  } = {
    before: [],
    after: [],
  };
  const counts = new Map<string, number>();
  [...evaluation.unsupportedDecisions]
    .sort((left, right) => {
      const leftRoot = owningRoot(
        rootsBySide[left.side],
        left.unit.absolutePath,
      );
      const rightRoot = owningRoot(
        rootsBySide[right.side],
        right.unit.absolutePath,
      );
      return (
        compareOrdinal(
          leftRoot?.absolutePath ?? "",
          rightRoot?.absolutePath ?? "",
        ) ||
        compareOrdinal(left.side, right.side) ||
        compareNumbers(
          issueKindOrder[issueKind(left)],
          issueKindOrder[issueKind(right)],
        ) ||
        compareOrdinal(left.reason, right.reason) ||
        compareOrdinal(issueTargetKind(left), issueTargetKind(right)) ||
        compareOrdinal(left.unit.id, right.unit.id) ||
        compareOrdinal(left.unit.absolutePath, right.unit.absolutePath) ||
        compareOrdinal(left.parameter.key, right.parameter.key) ||
        compareOrdinal(
          detailOrderingKey(detailForUnsupported(result, left)),
          detailOrderingKey(detailForUnsupported(result, right)),
        ) ||
        compareNumbers(left.scheduleRule ?? -1, right.scheduleRule ?? -1) ||
        compareOrdinal(left.parameter.value, right.parameter.value)
      );
    })
    .forEach((decision) => {
      if (
        excludedUnitIds.has(decision.unit.id) ||
        [...excludedRootPaths].some((path) =>
          isWithinRoot(decision.unit.absolutePath, path),
        )
      ) {
        return;
      }
      const root = owningRoot(
        rootsBySide[decision.side],
        decision.unit.absolutePath,
      );
      if (!root) return;
      const rootId =
        rootIdsByPath[decision.side].get(root.absolutePath) ?? null;
      const detail = detailForUnsupported(result, decision);
      const targetKind = issueTargetKind(decision);
      const targetId = decision.unit.id;
      const targetPath = decision.unit.absolutePath;
      const parameterKey = decision.parameter.key;
      const countKey = [
        decision.side,
        rootId,
        issueKind(decision),
        decision.reason,
        targetKind,
        targetId,
        targetPath,
        parameterKey,
      ].join("\u0000");
      const occurrenceOrdinal = counts.get(countKey) ?? 0;
      counts.set(countKey, occurrenceOrdinal + 1);
      const issue: SemanticDiffScheduleImpactIssue = {
        id: issueId({
          side: decision.side,
          rootId,
          kind: issueKind(decision),
          reasonCode: decision.reason,
          targetKind,
          targetId,
          targetPath,
          parameterKey,
          occurrenceOrdinal,
        }),
        occurrenceOrdinal,
        kind: issueKind(decision),
        side: decision.side,
        rootId,
        reasonCode: unsupportedReason(decision.reason)
          ? decision.reason
          : "uncalculated",
        targetKind,
        targetId,
        targetPath,
        parameterKey,
        detail: cloneDetail(detail),
      };
      bySide[decision.side].push(issue);
    });
  return {
    before: bySide.before.sort((left, right) =>
      compareOrdinal(left.id, right.id),
    ),
    after: bySide.after.sort((left, right) =>
      compareOrdinal(left.id, right.id),
    ),
  };
};

const outcomeFor = (input: {
  runs: readonly SemanticDiffScheduleRun[];
  hasIssues: boolean;
  explicitNoRuns: boolean;
}): SemanticDiffScheduleImpactRootOutcome => {
  if (input.runs.length > 0)
    return input.hasIssues ? "partial" : "supported-runs";
  if (input.explicitNoRuns && !input.hasIssues) {
    return "valid-no-runs";
  }
  return "uncalculated";
};

const sideRoot = (input: {
  unit: AjsUnit;
  side: SemanticDiffSide;
  rootId: string;
  rootContext: SourceKeyRootContext;
  runs: readonly ScheduleRun[];
  issues: readonly SemanticDiffScheduleImpactIssue[];
  explicitNoRuns: boolean;
  unitsByPath: ReadonlyMap<string, AjsUnit>;
  sourceKeyForRun: SourceKeyForRun;
}): SemanticDiffScheduleImpactRootSide => {
  const indexed = indexedRuns(
    {
      id: input.rootId,
      matchKind: input.rootContext.matchKind,
      identityDecisionId: input.rootContext.identityDecisionId,
      ...input.rootContext,
    },
    input.side,
    input.runs,
    input.sourceKeyForRun,
  );
  const outcome = outcomeFor({
    runs: input.runs,
    hasIssues: input.issues.length > 0,
    explicitNoRuns: input.explicitNoRuns,
  });
  const runs = indexed.map((run) => {
    return runWithId({
      run,
      side: input.side,
      rootId: input.rootId,
      unitId:
        run.unitId ?? input.unitsByPath.get(run.unitPath)?.id ?? input.unit.id,
      sourceChangeRef: null,
    });
  });
  return {
    side: input.side,
    unitId: input.unit.id,
    unitPath: input.unit.absolutePath,
    unitName: input.unit.name,
    outcome,
    runs,
    issueIds: input.issues.map((issue) => issue.id),
  };
};

const rootIdFor = (
  side: "pair" | SemanticDiffSide,
  canonicalPath: string,
  matchKind: SemanticDiffScheduleImpactRootMatchKind,
): string =>
  encodeSemanticDiffScheduleImpactId(
    "root",
    side,
    canonicalPath,
    "",
    "",
    matchKind,
    0,
  );

const makeRoot = (input: {
  before: AjsUnit | null;
  after: AjsUnit | null;
  matchKind: SemanticDiffScheduleImpactRootMatchKind;
  identityDecisionId: string | null;
  rootRuns: {
    before: readonly ScheduleRun[];
    after: readonly ScheduleRun[];
  };
  rootIssues: {
    before: Map<string, SemanticDiffScheduleImpactIssue[]>;
    after: Map<string, SemanticDiffScheduleImpactIssue[]>;
  };
  noRuns: { before: Set<string>; after: Set<string> };
  unitsByPath: {
    before: ReadonlyMap<string, AjsUnit>;
    after: ReadonlyMap<string, AjsUnit>;
  };
  sourceKeyForRun: SourceKeyForRun;
}): SemanticDiffScheduleImpactRoot => {
  const beforeIsRoot = input.before !== null && isRootJobnet(input.before);
  const afterIsRoot = input.after !== null && isRootJobnet(input.after);
  const canonicalPath = input.after?.absolutePath ?? input.before!.absolutePath;
  const side =
    beforeIsRoot && afterIsRoot ? "pair" : beforeIsRoot ? "before" : "after";
  const id = rootIdFor(side, canonicalPath, input.matchKind);
  const scopeTransition =
    input.matchKind === "removed-root-scope" &&
    input.before &&
    input.after &&
    beforeIsRoot &&
    !afterIsRoot
      ? {
          kind: "removed-root-scope" as const,
          counterpartPath: input.after.absolutePath,
          identityDecisionId: input.identityDecisionId!,
        }
      : input.matchKind === "added-root-scope" &&
          input.before &&
          input.after &&
          !beforeIsRoot &&
          afterIsRoot
        ? {
            kind: "added-root-scope" as const,
            counterpartPath: input.before.absolutePath,
            identityDecisionId: input.identityDecisionId!,
          }
        : null;
  const beforeIssues = input.before
    ? (input.rootIssues.before.get(input.before.absolutePath) ?? [])
    : [];
  const afterIssues = input.after
    ? (input.rootIssues.after.get(input.after.absolutePath) ?? [])
    : [];
  const runsForRoot = (
    side: SemanticDiffSide,
    root: AjsUnit,
  ): readonly ScheduleRun[] =>
    input.rootRuns[side].filter((run) =>
      isWithinRoot(run.unitPath, root.absolutePath),
    );
  const before = beforeIsRoot
    ? sideRoot({
        unit: input.before,
        side: "before",
        rootId: id,
        rootContext: {
          id,
          matchKind: input.matchKind,
          identityDecisionId: input.identityDecisionId,
          scopeTransition,
        },
        runs: runsForRoot("before", input.before),
        issues: beforeIssues,
        explicitNoRuns: input.noRuns.before.has(input.before.id),
        unitsByPath: input.unitsByPath.before,
        sourceKeyForRun: input.sourceKeyForRun,
      })
    : null;
  const after = afterIsRoot
    ? sideRoot({
        unit: input.after,
        side: "after",
        rootId: id,
        rootContext: {
          id,
          matchKind: input.matchKind,
          identityDecisionId: input.identityDecisionId,
          scopeTransition,
        },
        runs: runsForRoot("after", input.after),
        issues: afterIssues,
        explicitNoRuns: input.noRuns.after.has(input.after.id),
        unitsByPath: input.unitsByPath.after,
        sourceKeyForRun: input.sourceKeyForRun,
      })
    : null;
  return {
    id,
    matchKind: input.matchKind,
    canonicalPath,
    identityDecisionId: input.identityDecisionId,
    before,
    after,
    scopeTransition,
  };
};

const rootIssueMaps = (
  issues: {
    before: SemanticDiffScheduleImpactIssue[];
    after: SemanticDiffScheduleImpactIssue[];
  },
  roots: {
    before: readonly AjsUnit[];
    after: readonly AjsUnit[];
  },
): {
  before: Map<string, SemanticDiffScheduleImpactIssue[]>;
  after: Map<string, SemanticDiffScheduleImpactIssue[]>;
} => {
  const before = new Map<string, SemanticDiffScheduleImpactIssue[]>();
  const after = new Map<string, SemanticDiffScheduleImpactIssue[]>();
  issues.before.forEach((issue) => {
    const root = issue.targetPath
      ? owningRoot(roots.before, issue.targetPath)
      : undefined;
    if (root)
      before.set(root.absolutePath, [
        ...(before.get(root.absolutePath) ?? []),
        issue,
      ]);
  });
  issues.after.forEach((issue) => {
    const root = issue.targetPath
      ? owningRoot(roots.after, issue.targetPath)
      : undefined;
    if (root)
      after.set(root.absolutePath, [
        ...(after.get(root.absolutePath) ?? []),
        issue,
      ]);
  });
  return { before, after };
};

const rootIdMaps = (
  roots: readonly SemanticDiffScheduleImpactRoot[],
): { before: Map<string, string>; after: Map<string, string> } => {
  const before = new Map<string, string>();
  const after = new Map<string, string>();
  roots.forEach((root) => {
    if (root.before) before.set(root.before.unitPath, root.id);
    if (root.after) after.set(root.after.unitPath, root.id);
  });
  return { before, after };
};

const compareIssues = (
  left: SemanticDiffScheduleImpactIssue,
  right: SemanticDiffScheduleImpactIssue,
): number =>
  compareOrdinal(left.rootId ?? "", right.rootId ?? "") ||
  compareOrdinal(left.side ?? "", right.side ?? "") ||
  compareNumbers(issueKindOrder[left.kind], issueKindOrder[right.kind]) ||
  compareOrdinal(left.reasonCode, right.reasonCode) ||
  compareOrdinal(left.targetKind, right.targetKind) ||
  compareOrdinal(left.targetId ?? "", right.targetId ?? "") ||
  compareOrdinal(left.targetPath ?? "", right.targetPath ?? "") ||
  compareOrdinal(left.parameterKey ?? "", right.parameterKey ?? "") ||
  compareOrdinal(
    detailOrderingKey(left.detail),
    detailOrderingKey(right.detail),
  ) ||
  compareNumbers(left.occurrenceOrdinal, right.occurrenceOrdinal) ||
  compareOrdinal(left.id, right.id);

const createRootStatuses = (
  side: SemanticDiffSide,
  roots: readonly SemanticDiffScheduleImpactRootSide[],
  rootIds: Map<string, string>,
): SemanticDiffScheduleImpactRootStatus[] =>
  roots.map((root) => ({
    rootId: rootIds.get(root.unitPath)!,
    side,
    outcome: root.outcome,
    issueIds: root.issueIds,
  }));

const matchRuns = (input: {
  root: SemanticDiffScheduleImpactRoot;
  before: readonly SemanticDiffScheduleImpactRun[];
  after: readonly SemanticDiffScheduleImpactRun[];
  sourceKeyForRun: SourceKeyForRun;
}): SemanticDiffScheduleImpactTimelineItem[] => {
  const beforeGroups = new Map<string, SemanticDiffScheduleImpactRun[]>();
  const afterGroups = new Map<string, SemanticDiffScheduleImpactRun[]>();
  input.before.forEach((run) => {
    const key = encodeSemanticDiffScheduleImpactId(
      input.sourceKeyForRun(input.root, "before", run),
      run.date,
      run.rule,
    );
    beforeGroups.set(key, [...(beforeGroups.get(key) ?? []), run]);
  });
  input.after.forEach((run) => {
    const key = encodeSemanticDiffScheduleImpactId(
      input.sourceKeyForRun(input.root, "after", run),
      run.date,
      run.rule,
    );
    afterGroups.set(key, [...(afterGroups.get(key) ?? []), run]);
  });
  const keys = [
    ...new Set([...beforeGroups.keys(), ...afterGroups.keys()]),
  ].sort(compareOrdinal);
  return keys.flatMap((key) => {
    const beforeRuns = [...(beforeGroups.get(key) ?? [])].sort(
      (left, right) =>
        compareOrdinal(left.time, right.time) ||
        compareOrdinal(left.unitPath, right.unitPath) ||
        compareOrdinal(left.unitId, right.unitId) ||
        compareOrdinal(left.unitName, right.unitName),
    );
    const afterRuns = [...(afterGroups.get(key) ?? [])].sort(
      (left, right) =>
        compareOrdinal(left.time, right.time) ||
        compareOrdinal(left.unitPath, right.unitPath) ||
        compareOrdinal(left.unitId, right.unitId) ||
        compareOrdinal(left.unitName, right.unitName),
    );
    const max = Math.max(beforeRuns.length, afterRuns.length);
    return Array.from({ length: max }, (_, ordinal) => {
      const before = beforeRuns[ordinal] ?? null;
      const after = afterRuns[ordinal] ?? null;
      const state: SemanticDiffScheduleImpactRunState =
        before && after
          ? before.time === after.time
            ? "unchanged"
            : "changed-time"
          : before
            ? "removed"
            : "added";
      const side =
        state === "changed-time" || state === "unchanged"
          ? "pair"
          : before
            ? "before"
            : "after";
      const date = after?.date ?? before!.date;
      const time =
        state === "changed-time"
          ? encodeSemanticDiffScheduleImpactId(before!.time, after!.time)
          : (after?.time ?? before!.time);
      const rule = after?.rule ?? before!.rule;
      const sourceKey = input.sourceKeyForRun(
        input.root,
        before ? "before" : "after",
        before ?? after!,
      );
      const sourceChangeRef =
        before?.sourceChangeRef ?? after?.sourceChangeRef ?? null;
      return {
        id: encodeSemanticDiffScheduleImpactId(
          "timeline",
          side,
          input.root.id,
          sourceKey,
          date,
          time,
          rule,
          ordinal,
        ),
        state,
        side,
        rootId: input.root.id,
        date,
        time,
        rule,
        occurrenceOrdinal: ordinal,
        before,
        after,
        sourceChangeRef,
      };
    });
  });
};

const timeline = (
  roots: readonly SemanticDiffScheduleImpactRoot[],
  sourceKeyForRun: SourceKeyForRun,
): SemanticDiffScheduleImpactTimelineItem[] =>
  roots
    .flatMap((root) =>
      matchRuns({
        root,
        before: root.before?.runs ?? [],
        after: root.after?.runs ?? [],
        sourceKeyForRun,
      }),
    )
    .sort(
      (left, right) =>
        compareOrdinal(left.rootId, right.rootId) ||
        compareOrdinal(
          left.before?.id ?? left.after?.id ?? "",
          right.before?.id ?? right.after?.id ?? "",
        ) ||
        compareOrdinal(left.date, right.date) ||
        compareNumbers(left.rule, right.rule) ||
        compareOrdinal(left.time, right.time) ||
        compareNumbers(left.occurrenceOrdinal, right.occurrenceOrdinal),
    );

const sourceChangeRefForTimelineItem = (
  result: SemanticDiffResult,
  item: SemanticDiffScheduleImpactTimelineItem,
  usedChangeIndices: Set<number>,
): Readonly<{ id: string; occurrenceOrdinal: number }> | null => {
  if (item.state === "unchanged") {
    return null;
  }
  const changes = result.scheduleComparison?.runChanges ?? [];
  const beforeTime = item.before?.time ?? "";
  const afterTime = item.after?.time ?? "";
  const source = item.after ?? item.before;
  if (!source) return null;
  const candidateIndex = changes.findIndex((change, index) => {
    if (usedChangeIndices.has(index)) return false;
    if (
      change.unitPath !== source.unitPath ||
      change.date !== item.date ||
      change.kind !== item.state
    ) {
      return false;
    }
    if (change.kind === "changed-time") {
      return (
        change.before?.rule === item.rule &&
        change.after?.rule === item.rule &&
        change.before?.time === beforeTime &&
        change.after?.time === afterTime
      );
    }
    const changedRun = change.kind === "added" ? change.after : change.before;
    const expectedTime = change.kind === "added" ? afterTime : beforeTime;
    return changedRun?.rule === item.rule && changedRun.time === expectedTime;
  });
  if (candidateIndex < 0) return null;
  usedChangeIndices.add(candidateIndex);
  const candidate = changes[candidateIndex];
  return {
    id: candidate.id,
    occurrenceOrdinal: changes
      .slice(0, candidateIndex)
      .filter((change) => change.id === candidate.id).length,
  };
};

const attachSourceChangeReferences = (
  result: SemanticDiffResult,
  roots: readonly SemanticDiffScheduleImpactRoot[],
  sourceKeyForRun: SourceKeyForRun,
): {
  roots: SemanticDiffScheduleImpactRoot[];
  timelineItems: SemanticDiffScheduleImpactTimelineItem[];
} => {
  const usedChangeIndices = new Set<number>();
  const initialItems = timeline(roots, sourceKeyForRun).map((item) => ({
    ...item,
    sourceChangeRef: sourceChangeRefForTimelineItem(
      result,
      item,
      usedChangeIndices,
    ),
  }));
  const referencesByRunId = new Map<
    string,
    Readonly<{ id: string; occurrenceOrdinal: number }>
  >();
  initialItems.forEach((item) => {
    if (!item.sourceChangeRef) return;
    [item.before, item.after].forEach((run) => {
      if (run) referencesByRunId.set(run.id, item.sourceChangeRef!);
    });
  });
  const cloneRun = (
    run: SemanticDiffScheduleImpactRun,
  ): SemanticDiffScheduleImpactRun => ({
    ...run,
    sourceChangeRef: referencesByRunId.get(run.id) ?? null,
  });
  const withRootReferences = roots.map((root) => ({
    ...root,
    before: root.before
      ? { ...root.before, runs: root.before.runs.map(cloneRun) }
      : null,
    after: root.after
      ? { ...root.after, runs: root.after.runs.map(cloneRun) }
      : null,
  }));
  const withTimelineReferences = initialItems.map((item) => ({
    ...item,
    before: item.before ? cloneRun(item.before) : null,
    after: item.after ? cloneRun(item.after) : null,
  }));
  return { roots: withRootReferences, timelineItems: withTimelineReferences };
};

const sourceChangeReferenceKey = (reference: {
  id: string;
  occurrenceOrdinal: number;
}): string => `${reference.id}\u0000${reference.occurrenceOrdinal}`;

const validateSourceChangeReferences = (
  result: SemanticDiffResult,
  items: readonly SemanticDiffScheduleImpactTimelineItem[],
): void => {
  const changes = result.scheduleComparison?.runChanges ?? [];
  const byId = new Map<string, typeof changes>();
  changes.forEach((change) =>
    byId.set(change.id, [...(byId.get(change.id) ?? []), change]),
  );
  const owners = new Map<string, string>();
  const validate = (
    reference: Readonly<{ id: string; occurrenceOrdinal: number }>,
  ): void => {
    const candidates = byId.get(reference.id) ?? [];
    if (!Number.isSafeInteger(reference.occurrenceOrdinal)) {
      throw new Error("Invalid schedule-impact source-change ordinal");
    }
    if (!candidates[reference.occurrenceOrdinal]) {
      throw new Error("Unknown schedule-impact source-change reference");
    }
  };
  items.forEach((item) => {
    const effectReference = item.sourceChangeRef;
    const runs = [item.before, item.after].filter(
      (run): run is SemanticDiffScheduleImpactRun => run !== null,
    );
    if (item.state === "unchanged") {
      if (effectReference !== null || runs.some((run) => run.sourceChangeRef)) {
        throw new Error(
          "Unchanged schedule-impact runs cannot reference changes",
        );
      }
      return;
    }
    if (!effectReference) {
      throw new Error(
        "Changed schedule-impact effects require a change reference",
      );
    }
    validate(effectReference);
    const effectKey = sourceChangeReferenceKey(effectReference);
    const owner = owners.get(effectKey);
    if (owner && owner !== item.id) {
      throw new Error(
        "A schedule-change reference crosses schedule-impact effects",
      );
    }
    owners.set(effectKey, item.id);
    runs.forEach((run) => {
      if (
        !run.sourceChangeRef ||
        sourceChangeReferenceKey(run.sourceChangeRef) !== effectKey
      ) {
        throw new Error("Schedule-impact run and timeline references differ");
      }
    });
  });
};

const createRoots = (input: {
  result: SemanticDiffResult;
  before: AjsDocument;
  after: AjsDocument;
  evaluation: Extract<SemanticDiffScheduleEvaluation, { kind: "evaluated" }>;
}): {
  roots: SemanticDiffScheduleImpactRoot[];
  issues: {
    before: SemanticDiffScheduleImpactIssue[];
    after: SemanticDiffScheduleImpactIssue[];
  };
  candidates: SemanticDiffScheduleImpactCandidateGroup[];
} => {
  const beforeRoots = rootUnits(
    input.before,
    input.result.inputs.before.jobGroupPath,
  );
  const afterRoots = rootUnits(
    input.after,
    input.result.inputs.after.jobGroupPath,
  );
  const beforeById = unitsById(input.before);
  const afterById = unitsById(input.after);
  const identity = identityDecisionsByUnit(input.result.identityDecisions);
  const sourceKeyForRun = createSourceKeyForRun(input.result);
  const sourceUnitsByPath = {
    before: unitsByPath(input.before),
    after: unitsByPath(input.after),
  };
  const runs = scheduleRunsBySide(input.evaluation, sourceUnitsByPath);
  const noRuns = {
    before: new Set<string>(),
    after: new Set<string>(),
  };
  input.evaluation.zeroRunCandidatesBySide.before.forEach((unit) =>
    noRuns.before.add(unit.id),
  );
  input.evaluation.zeroRunCandidatesBySide.after.forEach((unit) =>
    noRuns.after.add(unit.id),
  );
  const candidateUnitIds = new Set(
    input.result.identityDecisions
      .filter((decision) => decision.status === "candidate")
      .flatMap((decision) => [
        ...decision.before.map((reference) => reference.id),
        ...decision.after.map((reference) => reference.id),
      ]),
  );
  const candidateRootPaths = new Set(
    input.result.identityDecisions
      .filter((decision) => decision.status === "candidate")
      .flatMap((decision) => [
        ...decision.before
          .map((reference) => beforeById.get(reference.id))
          .filter(
            (unit): unit is AjsUnit => unit !== undefined && isRootJobnet(unit),
          )
          .map((unit) => unit.absolutePath),
        ...decision.after
          .map((reference) => afterById.get(reference.id))
          .filter(
            (unit): unit is AjsUnit => unit !== undefined && isRootJobnet(unit),
          )
          .map((unit) => unit.absolutePath),
      ]),
  );
  const issues = scheduleIssues(
    input.result,
    input.evaluation,
    { before: beforeRoots, after: afterRoots },
    { before: new Map(), after: new Map() },
    candidateUnitIds,
    candidateRootPaths,
  );
  const roots: SemanticDiffScheduleImpactRoot[] = [];
  const makeInput = (
    before: AjsUnit | null,
    after: AjsUnit | null,
    matchKind: SemanticDiffScheduleImpactRootMatchKind,
    decisionId: string | null,
  ): SemanticDiffScheduleImpactRoot =>
    makeRoot({
      before,
      after,
      matchKind,
      identityDecisionId: decisionId,
      rootRuns: runs,
      rootIssues: rootIssueMaps(issues, {
        before: beforeRoots,
        after: afterRoots,
      }),
      noRuns,
      unitsByPath: sourceUnitsByPath,
      sourceKeyForRun,
    });
  input.result.identityDecisions.forEach((decision) => {
    if (!["exact", "fingerprint-confirmed"].includes(decision.status)) return;
    const before = decision.before
      .map((unit) => beforeById.get(unit.id))
      .find(
        (unit): unit is AjsUnit => unit !== undefined && isRootJobnet(unit),
      );
    const after = decision.after
      .map((unit) => afterById.get(unit.id))
      .find(
        (unit): unit is AjsUnit => unit !== undefined && isRootJobnet(unit),
      );
    const beforeAny = decision.before
      .map((unit) => beforeById.get(unit.id))
      .find((unit): unit is AjsUnit => unit !== undefined);
    const afterAny = decision.after
      .map((unit) => afterById.get(unit.id))
      .find((unit): unit is AjsUnit => unit !== undefined);
    if (before && after) {
      roots.push(
        makeInput(before, after, identityMatchKind(decision), decision.id),
      );
    } else if (before && afterAny) {
      roots.push(
        makeInput(before, afterAny, "removed-root-scope", decision.id),
      );
    } else if (beforeAny && after) {
      roots.push(makeInput(beforeAny, after, "added-root-scope", decision.id));
    }
  });
  beforeRoots.forEach((before) => {
    if (roots.some((root) => root.before?.unitId === before.id)) return;
    const decision = identity.before.get(before.id);
    if (decision?.status === "candidate") return;
    roots.push(makeInput(before, null, "removed", decision?.id ?? null));
  });
  afterRoots.forEach((after) => {
    if (roots.some((root) => root.after?.unitId === after.id)) return;
    const decision = identity.after.get(after.id);
    if (decision?.status === "candidate") return;
    roots.push(makeInput(null, after, "added", decision?.id ?? null));
  });
  const sortedRoots = roots.sort(
    (left, right) =>
      compareOrdinal(left.canonicalPath, right.canonicalPath) ||
      compareOrdinal(left.id, right.id),
  );
  const ids = rootIdMaps(sortedRoots);
  const rootIdForPath = (
    side: SemanticDiffSide,
    path: string | null,
  ): string | null => {
    if (!path) return null;
    const root = owningRoot(side === "before" ? beforeRoots : afterRoots, path);
    return root ? (ids[side].get(root.absolutePath) ?? null) : null;
  };
  const rekeyIssue = (
    issue: SemanticDiffScheduleImpactIssue,
    rootId: string | null,
  ): SemanticDiffScheduleImpactIssue => ({
    ...issue,
    rootId,
    id: issueId({
      side: issue.side,
      rootId,
      kind: issue.kind,
      reasonCode: issue.reasonCode,
      targetKind: issue.targetKind,
      targetId: issue.targetId,
      targetPath: issue.targetPath,
      parameterKey: issue.parameterKey,
      occurrenceOrdinal: issue.occurrenceOrdinal,
    }),
  });
  const remappedIssues = {
    before: issues.before
      .map((issue) =>
        rekeyIssue(issue, rootIdForPath("before", issue.targetPath)),
      )
      .sort(compareIssues),
    after: issues.after
      .map((issue) =>
        rekeyIssue(issue, rootIdForPath("after", issue.targetPath)),
      )
      .sort(compareIssues),
  };
  const finalRoots = sortedRoots.map((root) => {
    const before = root.before
      ? {
          ...root.before,
          issueIds: remappedIssues.before
            .filter((issue) => issue.rootId === root.id)
            .map((issue) => issue.id),
        }
      : null;
    const after = root.after
      ? {
          ...root.after,
          issueIds: remappedIssues.after
            .filter((issue) => issue.rootId === root.id)
            .map((issue) => issue.id),
        }
      : null;
    return { ...root, before, after };
  });
  return {
    roots: finalRoots,
    issues: remappedIssues,
    candidates: candidateGroups(
      input.result.identityDecisions,
      beforeById,
      afterById,
    ),
  };
};

const evaluatedFacts = (
  input: BuildSemanticDiffScheduleImpactInput,
  evaluation: Extract<SemanticDiffScheduleEvaluation, { kind: "evaluated" }>,
): Extract<ScheduleProjectionFacts, { kind: "evaluated" }> => {
  const built = createRoots({
    result: input.result,
    before: input.before,
    after: input.after,
    evaluation,
  });
  const rootIds = rootIdMaps(built.roots);
  const before = built.roots.flatMap((root) =>
    root.before ? [root.before] : [],
  );
  const after = built.roots.flatMap((root) => (root.after ? [root.after] : []));
  return {
    kind: "evaluated",
    period: { ...evaluation.period },
    before: {
      rootProjections: before,
      statuses: createRootStatuses("before", before, rootIds.before),
      issues: built.issues.before,
    },
    after: {
      rootProjections: after,
      statuses: createRootStatuses("after", after, rootIds.after),
      issues: built.issues.after,
    },
    correspondence: built.roots,
    candidateGroups: built.candidates,
  };
};

const invalidFacts = (
  result: SemanticDiffResult,
  period: SemanticDiffComparisonPeriod,
): Extract<ScheduleProjectionFacts, { kind: "invalid" }> => ({
  kind: "invalid",
  period: { ...period },
  issues: result.unsupportedItems
    .filter((item) => item.reasonCode === "invalid-schedule-comparison-period")
    .map((item, occurrenceOrdinal) => {
      const targetKind = item.target?.kind ?? "schedule";
      const targetId =
        item.target?.kind === "jobnet" || item.target?.kind === "unit"
          ? item.target.unit.id
          : null;
      const targetPath = item.detail.unitPath;
      const parameterKey = item.detail.parameterKey;
      return {
        id: issueId({
          side: null,
          rootId: null,
          kind: "invalid",
          reasonCode: item.reasonCode,
          targetKind,
          targetId,
          targetPath,
          parameterKey,
          occurrenceOrdinal,
        }),
        occurrenceOrdinal,
        kind: "invalid" as const,
        side: null,
        rootId: null,
        reasonCode: item.reasonCode,
        targetKind,
        targetId,
        targetPath,
        parameterKey,
        detail: cloneDetail(item.detail),
      };
    }),
});

/** Build immutable application schedule facts from one schedule evaluation. */
export const buildScheduleProjectionFacts = (
  input: BuildSemanticDiffScheduleImpactInput,
): ScheduleProjectionFacts => {
  if (input.scheduleEvaluation.kind === "not-requested") {
    return deepFreeze({ kind: "not-requested" });
  }
  if (input.scheduleEvaluation.kind === "invalid-period") {
    return deepFreeze(
      invalidFacts(input.result, input.scheduleEvaluation.period),
    );
  }
  return deepFreeze(evaluatedFacts(input, input.scheduleEvaluation));
};

/** Project the immutable sidecar without comparison or schedule recalculation. */
export const buildSemanticDiffScheduleImpact = (input: {
  result: SemanticDiffResult;
  facts: Extract<ScheduleProjectionFacts, { kind: "evaluated" }>;
}): SemanticDiffScheduleImpact => {
  const cloneRun = (
    run: SemanticDiffScheduleImpactRun,
  ): SemanticDiffScheduleImpactRun => ({
    ...run,
    sourceChangeRef: run.sourceChangeRef ? { ...run.sourceChangeRef } : null,
  });
  const cloneSide = (
    side: SemanticDiffScheduleImpactRootSide,
  ): SemanticDiffScheduleImpactRootSide => ({
    ...side,
    runs: side.runs.map(cloneRun),
    issueIds: [...side.issueIds],
  });
  const roots = input.facts.correspondence.map((root) => ({
    ...root,
    before: root.before ? cloneSide(root.before) : null,
    after: root.after ? cloneSide(root.after) : null,
    scopeTransition: root.scopeTransition ? { ...root.scopeTransition } : null,
  }));
  const issues = [...input.facts.before.issues, ...input.facts.after.issues]
    .map((issue) => ({
      ...issue,
      detail: cloneDetail(issue.detail),
    }))
    .sort(compareIssues);
  const candidateGroups = (input.facts.candidateGroups ?? []).map((group) => ({
    ...group,
    before: group.before.map((candidate) => ({ ...candidate })),
    after: group.after.map((candidate) => ({ ...candidate })),
  }));
  const attached = attachSourceChangeReferences(
    input.result,
    roots,
    createSourceKeyForRun(input.result),
  );
  validateSourceChangeReferences(input.result, attached.timelineItems);
  return deepFreeze({
    period: input.facts.period,
    roots: attached.roots,
    candidateGroups,
    timelineItems: attached.timelineItems,
    issues,
  });
};

export const buildScheduleImpact = buildSemanticDiffScheduleImpact;
