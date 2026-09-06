import type {
  SemanticDiffChange,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffConstraint,
  SemanticDiffDetail,
  SemanticDiffLimitation,
  SemanticDiffRelationEndpoint,
  SemanticDiffRelationPair,
  SemanticDiffScheduleRunChange,
  SemanticDiffSide,
  SemanticDiffTarget,
  SemanticDiffUnsupportedItem,
  SemanticDiffWarning,
} from "./semanticDiffDto";
import type { SemanticDiffOutputContext } from "./semanticDiffDto";
import {
  COMPARISON_LEVEL_FINDINGS_GROUP,
  createSemanticDiffExplorerActionIdAllocator,
  createSemanticDiffExplorerSessionIdAllocator,
  type SemanticDiffExplorerActionAvailability,
  type SemanticDiffExplorerActionId,
  type SemanticDiffExplorerActionIdAllocator,
  type SemanticDiffExplorerActionLookup,
  type SemanticDiffExplorerActionSet,
  type SemanticDiffExplorerCard,
  type SemanticDiffExplorerCardId,
  type SemanticDiffExplorerChangeLeaf,
  type SemanticDiffExplorerConfirmationLeaf,
  type SemanticDiffExplorerFilter,
  type SemanticDiffExplorerLeaf,
  type SemanticDiffExplorerLimitationLeaf,
  type SemanticDiffExplorerScheduleLeaf,
  type SemanticDiffExplorerSession,
  type SemanticDiffExplorerSessionIdAllocator,
  type SemanticDiffExplorerTarget,
  type SemanticDiffExplorerTreeNode,
  type SemanticDiffExplorerUnsupportedLeaf,
  type SemanticDiffExplorerViewModel,
} from "./semanticDiffExplorerDto";

const defaultSessionIds = createSemanticDiffExplorerSessionIdAllocator();
const defaultActionIds = createSemanticDiffExplorerActionIdAllocator();

const leafKindOrder: Record<SemanticDiffExplorerLeaf["kind"], number> = {
  change: 0,
  confirmation: 1,
  unsupported: 2,
  limitation: 3,
  schedule: 4,
};

const freeze = <T>(value: T): Readonly<T> => Object.freeze(value);
const freezeArray = <T>(values: readonly T[]): T[] =>
  Object.freeze([...values]) as unknown as T[];
const unfilteredViewByFilteredView = new WeakMap<
  object,
  SemanticDiffExplorerViewModel
>();

const cloneWarning = (
  warning: SemanticDiffWarning | null,
): SemanticDiffWarning | null =>
  warning === null
    ? null
    : freeze({
        code: warning.code,
        detail: cloneDetail(warning.detail),
        fallbackText: warning.fallbackText,
      });

const cloneDetail = (detail: SemanticDiffDetail): SemanticDiffDetail =>
  freeze({
    unitPath: detail.unitPath,
    parameterKey: detail.parameterKey,
    relationPair: cloneRelationPair(detail.relationPair),
    scheduleRule: detail.scheduleRule,
    period: detail.period === null ? null : freeze({ ...detail.period }),
    beforeValues: freezeArray(detail.beforeValues),
    afterValues: freezeArray(detail.afterValues),
    rawValues: freezeArray(detail.rawValues),
    removedSources: freezeArray(detail.removedSources),
  });

const cloneConstraint = (
  constraint: SemanticDiffConstraint,
): SemanticDiffConstraint =>
  freeze({
    code: constraint.code,
    detail: cloneDetail(constraint.detail),
    warning: cloneWarning(constraint.warning),
  });

const cloneEndpoint = (
  endpoint: SemanticDiffRelationEndpoint | null,
): SemanticDiffRelationEndpoint | null =>
  endpoint === null
    ? null
    : freeze({
        sourceUnitPath: endpoint.sourceUnitPath,
        sourceUnitId: endpoint.sourceUnitId,
        targetUnitPath: endpoint.targetUnitPath,
        targetUnitId: endpoint.targetUnitId,
        type: endpoint.type,
      });

const cloneRelationPair = (
  pair: SemanticDiffRelationPair | null,
): SemanticDiffRelationPair | null =>
  pair === null
    ? null
    : freeze({
        canonicalPair: freeze({ ...pair.canonicalPair }),
        before: cloneEndpoint(pair.before),
        after: cloneEndpoint(pair.after),
      });

