import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../models/ajs/AjsDocument";
import {
  createScheduleDate,
  daysInGregorianMonth,
  isImpossibleYearDay,
  isInvalidCalendarDay,
  isInvalidCalendarMonth,
  type ScheduleDateInterpretation,
  type ScheduleDateWeekday,
} from "./ScheduleDate";

export type ScheduleCalendarContextStatus =
  | "supported"
  | "invalid"
  | "missing-context";

export type ScheduleCalendarBaseDay =
  | { kind: "numeric"; value: number }
  | { kind: "weekday"; weekday: ScheduleDateWeekday; occurrence: number };

export type ScheduleCalendarDayClassification = "open" | "closed";

export type ScheduleCalendarSelector =
  | {
      kind: "exact";
      year?: number;
      month: number;
      day: number;
      key: string;
    }
  | {
      kind: "weekday";
      weekday: ScheduleDateWeekday;
      key: string;
    };

export type ScheduleCalendarEntry = {
  selector: ScheduleCalendarSelector;
  classification: ScheduleCalendarDayClassification;
  parameter: AjsParameter;
};

export type ScheduleCalendarGroup = {
  entries: ScheduleCalendarEntry[];
};

export type ScheduleCalendarSelection = {
  status: ScheduleCalendarContextStatus;
  evidenceId: string;
  rawParameters: AjsParameter[];
};

export type ScheduleCalendarContext = {
  status: ScheduleCalendarContextStatus;
  selection: ScheduleCalendarSelection;
  sourceGroup?: AjsUnit;
  baseDay?: ScheduleCalendarBaseDay;
  baseMonth?: "th" | "ne";
  baseTime?: string;
  rawParameters: AjsParameter[];
  evidenceId: string;
  calendarGroups?: ScheduleCalendarGroup[];
};

export type ScheduleCalendarContextIndex = {
  byId: Map<string, AjsUnit[]>;
  byPath: Map<string, AjsUnit[]>;
  duplicatePath: boolean;
};

export type ScheduleCalendarDayResult =
  | {
      status: ScheduleCalendarDayClassification;
    }
  | {
      status: "missing-context" | "invalid";
      evidenceId: string;
    };

type ScheduleCalendarContextInput = {
  status: ScheduleCalendarContextStatus;
  selection: ScheduleCalendarSelection;
  sourceGroup?: AjsUnit;
  baseDay?: ScheduleCalendarBaseDay;
  baseMonth?: "th" | "ne";
  baseTime?: string;
  rawParameters: AjsParameter[];
  evidenceId: string;
  calendarGroups?: ScheduleCalendarGroup[];
};

const createScheduleCalendarContext = (
  input: ScheduleCalendarContextInput,
): ScheduleCalendarContext => input;

const appendChildren = (pending: AjsUnit[], unit: AjsUnit): void => {
  [...unit.children].reverse().forEach((child) => pending.push(child));
};

const visitUnit = (
  units: AjsUnit[],
  visited: Set<AjsUnit>,
  unit: AjsUnit,
): boolean => {
  if (visited.has(unit)) {
    return false;
  }
  visited.add(unit);
  units.push(unit);
  return true;
};

const processPendingUnit = (
  pending: AjsUnit[],
  units: AjsUnit[],
  visited: Set<AjsUnit>,
): void => {
  const unit = pending.pop() as AjsUnit;
  if (visitUnit(units, visited, unit)) {
    appendChildren(pending, unit);
  }
};

const collectUnits = (document: AjsDocument): AjsUnit[] => {
  const units: AjsUnit[] = [];
  const pending = [...document.rootUnits].reverse();
  const visited = new Set<AjsUnit>();
  while (pending.length > 0) {
    processPendingUnit(pending, units, visited);
  }
  return units;
};

const appendUnit = (
  index: Map<string, AjsUnit[]>,
  key: string,
  unit: AjsUnit,
): Map<string, AjsUnit[]> => {
  const matches = index.get(key) ?? [];
  matches.push(unit);
  index.set(key, matches);
  return index;
};

const indexUnits = (
  units: AjsUnit[],
  key: (unit: AjsUnit) => string,
): Map<string, AjsUnit[]> =>
  units.reduce(
    (index, unit) => appendUnit(index, key(unit), unit),
    new Map<string, AjsUnit[]>(),
  );

