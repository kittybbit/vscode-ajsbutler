import type {
  SemanticDiffResult,
  SemanticDiffScheduleRunChange,
  SemanticDiffSide,
} from "./semanticDiffDto";
import type {
  SemanticDiffScheduleImpactRoot,
  SemanticDiffScheduleImpactRootSide,
  SemanticDiffScheduleImpactRun,
  SemanticDiffScheduleImpactRunState,
  SemanticDiffScheduleImpactTimelineItem,
} from "./semanticDiffScheduleImpactDto";
import {
  compareInOrder,
  compareNumbers,
  compareOrdinal,
  encodeSemanticDiffScheduleImpactId,
  type SourceKeyForRun,
} from "./semanticDiffScheduleImpactIdentity";

type TimelineRun = SemanticDiffScheduleImpactRun;
type TimelineRunGroups = ReadonlyMap<string, readonly TimelineRun[]>;

type TimelineGroupKeyInput = {
  root: SemanticDiffScheduleImpactRoot;
  side: SemanticDiffSide;
  run: TimelineRun;
  sourceKeyForRun: SourceKeyForRun;
};

const timelineGroupKey = (input: TimelineGroupKeyInput): string =>
  encodeSemanticDiffScheduleImpactId(
    input.sourceKeyForRun(input.root, input.side, input.run),
    input.run.date,
    input.run.rule,
  );

type TimelineRunGroupInput = {
  root: SemanticDiffScheduleImpactRoot;
  side: SemanticDiffSide;
  runs: readonly TimelineRun[];
  sourceKeyForRun: SourceKeyForRun;
};

const groupTimelineRuns = (input: TimelineRunGroupInput): TimelineRunGroups => {
  const groups = new Map<string, TimelineRun[]>();
  input.runs.forEach((run) => {
    const key = timelineGroupKey({
      root: input.root,
      side: input.side,
      run,
      sourceKeyForRun: input.sourceKeyForRun,
    });
    groups.set(key, [...(groups.get(key) ?? []), run]);
  });
  return groups;
};

const timelineRunOrder = (left: TimelineRun, right: TimelineRun): number =>
  compareInOrder([
    () => compareOrdinal(left.time, right.time),
    () => compareOrdinal(left.unitPath, right.unitPath),
    () => compareOrdinal(left.unitId, right.unitId),
    () => compareOrdinal(left.unitName, right.unitName),
  ]);

const sortedTimelineRuns = (runs: readonly TimelineRun[]): TimelineRun[] =>
  [...runs].sort(timelineRunOrder);

const timelineGroupKeys = (
  before: TimelineRunGroups,
  after: TimelineRunGroups,
): string[] =>
  [...new Set([...before.keys(), ...after.keys()])].sort(compareOrdinal);

const runPairState = (
  before: TimelineRun | null,
  after: TimelineRun | null,
): SemanticDiffScheduleImpactRunState => {
  const hasBefore = before !== null;
  const hasAfter = after !== null;
  const sameTime = hasBefore && hasAfter && before.time === after.time;
  const state = `${hasBefore}:${hasAfter}:${sameTime}`;
  return (
    new Map<string, SemanticDiffScheduleImpactRunState>([
      ["true:true:true", "unchanged"],
      ["true:true:false", "changed-time"],
      ["true:false:false", "removed"],
      ["false:true:false", "added"],
    ]).get(state) ?? "added"
  );
};

const timelineSides: ReadonlyMap<
  SemanticDiffScheduleImpactRunState,
  SemanticDiffSide | "pair"
> = new Map([
  ["unchanged", "pair"],
  ["changed-time", "pair"],
  ["added", "after"],
  ["removed", "before"],
]);

const timelineSide = (
  state: SemanticDiffScheduleImpactRunState,
): SemanticDiffSide | "pair" => timelineSides.get(state)!;

const timelineTime = (
  state: SemanticDiffScheduleImpactRunState,
  before: TimelineRun | null,
  after: TimelineRun | null,
): string =>
  new Map<
    string,
    (before: TimelineRun | null, after: TimelineRun | null) => string
  >([
    [
      "changed-time",
      (before, after) =>
        encodeSemanticDiffScheduleImpactId(before!.time, after!.time),
    ],
    ["unchanged", (_, after) => after!.time],
    ["removed", (before) => before!.time],
    ["added", (_, after) => after!.time],
  ]).get(state)!(before, after);

type TimelineSourceKeyInput = {
  root: SemanticDiffScheduleImpactRoot;
  before: TimelineRun | null;
  after: TimelineRun | null;
  sourceKeyForRun: SourceKeyForRun;
};

