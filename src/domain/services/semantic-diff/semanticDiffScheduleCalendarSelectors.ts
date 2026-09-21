import type { AjsParameter, AjsUnit } from "../../models/ajs/AjsDocument";
import type { ScheduleDateWeekday } from "../../schedule/ScheduleDate";
import {
  isImpossibleYearDay,
  isInvalidCalendarDay,
  isInvalidCalendarMonth,
} from "../../schedule/ScheduleDate";
import { type AncestorResult } from "./semanticDiffScheduleCalendarIndex";
import type {
  SemanticDiffScheduleCalendarContextIndex,
  SemanticDiffScheduleCalendarDayClassification,
  SemanticDiffScheduleCalendarDayResult,
  SemanticDiffScheduleCalendarEntry,
  SemanticDiffScheduleCalendarGroup,
  SemanticDiffScheduleCalendarSelection,
  SemanticDiffScheduleCalendarSelector,
  SemanticDiffScheduleCalendarContextStatus,
} from "./semanticDiffScheduleCalendarTypes";

const isInvalidExactSelector = (
  year: number | undefined,
  month: number,
  day: number,
): boolean =>
  isInvalidCalendarMonth(month) ||
  isInvalidCalendarDay(day) ||
  isImpossibleYearDay(year, month, day);

const createExactSelector = (
  year: number | undefined,
  month: number,
  day: number,
): SemanticDiffScheduleCalendarSelector => {
  const selector = {
    kind: "exact" as const,
    month,
    day,
    key: `exact:${year ?? "*"}/${month}/${day}`,
  };
  return year === undefined ? selector : { ...selector, year };
};

const exactSelectorFromMatch = (
  exact: RegExpExecArray,
): SemanticDiffScheduleCalendarSelector | undefined => {
  const year = exact[1] === undefined ? undefined : Number(exact[1]);
  const month = Number(exact[2]);
  const day = Number(exact[3]);
  return isInvalidExactSelector(year, month, day)
    ? undefined
    : createExactSelector(year, month, day);
};

const parseExactSelector = (
  value: string,
): SemanticDiffScheduleCalendarSelector | undefined => {
  const exact = /^(?:(\d{4})\/)?(\d{2})\/(\d{2})$/.exec(value);
  return exact === null ? undefined : exactSelectorFromMatch(exact);
};

const parseWeekdaySelector = (
  value: string,
): SemanticDiffScheduleCalendarSelector | undefined => {
  const weekday = /^(su|mo|tu|we|th|fr|sa)(?::(?:[1-5]|b))?$/.exec(value);
  return weekday
    ? {
        kind: "weekday",
        weekday: weekday[1] as ScheduleDateWeekday,
        key: `weekday:${weekday[1]}`,
      }
    : undefined;
};

export const parseCalendarSelector = (
  value: string,
): SemanticDiffScheduleCalendarSelector | undefined =>
  parseExactSelector(value) ?? parseWeekdaySelector(value);

const calendarParameters = (group: AjsUnit): AjsParameter[] =>
  group.parameters.filter(
    (parameter) => parameter.key === "op" || parameter.key === "cl",
  );

type CalendarEntryResult =
  | { status: "supported"; entry: SemanticDiffScheduleCalendarEntry }
  | { status: "invalid"; invalidKey: string };

const classificationForParameter = (
  parameter: AjsParameter,
): SemanticDiffScheduleCalendarDayClassification =>
  parameter.key === "op" ? "open" : "closed";

const hasConflictingClassification = (
  existing: SemanticDiffScheduleCalendarDayClassification | undefined,
  classification: SemanticDiffScheduleCalendarDayClassification,
): boolean => existing !== undefined && existing !== classification;

const resolveCalendarEntry = (
  parameter: AjsParameter,
  classifications: Map<string, SemanticDiffScheduleCalendarDayClassification>,
): CalendarEntryResult => {
  const selector = parseCalendarSelector(parameter.value);
  if (!selector) {
    return { status: "invalid", invalidKey: parameter.key };
  }
  const classification = classificationForParameter(parameter);
  const existing = classifications.get(selector.key);
  if (hasConflictingClassification(existing, classification)) {
    return { status: "invalid", invalidKey: parameter.key };
  }
  classifications.set(selector.key, classification);
  return {
    status: "supported",
    entry: { selector, classification, parameter },
  };
};

type CalendarGroupResult =
  | { status: "supported"; group: SemanticDiffScheduleCalendarGroup }
  | { status: "invalid"; invalidKey: string };

type CalendarEntriesState = {
  entries: SemanticDiffScheduleCalendarEntry[];
  classifications: Map<string, SemanticDiffScheduleCalendarDayClassification>;
  invalidKey?: string;
};

