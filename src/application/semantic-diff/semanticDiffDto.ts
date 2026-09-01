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

export type SemanticDiffUnitReference = {
  id: string;
  name: string;
  absolutePath: string;
  unitType: string;
};

export type SemanticDiffIdentityStrategyId =
  | "command-text-v1"
  | "executable-file-v1"
  | "event-reception-v1"
  | "file-monitor-v1"
  | "legacy-all-parameters-v1";

export type SemanticDiffIdentityField = {
  key: string;
  presence: "absent" | "present";
  values: string[];
};

export type SemanticDiffIdentityFingerprintEvidence = {
  kind: "fingerprint";
  strategyId: SemanticDiffIdentityStrategyId;
  unitType: string;
  fields: SemanticDiffIdentityField[];
};

export type SemanticDiffIdentityExactKey =
  | {
      kind: "jobnet";
      jobGroupRelativePath: string;
      unitType: string;
    }
  | {
      kind: "unit";
      parentJobnetPath: string;
      unitName: string;
      unitType: string;
    };

export type SemanticDiffIdentityExactKeyEvidence = {
  kind: "exact-key";
  key: SemanticDiffIdentityExactKey;
};

export type SemanticDiffIdentityEvidence =
  | SemanticDiffIdentityExactKeyEvidence
  | SemanticDiffIdentityFingerprintEvidence;

export type SemanticDiffIdentityDecisionRule =
  | "exact-key"
  | "one-to-one-fingerprint"
  | "ambiguous-fingerprint"
  | "unmatched-before"
  | "unmatched-after";

export type SemanticDiffIdentityDecisionStatus =
  | "exact"
  | "fingerprint-confirmed"
  | "candidate"
  | "removed"
  | "added";

export type SemanticDiffIdentityDecisionId = string;

type SemanticDiffIdentityDecisionBase = {
  id: SemanticDiffIdentityDecisionId;
  before: SemanticDiffUnitReference[];
  after: SemanticDiffUnitReference[];
};

export type SemanticDiffIdentityDecision =
  | (SemanticDiffIdentityDecisionBase & {
      status: "exact";
      rule: "exact-key";
      evidence: SemanticDiffIdentityExactKeyEvidence;
    })
  | (SemanticDiffIdentityDecisionBase & {
      status: "fingerprint-confirmed";
      rule: "one-to-one-fingerprint";
      evidence: SemanticDiffIdentityFingerprintEvidence;
    })
  | (SemanticDiffIdentityDecisionBase & {
      status: "candidate";
      rule: "ambiguous-fingerprint";
      evidence: SemanticDiffIdentityFingerprintEvidence;
    })
  | (SemanticDiffIdentityDecisionBase & {
      status: "removed";
      rule: "unmatched-before";
      evidence: SemanticDiffIdentityFingerprintEvidence;
    })
  | (SemanticDiffIdentityDecisionBase & {
      status: "added";
      rule: "unmatched-after";
      evidence: SemanticDiffIdentityFingerprintEvidence;
    });

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

type SemanticDiffIdentityChange = {
  id: string;
  kind: SemanticDiffChangeKind;
  elementKind: "jobnet" | "unit" | "attribute";
  confirmationLevel: SemanticDiffConfirmationLevel;
  before?: SemanticDiffTarget;
  after?: SemanticDiffTarget;
  attributeCategory?: SemanticDiffAttributeCategory;
  summary: string;
  rationale?: string;
  identityDecisionId: SemanticDiffIdentityDecisionId;
};

type SemanticDiffNonIdentityChange = {
  id: string;
  kind: SemanticDiffChangeKind;
  elementKind: "job-group" | "relation";
  confirmationLevel: SemanticDiffConfirmationLevel;
  before?: SemanticDiffTarget;
  after?: SemanticDiffTarget;
  attributeCategory?: SemanticDiffAttributeCategory;
  summary: string;
  rationale?: string;
  identityDecisionId?: never;
};

export type SemanticDiffChange =
  | SemanticDiffIdentityChange
  | SemanticDiffNonIdentityChange;

export type SemanticDiffConfirmationRequiredItem = {
  id: string;
  target: SemanticDiffTarget;
  changeContent: string;
  rationale: string;
  relatedTargets: SemanticDiffTarget[];
  constraints: string[];
};

export type SemanticDiffUnsupportedItem = {
  id: string;
  kind: SemanticDiffUnsupportedKind;
  side?: SemanticDiffSide;
  target?: SemanticDiffTarget;
  message: string;
};

export type SemanticDiffLimitation = {
  code: string;
  kind: SemanticDiffLimitationKind;
  side?: SemanticDiffSide;
  message: string;
  unitPath?: string;
};

export type SemanticDiffReportSectionId =
  | "summary"
  | "structural"
  | "attributes"
  | "confirmation-required"
  | "unsupported"
  | "limitations"
  | "schedule";

export type SemanticDiffReportSection = {
  id: SemanticDiffReportSectionId;
  title: string;
  changeIds: string[];
  limitationCodes: string[];
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
  before?: SemanticDiffScheduleRun;
  after?: SemanticDiffScheduleRun;
  summary: string;
};

export type SemanticDiffScheduleComparison = {
  period: SemanticDiffComparisonPeriod;
  runChanges: SemanticDiffScheduleRunChange[];
};

export type SemanticDiffChangeSet = {
  inputs: SemanticDiffInputPair;
  changes: SemanticDiffChange[];
  identityDecisions: SemanticDiffIdentityDecision[];
  confirmationRequired: SemanticDiffConfirmationRequiredItem[];
  unsupportedItems: SemanticDiffUnsupportedItem[];
  limitations: SemanticDiffLimitation[];
  scheduleComparison?: SemanticDiffScheduleComparison;
  reportSections: SemanticDiffReportSection[];
};

export type SemanticDiffParserError = {
  line: number;
  column: number;
  message: string;
};
