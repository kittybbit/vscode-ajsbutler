import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffDetail,
  SemanticDiffSide,
} from "./semanticDiffDto";

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