const cloneTarget = (
  target: SemanticDiffTarget | null | undefined,
): SemanticDiffTarget | null => {
  if (target === undefined || target === null) return null;
  switch (target.kind) {
    case "job-group":
      return freeze({
        kind: target.kind,
        ...(target.path === undefined ? {} : { path: target.path }),
      });
    case "unit":
    case "jobnet":
      return freeze({ kind: target.kind, unit: freeze({ ...target.unit }) });
    case "relation":
      return freeze({
        kind: target.kind,
        relation: freeze({ ...target.relation }),
      });
    case "attribute":
      return freeze({
        kind: target.kind,
        unit: freeze({ ...target.unit }),
        parameterKey: target.parameterKey,
        category: target.category,
        values: freezeArray(target.values),
      });
  }
};

/** Return the closed, upstream-declared side for a change kind. */
export const semanticDiffChangeTargetSide = (
  kind: SemanticDiffChange["kind"],
): SemanticDiffSide | undefined => {
  switch (kind) {
    case "added":
      return "after";
    case "removed":
      return "before";
    case "changed":
    case "renamed":
    case "moved":
      return "after";
  }
};

/** Return the exhaustive side mapping for the review-risk reason union. */
export const semanticDiffConfirmationTargetSide = (
  reasonCode: SemanticDiffConfirmationRequiredItem["reasonCode"],
): SemanticDiffSide | undefined => {
  switch (reasonCode) {
    case "conditional-relation-removed":
      return "before";
    case "wait-release-source-changed":
    case "timeout-removed":
    case "condition-judgment-changed":
    case "wait-target-changed":
    case "no-calculated-schedule-run":
    case "calculated-schedule-run-removed":
    case "execution-user-type-changed":
    case "jp1-resource-group-changed":
      return "after";
  }
};

export const resolveSemanticDiffChangeTargetSide = semanticDiffChangeTargetSide;
export const resolveSemanticDiffConfirmationTargetSide =
  semanticDiffConfirmationTargetSide;

const pathSegments = (path: string): string[] =>
  path.split("/").filter((segment) => segment.length > 0);

const pathFromSegments = (segments: readonly string[]): string | null =>
  segments.length === 0 ? null : `/${segments.join("/")}`;

const commonParentPath = (
  source: string,
  destination: string,
): string | null => {
  const sourceSegments = pathSegments(source);
  const destinationSegments = pathSegments(destination);
  const sourceParent = sourceSegments.slice(0, -1);
  const destinationParent = destinationSegments.slice(0, -1);
  const common: string[] = [];
  for (
    let index = 0;
    index < Math.min(sourceParent.length, destinationParent.length);
    index += 1
  ) {
    if (sourceParent[index] !== destinationParent[index]) break;
    common.push(sourceParent[index]);
  }
  return pathFromSegments(common);
};

const targetUnitId = (target: SemanticDiffTarget | null): string | null => {
  if (target === null) return null;
  switch (target.kind) {
    case "unit":
    case "jobnet":
    case "attribute":
      return target.unit.id;
    default:
      return null;
  }
};

const explorerTarget = (
  side: SemanticDiffSide | null,
  target: SemanticDiffTarget | null,
): SemanticDiffExplorerTarget => freeze({ side, value: target });

const unavailableAction = (
  unavailableReason: Exclude<
    SemanticDiffExplorerActionAvailability["unavailableReason"],
    null
  >,
): SemanticDiffExplorerActionAvailability =>
  freeze({ available: false, actionId: null, unavailableReason });

const availableAction = (
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): SemanticDiffExplorerActionAvailability =>
  freeze({
    available: true,
    actionId: actionIdAllocator(),
    unavailableReason: null,
  });

const createActionSet = (
  side: SemanticDiffSide | null,
  target: SemanticDiffTarget | null,
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
  relationPair?: SemanticDiffRelationPair | null,
): SemanticDiffExplorerActionSet => {
  if (side === null) {
    return freeze({
      source: unavailableAction("missing-target-side"),
      flow: unavailableAction("missing-target-side"),
    });
  }
  if (target === null) {
    return freeze({
      source: unavailableAction("missing-target"),
      flow: unavailableAction("missing-target"),
    });
  }

  const id = targetUnitId(target);
  const source =
    id === null
      ? unavailableAction("unsupported-target")
      : availableAction(actionIdAllocator);

  if (target.kind === "relation") {
    const endpoint = relationPair?.[side];
    const flowAvailable =
      endpoint !== null &&
      endpoint !== undefined &&
      endpoint.sourceUnitId.length > 0 &&
      endpoint.targetUnitId.length > 0 &&
      endpoint.sourceUnitPath !== null &&
      endpoint.targetUnitPath !== null;
    return freeze({
      source: unavailableAction("unsupported-target"),
      flow: flowAvailable
        ? availableAction(actionIdAllocator)
        : unavailableAction("missing-target"),
    });
  }

  return freeze({
    source,
    flow:
      id === null
        ? unavailableAction("unsupported-target")
        : availableAction(actionIdAllocator),
  });
};