export const createScheduleCalendarContextIndex = (
  document: AjsDocument,
): ScheduleCalendarContextIndex => {
  const units = collectUnits(document);
  const byId = indexUnits(units, (unit) => unit.id);
  const byPath = indexUnits(units, (unit) => unit.absolutePath);
  return {
    byId,
    byPath,
    duplicatePath: [...byPath.values()].some((matches) => matches.length > 1),
  };
};

type AncestorResult =
  | { status: "supported"; ancestors: AjsUnit[] }
  | { status: "invalid" };

type AncestorLookup = {
  parentId: string;
  index: ScheduleCalendarContextIndex;
  seenIds: Set<string>;
  seenPaths: Set<string>;
};

type AncestorStep =
  | { status: "supported"; parent: AjsUnit }
  | { status: "invalid" };

const uniqueParent = (
  parentId: string,
  index: ScheduleCalendarContextIndex,
): AjsUnit | undefined => {
  const matches = index.byId.get(parentId) ?? [];
  return matches.length === 1 ? matches[0] : undefined;
};

const isSeenAncestor = (lookup: AncestorLookup, parent: AjsUnit): boolean =>
  lookup.seenIds.has(parent.id) || lookup.seenPaths.has(parent.absolutePath);

const nextAncestor = (lookup: AncestorLookup): AncestorStep => {
  const parent = uniqueParent(lookup.parentId, lookup.index);
  return parent && !isSeenAncestor(lookup, parent)
    ? { status: "supported", parent }
    : { status: "invalid" };
};

type AncestorState = {
  parentId: string | undefined;
  ancestors: AjsUnit[];
  seenIds: Set<string>;
  seenPaths: Set<string>;
};

const advanceAncestor = (
  state: AncestorState,
  index: ScheduleCalendarContextIndex,
): AncestorState & { invalid?: boolean } => {
  if (state.parentId === undefined) {
    return state;
  }
  const step = nextAncestor({
    parentId: state.parentId,
    index,
    seenIds: state.seenIds,
    seenPaths: state.seenPaths,
  });
  if (step.status === "invalid") {
    return { ...state, invalid: true };
  }
  state.seenIds.add(step.parent.id);
  state.seenPaths.add(step.parent.absolutePath);
  state.ancestors.push(step.parent);
  return { ...state, parentId: step.parent.parentId };
};

const hasPendingAncestor = (state: AncestorState & { invalid?: boolean }) =>
  state.parentId !== undefined && !state.invalid;

const collectAncestorState = (
  state: AncestorState & { invalid?: boolean },
  index: ScheduleCalendarContextIndex,
): AncestorState & { invalid?: boolean } => {
  while (hasPendingAncestor(state)) {
    state = advanceAncestor(state, index);
  }
  return state;
};

const ancestorsOf = (
  unit: AjsUnit,
  index: ScheduleCalendarContextIndex,
): AncestorResult => {
  let state: AncestorState & { invalid?: boolean } = {
    parentId: unit.parentId,
    ancestors: [],
    seenIds: new Set<string>(),
    seenPaths: new Set<string>(),
  };
  state = collectAncestorState(state, index);
  return state.invalid
    ? { status: "invalid" }
    : { status: "supported", ancestors: state.ancestors };
};

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
): ScheduleCalendarSelector => {
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
): ScheduleCalendarSelector | undefined => {
  const year = exact[1] === undefined ? undefined : Number(exact[1]);
  const month = Number(exact[2]);
  const day = Number(exact[3]);
  return isInvalidExactSelector(year, month, day)
    ? undefined
    : createExactSelector(year, month, day);
};

const parseExactSelector = (
  value: string,
): ScheduleCalendarSelector | undefined => {
  const exact = /^(?:(\d{4})\/)?(\d{2})\/(\d{2})$/.exec(value);
  return exact === null ? undefined : exactSelectorFromMatch(exact);
};

const parseWeekdaySelector = (
  value: string,
): ScheduleCalendarSelector | undefined => {
  const weekday = /^(su|mo|tu|we|th|fr|sa)(?::(?:[1-5]|b))?$/.exec(value);
  return weekday
    ? {
        kind: "weekday",
        weekday: weekday[1] as ScheduleDateWeekday,
        key: `weekday:${weekday[1]}`,
      }
    : undefined;
};

const parseCalendarSelector = (
  value: string,
): ScheduleCalendarSelector | undefined =>
  parseExactSelector(value) ?? parseWeekdaySelector(value);

