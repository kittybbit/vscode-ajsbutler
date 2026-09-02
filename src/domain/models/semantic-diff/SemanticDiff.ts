import type { AjsRelation, AjsUnitType } from "../ajs/AjsDocument";

export type SemanticDiffAttributeCategory =
  | "execution-environment"
  | "execution-definition"
  | "start-condition"
  | "end-control"
  | "abnormal-end-control"
  | "wait-condition"
  | "external-integration"
  | "schedule";

export type SemanticDiffJobGroupIdentityKey = {
  kind: "job-group";
  jobGroupPath: string;
};

export type SemanticDiffJobnetIdentityKey = {
  kind: "jobnet";
  jobGroupRelativePath: string;
  unitType: AjsUnitType;
};

export type SemanticDiffUnitIdentityKey = {
  kind: "unit";
  parentJobnetPath: string;
  unitName: string;
  unitType: AjsUnitType;
};

export type SemanticDiffRelationIdentityKey = {
  kind: "relation";
  sourceUnitId: string;
  targetUnitId: string;
  relationType: AjsRelation["type"];
};

export type SemanticDiffIdentityKey =
  | SemanticDiffJobGroupIdentityKey
  | SemanticDiffJobnetIdentityKey
  | SemanticDiffUnitIdentityKey
  | SemanticDiffRelationIdentityKey;

/**
 * Closed set of identity strategies supported by Semantic Diff.  The
 * strategy is deliberately part of the evidence so that equivalent values
 * from different definition forms can never be matched implicitly.
 */
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

export type SemanticDiffIdentityUnitReference = {
  id: string;
  name: string;
  absolutePath: string;
  unitType: string;
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
  before: SemanticDiffIdentityUnitReference[];
  after: SemanticDiffIdentityUnitReference[];
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