const changeLeaf = (
  change: SemanticDiffChange,
  occurrence: number,
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): SemanticDiffExplorerChangeLeaf => {
  const side = semanticDiffChangeTargetSide(change.kind);
  if (side === undefined)
    throw new TypeError("Unknown Semantic Diff change kind.");
  const before = cloneTarget(change.before);
  const after = cloneTarget(change.after);
  const target = side === "before" ? before : after;
  return freeze({
    kind: "change",
    id: `change:${change.id}:${occurrence}`,
    recordId: change.id,
    changeKind: change.kind,
    elementKind: change.elementKind,
    confirmationLevel: change.confirmationLevel,
    attributeCategory: change.attributeCategory ?? null,
    identityDecisionId: change.identityDecisionId ?? null,
    targetSide: side,
    target: explorerTarget(side, target),
    before,
    after,
    relationPair: cloneRelationPair(change.relationPair),
    detail: null,
    constraints: freeze([]),
    warning: null,
    actions: createActionSet(
      side,
      target,
      actionIdAllocator,
      change.relationPair,
    ),
  });
};

const confirmationLeaf = (
  item: SemanticDiffConfirmationRequiredItem,
  occurrence: number,
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): SemanticDiffExplorerConfirmationLeaf => {
  const side = semanticDiffConfirmationTargetSide(item.reasonCode);
  if (side === undefined)
    throw new TypeError("Unknown Semantic Diff confirmation reason.");
  const target = cloneTarget(item.target);
  return freeze({
    kind: "confirmation",
    id: `confirmation:${item.id}:${occurrence}`,
    recordId: item.id,
    reasonCode: item.reasonCode,
    targetSide: side,
    target: explorerTarget(side, target),
    relatedTargets: freeze(
      item.relatedTargets.map(
        (related) => cloneTarget(related) as SemanticDiffTarget,
      ),
    ),
    detail: cloneDetail(item.detail),
    constraints: freeze(item.constraints.map(cloneConstraint)),
    warning: cloneWarning(item.warning),
    actions: createActionSet(
      side,
      target,
      actionIdAllocator,
      item.detail.relationPair,
    ),
  });
};

const unsupportedLeaf = (
  item: SemanticDiffUnsupportedItem,
  occurrence: number,
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): SemanticDiffExplorerUnsupportedLeaf => {
  const target = cloneTarget(item.target);
  return freeze({
    kind: "unsupported",
    id: `unsupported:${item.id}:${occurrence}`,
    recordId: item.id,
    unsupportedKind: item.kind,
    reasonCode: item.reasonCode,
    targetSide: item.side,
    target: explorerTarget(item.side, target),
    detail: cloneDetail(item.detail),
    warning: cloneWarning(item.warning),
    actions: createActionSet(
      item.side,
      target,
      actionIdAllocator,
      item.detail.relationPair,
    ),
  });
};

const limitationLeaf = (
  item: SemanticDiffLimitation,
  occurrence: number,
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): SemanticDiffExplorerLimitationLeaf =>
  freeze({
    kind: "limitation",
    id: `limitation:${item.code}:${occurrence}`,
    recordId: item.code,
    limitationKind: item.kind,
    code: item.code,
    targetSide: item.side,
    unitPath: item.unitPath,
    detail: cloneDetail(item.detail),
    warning: cloneWarning(item.warning),
    actions: unavailableActionSetForLimitation(item, actionIdAllocator),
  });

const unavailableActionSetForLimitation = (
  item: SemanticDiffLimitation,
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): SemanticDiffExplorerActionSet => {
  // A limitation has no semantic unit target.  Its declared side is retained,
  // but no source/Flow target is invented from its display path.
  void item;
  void actionIdAllocator;
  return freeze({
    source: unavailableAction("unsupported-target"),
    flow: unavailableAction("unsupported-target"),
  });
};