const timelineSourceKey = (input: TimelineSourceKeyInput): string => {
  const side = new Map<boolean, SemanticDiffSide>([
    [true, "before"],
    [false, "after"],
  ]).get(input.before !== null)!;
  return input.sourceKeyForRun(input.root, side, input.before ?? input.after!);
};

const timelineItemForPair = (input: {
  root: SemanticDiffScheduleImpactRoot;
  before: TimelineRun | null;
  after: TimelineRun | null;
  ordinal: number;
  sourceKeyForRun: SourceKeyForRun;
}): SemanticDiffScheduleImpactTimelineItem => {
  const state = runPairState(input.before, input.after);
  const side = timelineSide(state);
  const source = input.after ?? input.before;
  const sourceKey = timelineSourceKey({
    root: input.root,
    before: input.before,
    after: input.after,
    sourceKeyForRun: input.sourceKeyForRun,
  });
  return {
    id: encodeSemanticDiffScheduleImpactId(
      "timeline",
      side,
      input.root.id,
      sourceKey,
      source!.date,
      timelineTime(state, input.before, input.after),
      source!.rule,
      input.ordinal,
    ),
    state,
    side,
    rootId: input.root.id,
    date: source!.date,
    time: timelineTime(state, input.before, input.after),
    rule: source!.rule,
    occurrenceOrdinal: input.ordinal,
    before: input.before,
    after: input.after,
    sourceChangeRef:
      input.before?.sourceChangeRef ?? input.after?.sourceChangeRef ?? null,
  };
};

const timelineItemsForGroup = (input: {
  root: SemanticDiffScheduleImpactRoot;
  key: string;
  beforeGroups: TimelineRunGroups;
  afterGroups: TimelineRunGroups;
  sourceKeyForRun: SourceKeyForRun;
}): SemanticDiffScheduleImpactTimelineItem[] => {
  const beforeRuns = sortedTimelineRuns(
    input.beforeGroups.get(input.key) ?? [],
  );
  const afterRuns = sortedTimelineRuns(input.afterGroups.get(input.key) ?? []);
  const maxRuns = Math.max(beforeRuns.length, afterRuns.length);
  return Array.from({ length: maxRuns }, (_, ordinal) =>
    timelineItemForPair({
      root: input.root,
      before: beforeRuns[ordinal] ?? null,
      after: afterRuns[ordinal] ?? null,
      ordinal,
      sourceKeyForRun: input.sourceKeyForRun,
    }),
  );
};

const matchRuns = (input: {
  root: SemanticDiffScheduleImpactRoot;
  before: readonly SemanticDiffScheduleImpactRun[];
  after: readonly SemanticDiffScheduleImpactRun[];
  sourceKeyForRun: SourceKeyForRun;
}): SemanticDiffScheduleImpactTimelineItem[] => {
  const beforeGroups = groupTimelineRuns({
    root: input.root,
    side: "before",
    runs: input.before,
    sourceKeyForRun: input.sourceKeyForRun,
  });
  const afterGroups = groupTimelineRuns({
    root: input.root,
    side: "after",
    runs: input.after,
    sourceKeyForRun: input.sourceKeyForRun,
  });
  return timelineGroupKeys(beforeGroups, afterGroups).flatMap((key) =>
    timelineItemsForGroup({
      root: input.root,
      key,
      beforeGroups,
      afterGroups,
      sourceKeyForRun: input.sourceKeyForRun,
    }),
  );
};

const timelineOrder = (
  left: SemanticDiffScheduleImpactTimelineItem,
  right: SemanticDiffScheduleImpactTimelineItem,
): number =>
  compareInOrder([
    () => compareOrdinal(left.rootId, right.rootId),
    () =>
      compareOrdinal(
        left.before?.id ?? left.after?.id ?? "",
        right.before?.id ?? right.after?.id ?? "",
      ),
    () => compareOrdinal(left.date, right.date),
    () => compareNumbers(left.rule, right.rule),
    () => compareOrdinal(left.time, right.time),
    () => compareNumbers(left.occurrenceOrdinal, right.occurrenceOrdinal),
  ]);

const timeline = (
  roots: readonly SemanticDiffScheduleImpactRoot[],
  sourceKeyForRun: SourceKeyForRun,
): SemanticDiffScheduleImpactTimelineItem[] =>
  roots
    .flatMap((root) =>
      matchRuns({
        root,
        before: root.before?.runs ?? [],
        after: root.after?.runs ?? [],
        sourceKeyForRun,
      }),
    )
    .sort(timelineOrder);

