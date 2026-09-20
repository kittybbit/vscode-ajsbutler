import type {
  SemanticDiffScheduleImpact,
  SemanticDiffScheduleImpactCandidateGroup,
  SemanticDiffScheduleImpactIssue,
  SemanticDiffScheduleImpactRoot,
  SemanticDiffScheduleImpactRootOutcome,
  SemanticDiffScheduleImpactRun,
  SemanticDiffScheduleImpactRunState,
  SemanticDiffScheduleImpactTimelineItem,
} from "../../../../application/semantic-diff/semanticDiffScheduleImpact";

export const SCHEDULE_IMPACT_CALENDAR_VIRTUALIZATION_THRESHOLD = 200;
export const SCHEDULE_IMPACT_CALENDAR_OVERSCAN = 20;

export type ScheduleImpactCalendarRunState = SemanticDiffScheduleImpactRunState;
export type ScheduleImpactCalendarRootOutcome =
  SemanticDiffScheduleImpactRootOutcome;

export type ScheduleImpactCalendarFilters = Readonly<{
  rootIds: readonly string[];
  outcomes: readonly ScheduleImpactCalendarRootOutcome[];
  runStates: readonly ScheduleImpactCalendarRunState[];
}>;

export type ScheduleImpactCalendarRootOption = Readonly<{
  id: string;
  label: string;
  outcome: ScheduleImpactCalendarRootOutcome | null;
  scopeTransition: "added-root-scope" | "removed-root-scope" | null;
  counterpartPath: string | null;
}>;

export type ScheduleImpactCalendarTimelineItem = Readonly<{
  item: SemanticDiffScheduleImpactTimelineItem;
  root: SemanticDiffScheduleImpactRoot | undefined;
  accessibleLabel: string;
}>;

export type ScheduleImpactCalendarDateGroup = Readonly<{
  date: string;
  items: readonly ScheduleImpactCalendarTimelineItem[];
}>;

export type ScheduleImpactCalendarModel = Readonly<{
  period: SemanticDiffScheduleImpact["period"];
  filters: ScheduleImpactCalendarFilters;
  roots: readonly SemanticDiffScheduleImpactRoot[];
  rootOptions: readonly ScheduleImpactCalendarRootOption[];
  visibleRoots: readonly SemanticDiffScheduleImpactRoot[];
  visibleRootOptions: readonly ScheduleImpactCalendarRootOption[];
  candidateGroups: readonly SemanticDiffScheduleImpactCandidateGroup[];
  issues: readonly SemanticDiffScheduleImpactIssue[];
  visibleIssues: readonly SemanticDiffScheduleImpactIssue[];
  allItems: readonly ScheduleImpactCalendarTimelineItem[];
  visibleItems: readonly ScheduleImpactCalendarTimelineItem[];
  dateGroups: readonly ScheduleImpactCalendarDateGroup[];
  globalCount: number;
  visibleCount: number;
  filtered: boolean;
  virtualized: boolean;
}>;

const compareText = (left: string, right: string): number =>
  Number(left > right) - Number(left < right);

const compareNumber = (left: number, right: number): number => left - right;

const compareItem = (
  left: SemanticDiffScheduleImpactTimelineItem,
  right: SemanticDiffScheduleImpactTimelineItem,
): number =>
  compareText(left.date, right.date) ||
  compareText(left.time, right.time) ||
  compareNumber(left.rule, right.rule) ||
  compareNumber(left.occurrenceOrdinal, right.occurrenceOrdinal) ||
  compareText(left.id, right.id);

const compareRoot = (
  left: SemanticDiffScheduleImpactRoot,
  right: SemanticDiffScheduleImpactRoot,
): number =>
  compareText(left.canonicalPath, right.canonicalPath) ||
  compareText(left.id, right.id);

const rootOutcome = (
  root: SemanticDiffScheduleImpactRoot,
): SemanticDiffScheduleImpactRootOutcome | null => {
  const outcomes = [root.before?.outcome, root.after?.outcome].filter(
    (value): value is SemanticDiffScheduleImpactRootOutcome =>
      value !== undefined,
  );
  if (outcomes.length === 0) return null;
  if (outcomes.includes("supported-runs")) return "supported-runs";
  if (outcomes.includes("partial")) return "partial";
  if (outcomes.includes("uncalculated")) return "uncalculated";
  return "valid-no-runs";
};

