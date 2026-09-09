import type {
  SemanticDiffAttributeCategory,
  SemanticDiffChangeKind,
  SemanticDiffConfirmationLevel,
  SemanticDiffConstraint,
  SemanticDiffDetail,
  SemanticDiffElementKind,
  SemanticDiffLimitationKind,
  SemanticDiffOutputContext,
  SemanticDiffConfirmationReason,
  SemanticDiffRelationPair,
  SemanticDiffScheduleRunChange,
  SemanticDiffSide,
  SemanticDiffTarget,
  SemanticDiffUnsupportedKind,
  SemanticDiffUnsupportedReason,
  SemanticDiffWarning,
} from "./semanticDiffDto";

/**
 * Opaque IDs are intentionally namespaced at runtime as well as branded at
 * compile time.  They are handles for a host-side action registry, never
 * identifiers derived from a URI, result record, or source content.
 */
export type SemanticDiffExplorerSessionId = string & {
  readonly __semanticDiffExplorerSessionId: unique symbol;
};

export type SemanticDiffExplorerActionId = string & {
  readonly __semanticDiffExplorerActionId: unique symbol;
};

export const SEMANTIC_DIFF_EXPLORER_SESSION_ID_PREFIX = "sde-session-";
export const SEMANTIC_DIFF_EXPLORER_ACTION_ID_PREFIX = "sde-action-";

const sessionIdPattern = /^sde-session-[1-9][0-9]*$/;
const actionIdPattern = /^sde-action-[1-9][0-9]*$/;

export const isSemanticDiffExplorerSessionId = (
  value: unknown,
): value is SemanticDiffExplorerSessionId =>
  typeof value === "string" && sessionIdPattern.test(value);

export const isSemanticDiffExplorerActionId = (
  value: unknown,
): value is SemanticDiffExplorerActionId =>
  typeof value === "string" && actionIdPattern.test(value);

export const createSemanticDiffExplorerSessionId = (
  sequence: number,
): SemanticDiffExplorerSessionId => {
  if (!Number.isSafeInteger(sequence) || sequence < 1) {
    throw new RangeError("A session ID sequence must be a positive integer.");
  }
  return `${SEMANTIC_DIFF_EXPLORER_SESSION_ID_PREFIX}${sequence}` as SemanticDiffExplorerSessionId;
};

export const createSemanticDiffExplorerActionId = (
  sequence: number,
): SemanticDiffExplorerActionId => {
  if (!Number.isSafeInteger(sequence) || sequence < 1) {
    throw new RangeError("An action ID sequence must be a positive integer.");
  }
  return `${SEMANTIC_DIFF_EXPLORER_ACTION_ID_PREFIX}${sequence}` as SemanticDiffExplorerActionId;
};

export type SemanticDiffExplorerActionIdAllocator =
  () => SemanticDiffExplorerActionId;
export type SemanticDiffExplorerSessionIdAllocator =
  () => SemanticDiffExplorerSessionId;

export const createSemanticDiffExplorerSessionIdAllocator = (
  start = 1,
): SemanticDiffExplorerSessionIdAllocator => {
  let sequence = start;
  return () => createSemanticDiffExplorerSessionId(sequence++);
};

export const createSemanticDiffExplorerActionIdAllocator = (
  start = 1,
): SemanticDiffExplorerActionIdAllocator => {
  let sequence = start;
  return () => createSemanticDiffExplorerActionId(sequence++);
};

export type SemanticDiffExplorerActionAvailability = Readonly<{
  available: boolean;
  actionId: SemanticDiffExplorerActionId | null;
  unavailableReason:
    | "missing-target-side"
    | "missing-target"
    | "unsupported-target"
    | null;
}>;

export type SemanticDiffExplorerActionSet = Readonly<{
  source: SemanticDiffExplorerActionAvailability;
  flow: SemanticDiffExplorerActionAvailability;
}>;

/**
 * Host-private action membership. The backing collection is deliberately
 * closed over so callers cannot mutate the session's action registry through
 * a Set API or a cast at runtime.
 */
export type SemanticDiffExplorerActionLookup = Readonly<{
  readonly size: number;
  has(value: unknown): value is SemanticDiffExplorerActionId;
  toArray(): readonly SemanticDiffExplorerActionId[];
}>;

export type SemanticDiffExplorerTarget = Readonly<{
  side: SemanticDiffSide | null;
  value: SemanticDiffTarget | null;
}>;

export type SemanticDiffExplorerCardId =
  | "changes"
  | "elements"
  | "attributes"
  | "confirmation-required"
  | "unsupported"
  | "limitations"
  | "schedule-run-changes";