const scheduleLeaf = (
  change: SemanticDiffScheduleRunChange,
  occurrence: number,
): SemanticDiffExplorerScheduleLeaf =>
  freeze({
    kind: "schedule",
    id: `schedule:${change.id}:${occurrence}`,
    recordId: change.id,
    change: freeze({
      ...change,
      before: change.before === null ? null : freeze({ ...change.before }),
      after: change.after === null ? null : freeze({ ...change.after }),
    }),
    targetSide: null,
    target: explorerTarget(null, null),
    actions: freeze({
      source: unavailableAction("missing-target-side"),
      flow: unavailableAction("missing-target-side"),
    }),
  });

type PathPlacement = {
  segments: readonly string[];
  path: string | null;
  finalKind: "job-group" | "unit";
};

const placementForTarget = (
  target: SemanticDiffTarget | null,
  relationPair: SemanticDiffRelationPair | null = null,
  relationSide: SemanticDiffSide | null = null,
): PathPlacement | null => {
  if (target === null) return null;
  switch (target.kind) {
    case "job-group": {
      if (target.path === undefined || target.path.length === 0) return null;
      const segments = pathSegments(target.path);
      return segments.length === 0
        ? null
        : {
            segments,
            path: pathFromSegments(segments),
            finalKind: "job-group",
          };
    }
    case "unit":
    case "jobnet":
    case "attribute": {
      const segments = pathSegments(target.unit.absolutePath);
      return segments.length === 0
        ? null
        : { segments, path: pathFromSegments(segments), finalKind: "unit" };
    }
    case "relation": {
      // Relation hierarchy is based on the canonical endpoint pair supplied
      // by comparison, never on the display target's denormalized paths.
      const endpoint =
        relationPair !== null && relationSide !== null
          ? relationPair[relationSide]
          : null;
      const source = endpoint?.sourceUnitPath ?? null;
      const destination = endpoint?.targetUnitPath ?? null;
      if (source === null || destination === null) return null;
      const relationPath = commonParentPath(source, destination);
      if (relationPath === null) return null;
      const segments = pathSegments(relationPath);
      return segments.length === 0
        ? null
        : { segments, path: relationPath, finalKind: "job-group" };
    }
  }
};

const placementForLimitation = (
  item: Pick<SemanticDiffLimitation, "unitPath">,
): PathPlacement | null => {
  if (item.unitPath === null || item.unitPath.length === 0) return null;
  const segments = pathSegments(item.unitPath);
  return segments.length === 0
    ? null
    : { segments, path: pathFromSegments(segments), finalKind: "unit" };
};

const placementForSchedule = (
  item: SemanticDiffScheduleRunChange,
): PathPlacement | null => {
  if (item.unitPath.length === 0) return null;
  const segments = pathSegments(item.unitPath);
  return segments.length === 0
    ? null
    : { segments, path: pathFromSegments(segments), finalKind: "unit" };
};

const placementForLeaf = (
  leaf: SemanticDiffExplorerLeaf,
): PathPlacement | null => {
  switch (leaf.kind) {
    case "change":
      return placementForTarget(
        leaf.target.value,
        leaf.relationPair,
        leaf.targetSide,
      );
    case "confirmation":
      return placementForTarget(
        leaf.target.value,
        leaf.detail.relationPair,
        leaf.targetSide,
      );
    case "unsupported":
      return placementForTarget(
        leaf.target.value,
        leaf.detail.relationPair,
        leaf.targetSide,
      );
    case "limitation":
      return placementForLimitation({ unitPath: leaf.unitPath });
    case "schedule":
      return placementForSchedule(leaf.change);
  }
};

type MutableTreeNode = {
  id: string;
  kind: "root" | "job-group" | "unit";
  label: string;
  path: string | null;
  children: Map<string, MutableTreeNode>;
  leaves: SemanticDiffExplorerLeaf[];
};

const newMutableNode = (
  id: string,
  kind: MutableTreeNode["kind"],
  label: string,
  path: string | null,
): MutableTreeNode => ({
  id,
  kind,
  label,
  path,
  children: new Map(),
  leaves: [],
});