const rootLabel = (root: SemanticDiffScheduleImpactRoot): string =>
  root.after?.unitPath ?? root.before?.unitPath ?? root.canonicalPath;

const rootTransition = (
  root: SemanticDiffScheduleImpactRoot,
): ScheduleImpactCalendarRootOption["scopeTransition"] =>
  root.scopeTransition?.kind ??
  (root.matchKind === "added-root-scope" ||
  root.matchKind === "removed-root-scope"
    ? root.matchKind
    : null);

const rootOutcomes = (
  root: SemanticDiffScheduleImpactRoot,
): readonly ScheduleImpactCalendarRootOutcome[] => [
  ...new Set(
    [root.before?.outcome, root.after?.outcome].filter(
      (value): value is ScheduleImpactCalendarRootOutcome =>
        value !== undefined,
    ),
  ),
];

const defaultFilters = (
  roots: readonly SemanticDiffScheduleImpactRoot[],
): ScheduleImpactCalendarFilters => ({
  rootIds: roots.map((root) => root.id),
  outcomes: ["supported-runs", "valid-no-runs", "partial", "uncalculated"],
  runStates: ["unchanged", "added", "removed", "changed-time"],
});

const hasAll = <T>(selected: readonly T[], available: readonly T[]): boolean =>
  selected.length === available.length &&
  available.every((value) => selected.includes(value));

const allOutcomes: readonly ScheduleImpactCalendarRootOutcome[] = [
  "supported-runs",
  "valid-no-runs",
  "partial",
  "uncalculated",
];
const allRunStates: readonly ScheduleImpactCalendarRunState[] = [
  "unchanged",
  "added",
  "removed",
  "changed-time",
];

export const normalizeScheduleImpactCalendarFilters = (
  filters: Partial<ScheduleImpactCalendarFilters> | undefined,
  roots: readonly SemanticDiffScheduleImpactRoot[],
): ScheduleImpactCalendarFilters => {
  const defaults = defaultFilters(roots);
  const rootIds =
    filters?.rootIds?.filter((id) => roots.some((root) => root.id === id)) ??
    defaults.rootIds;
  const outcomes =
    filters?.outcomes?.filter((outcome) => allOutcomes.includes(outcome)) ??
    defaults.outcomes;
  const runStates =
    filters?.runStates?.filter((state) => allRunStates.includes(state)) ??
    defaults.runStates;
  return {
    rootIds: rootIds.length > 0 ? [...rootIds] : defaults.rootIds,
    outcomes: outcomes.length > 0 ? [...outcomes] : defaults.outcomes,
    runStates: runStates.length > 0 ? [...runStates] : defaults.runStates,
  };
};

const issueOrder = (
  left: SemanticDiffScheduleImpactIssue,
  right: SemanticDiffScheduleImpactIssue,
): number =>
  compareText(left.id, right.id) ||
  compareNumber(left.occurrenceOrdinal, right.occurrenceOrdinal);

const itemLabel = (
  item: SemanticDiffScheduleImpactTimelineItem,
  root: SemanticDiffScheduleImpactRoot | undefined,
): string => {
  const path =
    root?.after?.unitPath ??
    root?.before?.unitPath ??
    item.after?.unitPath ??
    item.before?.unitPath ??
    "";
  const runLabel = (run: SemanticDiffScheduleImpactRun | null): string =>
    run
      ? `${run.side} unitName=${run.unitName} unitPath=${run.unitPath} date=${run.date} time=${run.time} rule=${run.rule} occurrence=${run.occurrenceOrdinal}`
      : "unavailable";
  return `date=${item.date} time=${item.time} path=${path} side=${item.side} rule=${item.rule} occurrence=${item.occurrenceOrdinal} state=${item.state} before=${runLabel(item.before)} after=${runLabel(item.after)}`;
};

const matches = (
  item: SemanticDiffScheduleImpactTimelineItem,
  root: SemanticDiffScheduleImpactRoot | undefined,
  filters: ScheduleImpactCalendarFilters,
): boolean => {
  return (
    Boolean(root) &&
    matchesRoot(root, filters) &&
    filters.runStates.includes(item.state)
  );
};