type SourceChangeReference = Readonly<{
  id: string;
  occurrenceOrdinal: number;
}>;

const changedTimeMatches = (
  change: SemanticDiffScheduleRunChange,
  item: SemanticDiffScheduleImpactTimelineItem,
): boolean =>
  [
    change.before?.rule === item.rule,
    change.after?.rule === item.rule,
    change.before?.time === (item.before?.time ?? ""),
    change.after?.time === (item.after?.time ?? ""),
  ].every(Boolean);

type OneSidedScheduleRunChange = SemanticDiffScheduleRunChange;

const oneSidedChangeMatches = (
  change: OneSidedScheduleRunChange,
  item: SemanticDiffScheduleImpactTimelineItem,
): boolean => {
  const changedRun = {
    added: change.after,
    removed: change.before,
  }[change.kind];
  const expectedTime = {
    added: item.after?.time ?? "",
    removed: item.before?.time ?? "",
  }[change.kind];
  return [
    changedRun?.rule === item.rule,
    changedRun?.time === expectedTime,
  ].every(Boolean);
};

const sourceChangeIdentityMatches = (
  change: SemanticDiffScheduleRunChange,
  item: SemanticDiffScheduleImpactTimelineItem,
  source: SemanticDiffScheduleImpactRun,
): boolean =>
  [
    change.unitPath === source.unitPath,
    change.date === item.date,
    change.kind === item.state,
  ].every(Boolean);

const sourceChangeValueMatches = (
  change: SemanticDiffScheduleRunChange,
  item: SemanticDiffScheduleImpactTimelineItem,
): boolean =>
  new Map<string, (change: SemanticDiffScheduleRunChange) => boolean>([
    ["changed-time", (candidate) => changedTimeMatches(candidate, item)],
    ["added", (candidate) => oneSidedChangeMatches(candidate, item)],
    ["removed", (candidate) => oneSidedChangeMatches(candidate, item)],
  ]).get(change.kind)!(change);

const sourceChangeMatches = (
  change: SemanticDiffScheduleRunChange,
  item: SemanticDiffScheduleImpactTimelineItem,
): boolean => {
  const source = item.after ?? item.before;
  const matcher = new Map<boolean, () => boolean>([
    [
      true,
      () =>
        [
          sourceChangeIdentityMatches(change, item, source!),
          sourceChangeValueMatches(change, item),
        ].every(Boolean),
    ],
    [false, () => false],
  ]).get(source !== undefined)!;
  return matcher();
};

const sourceChangeCandidateIndex = (
  changes: readonly SemanticDiffScheduleRunChange[],
  item: SemanticDiffScheduleImpactTimelineItem,
  usedChangeIndices: ReadonlySet<number>,
): number =>
  changes.findIndex((change, index) =>
    [!usedChangeIndices.has(index), sourceChangeMatches(change, item)].every(
      Boolean,
    ),
  );

const sourceChangeOccurrenceOrdinal = (
  changes: readonly SemanticDiffScheduleRunChange[],
  candidateIndex: number,
): number => {
  const candidate = changes[candidateIndex];
  return changes
    .slice(0, candidateIndex)
    .filter((change) => change.id === candidate.id).length;
};

const sourceChangeReferenceForChangedItem = (
  changes: readonly SemanticDiffScheduleRunChange[],
  item: SemanticDiffScheduleImpactTimelineItem,
  usedChangeIndices: Set<number>,
): SourceChangeReference | null => {
  const candidateIndex = sourceChangeCandidateIndex(
    changes,
    item,
    usedChangeIndices,
  );
  if (candidateIndex < 0) return null;
  usedChangeIndices.add(candidateIndex);
  const candidate = changes[candidateIndex];
  return {
    id: candidate.id,
    occurrenceOrdinal: sourceChangeOccurrenceOrdinal(changes, candidateIndex),
  };
};

const sourceChangeRefForTimelineItem = (
  result: SemanticDiffResult,
  item: SemanticDiffScheduleImpactTimelineItem,
  usedChangeIndices: Set<number>,
): SourceChangeReference | null => {
  const changes = result.scheduleComparison?.runChanges ?? [];
  if (item.state === "unchanged") return null;
  return sourceChangeReferenceForChangedItem(changes, item, usedChangeIndices);
};

