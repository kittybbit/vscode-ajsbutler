import type {
  SemanticDiffAttributeCategory,
  SemanticDiffChangeKind,
  SemanticDiffComparisonPeriod,
  SemanticDiffConfirmationLevel,
  SemanticDiffConfirmationReason,
  SemanticDiffConstraintCode,
  SemanticDiffElementKind,
  SemanticDiffIdentityDecisionStatus,
  SemanticDiffIdentityDecisionRule,
  SemanticDiffIdentityField,
  SemanticDiffIdentityStrategyId,
  SemanticDiffLimitationKind,
  SemanticDiffSide,
  SemanticDiffUnsupportedReason,
  SemanticDiffUnsupportedKind,
} from "../../application/semantic-diff/semanticDiffDto";

export const SEMANTIC_DIFF_JSON_MEDIA_TYPE =
  "application/json; charset=utf-8" as const;

export type SemanticDiffJsonUnitReference = {
  id: string;
  name: string;
  absolutePath: string;
  unitType: string;
};

export type SemanticDiffJsonRelationReference = {
  sourceUnitId: string;
  targetUnitId: string;
  type: "seq" | "con";
  sourceUnitPath: string | null;
  targetUnitPath: string | null;
};

export type SemanticDiffJsonScope = {
  side: SemanticDiffSide;
  jobGroupPath: string | null;
  unitIds: string[];
  relations: SemanticDiffJsonRelationReference[];
};

export type SemanticDiffJsonInputPair = {
  before: SemanticDiffJsonScope;
  after: SemanticDiffJsonScope;
};

export type SemanticDiffJsonTarget =
  | { kind: "job-group"; path: string | null }
  | { kind: "jobnet" | "unit"; unit: SemanticDiffJsonUnitReference }
  | { kind: "relation"; relation: SemanticDiffJsonRelationReference }
  | {
      kind: "attribute";
      unit: SemanticDiffJsonUnitReference;
      parameterKey: string;
      category: SemanticDiffAttributeCategory;
      values: string[];
    };

export type SemanticDiffJsonCanonicalPair = {
  sourceUnitId: string;
  targetUnitId: string;
  type: "seq" | "con";
};

export type SemanticDiffJsonRelationEndpoint = {
  sourceUnitPath: string | null;
  sourceUnitId: string;
  targetUnitPath: string | null;
  targetUnitId: string;
  type: "seq" | "con";
};

export type SemanticDiffJsonRelationPair = {
  canonicalPair: SemanticDiffJsonCanonicalPair;
  before: SemanticDiffJsonRelationEndpoint | null;
  after: SemanticDiffJsonRelationEndpoint | null;
};

export type SemanticDiffJsonPeriod = SemanticDiffComparisonPeriod;

export type SemanticDiffJsonDetail = {
  unitPath: string | null;
  parameterKey: string | null;
  relationPair: SemanticDiffJsonRelationPair | null;
  scheduleRule: number | null;
  period: SemanticDiffJsonPeriod | null;
  beforeValues: string[];
  afterValues: string[];
  rawValues: string[];
  removedSources: string[];
};

export type SemanticDiffJsonWarning = {
  code: string;
  detail: SemanticDiffJsonDetail;
  fallbackText: string | null;
};

export type SemanticDiffJsonConstraint = {
  code: SemanticDiffConstraintCode;
  detail: SemanticDiffJsonDetail;
  warning: SemanticDiffJsonWarning | null;
};

export type SemanticDiffJsonChange = {
  id: string;
  kind: SemanticDiffChangeKind;
  elementKind: SemanticDiffElementKind;
  confirmationLevel: SemanticDiffConfirmationLevel;
  identityDecisionId: string | null;
  before: SemanticDiffJsonTarget | null;
  after: SemanticDiffJsonTarget | null;
  relationPair: SemanticDiffJsonRelationPair | null;
  attributeCategory: SemanticDiffAttributeCategory | null;
};

export type SemanticDiffJsonIdentityField = SemanticDiffIdentityField;

export type SemanticDiffJsonIdentityEvidence =
  | {
      kind: "exact-key";
      key:
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
    }
  | {
      kind: "fingerprint";
      strategyId: SemanticDiffIdentityStrategyId;
      unitType: string;
      fields: SemanticDiffJsonIdentityField[];
    };

export type SemanticDiffJsonIdentityDecision = {
  id: string;
  status: SemanticDiffIdentityDecisionStatus;
  rule: SemanticDiffIdentityDecisionRule;
  before: SemanticDiffJsonUnitReference[];
  after: SemanticDiffJsonUnitReference[];
  evidence: SemanticDiffJsonIdentityEvidence;
};

export type SemanticDiffJsonConfirmation = {
  id: string;
  reasonCode: SemanticDiffConfirmationReason;
  target: SemanticDiffJsonTarget;
  relatedTargets: SemanticDiffJsonTarget[];
  detail: SemanticDiffJsonDetail;
  constraints: SemanticDiffJsonConstraint[];
  warning: SemanticDiffJsonWarning | null;
};

export type SemanticDiffJsonUnsupported = {
  id: string;
  kind: SemanticDiffUnsupportedKind;
  side: SemanticDiffSide | null;
  reasonCode: SemanticDiffUnsupportedReason;
  target: SemanticDiffJsonTarget | null;
  detail: SemanticDiffJsonDetail;
  warning: SemanticDiffJsonWarning | null;
};

export type SemanticDiffJsonLimitation = {
  code: string;
  kind: SemanticDiffLimitationKind;
  side: SemanticDiffSide | null;
  unitPath: string | null;
  detail: SemanticDiffJsonDetail;
  warning: SemanticDiffJsonWarning | null;
};

export type SemanticDiffJsonRun = {
  unitPath: string;
  unitName: string;
  rule: number;
  date: string;
  time: string;
};

export type SemanticDiffJsonRunChange = {
  id: string;
  kind: "added" | "removed" | "changed-time";
  unitPath: string;
  date: string;
  before: SemanticDiffJsonRun | null;
  after: SemanticDiffJsonRun | null;
};

export type SemanticDiffJsonSchedule = {
  period: SemanticDiffJsonPeriod;
  runChanges: SemanticDiffJsonRunChange[];
};

export type SemanticDiffJsonSummary = {
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

export type SemanticDiffJsonResult = {
  inputs: SemanticDiffJsonInputPair;
  identityDecisions: SemanticDiffJsonIdentityDecision[];
  changes: SemanticDiffJsonChange[];
  confirmationRequired: SemanticDiffJsonConfirmation[];
  unsupportedItems: SemanticDiffJsonUnsupported[];
  limitations: SemanticDiffJsonLimitation[];
  schedule: SemanticDiffJsonSchedule | null;
};

export type SemanticDiffJsonV1 = {
  schema: "ajsbutler.semantic-diff";
  schemaVersion: 1;
  summary: SemanticDiffJsonSummary;
  result: SemanticDiffJsonResult;
};

/**
 * Version 1 is a fixed wire contract. Removing, renaming, or changing the
 * meaning/type/nullability of a member requires a new schema version.
 */

export type SemanticDiffJsonOutput = {
  readonly mediaType: typeof SEMANTIC_DIFF_JSON_MEDIA_TYPE;
  readonly content: string;
};
