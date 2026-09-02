import type {
  SemanticDiffIdentityDecision as DomainSemanticDiffIdentityDecision,
  SemanticDiffIdentityDecisionId as DomainSemanticDiffIdentityDecisionId,
  SemanticDiffIdentityDecisionRule as DomainSemanticDiffIdentityDecisionRule,
  SemanticDiffIdentityDecisionStatus as DomainSemanticDiffIdentityDecisionStatus,
  SemanticDiffIdentityEvidence as DomainSemanticDiffIdentityEvidence,
  SemanticDiffIdentityExactKey as DomainSemanticDiffIdentityExactKey,
  SemanticDiffIdentityExactKeyEvidence as DomainSemanticDiffIdentityExactKeyEvidence,
  SemanticDiffIdentityField as DomainSemanticDiffIdentityField,
  SemanticDiffIdentityFingerprintEvidence as DomainSemanticDiffIdentityFingerprintEvidence,
  SemanticDiffIdentityStrategyId as DomainSemanticDiffIdentityStrategyId,
  SemanticDiffIdentityUnitReference as DomainSemanticDiffIdentityUnitReference,
} from "../../domain/models/semantic-diff/SemanticDiff";

export type SemanticDiffSide = "before" | "after";

export type SemanticDiffElementKind =
  | "job-group"
  | "jobnet"
  | "unit"
  | "relation"
  | "attribute";

export type SemanticDiffChangeKind =
  | "added"
  | "removed"
  | "changed"
  | "renamed"
  | "moved";

export type SemanticDiffAttributeCategory =
  | "execution-environment"
  | "execution-definition"
  | "start-condition"
  | "end-control"
  | "abnormal-end-control"
  | "wait-condition"
  | "external-integration"
  | "schedule";

export type SemanticDiffConfirmationLevel =
  | "confirmed"
  | "candidate"
  | "confirmation-required"
  | "unsupported";

export type SemanticDiffUnsupportedKind =
  | "unsupported"
  | "uninterpretable"
  | "uncalculated";

export type SemanticDiffLimitationKind =
  | "parse"
  | "normalization"
  | SemanticDiffUnsupportedKind;

export type SemanticDiffUnitReference = DomainSemanticDiffIdentityUnitReference;
export type SemanticDiffIdentityStrategyId =
  DomainSemanticDiffIdentityStrategyId;
export type SemanticDiffIdentityField = DomainSemanticDiffIdentityField;
export type SemanticDiffIdentityFingerprintEvidence =
  DomainSemanticDiffIdentityFingerprintEvidence;
export type SemanticDiffIdentityExactKey = DomainSemanticDiffIdentityExactKey;
export type SemanticDiffIdentityExactKeyEvidence =
  DomainSemanticDiffIdentityExactKeyEvidence;
export type SemanticDiffIdentityEvidence = DomainSemanticDiffIdentityEvidence;
export type SemanticDiffIdentityDecisionRule =
  DomainSemanticDiffIdentityDecisionRule;
export type SemanticDiffIdentityDecisionStatus =
  DomainSemanticDiffIdentityDecisionStatus;
export type SemanticDiffIdentityDecisionId =
  DomainSemanticDiffIdentityDecisionId;
export type SemanticDiffIdentityDecision = DomainSemanticDiffIdentityDecision;

export type SemanticDiffRelationReference = {
  sourceUnitId: string;
  targetUnitId: string;
  type: "seq" | "con";
  sourceUnitPath?: string;
  targetUnitPath?: string;
};

export type SemanticDiffScope = {
  side: SemanticDiffSide;
  jobGroupPath?: string;
  unitIds: string[];
  relations: SemanticDiffRelationReference[];
};

export type SemanticDiffInputPair = {
  before: SemanticDiffScope;
  after: SemanticDiffScope;
};

export type SemanticDiffJobGroupTarget = {
  kind: "job-group";
  path?: string;
};

export type SemanticDiffUnitTarget = {
  kind: "jobnet" | "unit";
  unit: SemanticDiffUnitReference;
};

export type SemanticDiffRelationTarget = {
  kind: "relation";
  relation: SemanticDiffRelationReference;
};

export type SemanticDiffAttributeTarget = {
  kind: "attribute";
  unit: SemanticDiffUnitReference;
  parameterKey: string;
  category: SemanticDiffAttributeCategory;
  values: string[];
};

export type SemanticDiffTarget =
  | SemanticDiffJobGroupTarget
  | SemanticDiffUnitTarget
  | SemanticDiffRelationTarget
  | SemanticDiffAttributeTarget;

export type SemanticDiffCanonicalPair = {
  sourceUnitId: string;
  targetUnitId: string;
  type: "seq" | "con";
};

export type SemanticDiffRelationEndpoint = {
  sourceUnitPath: string | null;
  sourceUnitId: string;
  targetUnitPath: string | null;
  targetUnitId: string;
  type: "seq" | "con";
};

export type SemanticDiffRelationPair = {
  canonicalPair: SemanticDiffCanonicalPair;
  before: SemanticDiffRelationEndpoint | null;
  after: SemanticDiffRelationEndpoint | null;
};

export type SemanticDiffDetail = {
  unitPath: string | null;
  parameterKey: string | null;
  relationPair: SemanticDiffRelationPair | null;
  scheduleRule: number | null;
  period: SemanticDiffComparisonPeriod | null;
  beforeValues: string[];
  afterValues: string[];
  rawValues: string[];
  removedSources: string[];
};

export type SemanticDiffWarning = {
  code: string;
  detail: SemanticDiffDetail;
  fallbackText: string | null;
};

export type SemanticDiffConstraintCode =
  | "jp1-ajs3-v13-rule-basis"
  | "runtime-state-not-verified"
  | "external-state-not-verified"
  | "comparison-period";