const timelineItemsWithReferences = (
  result: SemanticDiffResult,
  roots: readonly SemanticDiffScheduleImpactRoot[],
  sourceKeyForRun: SourceKeyForRun,
): SemanticDiffScheduleImpactTimelineItem[] => {
  const usedChangeIndices = new Set<number>();
  return timeline(roots, sourceKeyForRun).map((item) => ({
    ...item,
    sourceChangeRef: sourceChangeRefForTimelineItem(
      result,
      item,
      usedChangeIndices,
    ),
  }));
};

const addTimelineRunReferences = (
  referencesByRunId: Map<string, SourceChangeReference>,
  item: SemanticDiffScheduleImpactTimelineItem,
): void => {
  if (!item.sourceChangeRef) return;
  [item.before, item.after]
    .filter((run): run is SemanticDiffScheduleImpactRun => run !== null)
    .forEach((run) => referencesByRunId.set(run.id, item.sourceChangeRef!));
};

const referencesByRunId = (
  items: readonly SemanticDiffScheduleImpactTimelineItem[],
): Map<string, SourceChangeReference> => {
  const references = new Map<string, SourceChangeReference>();
  items.forEach((item) => addTimelineRunReferences(references, item));
  return references;
};

const cloneRunWithReference = (
  run: SemanticDiffScheduleImpactRun,
  references: ReadonlyMap<string, SourceChangeReference>,
): SemanticDiffScheduleImpactRun => ({
  ...run,
  sourceChangeRef: references.get(run.id) ?? null,
});

const rootSideWithReferences = (
  side: SemanticDiffScheduleImpactRootSide | null,
  references: ReadonlyMap<string, SourceChangeReference>,
): SemanticDiffScheduleImpactRootSide | null =>
  side === null
    ? null
    : {
        ...side,
        runs: side.runs.map((run) => cloneRunWithReference(run, references)),
      };

const rootWithReferences = (
  root: SemanticDiffScheduleImpactRoot,
  references: ReadonlyMap<string, SourceChangeReference>,
): SemanticDiffScheduleImpactRoot => ({
  ...root,
  before: rootSideWithReferences(root.before, references),
  after: rootSideWithReferences(root.after, references),
});

const timelineRunWithReference = (
  run: SemanticDiffScheduleImpactRun | null,
  references: ReadonlyMap<string, SourceChangeReference>,
): SemanticDiffScheduleImpactRun | null =>
  run === null ? null : cloneRunWithReference(run, references);

const timelineItemWithReferences = (
  item: SemanticDiffScheduleImpactTimelineItem,
  references: ReadonlyMap<string, SourceChangeReference>,
): SemanticDiffScheduleImpactTimelineItem => ({
  ...item,
  before: timelineRunWithReference(item.before, references),
  after: timelineRunWithReference(item.after, references),
});

export const attachSourceChangeReferences = (
  result: SemanticDiffResult,
  roots: readonly SemanticDiffScheduleImpactRoot[],
  sourceKeyForRun: SourceKeyForRun,
): {
  roots: SemanticDiffScheduleImpactRoot[];
  timelineItems: SemanticDiffScheduleImpactTimelineItem[];
} => {
  const timelineItems = timelineItemsWithReferences(
    result,
    roots,
    sourceKeyForRun,
  );
  const references = referencesByRunId(timelineItems);
  return {
    roots: roots.map((root) => rootWithReferences(root, references)),
    timelineItems: timelineItems.map((item) =>
      timelineItemWithReferences(item, references),
    ),
  };
};

const sourceChangeReferenceKey = (reference: {
  id: string;
  occurrenceOrdinal: number;
}): string => `${reference.id}\u0000${reference.occurrenceOrdinal}`;

type ScheduleRunChanges = readonly NonNullable<
  NonNullable<SemanticDiffResult["scheduleComparison"]>["runChanges"][number]
>[];

const changesById = (
  changes: ScheduleRunChanges,
): ReadonlyMap<string, readonly ScheduleRunChanges[number][]> => {
  const byId = new Map<string, ScheduleRunChanges[number][]>();
  changes.forEach((change) =>
    byId.set(change.id, [...(byId.get(change.id) ?? []), change]),
  );
  return byId;
};

const validateSourceChangeReference = (
  byId: ReadonlyMap<string, readonly ScheduleRunChanges[number][]>,
  reference: SourceChangeReference,
): void => {
  const candidates = byId.get(reference.id) ?? [];
  const errors: readonly [boolean, string][] = [
    [
      !Number.isSafeInteger(reference.occurrenceOrdinal),
      "Invalid schedule-impact source-change ordinal",
    ],
    [
      !candidates[reference.occurrenceOrdinal],
      "Unknown schedule-impact source-change reference",
    ],
  ];
  const error = errors.find(([invalid]) => invalid)?.[1];
  if (error) throw new Error(error);
};