const appendCalendarEntry = (
  state: CalendarEntriesState,
  parameter: AjsParameter,
): CalendarEntriesState => {
  if (state.invalidKey) {
    return state;
  }
  const result = resolveCalendarEntry(parameter, state.classifications);
  return result.status === "invalid"
    ? { ...state, invalidKey: result.invalidKey }
    : { ...state, entries: [...state.entries, result.entry] };
};

const resolveCalendarEntries = (group: AjsUnit): CalendarEntriesState =>
  calendarParameters(group).reduce(appendCalendarEntry, {
    entries: [],
    classifications: new Map(),
  });

const resolveCalendarGroup = (group: AjsUnit): CalendarGroupResult => {
  const result = resolveCalendarEntries(group);
  return result.invalidKey
    ? { status: "invalid", invalidKey: result.invalidKey }
    : { status: "supported", group: { entries: result.entries } };
};

export type CalendarGroupsResult = {
  groups: SemanticDiffScheduleCalendarGroup[];
  invalidKey?: string;
};

type CalendarGroupsState = {
  groups: SemanticDiffScheduleCalendarGroup[];
  invalidKey?: string;
};

const appendCalendarGroup = (
  state: CalendarGroupsState,
  group: AjsUnit,
): CalendarGroupsState => {
  if (state.invalidKey) {
    return state;
  }
  const result = resolveCalendarGroup(group);
  return result.status === "invalid"
    ? { groups: state.groups, invalidKey: result.invalidKey }
    : { groups: [...state.groups, result.group] };
};

export const resolveCalendarGroups = (
  groups: AjsUnit[],
): CalendarGroupsResult => groups.reduce(appendCalendarGroup, { groups: [] });

const matchesExactSelector = (
  selector: Extract<SemanticDiffScheduleCalendarSelector, { kind: "exact" }>,
  date: Date,
): boolean => {
  const matchesMonthAndDay =
    selector.month === date.getUTCMonth() + 1 &&
    selector.day === date.getUTCDate();
  const matchesYear =
    selector.year === undefined || selector.year === date.getUTCFullYear();
  return matchesMonthAndDay && matchesYear;
};

const selectorMatchesDate = (
  selector: SemanticDiffScheduleCalendarSelector,
  date: Date,
): boolean =>
  selector.kind === "exact"
    ? matchesExactSelector(selector, date)
    : selector.weekday ===
      (["su", "mo", "tu", "we", "th", "fr", "sa"][
        date.getUTCDay()
      ] as ScheduleDateWeekday);

const classificationForMatches = (
  matches: SemanticDiffScheduleCalendarEntry[],
): SemanticDiffScheduleCalendarDayResult | undefined => {
  if (matches.length === 0) {
    return undefined;
  }
  const classifications = new Set(matches.map((entry) => entry.classification));
  if (classifications.size > 1) {
    return {
      status: "invalid",
      evidenceId: `schedule:calendar:invalid-base-or-conflict:${matches[0].parameter.key}`,
    };
  }
  return { status: matches[0].classification };
};

const classifyCalendarGroup = (
  group: SemanticDiffScheduleCalendarGroup,
  date: Date,
  kind: "exact" | "weekday",
): SemanticDiffScheduleCalendarDayResult | undefined =>
  classificationForMatches(
    group.entries.filter(
      (entry) =>
        entry.selector.kind === kind &&
        selectorMatchesDate(entry.selector, date),
    ),
  );

export const classifyCalendarSelector = (
  groups: SemanticDiffScheduleCalendarGroup[],
  date: Date,
  kind: "exact" | "weekday",
): SemanticDiffScheduleCalendarDayResult | undefined =>
  groups
    .map((group) => classifyCalendarGroup(group, date, kind))
    .find(
      (result): result is SemanticDiffScheduleCalendarDayResult =>
        result !== undefined,
    );

/** Resolve one operational-calendar day with exact-date precedence. */
export const classifyScheduleCalendarDay = (
  context: {
    status: SemanticDiffScheduleCalendarContextStatus;
    evidenceId: string;
    calendarGroups?: SemanticDiffScheduleCalendarGroup[];
  },
  date: Date,
): SemanticDiffScheduleCalendarDayResult => {
  if (context.status !== "supported") {
    return {
      status: context.status,
      evidenceId: context.evidenceId,
    };
  }
  const groups = context.calendarGroups ?? [];
  return (
    classifyCalendarSelector(groups, date, "exact") ??
    classifyCalendarSelector(groups, date, "weekday") ?? {
      status: "missing-context",
      evidenceId: "schedule:calendar:missing-context:calendar",
    }
  );
};

export const selectionEvidence = (
  status: SemanticDiffScheduleCalendarContextStatus,
  value: string,
  rawParameters: AjsParameter[],
): SemanticDiffScheduleCalendarSelection => {
  const evidencePrefix = {
    supported: "schedule:jc:resolved",
    invalid: "schedule:jc:invalid",
    "missing-context": "schedule:jc:missing-context",
  }[status];
  return {
    status,
    evidenceId: `${evidencePrefix}:${value}`,
    rawParameters,
  };
};

