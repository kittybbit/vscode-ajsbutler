import type { AjsUnit } from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffScheduleEvaluation,
  SemanticDiffScheduleUnsupportedDecision,
} from "../../domain/services/semantic-diff/semanticDiffScheduleRules";
import type {
  SemanticDiffDetail,
  SemanticDiffResult,
  SemanticDiffSide,
  SemanticDiffTarget,
  SemanticDiffUnitTarget,
} from "./semanticDiffDto";
import type {
  SemanticDiffScheduleImpactIssue,
  SemanticDiffScheduleImpactIssueKind,
} from "./semanticDiffScheduleImpactDto";
import {
  compareInOrder,
  compareNumbers,
  compareOrdinal,
  encodeSemanticDiffScheduleImpactId,
} from "./semanticDiffScheduleImpactIdentity";

export type ScheduleIssueList = readonly SemanticDiffScheduleImpactIssue[];

export type ScheduleIssuesBySide = Readonly<{
  before: ScheduleIssueList;
  after: ScheduleIssueList;
}>;

const isWithinRoot = (path: string, rootPath: string): boolean =>
  [path === rootPath, path.startsWith(`${rootPath}/`)].some(Boolean);

export const findScheduleIssueRoot = (
  roots: readonly AjsUnit[],
  path: string,
): AjsUnit | undefined =>
  [...roots]
    .filter((root) => isWithinRoot(path, root.absolutePath))
    .sort((left, right) =>
      compareInOrder([
        () => right.absolutePath.length - left.absolutePath.length,
        () => compareOrdinal(left.absolutePath, right.absolutePath),
      ]),
    )[0];

const reasonIssueKinds: ReadonlyMap<
  SemanticDiffScheduleUnsupportedDecision["reason"],
  SemanticDiffScheduleImpactIssueKind
> = new Map([
  ["invalid-start-time", "invalid"],
  ["invalid-calendar-day", "invalid"],
  ["unsupported-schedule-date", "invalid"],
  ["missing-start-time", "uncalculated"],
  ["unpaired-start-time", "uncalculated"],
]);

const projectionIssueKinds: ReadonlyMap<
  string,
  SemanticDiffScheduleImpactIssueKind
> = new Map([
  ["calendar-selection\u0000missing-context", "missing-context"],
  ["closed-day-substitution\u0000missing-context", "missing-context"],
  ["calendar-selection\u0000invalid", "invalid"],
  ["closed-day-substitution\u0000invalid", "invalid"],
]);

const projectionIssueKind = (
  decision: Pick<SemanticDiffScheduleUnsupportedDecision, "reason" | "status">,
): SemanticDiffScheduleImpactIssueKind | undefined =>
  projectionIssueKinds.get(`${decision.reason}\u0000${decision.status ?? ""}`);

const reasonIssueKind = (
  reason: SemanticDiffScheduleUnsupportedDecision["reason"],
): SemanticDiffScheduleImpactIssueKind =>
  reasonIssueKinds.get(reason) ?? "unsupported";

const issueKind = (
  decision: Pick<SemanticDiffScheduleUnsupportedDecision, "reason" | "status">,
): SemanticDiffScheduleImpactIssueKind =>
  projectionIssueKind(decision) ?? reasonIssueKind(decision.reason);

const issueKindOrder: Record<SemanticDiffScheduleImpactIssueKind, number> = {
  invalid: 0,
  "missing-context": 1,
  unsupported: 2,
  uncalculated: 3,
};

const cloneOptionalObject = <T extends object>(value: T | null): T | null =>
  value === null ? null : { ...value };

const cloneRelationPair = (
  relationPair: SemanticDiffDetail["relationPair"],
): SemanticDiffDetail["relationPair"] =>
  relationPair === null
    ? null
    : {
        canonicalPair: { ...relationPair.canonicalPair },
        before: cloneOptionalObject(relationPair.before),
        after: cloneOptionalObject(relationPair.after),
      };

export const cloneDetail = (
  detail: SemanticDiffDetail,
): SemanticDiffDetail => ({
  ...detail,
  relationPair: cloneRelationPair(detail.relationPair),
  period: detail.period ? { ...detail.period } : null,
  beforeValues: [...detail.beforeValues],
  afterValues: [...detail.afterValues],
  rawValues: [...detail.rawValues],
  removedSources: [...detail.removedSources],
});

