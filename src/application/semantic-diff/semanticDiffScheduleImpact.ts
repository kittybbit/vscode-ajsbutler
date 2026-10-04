import type { SemanticDiffResult } from "./semanticDiffDto";
import type {
  ScheduleProjectionFacts,
  SemanticDiffScheduleImpact,
  SemanticDiffScheduleImpactCandidateGroup,
  SemanticDiffScheduleImpactIssue,
  SemanticDiffScheduleImpactRoot,
  SemanticDiffScheduleImpactRootSide,
  SemanticDiffScheduleImpactRun,
} from "./semanticDiffScheduleImpactDto";
import {
  compareIssues,
  cloneDetail,
  deepFreeze,
} from "./semanticDiffScheduleProjectionFacts";
import { createSourceKeyForRun } from "./semanticDiffScheduleImpactIdentity";
import {
  attachSourceChangeReferences,
  validateSourceChangeReferences,
} from "./semanticDiffScheduleImpactTimeline";

const cloneOptionalObject = <T extends object>(value: T | null): T | null =>
  value === null ? null : { ...value };

export * from "./semanticDiffScheduleImpactDto";
export {
  encodeSemanticDiffScheduleImpactId,
  encodeScheduleImpactId,
} from "./semanticDiffScheduleImpactIdentity";
export { buildScheduleProjectionFacts } from "./semanticDiffScheduleProjectionFacts";
export type { BuildSemanticDiffScheduleImpactInput } from "./semanticDiffScheduleProjectionFacts";

/** Project the immutable sidecar without comparison or schedule recalculation. */
const cloneImpactRun = (
  run: SemanticDiffScheduleImpactRun,
): SemanticDiffScheduleImpactRun => ({
  ...run,
  sourceChangeRef: cloneOptionalObject(run.sourceChangeRef),
});

const cloneImpactSide = (
  side: SemanticDiffScheduleImpactRootSide,
): SemanticDiffScheduleImpactRootSide => ({
  ...side,
  runs: side.runs.map(cloneImpactRun),
  issueIds: [...side.issueIds],
});

const cloneOptionalImpactSide = (
  side: SemanticDiffScheduleImpactRootSide | null,
): SemanticDiffScheduleImpactRootSide | null =>
  side === null ? null : cloneImpactSide(side);

const cloneImpactRoot = (
  root: SemanticDiffScheduleImpactRoot,
): SemanticDiffScheduleImpactRoot => ({
  ...root,
  before: cloneOptionalImpactSide(root.before),
  after: cloneOptionalImpactSide(root.after),
  scopeTransition: cloneOptionalObject(root.scopeTransition),
});

const cloneImpactRoots = (
  roots: readonly SemanticDiffScheduleImpactRoot[],
): SemanticDiffScheduleImpactRoot[] => roots.map(cloneImpactRoot);

const cloneImpactIssues = (
  facts: Extract<ScheduleProjectionFacts, { kind: "evaluated" }>,
): SemanticDiffScheduleImpactIssue[] =>
  [...facts.before.issues, ...facts.after.issues]
    .map((issue) => ({
      ...issue,
      detail: cloneDetail(issue.detail),
    }))
    .sort(compareIssues);

const cloneImpactCandidates = (
  candidates: readonly SemanticDiffScheduleImpactCandidateGroup[] | undefined,
): SemanticDiffScheduleImpactCandidateGroup[] =>
  (candidates ?? []).map((group) => ({
    ...group,
    before: group.before.map((candidate) => ({ ...candidate })),
    after: group.after.map((candidate) => ({ ...candidate })),
  }));

type ClonedImpactProjection = {
  roots: SemanticDiffScheduleImpactRoot[];
  issues: SemanticDiffScheduleImpactIssue[];
  candidateGroups: SemanticDiffScheduleImpactCandidateGroup[];
};

const cloneImpactProjection = (
  facts: Extract<ScheduleProjectionFacts, { kind: "evaluated" }>,
): ClonedImpactProjection => ({
  roots: cloneImpactRoots(facts.correspondence),
  issues: cloneImpactIssues(facts),
  candidateGroups: cloneImpactCandidates(facts.candidateGroups),
});

const buildSemanticDiffScheduleImpactOutput = (input: {
  result: SemanticDiffResult;
  facts: Extract<ScheduleProjectionFacts, { kind: "evaluated" }>;
}): SemanticDiffScheduleImpact => {
  const projection = cloneImpactProjection(input.facts);
  const attached = attachSourceChangeReferences(
    input.result,
    projection.roots,
    createSourceKeyForRun(input.result),
  );
  validateSourceChangeReferences(input.result, attached.timelineItems);
  return deepFreeze({
    period: input.facts.period,
    roots: attached.roots,
    candidateGroups: projection.candidateGroups,
    timelineItems: attached.timelineItems,
    issues: projection.issues,
  });
};

export const buildSemanticDiffScheduleImpact = (input: {
  result: SemanticDiffResult;
  facts: Extract<ScheduleProjectionFacts, { kind: "evaluated" }>;
}): SemanticDiffScheduleImpact => buildSemanticDiffScheduleImpactOutput(input);

export const buildScheduleImpact = buildSemanticDiffScheduleImpact;