const insertLeaf = (
  root: MutableTreeNode,
  leaf: SemanticDiffExplorerLeaf,
): void => {
  const placement = placementForLeaf(leaf);
  if (placement === null) {
    const key = "comparison-level";
    let group = root.children.get(key);
    if (group === undefined) {
      group = newMutableNode(
        "group:comparison-level",
        "job-group",
        COMPARISON_LEVEL_FINDINGS_GROUP,
        null,
      );
      root.children.set(key, group);
    }
    group.leaves.push(leaf);
    return;
  }

  let current = root;
  placement.segments.forEach((segment, index) => {
    const currentPath = pathFromSegments(
      placement.segments.slice(0, index + 1),
    );
    const kind =
      index === placement.segments.length - 1
        ? placement.finalKind
        : "job-group";
    const key = `${kind}\u0000${currentPath ?? ""}`;
    let child = current.children.get(key);
    if (child === undefined) {
      child = newMutableNode(
        `${kind}:${currentPath ?? ""}`,
        kind,
        segment,
        currentPath,
      );
      current.children.set(key, child);
    }
    current = child;
  });
  current.leaves.push(leaf);
};

const compareUtf16 = (left: string, right: string): number => {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const difference = left.charCodeAt(index) - right.charCodeAt(index);
    if (difference !== 0) return difference;
  }
  return left.length - right.length;
};

/** Canonical object-key ordering makes same-ID, different-fact records stable. */
const stableValueKey = (value: unknown): string => {
  if (value === null) return "null";
  switch (typeof value) {
    case "string":
      return `string:${JSON.stringify(value)}`;
    case "number":
    case "boolean":
      return `${typeof value}:${String(value)}`;
    case "undefined":
      return "undefined";
    case "object": {
      if (Array.isArray(value))
        return `[${value.map((item) => stableValueKey(item)).join(",")}]`;
      const record = value as Record<string, unknown>;
      return `{${Object.keys(record)
        .sort(compareUtf16)
        .map((key) => `${JSON.stringify(key)}:${stableValueKey(record[key])}`)
        .join(",")}}`;
    }
    default:
      return `${typeof value}:${String(value)}`;
  }
};

const leafSortKey = (leaf: SemanticDiffExplorerLeaf): string => {
  switch (leaf.kind) {
    case "change":
    case "confirmation":
    case "unsupported":
    case "limitation":
      return leaf.recordId;
    case "schedule":
      return leaf.recordId;
  }
};

const freezeTree = (node: MutableTreeNode): SemanticDiffExplorerTreeNode => {
  const children = [...node.children.values()]
    .sort((left, right) => {
      const leftIsComparison = left.path === null;
      const rightIsComparison = right.path === null;
      if (leftIsComparison !== rightIsComparison)
        return leftIsComparison ? 1 : -1;
      const labelDifference = compareUtf16(left.label, right.label);
      return labelDifference !== 0
        ? labelDifference
        : compareUtf16(left.id, right.id);
    })
    .map(freezeTree);
  const leaves = [...node.leaves].sort((left, right) => {
    const kindDifference = leafKindOrder[left.kind] - leafKindOrder[right.kind];
    if (kindDifference !== 0) return kindDifference;
    const keyDifference = compareUtf16(leafSortKey(left), leafSortKey(right));
    return keyDifference !== 0
      ? keyDifference
      : compareUtf16(left.id, right.id);
  });
  return freeze({
    id: node.id,
    kind: node.kind,
    label: node.label,
    path: node.path,
    children: freeze(children),
    leaves: freeze(leaves),
  });
};

const buildTree = (
  leaves: readonly SemanticDiffExplorerLeaf[],
): SemanticDiffExplorerTreeNode => {
  const root = newMutableNode("root", "root", "Semantic Diff", null);
  leaves.forEach((leaf) => insertLeaf(root, leaf));
  return freezeTree(root);
};

const card = (
  id: SemanticDiffExplorerCardId,
  count: number,
  counts: Readonly<Record<string, number>>,
): SemanticDiffExplorerCard =>
  freeze({ id, count, counts: freeze({ ...counts }) });

const total = (counts: Readonly<Record<string, number>>): number =>
  Object.values(counts).reduce((sum, count) => sum + count, 0);