export type SemanticDiffExplorerCard = Readonly<{
  id: SemanticDiffExplorerCardId;
  count: number;
  counts: Readonly<Record<string, number>>;
}>;

export type SemanticDiffExplorerRecordKind =
  | "change"
  | "confirmation"
  | "unsupported"
  | "limitation"
  | "schedule";

export type SemanticDiffExplorerChangeLeaf = Readonly<{
  kind: "change";
  id: string;
  recordId: string;
  changeKind: SemanticDiffChangeKind;
  elementKind: Extract<
    SemanticDiffElementKind,
    "job-group" | "jobnet" | "unit" | "relation" | "attribute"
  >;
  confirmationLevel: SemanticDiffConfirmationLevel;
  attributeCategory: SemanticDiffAttributeCategory | null;
  identityDecisionId: string | null;
  targetSide: SemanticDiffSide;
  target: SemanticDiffExplorerTarget;
  before: SemanticDiffTarget | null;
  after: SemanticDiffTarget | null;
  relationPair: SemanticDiffRelationPair | null;
  detail: SemanticDiffDetail | null;
  constraints: readonly SemanticDiffConstraint[];
  warning: SemanticDiffWarning | null;
  actions: SemanticDiffExplorerActionSet;
}>;

export type SemanticDiffExplorerConfirmationLeaf = Readonly<{
  kind: "confirmation";
  id: string;
  recordId: string;
  reasonCode: SemanticDiffConfirmationReason;
  targetSide: SemanticDiffSide;
  target: SemanticDiffExplorerTarget;
  relatedTargets: readonly SemanticDiffTarget[];
  detail: SemanticDiffDetail;
  constraints: readonly SemanticDiffConstraint[];
  warning: SemanticDiffWarning | null;
  actions: SemanticDiffExplorerActionSet;
}>;

export type SemanticDiffExplorerUnsupportedLeaf = Readonly<{
  kind: "unsupported";
  id: string;
  recordId: string;
  unsupportedKind: SemanticDiffUnsupportedKind;
  reasonCode: SemanticDiffUnsupportedReason;
  targetSide: SemanticDiffSide | null;
  target: SemanticDiffExplorerTarget;
  detail: SemanticDiffDetail;
  warning: SemanticDiffWarning | null;
  actions: SemanticDiffExplorerActionSet;
}>;

export type SemanticDiffExplorerLimitationLeaf = Readonly<{
  kind: "limitation";
  id: string;
  recordId: string;
  limitationKind: SemanticDiffLimitationKind;
  code: string;
  targetSide: SemanticDiffSide | null;
  unitPath: string | null;
  detail: SemanticDiffDetail;
  warning: SemanticDiffWarning | null;
  actions: SemanticDiffExplorerActionSet;
}>;

export type SemanticDiffExplorerScheduleLeaf = Readonly<{
  kind: "schedule";
  id: string;
  recordId: string;
  change: SemanticDiffScheduleRunChange;
  targetSide: null;
  target: SemanticDiffExplorerTarget;
  actions: SemanticDiffExplorerActionSet;
}>;

export type SemanticDiffExplorerLeaf =
  | SemanticDiffExplorerChangeLeaf
  | SemanticDiffExplorerConfirmationLeaf
  | SemanticDiffExplorerUnsupportedLeaf
  | SemanticDiffExplorerLimitationLeaf
  | SemanticDiffExplorerScheduleLeaf;

export type SemanticDiffExplorerTreeNode = Readonly<{
  id: string;
  kind: "root" | "job-group" | "unit";
  label: string;
  path: string | null;
  children: readonly SemanticDiffExplorerTreeNode[];
  leaves: readonly SemanticDiffExplorerLeaf[];
}>;

export type SemanticDiffExplorerFilter = "all" | "confirmation-required";

export type SemanticDiffExplorerViewModel = Readonly<{
  filter: SemanticDiffExplorerFilter;
  cards: readonly SemanticDiffExplorerCard[];
  tree: SemanticDiffExplorerTreeNode;
  leafCount: number;
  status: "findings" | "empty" | "filter-empty";
}>;

/** The session is host-private; only its view model is suitable for transport. */
export type SemanticDiffExplorerSession = Readonly<{
  sessionId: SemanticDiffExplorerSessionId;
  context: SemanticDiffOutputContext;
  displayLanguage: string;
  viewModel: SemanticDiffExplorerViewModel;
  allViewModel: SemanticDiffExplorerViewModel;
  actionIds: SemanticDiffExplorerActionLookup;
}>;

export const COMPARISON_LEVEL_FINDINGS_GROUP = "Comparison-level findings";