const timelineRuns = (
  item: SemanticDiffScheduleImpactTimelineItem,
): SemanticDiffScheduleImpactRun[] =>
  [item.before, item.after].filter(
    (run): run is SemanticDiffScheduleImpactRun => run !== null,
  );

const hasRunSourceChangeReferences = (
  runs: readonly SemanticDiffScheduleImpactRun[],
): boolean => runs.some((run) => run.sourceChangeRef !== null);

const validateUnchangedTimelineItem = (
  item: SemanticDiffScheduleImpactTimelineItem,
): void => {
  const runs = timelineRuns(item);
  const hasReferences = [
    item.sourceChangeRef !== null,
    hasRunSourceChangeReferences(runs),
  ].some(Boolean);
  if (hasReferences) {
    throw new Error("Unchanged schedule-impact runs cannot reference changes");
  }
};

const validateChangedRunReferences = (
  runs: readonly SemanticDiffScheduleImpactRun[],
  effectKey: string,
): void => {
  const referencesDiffer = runs.some((run) => {
    const reference = run.sourceChangeRef;
    return new Map<boolean, () => boolean>([
      [true, () => true],
      [false, () => sourceChangeReferenceKey(reference!) !== effectKey],
    ]).get(reference === null)!();
  });
  if (referencesDiffer) {
    throw new Error("Schedule-impact run and timeline references differ");
  }
};

const sourceChangeReferenceForItem = (
  item: SemanticDiffScheduleImpactTimelineItem,
): SourceChangeReference => {
  if (!item.sourceChangeRef) {
    throw new Error(
      "Changed schedule-impact effects require a change reference",
    );
  }
  return item.sourceChangeRef;
};

const sourceChangeOwnerActions: ReadonlyMap<boolean, () => void> = new Map([
  [
    true,
    () => {
      throw new Error(
        "A schedule-change reference crosses schedule-impact effects",
      );
    },
  ],
  [false, () => undefined],
]);

const claimSourceChangeOwner = (
  owners: Map<string, string>,
  effectKey: string,
  itemId: string,
): void => {
  const owner = owners.get(effectKey);
  const ownerConflict = owner !== undefined && owner !== itemId;
  sourceChangeOwnerActions.get(ownerConflict)!();
  owners.set(effectKey, itemId);
};

const validateChangedTimelineItem = (
  item: SemanticDiffScheduleImpactTimelineItem,
  byId: ReadonlyMap<string, readonly ScheduleRunChanges[number][]>,
  owners: Map<string, string>,
): void => {
  const effectReference = sourceChangeReferenceForItem(item);
  validateSourceChangeReference(byId, effectReference);
  const effectKey = sourceChangeReferenceKey(effectReference);
  claimSourceChangeOwner(owners, effectKey, item.id);
  validateChangedRunReferences(timelineRuns(item), effectKey);
};

const timelineValidators: ReadonlyMap<
  SemanticDiffScheduleImpactRunState,
  (
    item: SemanticDiffScheduleImpactTimelineItem,
    byId: ReadonlyMap<string, readonly ScheduleRunChanges[number][]>,
    owners: Map<string, string>,
  ) => void
> = new Map([
  ["unchanged", (item) => validateUnchangedTimelineItem(item)],
  [
    "added",
    (item, byId, owners) => validateChangedTimelineItem(item, byId, owners),
  ],
  [
    "removed",
    (item, byId, owners) => validateChangedTimelineItem(item, byId, owners),
  ],
  [
    "changed-time",
    (item, byId, owners) => validateChangedTimelineItem(item, byId, owners),
  ],
]);

const validateTimelineItem = (
  item: SemanticDiffScheduleImpactTimelineItem,
  byId: ReadonlyMap<string, readonly ScheduleRunChanges[number][]>,
  owners: Map<string, string>,
): void => timelineValidators.get(item.state)!(item, byId, owners);

export const validateSourceChangeReferences = (
  result: SemanticDiffResult,
  items: readonly SemanticDiffScheduleImpactTimelineItem[],
): void => {
  const changes = result.scheduleComparison?.runChanges ?? [];
  const byId = changesById(changes);
  const owners = new Map<string, string>();
  items.forEach((item) => validateTimelineItem(item, byId, owners));
};