const buildCards = (
  context: SemanticDiffOutputContext,
): readonly SemanticDiffExplorerCard[] => {
  const summary = context.summary;
  return freeze([
    card(
      "changes",
      total(summary.changeCountsByKind),
      summary.changeCountsByKind,
    ),
    card(
      "elements",
      total(summary.changeCountsByElementKind),
      summary.changeCountsByElementKind,
    ),
    card(
      "attributes",
      total(summary.changeCountsByAttributeCategory),
      summary.changeCountsByAttributeCategory,
    ),
    card("confirmation-required", summary.confirmationRequiredCount, {
      required: summary.confirmationRequiredCount,
    }),
    card(
      "unsupported",
      total(summary.unsupportedCountsByKind),
      summary.unsupportedCountsByKind,
    ),
    card("limitations", summary.limitationCount, {
      total: summary.limitationCount,
    }),
    card("schedule-run-changes", summary.scheduleRunChangeCount, {
      total: summary.scheduleRunChangeCount,
    }),
  ]);
};

const createLeaves = (
  context: SemanticDiffOutputContext,
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): readonly SemanticDiffExplorerLeaf[] => {
  const leaves: SemanticDiffExplorerLeaf[] = [];
  const sortByIdentifier = <T>(
    records: readonly T[],
    identifier: (record: T) => string,
  ): T[] =>
    [...records].sort((left, right) => {
      const identifierDifference = compareUtf16(
        identifier(left),
        identifier(right),
      );
      return identifierDifference !== 0
        ? identifierDifference
        : compareUtf16(stableValueKey(left), stableValueKey(right));
    });
  const occurrences = new Map<string, number>();
  const nextOccurrence = (key: string): number => {
    const occurrence = occurrences.get(key) ?? 0;
    occurrences.set(key, occurrence + 1);
    return occurrence;
  };
  sortByIdentifier(context.result.changes, (change) => change.id).forEach(
    (change) =>
      leaves.push(
        changeLeaf(
          change,
          nextOccurrence(`change:${change.id}`),
          actionIdAllocator,
        ),
      ),
  );
  sortByIdentifier(
    context.result.confirmationRequired,
    (item) => item.id,
  ).forEach((item) =>
    leaves.push(
      confirmationLeaf(
        item,
        nextOccurrence(`confirmation:${item.id}`),
        actionIdAllocator,
      ),
    ),
  );
  sortByIdentifier(context.result.unsupportedItems, (item) => item.id).forEach(
    (item) =>
      leaves.push(
        unsupportedLeaf(
          item,
          nextOccurrence(`unsupported:${item.id}`),
          actionIdAllocator,
        ),
      ),
  );
  sortByIdentifier(context.result.limitations, (item) => item.code).forEach(
    (item) =>
      leaves.push(
        limitationLeaf(
          item,
          nextOccurrence(`limitation:${item.code}`),
          actionIdAllocator,
        ),
      ),
  );
  sortByIdentifier(
    context.result.scheduleComparison?.runChanges ?? [],
    (item) => item.id,
  ).forEach((item) =>
    leaves.push(scheduleLeaf(item, nextOccurrence(`schedule:${item.id}`))),
  );
  return freeze(leaves);
};

const hasConfirmation = (leaf: SemanticDiffExplorerLeaf): boolean =>
  leaf.kind === "confirmation" ||
  (leaf.kind === "change" &&
    leaf.confirmationLevel === "confirmation-required");

const filterTree = (
  node: SemanticDiffExplorerTreeNode,
  filter: SemanticDiffExplorerFilter,
): SemanticDiffExplorerTreeNode | null => {
  const leaves =
    filter === "all" ? node.leaves : node.leaves.filter(hasConfirmation);
  const children = node.children
    .map((child) => filterTree(child, filter))
    .filter((child): child is SemanticDiffExplorerTreeNode => child !== null);
  if (node.kind !== "root" && leaves.length === 0 && children.length === 0)
    return null;
  return freeze({
    ...node,
    leaves: freeze(leaves),
    children: freeze(children),
  });
};

const countLeaves = (node: SemanticDiffExplorerTreeNode): number =>
  node.leaves.length +
  node.children.reduce((sum, child) => sum + countLeaves(child), 0);

const createViewModel = (
  cards: readonly SemanticDiffExplorerCard[],
  tree: SemanticDiffExplorerTreeNode,
  filter: SemanticDiffExplorerFilter,
): SemanticDiffExplorerViewModel => {
  const leafCount = countLeaves(tree);
  return freeze({
    filter,
    cards,
    tree,
    leafCount,
    status:
      leafCount > 0 ? "findings" : filter === "all" ? "empty" : "filter-empty",
  });
};