export type SemanticDiffConstraint = {
  code: SemanticDiffConstraintCode;
  detail: SemanticDiffDetail;
  warning: SemanticDiffWarning | null;
};

export type SemanticDiffConfirmationReason =
  | "conditional-relation-removed"
  | "wait-release-source-changed"
  | "timeout-removed"
  | "condition-judgment-changed"
  | "wait-target-changed"
  | "no-calculated-schedule-run"
  | "calculated-schedule-run-removed"
  | "execution-user-type-changed"
  | "jp1-resource-group-changed";
export type SemanticDiffConfirmationReasonCode = SemanticDiffConfirmationReason;

export type SemanticDiffUnsupportedReason =
  | "uninterpretable-file-monitoring-condition"
  | "cycle-schedule"
  | "closed-day-substitution"
  | "shift-days"
  | "calendar-selection"
  | "inherited-parent-rule"
  | "days-from-start"
  | "invalid-start-time"
  | "unpaired-start-time"
  | "unsupported-schedule-date"
  | "missing-start-time"
  | "invalid-calendar-day"
  | "invalid-schedule-comparison-period";
export type SemanticDiffUnsupportedReasonCode = SemanticDiffUnsupportedReason;

type SemanticDiffIdentityChange = {
  id: string;
  kind: SemanticDiffChangeKind;
  elementKind: "jobnet" | "unit" | "attribute";
  confirmationLevel: SemanticDiffConfirmationLevel;
  before?: SemanticDiffTarget;
  after?: SemanticDiffTarget;
  attributeCategory?: SemanticDiffAttributeCategory;
  relationPair: null;
  identityDecisionId: SemanticDiffIdentityDecisionId;
};

type SemanticDiffNonIdentityChange = {
  id: string;
  kind: SemanticDiffChangeKind;
  elementKind: "job-group";
  confirmationLevel: SemanticDiffConfirmationLevel;
  before?: SemanticDiffTarget;
  after?: SemanticDiffTarget;
  attributeCategory?: SemanticDiffAttributeCategory;
  relationPair: null;
  identityDecisionId?: never;
};

type SemanticDiffRelationChange = {
  id: string;
  kind: Extract<SemanticDiffChangeKind, "added" | "removed">;
  elementKind: "relation";
  confirmationLevel: SemanticDiffConfirmationLevel;
  before?: SemanticDiffTarget;
  after?: SemanticDiffTarget;
  attributeCategory?: never;
  relationPair: SemanticDiffRelationPair;
  identityDecisionId?: never;
};

export type SemanticDiffChange =
  | SemanticDiffIdentityChange
  | SemanticDiffNonIdentityChange
  | SemanticDiffRelationChange;

export type SemanticDiffConfirmationRequiredItem = {
  id: string;
  reasonCode: SemanticDiffConfirmationReason;
  target: SemanticDiffTarget;
  relatedTargets: SemanticDiffTarget[];
  detail: SemanticDiffDetail;
  constraints: SemanticDiffConstraint[];
  warning: SemanticDiffWarning | null;
};

export type SemanticDiffUnsupportedItem = {
  id: string;
  kind: SemanticDiffUnsupportedKind;
  side: SemanticDiffSide | null;
  reasonCode: SemanticDiffUnsupportedReason;
  target: SemanticDiffTarget | null;
  detail: SemanticDiffDetail;
  warning: SemanticDiffWarning | null;
};

export type SemanticDiffLimitation = {
  code: string;
  kind: SemanticDiffLimitationKind;
  side: SemanticDiffSide | null;
  unitPath: string | null;
  detail: SemanticDiffDetail;
  warning: SemanticDiffWarning | null;
};

export type SemanticDiffComparisonPeriod = {
  from: string;
  to: string;
};

export type SemanticDiffScheduleRun = {
  unitPath: string;
  unitName: string;
  rule: number;
  date: string;
  time: string;
};

export type SemanticDiffScheduleRunChangeKind =
  | "added"
  | "removed"
  | "changed-time";

export type SemanticDiffScheduleRunChange = {
  id: string;
  kind: SemanticDiffScheduleRunChangeKind;
  unitPath: string;
  date: string;
  before: SemanticDiffScheduleRun | null;
  after: SemanticDiffScheduleRun | null;
};

export type SemanticDiffScheduleComparison = {
  period: SemanticDiffComparisonPeriod;
  runChanges: SemanticDiffScheduleRunChange[];
};

export type SemanticDiffResult = {
  inputs: SemanticDiffInputPair;
  changes: SemanticDiffChange[];
  identityDecisions: SemanticDiffIdentityDecision[];
  confirmationRequired: SemanticDiffConfirmationRequiredItem[];
  unsupportedItems: SemanticDiffUnsupportedItem[];
  limitations: SemanticDiffLimitation[];
  scheduleComparison?: SemanticDiffScheduleComparison;
};

export type SemanticDiffSummary = {
  changeCountsByKind: Record<SemanticDiffChangeKind, number>;
  changeCountsByElementKind: Record<SemanticDiffElementKind, number>;
  changeCountsByAttributeCategory: Record<
    SemanticDiffAttributeCategory,
    number
  >;
  unsupportedCountsByKind: Record<SemanticDiffUnsupportedKind, number>;
  confirmationRequiredCount: number;
  limitationCount: number;
  scheduleRunChangeCount: number;
  hasUncalculated: boolean;
  hasFindings: boolean;
};

export type SemanticDiffOutputContext = {
  readonly result: SemanticDiffResult;
  readonly summary: SemanticDiffSummary;
};

export type SemanticDiffParserError = {
  line: number;
  column: number;
  message: string;
};