const baseCalendarParameters = (group: AjsUnit): AjsParameter[] =>
  group.parameters.filter(
    (parameter) => parameter.key === "op" || parameter.key === "cl",
  );

type CalendarEntryResult =
  | { status: "supported"; entry: ScheduleCalendarEntry }
  | { status: "invalid"; invalidKey: string };

const classificationForParameter = (
  parameter: AjsParameter,
): ScheduleCalendarDayClassification =>
  parameter.key === "op" ? "open" : "closed";

const hasConflictingClassification = (
  existing: ScheduleCalendarDayClassification | undefined,
  classification: ScheduleCalendarDayClassification,
): boolean => existing !== undefined && existing !== classification;

const resolveCalendarEntry = (
  parameter: AjsParameter,
  classifications: Map<string, ScheduleCalendarDayClassification>,
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
  | { status: "supported"; group: ScheduleCalendarGroup }
  | { status: "invalid"; invalidKey: string };

type CalendarEntriesState = {
  entries: ScheduleCalendarEntry[];
  classifications: Map<string, ScheduleCalendarDayClassification>;
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

type CalendarGroupsResult = {
  groups: ScheduleCalendarGroup[];
  invalidKey?: string;
};

type CalendarGroupsState = {
  groups: ScheduleCalendarGroup[];
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

const resolveCalendarGroups = (groups: AjsUnit[]): CalendarGroupsResult =>
  groups.reduce(appendCalendarGroup, { groups: [] });

const matchesExactSelector = (
  selector: Extract<ScheduleCalendarSelector, { kind: "exact" }>,
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
  selector: ScheduleCalendarSelector,
  date: Date,
): boolean =>
  selector.kind === "exact"
    ? matchesExactSelector(selector, date)
    : selector.weekday ===
      (["su", "mo", "tu", "we", "th", "fr", "sa"][
        date.getUTCDay()
      ] as ScheduleDateWeekday);

const classificationForMatches = (
  matches: ScheduleCalendarEntry[],
): ScheduleCalendarDayResult | undefined => {
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
  group: ScheduleCalendarGroup,
  date: Date,
  kind: "exact" | "weekday",
): ScheduleCalendarDayResult | undefined =>
  classificationForMatches(
    group.entries.filter(
      (entry) =>
        entry.selector.kind === kind &&
        selectorMatchesDate(entry.selector, date),
    ),
  );

const classifyCalendarSelector = (
  groups: ScheduleCalendarGroup[],
  date: Date,
  kind: "exact" | "weekday",
): ScheduleCalendarDayResult | undefined =>
  groups
    .map((group) => classifyCalendarGroup(group, date, kind))
    .find(
      (result): result is ScheduleCalendarDayResult => result !== undefined,
    );

/** Resolve one operational-calendar day with exact-date precedence. */
export const classifyScheduleCalendarDay = (
  context: {
    status: ScheduleCalendarContextStatus;
    evidenceId: string;
    calendarGroups?: ScheduleCalendarGroup[];
  },
  date: Date,
): ScheduleCalendarDayResult => {
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

const selectionEvidence = (
  status: ScheduleCalendarContextStatus,
  value: string,
  rawParameters: AjsParameter[],
): ScheduleCalendarSelection => {
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

type ScheduleCalendarSourceResolution =
  | {
      status: "supported";
      selection: ScheduleCalendarSelection;
      rawParameters: AjsParameter[];
      sourceGroup: AjsUnit;
    }
  | {
      status: "invalid" | "missing-context";
      selection: ScheduleCalendarSelection;
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
  index: ScheduleCalendarContextIndex,
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
    index: ScheduleCalendarContextIndex;
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
  index: ScheduleCalendarContextIndex,
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

const resolveScheduleCalendarSource = (input: {
  unit: AjsUnit;
  index: ScheduleCalendarContextIndex;
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

type BaseParameterResult = {
  parameter?: AjsParameter;
  parameters: AjsParameter[];
  invalid: boolean;
};

const baseParameterResult = (
  parameters: AjsParameter[],
): BaseParameterResult | undefined => {
  if (parameters.length > 1) {
    return { parameters, invalid: true };
  }
  if (parameters.length === 1) {
    return { parameter: parameters[0], parameters, invalid: false };
  }
  return undefined;
};

const baseParametersFor = (group: AjsUnit, key: "sdd" | "md" | "stt") =>
  group.parameters.filter((parameter) => parameter.key === key);

const findBaseParameter = (
  groups: AjsUnit[],
  key: "sdd" | "md" | "stt",
): BaseParameterResult =>
  groups
    .map((group) => baseParameterResult(baseParametersFor(group, key)))
    .find((result): result is BaseParameterResult => result !== undefined) ?? {
    parameters: [],
    invalid: false,
  };

const numericBaseDay = (value: string): ScheduleCalendarBaseDay | undefined => {
  const numeric = Number(value);
  return /^\d{1,2}$/.test(value) && numeric >= 1 && numeric <= 31
    ? { kind: "numeric", value: numeric }
    : undefined;
};

const weekdayBaseDay = (value: string): ScheduleCalendarBaseDay | undefined => {
  const weekday = /^(su|mo|tu|we|th|fr|sa)(?::([1-5]))?$/.exec(value);
  return weekday
    ? {
        kind: "weekday",
        weekday: weekday[1] as ScheduleDateWeekday,
        occurrence: Number(weekday[2] ?? "1"),
      }
    : undefined;
};

const parseBaseDay = (value: string): ScheduleCalendarBaseDay | undefined =>
  numericBaseDay(value) ?? weekdayBaseDay(value);

const isValidBaseTime = (value: string): boolean => {
  const matched = /^(\d{2}):(\d{2})$/.exec(value);
  return matched !== null && Number(matched[1]) < 24 && Number(matched[2]) < 60;
};

const calendarParameters = (group: AjsUnit): AjsParameter[] =>
  group.parameters.filter(
    (parameter) => parameter.key === "op" || parameter.key === "cl",
  );

type BaseSettings = {
  baseDay: ScheduleCalendarBaseDay;
  baseMonth: "th" | "ne";
  baseTime: string;
  rawParameters: AjsParameter[];
};

type BaseSettingsResult =
  | { status: "supported"; settings: BaseSettings }
  | { status: "missing-context"; settings: BaseSettings }
  | { status: "invalid"; key: string; rawParameters: AjsParameter[] };

type BaseParameters = {
  sdd: BaseParameterResult;
  md: BaseParameterResult;
  stt: BaseParameterResult;
};

const resolveBaseParameters = (groups: AjsUnit[]): BaseParameters => ({
  sdd: findBaseParameter(groups, "sdd"),
  md: findBaseParameter(groups, "md"),
  stt: findBaseParameter(groups, "stt"),
});

const baseParameterValues = (parameters: BaseParameters): AjsParameter[] => [
  ...parameters.sdd.parameters,
  ...parameters.md.parameters,
  ...parameters.stt.parameters,
];

const firstInvalidBaseParameter = (
  parameters: BaseParameters,
): "sdd" | "md" | "stt" | undefined =>
  (["sdd", "md", "stt"] as const).find((key) => parameters[key].invalid);

const parameterValue = (
  parameter: AjsParameter | undefined,
  fallback: string,
): string => parameter?.value ?? fallback;

const parseBaseMonth = (value: string): "th" | "ne" | undefined =>
  value === "th" || value === "ne" ? value : undefined;

const parseBaseTime = (value: string): string | undefined =>
  isValidBaseTime(value) ? value : undefined;

type ParsedBaseSettings = {
  baseDay: ScheduleCalendarBaseDay | undefined;
  baseMonth: "th" | "ne" | undefined;
  baseTime: string | undefined;
};

const parseBaseSettings = (parameters: BaseParameters): ParsedBaseSettings => ({
  baseDay: parseBaseDay(parameterValue(parameters.sdd.parameter, "1")),
  baseMonth: parseBaseMonth(parameterValue(parameters.md.parameter, "th")),
  baseTime: parseBaseTime(parameterValue(parameters.stt.parameter, "00:00")),
});

const firstInvalidBaseSetting = (
  settings: ParsedBaseSettings,
): "sdd" | "md" | "stt" | undefined =>
  [
    { key: "sdd" as const, valid: settings.baseDay !== undefined },
    { key: "md" as const, valid: settings.baseMonth !== undefined },
    { key: "stt" as const, valid: settings.baseTime !== undefined },
  ].find((setting) => !setting.valid)?.key;

const resolveBaseSettings = (input: {
  groups: AjsUnit[];
  rawSelector: AjsParameter[];
}): BaseSettingsResult => {
  const baseParameters = resolveBaseParameters(input.groups);
  const rawParameters = [
    ...input.rawSelector,
    ...baseParameterValues(baseParameters),
    ...input.groups.flatMap(baseCalendarParameters),
  ];
  const invalidParameter = firstInvalidBaseParameter(baseParameters);
  const parsedSettings = parseBaseSettings(baseParameters);
  const invalidSetting = firstInvalidBaseSetting(parsedSettings);
  const invalidKey = invalidParameter ?? invalidSetting;
  if (invalidKey) {
    return { status: "invalid", key: invalidKey, rawParameters };
  }
  const settings: BaseSettings = {
    baseDay: parsedSettings.baseDay as ScheduleCalendarBaseDay,
    baseMonth: parsedSettings.baseMonth as "th" | "ne",
    baseTime: parsedSettings.baseTime as string,
    rawParameters,
  };
  return settings.baseTime === "00:00"
    ? { status: "supported", settings }
    : { status: "missing-context", settings };
};

const invalidBaseContext = (
  selection: ScheduleCalendarSelection,
  rawParameters: AjsParameter[],
  key: string,
): ScheduleCalendarContext =>
  createScheduleCalendarContext({
    status: "invalid",
    selection,
    rawParameters,
    evidenceId: `schedule:calendar:invalid-base-or-conflict:${key}`,
  });

const missingTimeContext = (
  input: {
    selection: ScheduleCalendarSelection;
    sourceGroup: AjsUnit;
  },
  settings: BaseSettings,
): ScheduleCalendarContext =>
  createScheduleCalendarContext({
    status: "missing-context",
    selection: input.selection,
    sourceGroup: input.sourceGroup,
    ...settings,
    evidenceId: "schedule:calendar:missing-context:stt",
  });

const resolvedCalendarContext = (
  input: {
    groups: AjsUnit[];
    selection: ScheduleCalendarSelection;
    sourceGroup: AjsUnit;
  },
  settings: BaseSettings,
): ScheduleCalendarContext => {
  const resolvedCalendarGroups: CalendarGroupsResult = resolveCalendarGroups(
    input.groups,
  );
  if (resolvedCalendarGroups.invalidKey) {
    return invalidBaseContext(
      input.selection,
      settings.rawParameters,
      resolvedCalendarGroups.invalidKey,
    );
  }
  return createScheduleCalendarContext({
    status: "supported",
    selection: input.selection,
    sourceGroup: input.sourceGroup,
    ...settings,
    evidenceId: "schedule:calendar:resolved",
    calendarGroups: resolvedCalendarGroups.groups,
  });
};

const contextForBaseSettings = (
  input: {
    groups: AjsUnit[];
    selection: ScheduleCalendarSelection;
    sourceGroup: AjsUnit;
  },
  settings: Exclude<BaseSettingsResult, { status: "invalid" }>,
): ScheduleCalendarContext =>
  settings.status === "missing-context"
    ? missingTimeContext(input, settings.settings)
    : resolvedCalendarContext(input, settings.settings);

const resolveScheduleCalendarBaseContext = (input: {
  groups: AjsUnit[];
  sourceGroup: AjsUnit;
  selection: ScheduleCalendarSelection;
  rawSelector: AjsParameter[];
}): ScheduleCalendarContext => {
  const settings = resolveBaseSettings(input);
  if (settings.status === "invalid") {
    return invalidBaseContext(
      input.selection,
      settings.rawParameters,
      settings.key,
    );
  }
  return contextForBaseSettings(input, settings);
};

const numericBaseDayNumber = (
  days: number,
  baseDay: Extract<ScheduleCalendarBaseDay, { kind: "numeric" }>,
): number | undefined => (baseDay.value <= days ? baseDay.value : undefined);

type WeekdayBaseDayInput = {
  year: number;
  month: number;
  days: number;
  baseDay: Extract<ScheduleCalendarBaseDay, { kind: "weekday" }>;
};

const weekdayBaseDayNumber = ({
  year,
  month,
  days,
  baseDay,
}: WeekdayBaseDayInput): number | undefined => {
  const target = ["su", "mo", "tu", "we", "th", "fr", "sa"].indexOf(
    baseDay.weekday,
  );
  const first = createScheduleDate(year, month, 1).getUTCDay();
  const day = 1 + ((target - first + 7) % 7) + (baseDay.occurrence - 1) * 7;
  return day <= days ? day : undefined;
};

const baseDayNumber = (
  year: number,
  month: number,
  baseDay: ScheduleCalendarBaseDay,
): number | undefined => {
  const days = daysInGregorianMonth(year, month);
  return baseDay.kind === "numeric"
    ? numericBaseDayNumber(days, baseDay)
    : weekdayBaseDayNumber({ year, month, days, baseDay });
};

type CalendarMonth = { year: number; month: number };

const previousMonth = (year: number, month: number): CalendarMonth =>
  month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };

const nextMonth = (year: number, month: number): CalendarMonth =>
  month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };

const monthBoundary = (
  year: number,
  month: number,
  direction: "previous" | "next",
): CalendarMonth =>
  direction === "previous"
    ? previousMonth(year, month)
    : nextMonth(year, month);

type OperationalCalendarContext = ScheduleCalendarContext & {
  status: "supported";
  baseDay: ScheduleCalendarBaseDay;
  baseMonth: "th" | "ne";
};

const isOperationalMonthInput = (
  context: ScheduleCalendarContext,
  month: number,
): context is OperationalCalendarContext =>
  hasOperationalBase(context) && isValidCalendarMonth(month);

const hasOperationalBase = (
  context: ScheduleCalendarContext,
): context is OperationalCalendarContext =>
  context.status === "supported" &&
  context.baseDay !== undefined &&
  context.baseMonth !== undefined;

const isValidCalendarMonth = (month: number): boolean =>
  month >= 1 && month <= 12;

type OperationalBoundaries = {
  start: CalendarMonth;
  end: CalendarMonth;
};

const operationalBoundaries = (
  context: OperationalCalendarContext,
  year: number,
  month: number,
): OperationalBoundaries => {
  const previous = monthBoundary(year, month, "previous");
  const next = monthBoundary(year, month, "next");
  return context.baseMonth === "th"
    ? { start: { year, month }, end: next }
    : { start: previous, end: { year, month } };
};

const createOperationalMonth = (
  context: OperationalCalendarContext,
  boundaries: OperationalBoundaries,
): ScheduleOperationalMonth | undefined => {
  const startDay = baseDayNumber(
    boundaries.start.year,
    boundaries.start.month,
    context.baseDay,
  );
  const endDay = baseDayNumber(
    boundaries.end.year,
    boundaries.end.month,
    context.baseDay,
  );
  if (startDay === undefined || endDay === undefined) {
    return undefined;
  }
  return {
    start: createScheduleDate(
      boundaries.start.year,
      boundaries.start.month,
      startDay,
    ),
    endExclusive: createScheduleDate(
      boundaries.end.year,
      boundaries.end.month,
      endDay,
    ),
  };
};

/** Build one definition-backed operational month without host calendar data. */
export const resolveOperationalMonth = (
  context: ScheduleCalendarContext,
  year: number,
  month: number,
): ScheduleOperationalMonth | undefined => {
  if (!isOperationalMonthInput(context, month)) {
    return undefined;
  }
  const boundaries = operationalBoundaries(context, year, month);
  return createOperationalMonth(context, boundaries);
};

export type ScheduleOperationalMonth = {
  start: Date;
  endExclusive: Date;
};

export const isWithinOperationalMonth = (
  date: Date,
  month: ScheduleOperationalMonth,
): boolean => date >= month.start && date < month.endExclusive;

export const operationalMonthLength = (
  month: ScheduleOperationalMonth,
): number =>
  Math.floor(
    (month.endExclusive.getTime() - month.start.getTime()) / 86_400_000,
  );

export const operationalMonthDate = (
  month: ScheduleOperationalMonth,
  offset: number,
): Date => new Date(month.start.getTime() + offset * 86_400_000);

const relativeDayKinds = new Set(["relative", "open", "closed"]);

const isRelativeBackwardDay = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.day.kind === "backward" &&
  ["+", "*", "@"].includes(parsed.day.prefix ?? "");

const isRelativeWeekday = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.day.kind === "weekday" && parsed.day.prefix === "+";

type ClassifiedBackwardDay = Extract<
  ScheduleDateInterpretation["day"],
  { kind: "backward" }
>;

const isClassifiedBackwardDay = (
  parsed: ScheduleDateInterpretation,
): parsed is ScheduleDateInterpretation & { day: ClassifiedBackwardDay } =>
  parsed.day.kind === "backward" &&
  (parsed.day.prefix === "*" || parsed.day.prefix === "@");

const hasInvalidClassifiedOffset = (day: ClassifiedBackwardDay): boolean =>
  day.offset !== undefined && (day.offset < 0 || day.offset > 34);

export const relativeScheduleDateRequiresContext = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  relativeDayKinds.has(parsed.day.kind) ||
  isRelativeBackwardDay(parsed) ||
  isRelativeWeekday(parsed);

const hasInvalidMonth = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.month !== undefined && (parsed.month < 1 || parsed.month > 12);

const hasInvalidRelativeDay = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.day.kind === "relative" &&
  (parsed.day.value < 1 || parsed.day.value > 31);

const hasInvalidClassifiedDay = (parsed: ScheduleDateInterpretation): boolean =>
  (parsed.day.kind === "open" || parsed.day.kind === "closed") &&
  (parsed.day.value < 1 || parsed.day.value > 35);

const hasInvalidRelativeBackwardOffset = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  parsed.day.kind === "backward" &&
  parsed.day.prefix === "+" &&
  parsed.day.offset !== undefined &&
  (parsed.day.offset < 0 || parsed.day.offset > 30);

const hasInvalidClassifiedBackwardOffset = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  isClassifiedBackwardDay(parsed) && hasInvalidClassifiedOffset(parsed.day);

const hasInvalidRelativeWeekdayOccurrence = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  parsed.day.kind === "weekday" &&
  parsed.day.prefix === "+" &&
  typeof parsed.day.occurrence === "number" &&
  (parsed.day.occurrence < 1 || parsed.day.occurrence > 5);

const relativeDateValidators: readonly ((
  parsed: ScheduleDateInterpretation,
) => boolean)[] = [
  hasInvalidMonth,
  hasInvalidRelativeDay,
  hasInvalidClassifiedDay,
  hasInvalidRelativeBackwardOffset,
  hasInvalidClassifiedBackwardOffset,
  hasInvalidRelativeWeekdayOccurrence,
];

export const isSyntacticallyInvalidRelativeScheduleDate = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  relativeScheduleDateRequiresContext(parsed) &&
  relativeDateValidators.some((validate) => validate(parsed));

const isFullyQualifiedDate = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.year !== undefined &&
  parsed.month !== undefined &&
  parsed.month >= 1 &&
  parsed.month <= 12;

export const isFullyQualifiedRelativeScheduleDate = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  isFullyQualifiedDate(parsed) &&
  relativeScheduleDateRequiresContext(parsed) &&
  !isSyntacticallyInvalidRelativeScheduleDate(parsed);

const invalidHierarchyContext = (
  selection: ScheduleCalendarSelection,
  rawParameters: AjsParameter[],
): ScheduleCalendarContext =>
  createScheduleCalendarContext({
    status: "invalid",
    selection,
    rawParameters,
    evidenceId: "schedule:calendar:invalid-base-or-conflict:hierarchy",
  });

type SourceFailure = Extract<
  ScheduleCalendarSourceResolution,
  { status: "invalid" | "missing-context" }
>;

const sourceFailureContext = (source: SourceFailure): ScheduleCalendarContext =>
  createScheduleCalendarContext({
    status: source.status,
    selection: source.selection,
    rawParameters: source.rawParameters,
    evidenceId: source.evidenceId,
  });

/** Resolve a jobnet's definition-backed calendar/base context. */
export const resolveScheduleCalendarContext = (
  document: AjsDocument,
  unit: AjsUnit,
  index: ScheduleCalendarContextIndex = createScheduleCalendarContextIndex(
    document,
  ),
): ScheduleCalendarContext => {
  const ancestorResult = ancestorsOf(unit, index);
  const source = resolveScheduleCalendarSource({
    unit,
    index,
    ancestorResult,
  });
  if (source.status !== "supported") {
    return sourceFailureContext(source);
  }
  const sourceAncestors = ancestorsOf(source.sourceGroup, index);
  if (sourceAncestors.status === "invalid") {
    return invalidHierarchyContext(source.selection, source.rawParameters);
  }
  const groups = [
    source.sourceGroup,
    ...sourceAncestors.ancestors.filter(
      (ancestor) => ancestor.unitType === "g",
    ),
  ];
  return resolveScheduleCalendarBaseContext({
    groups,
    sourceGroup: source.sourceGroup,
    selection: source.selection,
    rawSelector: source.rawParameters,
  });
};