export type BuildSemanticDiffExplorerViewOptions = {
  readonly actionIdAllocator?: SemanticDiffExplorerActionIdAllocator;
};

/**
 * Build the browser-safe projection from one already-built output context.
 * This function deliberately reads context.summary and never invokes the
 * summary builder or any comparison rule.
 */
export const buildSemanticDiffExplorerViewModel = (
  context: SemanticDiffOutputContext,
  options: BuildSemanticDiffExplorerViewOptions = {},
): SemanticDiffExplorerViewModel => {
  const actionIdAllocator = options.actionIdAllocator ?? defaultActionIds;
  const leaves = createLeaves(context, actionIdAllocator);
  return createViewModel(buildCards(context), buildTree(leaves), "all");
};

export const buildSemanticDiffExplorerView = buildSemanticDiffExplorerViewModel;

/** Apply only the panel-local filter; cards and context remain unchanged. */
export const filterSemanticDiffExplorerViewModel = (
  viewModel: SemanticDiffExplorerViewModel,
  filter: SemanticDiffExplorerFilter,
): SemanticDiffExplorerViewModel => {
  if (viewModel.filter === filter) return viewModel;
  const unfiltered =
    filter === "all"
      ? (unfilteredViewByFilteredView.get(viewModel) ?? viewModel)
      : viewModel;
  const tree = filterTree(viewModel.tree, filter);
  if (tree === null) throw new Error("The Explorer root cannot be removed.");
  const filtered = createViewModel(viewModel.cards, tree, filter);
  if (filter !== "all") unfilteredViewByFilteredView.set(filtered, viewModel);
  else if (unfiltered !== viewModel) return unfiltered;
  return filtered;
};

export const applySemanticDiffExplorerFilter =
  filterSemanticDiffExplorerViewModel;

export type CreateSemanticDiffExplorerSessionOptions = {
  readonly displayLanguage?: string;
  readonly sessionIdAllocator?: SemanticDiffExplorerSessionIdAllocator;
  readonly actionIdAllocator?: SemanticDiffExplorerActionIdAllocator;
};

const actionIdsInTree = (
  tree: SemanticDiffExplorerTreeNode,
): Set<SemanticDiffExplorerActionId> => {
  const ids = new Set<SemanticDiffExplorerActionId>();
  const collect = (node: SemanticDiffExplorerTreeNode): void => {
    node.leaves.forEach((leaf) => {
      [leaf.actions.source, leaf.actions.flow].forEach((action) => {
        if (action.actionId !== null) ids.add(action.actionId);
      });
    });
    node.children.forEach(collect);
  };
  collect(tree);
  return ids;
};

const createActionLookup = (
  ids: Iterable<SemanticDiffExplorerActionId>,
): SemanticDiffExplorerActionLookup => {
  const values = freezeArray([...new Set(ids)]);
  const membership = new Set(values);
  return Object.freeze({
    size: values.length,
    has: (value: unknown): value is SemanticDiffExplorerActionId =>
      typeof value === "string" &&
      membership.has(value as SemanticDiffExplorerActionId),
    toArray: (): readonly SemanticDiffExplorerActionId[] => values,
  });
};

/** Create one session while retaining the exact context object identity. */
export const createSemanticDiffExplorerSession = (
  context: SemanticDiffOutputContext,
  options: CreateSemanticDiffExplorerSessionOptions = {},
): SemanticDiffExplorerSession => {
  const allViewModel = buildSemanticDiffExplorerViewModel(context, {
    actionIdAllocator: options.actionIdAllocator,
  });
  const actionIds = actionIdsInTree(allViewModel.tree);
  return freeze({
    sessionId: (options.sessionIdAllocator ?? defaultSessionIds)(),
    context,
    displayLanguage: options.displayLanguage ?? "en",
    viewModel: allViewModel,
    allViewModel,
    actionIds: createActionLookup(actionIds),
  });
};

export const setSemanticDiffExplorerFilter = (
  session: SemanticDiffExplorerSession,
  filter: SemanticDiffExplorerFilter,
): SemanticDiffExplorerSession => {
  if (session.viewModel.filter === filter) return session;
  return freeze({
    ...session,
    viewModel: filterSemanticDiffExplorerViewModel(
      session.allViewModel,
      filter,
    ),
  });
};

export const getSemanticDiffExplorerActionIds = (
  session: SemanticDiffExplorerSession,
): readonly SemanticDiffExplorerActionId[] => session.actionIds.toArray();
