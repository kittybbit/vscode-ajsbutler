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

export type SemanticDiffChange = {
  id: string;
  kind: SemanticDiffChangeKind;
  elementKind: SemanticDiffElementKind;
  confirmationLevel: SemanticDiffConfirmationLevel;
  before?: SemanticDiffTarget;
  after?: SemanticDiffTarget;
  attributeCategory?: SemanticDiffAttributeCategory;
  summary: string;
  rationale?: string;
};

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