export type ScheduleCalendarSourceResolution =
  | {
      status: "supported";
      selection: SemanticDiffScheduleCalendarSelection;
      rawParameters: AjsParameter[];
      sourceGroup: AjsUnit;
    }
  | {
      status: "invalid" | "missing-context";
      selection: SemanticDiffScheduleCalendarSelection;
      rawParameters: AjsParameter[];
      evidenceId: string;
    };

type SourceFailureInput = {
  status: "invalid" | "missing-context";
  value: string;
  rawParameters: AjsParameter[];
  evidenceId?: string;
};

const sourceFailure = (
  input: SourceFailureInput,
): ScheduleCalendarSourceResolution => {
  const selection = selectionEvidence(
    input.status,
    input.value,
    input.rawParameters,
  );
  return {
    status: input.status,
    selection,
    rawParameters: input.rawParameters,
    evidenceId: input.evidenceId ?? selection.evidenceId,
  };
};

const isUniqueCalendarGroup = (matches: AjsUnit[]): matches is [AjsUnit] =>
  matches.length === 1 && matches[0].unitType === "g";

const resolveExplicitSource = (
  selector: AjsParameter,
  rawParameters: AjsParameter[],
  index: SemanticDiffScheduleCalendarContextIndex,
): ScheduleCalendarSourceResolution => {
  if (!selector.value.startsWith("/")) {
    return sourceFailure({
      status: "invalid",
      value: selector.value,
      rawParameters,
    });
  }
  const matches = index.byPath.get(selector.value) ?? [];
  if (!isUniqueCalendarGroup(matches)) {
    return sourceFailure({
      status: "missing-context",
      value: selector.value,
      rawParameters,
    });
  }
  const sourceGroup = matches[0];
  return {
    status: "supported",
    selection: selectionEvidence(
      "supported",
      sourceGroup.absolutePath,
      rawParameters,
    ),
    rawParameters,
    sourceGroup,
  };
};

const hierarchySourceFailure = (
  input: {
    index: SemanticDiffScheduleCalendarContextIndex;
    ancestorResult: AncestorResult;
  },
  value: string,
  rawParameters: AjsParameter[],
): ScheduleCalendarSourceResolution | undefined => {
  const invalidHierarchy =
    input.index.duplicatePath || input.ancestorResult.status === "invalid";
  return invalidHierarchy
    ? sourceFailure({
        status: "invalid",
        value,
        rawParameters,
        evidenceId: "schedule:calendar:invalid-base-or-conflict:hierarchy",
      })
    : undefined;
};

const duplicateSelectorFailure = (
  value: string,
  rawParameters: AjsParameter[],
): ScheduleCalendarSourceResolution =>
  sourceFailure({
    status: "invalid",
    value,
    rawParameters,
    evidenceId: "schedule:calendar:invalid-base-or-conflict:jc",
  });

const resolveContainingSource = (
  ancestors: AjsUnit[],
  rawParameters: AjsParameter[],
): ScheduleCalendarSourceResolution => {
  const containingGroup = ancestors.find(
    (ancestor) => ancestor.unitType === "g",
  );
  if (!containingGroup) {
    return sourceFailure({
      status: "missing-context",
      value: "",
      rawParameters,
      evidenceId: "schedule:calendar:missing-context:group",
    });
  }
  return {
    status: "supported",
    selection: selectionEvidence(
      "supported",
      containingGroup.absolutePath,
      rawParameters,
    ),
    rawParameters,
    sourceGroup: containingGroup,
  };
};

const supportedAncestors = (result: AncestorResult): AjsUnit[] =>
  result.status === "supported" ? result.ancestors : [];

const resolveSourceByParameters = (
  rawParameters: AjsParameter[],
  index: SemanticDiffScheduleCalendarContextIndex,
  ancestors: AjsUnit[],
): ScheduleCalendarSourceResolution => {
  const selectorValue = rawParameters[0]?.value ?? "";
  if (rawParameters.length > 1) {
    return duplicateSelectorFailure(selectorValue, rawParameters);
  }
  return rawParameters.length === 1
    ? resolveExplicitSource(
        rawParameters[0] as AjsParameter,
        rawParameters,
        index,
      )
    : resolveContainingSource(ancestors, rawParameters);
};

export const resolveScheduleCalendarSource = (input: {
  unit: AjsUnit;
  index: SemanticDiffScheduleCalendarContextIndex;
  ancestorResult: AncestorResult;
}): ScheduleCalendarSourceResolution => {
  const rawParameters = input.unit.parameters.filter(
    (parameter) => parameter.key === "jc",
  );
  const selectorValue = rawParameters[0]?.value ?? "";
  return (
    hierarchySourceFailure(input, selectorValue, rawParameters) ??
    resolveSourceByParameters(
      rawParameters,
      input.index,
      supportedAncestors(input.ancestorResult),
    )
  );
};
