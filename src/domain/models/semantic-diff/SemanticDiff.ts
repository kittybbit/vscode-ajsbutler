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