const matchesRoot = (
  root: SemanticDiffScheduleImpactRoot,
  filters: ScheduleImpactCalendarFilters,
): boolean =>
  filters.rootIds.includes(root.id) &&
  rootOutcomes(root).some((outcome) => filters.outcomes.includes(outcome));

const dateGroups = (
  items: readonly ScheduleImpactCalendarTimelineItem[],
): readonly ScheduleImpactCalendarDateGroup[] => {
  const groups = new Map<string, ScheduleImpactCalendarTimelineItem[]>();
  items.forEach((item) => {
    const group = groups.get(item.item.date) ?? [];
    group.push(item);
    groups.set(item.item.date, group);
  });
  return [...groups.entries()].map(([date, groupedItems]) => ({
    date,
    items: Object.freeze(groupedItems),
  }));
};

export const buildScheduleImpactCalendarModel = (
  sidecar: SemanticDiffScheduleImpact,
  filters?: Partial<ScheduleImpactCalendarFilters>,
): ScheduleImpactCalendarModel => {
  const roots = [...sidecar.roots].sort(compareRoot);
  const normalizedFilters = normalizeScheduleImpactCalendarFilters(
    filters,
    roots,
  );
  const rootsById = new Map(roots.map((root) => [root.id, root]));
  const allItems = [...sidecar.timelineItems].sort(compareItem).map((item) => {
    const root = rootsById.get(item.rootId);
    return { item, root, accessibleLabel: itemLabel(item, root) };
  });
  const visibleItems = allItems.filter(({ item, root }) =>
    matches(item, root, normalizedFilters),
  );
  const rootOptions = roots.map((root) => ({
    id: root.id,
    label: rootLabel(root),
    outcome: rootOutcome(root),
    scopeTransition: rootTransition(root),
    counterpartPath: root.scopeTransition?.counterpartPath ?? null,
  }));
  const visibleRoots = roots.filter((root) =>
    matchesRoot(root, normalizedFilters),
  );
  const visibleRootIds = new Set(visibleRoots.map((root) => root.id));
  const visibleRootOptions = rootOptions.filter((root) =>
    visibleRootIds.has(root.id),
  );
  const issues = Object.freeze([...sidecar.issues].sort(issueOrder));
  const visibleIssues = Object.freeze(
    issues.filter(
      (issue) => issue.rootId === null || visibleRootIds.has(issue.rootId),
    ),
  );
  return Object.freeze({
    period: sidecar.period,
    filters: normalizedFilters,
    roots: Object.freeze(roots),
    rootOptions: Object.freeze(rootOptions),
    visibleRoots: Object.freeze(visibleRoots),
    visibleRootOptions: Object.freeze(visibleRootOptions),
    candidateGroups: sidecar.candidateGroups,
    issues,
    visibleIssues,
    allItems: Object.freeze(allItems),
    visibleItems: Object.freeze(visibleItems),
    dateGroups: dateGroups(visibleItems),
    globalCount: allItems.length,
    visibleCount: visibleItems.length,
    filtered:
      !hasAll(
        normalizedFilters.rootIds,
        roots.map((root) => root.id),
      ) ||
      !hasAll(normalizedFilters.outcomes, allOutcomes) ||
      !hasAll(normalizedFilters.runStates, allRunStates),
    virtualized:
      visibleItems.length > SCHEDULE_IMPACT_CALENDAR_VIRTUALIZATION_THRESHOLD,
  });
};

export const filterScheduleImpactCalendar = (
  sidecar: SemanticDiffScheduleImpact,
  filters: Partial<ScheduleImpactCalendarFilters>,
): ScheduleImpactCalendarModel =>
  buildScheduleImpactCalendarModel(sidecar, filters);

export const getScheduleImpactCalendarRootOutcome = rootOutcome;
export const getScheduleImpactCalendarRootLabel = rootLabel;
export const getScheduleImpactCalendarRootOutcomes = (
  root: SemanticDiffScheduleImpactRoot,
): readonly ScheduleImpactCalendarRootOutcome[] => rootOutcomes(root);
export const buildScheduleImpactCalendarProjection =
  buildScheduleImpactCalendarModel;
export const buildScheduleImpactCalendarViewModel =
  buildScheduleImpactCalendarModel;
export const filterScheduleImpactCalendarModel = filterScheduleImpactCalendar;