const isJobnetTargetForDecision = (
  item: SemanticDiffResult["unsupportedItems"][number],
  decision: SemanticDiffScheduleUnsupportedDecision,
): boolean =>
  item.target?.kind === "jobnet" && item.target.unit.id === decision.unit.id;

const hasMatchingUnsupportedParameter = (
  item: SemanticDiffResult["unsupportedItems"][number],
  decision: SemanticDiffScheduleUnsupportedDecision,
): boolean =>
  item.detail.parameterKey === decision.parameter.key &&
  item.detail.rawValues.includes(decision.parameter.value);

const isMatchingUnsupportedItem = (
  item: SemanticDiffResult["unsupportedItems"][number],
  decision: SemanticDiffScheduleUnsupportedDecision,
): boolean =>
  [
    item.side === decision.side,
    item.reasonCode === decision.reason,
    isJobnetTargetForDecision(item, decision),
    hasMatchingUnsupportedParameter(item, decision),
  ].every(Boolean);

const detailForUnsupported = (
  result: SemanticDiffResult,
  decision: SemanticDiffScheduleUnsupportedDecision,
): SemanticDiffDetail =>
  result.unsupportedItems.find((candidateItem) =>
    isMatchingUnsupportedItem(candidateItem, decision),
  )?.detail ?? {
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
  new Set(["n", "rn", "rm", "rr"]).has(decision.unit.unitType)
    ? "jobnet"
    : "unit";

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

export type BuildScheduleIssuesInput = Readonly<{
  result: SemanticDiffResult;
  evaluation: Extract<SemanticDiffScheduleEvaluation, { kind: "evaluated" }>;
  rootsBySide: Readonly<{
    before: readonly AjsUnit[];
    after: readonly AjsUnit[];
  }>;
  rootIdsByPath: Readonly<{
    before: ReadonlyMap<string, string>;
    after: ReadonlyMap<string, string>;
  }>;
  excludedUnitIds: ReadonlySet<string>;
  excludedRootPaths: ReadonlySet<string>;
}>;

const compareUnsupportedDecisions =
  (
    result: SemanticDiffResult,
    rootsBySide: BuildScheduleIssuesInput["rootsBySide"],
  ) =>
  (
    left: SemanticDiffScheduleUnsupportedDecision,
    right: SemanticDiffScheduleUnsupportedDecision,
  ): number => {
    const leftRoot = findScheduleIssueRoot(
      rootsBySide[left.side],
      left.unit.absolutePath,
    );
    const rightRoot = findScheduleIssueRoot(
      rootsBySide[right.side],
      right.unit.absolutePath,
    );
    const leftKind = issueKind(left);
    const rightKind = issueKind(right);
    return compareInOrder([
      () =>
        compareOrdinal(
          leftRoot?.absolutePath ?? "",
          rightRoot?.absolutePath ?? "",
        ),
      () => compareOrdinal(left.side, right.side),
      () => compareNumbers(issueKindOrder[leftKind], issueKindOrder[rightKind]),
      () => compareOrdinal(left.reason, right.reason),
      () => compareOrdinal(issueTargetKind(left), issueTargetKind(right)),
      () => compareOrdinal(left.unit.id, right.unit.id),
      () => compareOrdinal(left.unit.absolutePath, right.unit.absolutePath),
      () => compareOrdinal(left.parameter.key, right.parameter.key),
      () =>
        compareOrdinal(
          detailOrderingKey(detailForUnsupported(result, left)),
          detailOrderingKey(detailForUnsupported(result, right)),
        ),
      () => compareNumbers(left.scheduleRule ?? -1, right.scheduleRule ?? -1),
      () => compareOrdinal(left.parameter.value, right.parameter.value),
    ]);
  };

const isExcludedScheduleIssue = (
  decision: SemanticDiffScheduleUnsupportedDecision,
  context: BuildScheduleIssuesInput,
): boolean =>
  [
    context.excludedUnitIds.has(decision.unit.id),
    [...context.excludedRootPaths].some((path) =>
      isWithinRoot(decision.unit.absolutePath, path),
    ),
  ].some(Boolean);

type ScheduleIssueMetadata = {
  rootId: string | null;
  kind: SemanticDiffScheduleImpactIssueKind;
  targetKind: string;
  targetId: string;
  targetPath: string;
  parameterKey: string;
  detail: SemanticDiffDetail;
};

const scheduleIssueMetadata = (
  context: BuildScheduleIssuesInput,
  decision: SemanticDiffScheduleUnsupportedDecision,
): ScheduleIssueMetadata | undefined => {
  const root = findScheduleIssueRoot(
    context.rootsBySide[decision.side],
    decision.unit.absolutePath,
  );
  return [root]
    .filter((candidate): candidate is AjsUnit => candidate !== undefined)
    .filter(() => !isExcludedScheduleIssue(decision, context))
    .map((includedRoot) => ({
      rootId:
        context.rootIdsByPath[decision.side].get(includedRoot.absolutePath) ??
        null,
      kind: issueKind(decision),
      targetKind: issueTargetKind(decision),
      targetId: decision.unit.id,
      targetPath: decision.unit.absolutePath,
      parameterKey: decision.parameter.key,
      detail: detailForUnsupported(context.result, decision),
    }))[0];
};

const scheduleIssueCountKey = (
  decision: SemanticDiffScheduleUnsupportedDecision,
  metadata: ScheduleIssueMetadata,
): string =>
  [
    decision.side,
    metadata.rootId,
    metadata.kind,
    decision.reason,
    metadata.targetKind,
    metadata.targetId,
    metadata.targetPath,
    metadata.parameterKey,
  ].join("\u0000");

const scheduleIssue = (
  decision: SemanticDiffScheduleUnsupportedDecision,
  metadata: ScheduleIssueMetadata,
  occurrenceOrdinal: number,
): SemanticDiffScheduleImpactIssue => ({
  id: issueId({
    side: decision.side,
    rootId: metadata.rootId,
    kind: metadata.kind,
    reasonCode: decision.reason,
    targetKind: metadata.targetKind,
    targetId: metadata.targetId,
    targetPath: metadata.targetPath,
    parameterKey: metadata.parameterKey,
    occurrenceOrdinal,
  }),
  occurrenceOrdinal,
  kind: metadata.kind,
  side: decision.side,
  rootId: metadata.rootId,
  reasonCode: new Map<boolean, string>([
    [true, decision.reason],
    [false, "uncalculated"],
  ]).get(Boolean(decision.reason))!,
  targetKind: metadata.targetKind,
  targetId: metadata.targetId,
  targetPath: metadata.targetPath,
  parameterKey: metadata.parameterKey,
  detail: cloneDetail(metadata.detail),
});

const scheduleIssueForDecision = (
  context: BuildScheduleIssuesInput,
  decision: SemanticDiffScheduleUnsupportedDecision,
  counts: Map<string, number>,
): SemanticDiffScheduleImpactIssue | undefined => {
  const metadata = scheduleIssueMetadata(context, decision);
  if (!metadata) return undefined;
  const countKey = scheduleIssueCountKey(decision, metadata);
  const occurrenceOrdinal = counts.get(countKey) ?? 0;
  counts.set(countKey, occurrenceOrdinal + 1);
  return scheduleIssue(decision, metadata, occurrenceOrdinal);
};

const collectedScheduleIssues = (
  context: BuildScheduleIssuesInput,
): SemanticDiffScheduleImpactIssue[] => {
  const counts = new Map<string, number>();
  return [...context.evaluation.unsupportedDecisions]
    .sort(compareUnsupportedDecisions(context.result, context.rootsBySide))
    .flatMap((decision) => {
      const issue = scheduleIssueForDecision(context, decision, counts);
      return [issue].filter(
        (candidate): candidate is SemanticDiffScheduleImpactIssue =>
          candidate !== undefined,
      );
    });
};

const issuesForSide = (
  issues: readonly SemanticDiffScheduleImpactIssue[],
  side: SemanticDiffSide,
): SemanticDiffScheduleImpactIssue[] =>
  issues
    .filter((issue) => issue.side === side)
    .sort((left, right) => compareOrdinal(left.id, right.id));

export const buildScheduleIssues = (
  context: BuildScheduleIssuesInput,
): ScheduleIssuesBySide => {
  const issues = collectedScheduleIssues(context);
  return {
    before: issuesForSide(issues, "before"),
    after: issuesForSide(issues, "after"),
  };
};

export const compareIssues = (
  left: SemanticDiffScheduleImpactIssue,
  right: SemanticDiffScheduleImpactIssue,
): number =>
  compareInOrder([
    () => compareOrdinal(left.rootId ?? "", right.rootId ?? ""),
    () => compareOrdinal(left.side ?? "", right.side ?? ""),
    () => compareNumbers(issueKindOrder[left.kind], issueKindOrder[right.kind]),
    () => compareOrdinal(left.reasonCode, right.reasonCode),
    () => compareOrdinal(left.targetKind, right.targetKind),
    () => compareOrdinal(left.targetId ?? "", right.targetId ?? ""),
    () => compareOrdinal(left.targetPath ?? "", right.targetPath ?? ""),
    () => compareOrdinal(left.parameterKey ?? "", right.parameterKey ?? ""),
    () =>
      compareOrdinal(
        detailOrderingKey(left.detail),
        detailOrderingKey(right.detail),
      ),
    () => compareNumbers(left.occurrenceOrdinal, right.occurrenceOrdinal),
    () => compareOrdinal(left.id, right.id),
  ]);

const rootIdForResolvedPath = (
  root: AjsUnit | undefined,
  ids: ReadonlyMap<string, string>,
): string | null => (root ? (ids.get(root.absolutePath) ?? null) : null);

type RootIdForPathInput = {
  side: SemanticDiffSide;
  path: string | null;
  sourceRoots: ReadonlyMap<SemanticDiffSide, readonly AjsUnit[]>;
  ids: RemapScheduleIssuesInput["rootIdsByPath"];
};

const rootIdForPath = (input: RootIdForPathInput): string | null => {
  if (!input.path) return null;
  const root = findScheduleIssueRoot(
    input.sourceRoots.get(input.side) ?? [],
    input.path,
  );
  return rootIdForResolvedPath(root, input.ids[input.side]);
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

type RemapIssuesForSideInput = {
  issues: readonly SemanticDiffScheduleImpactIssue[];
  side: SemanticDiffSide;
  roots: ReadonlyMap<SemanticDiffSide, readonly AjsUnit[]>;
  ids: RemapScheduleIssuesInput["rootIdsByPath"];
};

const remapIssuesForSide = (
  input: RemapIssuesForSideInput,
): SemanticDiffScheduleImpactIssue[] =>
  input.issues
    .map((issue) =>
      rekeyIssue(
        issue,
        rootIdForPath({
          side: input.side,
          path: issue.targetPath,
          sourceRoots: input.roots,
          ids: input.ids,
        }),
      ),
    )
    .sort(compareIssues);

export type RemapScheduleIssuesInput = Readonly<{
  issues: ScheduleIssuesBySide;
  rootsBySide: Readonly<{
    before: readonly AjsUnit[];
    after: readonly AjsUnit[];
  }>;
  rootIdsByPath: Readonly<{
    before: ReadonlyMap<string, string>;
    after: ReadonlyMap<string, string>;
  }>;
}>;

export const remapScheduleIssues = (
  input: RemapScheduleIssuesInput,
): ScheduleIssuesBySide => {
  const roots = new Map<SemanticDiffSide, readonly AjsUnit[]>([
    ["before", input.rootsBySide.before],
    ["after", input.rootsBySide.after],
  ]);
  return {
    before: remapIssuesForSide({
      issues: input.issues.before,
      side: "before",
      roots,
      ids: input.rootIdsByPath,
    }),
    after: remapIssuesForSide({
      issues: input.issues.after,
      side: "after",
      roots,
      ids: input.rootIdsByPath,
    }),
  };
};

const invalidTargetIdForKind: ReadonlyMap<
  string,
  (target: SemanticDiffTarget) => string
> = new Map([
  ["jobnet", (target) => (target as SemanticDiffUnitTarget).unit.id],
  ["unit", (target) => (target as SemanticDiffUnitTarget).unit.id],
]);

const invalidTargetId = (target: SemanticDiffTarget | null): string | null =>
  invalidTargetIdForKind.get(target?.kind ?? "")?.(target!) ?? null;

export type BuildInvalidScheduleIssuesInput = Readonly<SemanticDiffResult>;

export const buildInvalidScheduleIssues = (
  result: BuildInvalidScheduleIssuesInput,
): ScheduleIssueList =>
  result.unsupportedItems
    .filter((item) => item.reasonCode === "invalid-schedule-comparison-period")
    .map((item, occurrenceOrdinal) => {
      const targetKind = item.target?.kind ?? "schedule";
      const targetId = invalidTargetId(item.target ?? null);
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
    });
