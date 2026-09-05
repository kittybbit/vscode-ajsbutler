import {
  type AjsDocument,
  type AjsParameter,
  type AjsUnit,
} from "../../models/ajs/AjsDocument";
import type {
  ScheduleDateInterpretation,
  ScheduleDateWeekday,
} from "../../models/parameters/scheduleDateInterpreter";

export type SemanticDiffScheduleCalendarContextStatus =
  | "supported"
  | "invalid"
  | "missing-context";

export type SemanticDiffScheduleBaseDay =
  | { kind: "numeric"; value: number }
  | { kind: "weekday"; weekday: ScheduleDateWeekday; occurrence: number };

export type SemanticDiffScheduleCalendarDayClassification = "open" | "closed";

type SemanticDiffScheduleCalendarSelector =
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

type SemanticDiffScheduleCalendarEntry = {
  selector: SemanticDiffScheduleCalendarSelector;
  classification: SemanticDiffScheduleCalendarDayClassification;
  parameter: AjsParameter;
};

type SemanticDiffScheduleCalendarGroup = {
  entries: SemanticDiffScheduleCalendarEntry[];
};

export type SemanticDiffScheduleCalendarSelection = {
  status: SemanticDiffScheduleCalendarContextStatus;
  evidenceId: string;
  rawParameters: AjsParameter[];
};

export type SemanticDiffScheduleCalendarContext = {
  status: SemanticDiffScheduleCalendarContextStatus;
  selection: SemanticDiffScheduleCalendarSelection;
  sourceGroup?: AjsUnit;
  baseDay?: SemanticDiffScheduleBaseDay;
  baseMonth?: "th" | "ne";
  baseTime?: string;
  rawParameters: AjsParameter[];
  evidenceId: string;
  calendarGroups?: SemanticDiffScheduleCalendarGroup[];
};

export type SemanticDiffScheduleCalendarContextIndex = {
  byId: Map<string, AjsUnit[]>;
  byPath: Map<string, AjsUnit[]>;
  duplicatePath: boolean;
};

export const createScheduleCalendarContextIndex = (
  document: AjsDocument,
): SemanticDiffScheduleCalendarContextIndex => {
  const units: AjsUnit[] = [];
  const pending = [...document.rootUnits].reverse();
  const visited = new Set<AjsUnit>();
  while (pending.length > 0) {
    const unit = pending.pop()!;
    if (visited.has(unit)) {
      continue;
    }
    visited.add(unit);
    units.push(unit);
    for (let index = unit.children.length - 1; index >= 0; index -= 1) {
      pending.push(unit.children[index]);
    }
  }
  const byId = new Map<string, AjsUnit[]>();
  const byPath = new Map<string, AjsUnit[]>();
  units.forEach((unit) => {
    const unitsById = byId.get(unit.id);
    if (unitsById) {
      unitsById.push(unit);
    } else {
      byId.set(unit.id, [unit]);
    }
    const unitsByPath = byPath.get(unit.absolutePath);
    if (unitsByPath) {
      unitsByPath.push(unit);
    } else {
      byPath.set(unit.absolutePath, [unit]);
    }
  });
  return {
    byId,
    byPath,
    duplicatePath: [...byPath.values()].some((matches) => matches.length > 1),
  };
};

type AncestorResult =
  | { status: "supported"; ancestors: AjsUnit[] }
  | { status: "invalid" };

const ancestorsOf = (
  unit: AjsUnit,
  index: SemanticDiffScheduleCalendarContextIndex,
): AncestorResult => {
  const ancestors: AjsUnit[] = [];
  const seenIds = new Set<string>();
  const seenPaths = new Set<string>();
  let parentId = unit.parentId;
  while (parentId !== undefined) {
    const matches = index.byId.get(parentId) ?? [];
    if (matches.length !== 1) {
      return { status: "invalid" };
    }
    const parent = matches[0];
    if (seenIds.has(parent.id) || seenPaths.has(parent.absolutePath)) {
      return { status: "invalid" };
    }
    seenIds.add(parent.id);
    seenPaths.add(parent.absolutePath);
    ancestors.push(parent);
    parentId = parent.parentId;
  }
  return { status: "supported", ancestors };
};

const baseParameter = (
  groups: AjsUnit[],
  key: "sdd" | "md" | "stt",
): {
  parameter?: AjsParameter;
  parameters: AjsParameter[];
  invalid: boolean;
} => {
  for (const group of groups) {
    const parameters = group.parameters.filter(
      (parameter) => parameter.key === key,
    );
    if (parameters.length > 1) {
      return { parameters, invalid: true };
    }
    if (parameters.length === 1) {
      return { parameter: parameters[0], parameters, invalid: false };
    }
  }
  return { parameters: [], invalid: false };
};

const parseBaseDay = (
  value: string,
): SemanticDiffScheduleBaseDay | undefined => {
  if (/^\d{1,2}$/.test(value)) {
    const numeric = Number(value);
    return numeric >= 1 && numeric <= 31
      ? { kind: "numeric", value: numeric }
      : undefined;
  }
  const weekday = /^(su|mo|tu|we|th|fr|sa)(?::([1-5]))?$/.exec(value);
  if (!weekday) {
    return undefined;
  }
  return {
    kind: "weekday",
    weekday: weekday[1] as ScheduleDateWeekday,
    occurrence: Number(weekday[2] ?? "1"),
  };
};

const daysInGregorianMonth = (year: number, month: number): number => {
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
    month - 1
  ];
};

const parseCalendarSelector = (
  value: string,
): SemanticDiffScheduleCalendarSelector | undefined => {
  const exact = /^(?:(\d{4})\/)?(\d{2})\/(\d{2})$/.exec(value);
  if (exact) {
    const year = exact[1] === undefined ? undefined : Number(exact[1]);
    const month = Number(exact[2]);
    const day = Number(exact[3]);
    if (
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31 ||
      (year !== undefined && day > daysInGregorianMonth(year, month))
    ) {
      return undefined;
    }
    return {
      kind: "exact",
      ...(year === undefined ? {} : { year }),
      month,
      day,
      key: `exact:${year ?? "*"}/${month}/${day}`,
    };
  }
  const weekday = /^(su|mo|tu|we|th|fr|sa)(?::(?:[1-5]|b))?$/.exec(value);
  return weekday
    ? {
        kind: "weekday",
        weekday: weekday[1] as ScheduleDateWeekday,
        key: `weekday:${weekday[1]}`,
      }
    : undefined;
};

const calendarParameters = (group: AjsUnit): AjsParameter[] =>
  group.parameters.filter(
    (parameter) => parameter.key === "op" || parameter.key === "cl",
  );

const resolveCalendarGroups = (
  groups: AjsUnit[],
): {
  groups: SemanticDiffScheduleCalendarGroup[];
  invalidKey?: string;
} => {
  const resolvedGroups: SemanticDiffScheduleCalendarGroup[] = [];
  for (const group of groups) {
    const entries: SemanticDiffScheduleCalendarEntry[] = [];
    const classifications = new Map<
      string,
      SemanticDiffScheduleCalendarDayClassification
    >();
    for (const parameter of calendarParameters(group)) {
      const selector = parseCalendarSelector(parameter.value);
      if (!selector) {
        return { groups: resolvedGroups, invalidKey: parameter.key };
      }
      const classification: SemanticDiffScheduleCalendarDayClassification =
        parameter.key === "op" ? "open" : "closed";
      const existing = classifications.get(selector.key);
      if (existing !== undefined && existing !== classification) {
        return { groups: resolvedGroups, invalidKey: parameter.key };
      }
      classifications.set(selector.key, classification);
      entries.push({ selector, classification, parameter });
    }
    resolvedGroups.push({ entries });
  }
  return { groups: resolvedGroups };
};

const isValidBaseTime = (value: string): boolean => {
  const matched = /^(\d{2}):(\d{2})$/.exec(value);
  return matched !== null && Number(matched[1]) < 24 && Number(matched[2]) < 60;
};

const selectionEvidence = (
  status: SemanticDiffScheduleCalendarContextStatus,
  value: string,
  rawParameters: AjsParameter[],
): SemanticDiffScheduleCalendarSelection => ({
  status,
  evidenceId:
    status === "supported"
      ? `schedule:jc:resolved:${value}`
      : status === "invalid"
        ? `schedule:jc:invalid:${value}`
        : `schedule:jc:missing-context:${value}`,
  rawParameters,
});

const contextResult = (input: {
  status: SemanticDiffScheduleCalendarContextStatus;
  selection: SemanticDiffScheduleCalendarSelection;
  sourceGroup?: AjsUnit;
  baseDay?: SemanticDiffScheduleBaseDay;
  baseMonth?: "th" | "ne";
  baseTime?: string;
  rawParameters: AjsParameter[];
  evidenceId: string;
  calendarGroups?: SemanticDiffScheduleCalendarGroup[];
}): SemanticDiffScheduleCalendarContext => input;

const invalidBaseContext = (
  selection: SemanticDiffScheduleCalendarSelection,
  rawParameters: AjsParameter[],
  key: string,
): SemanticDiffScheduleCalendarContext =>
  contextResult({
    status: "invalid",
    selection,
    rawParameters,
    evidenceId: `schedule:calendar:invalid-base-or-conflict:${key}`,
  });

/** Resolve a jobnet's definition-backed calendar/base context. */
export const resolveScheduleCalendarContext = (
  document: AjsDocument,
  unit: AjsUnit,
  index: SemanticDiffScheduleCalendarContextIndex = createScheduleCalendarContextIndex(
    document,
  ),
): SemanticDiffScheduleCalendarContext => {
  const ancestorResult = ancestorsOf(unit, index);
  const rawSelector = unit.parameters.filter(
    (parameter) => parameter.key === "jc",
  );
  const selectorValue = rawSelector[0]?.value ?? "";
  if (index.duplicatePath || ancestorResult.status === "invalid") {
    const selection = selectionEvidence("invalid", selectorValue, rawSelector);
    return contextResult({
      status: "invalid",
      selection,
      rawParameters: rawSelector,
      evidenceId: "schedule:calendar:invalid-base-or-conflict:hierarchy",
    });
  }

  const ancestors = ancestorResult.ancestors;
  const containingGroup = ancestors.find(
    (ancestor) => ancestor.unitType === "g",
  );
  let sourceGroup: AjsUnit | undefined;
  let selection: SemanticDiffScheduleCalendarSelection;
  if (rawSelector.length > 1) {
    selection = selectionEvidence("invalid", selectorValue, rawSelector);
    return invalidBaseContext(selection, rawSelector, "jc");
  }
  if (rawSelector.length === 1) {
    if (!rawSelector[0].value.startsWith("/")) {
      selection = selectionEvidence(
        "invalid",
        rawSelector[0].value,
        rawSelector,
      );
      return contextResult({
        status: "invalid",
        selection,
        rawParameters: rawSelector,
        evidenceId: `schedule:jc:invalid:${rawSelector[0].value}`,
      });
    }
    const matches = index.byPath.get(rawSelector[0].value) ?? [];
    if (matches.length !== 1 || matches[0].unitType !== "g") {
      selection = selectionEvidence(
        "missing-context",
        rawSelector[0].value,
        rawSelector,
      );
      return contextResult({
        status: "missing-context",
        selection,
        rawParameters: rawSelector,
        evidenceId: selection.evidenceId,
      });
    }
    sourceGroup = matches[0];
    selection = selectionEvidence(
      "supported",
      sourceGroup.absolutePath,
      rawSelector,
    );
  } else {
    if (!containingGroup) {
      selection = selectionEvidence("missing-context", "", rawSelector);
      return contextResult({
        status: "missing-context",
        selection,
        rawParameters: rawSelector,
        evidenceId: "schedule:calendar:missing-context:group",
      });
    }
    sourceGroup = containingGroup;
    selection = selectionEvidence(
      "supported",
      sourceGroup.absolutePath,
      rawSelector,
    );
  }

  const sourceAncestors = ancestorsOf(sourceGroup, index);
  if (sourceAncestors.status === "invalid") {
    return invalidBaseContext(selection, rawSelector, "hierarchy");
  }
  const groups = [
    sourceGroup,
    ...sourceAncestors.ancestors.filter(
      (ancestor) => ancestor.unitType === "g",
    ),
  ];
  const baseParameters = [
    baseParameter(groups, "sdd"),
    baseParameter(groups, "md"),
    baseParameter(groups, "stt"),
  ];
  const rawParameters = [
    ...rawSelector,
    ...baseParameters.flatMap(({ parameters }) => parameters),
    ...groups.flatMap(calendarParameters),
  ];
  if (baseParameters.some(({ invalid }) => invalid)) {
    const invalidKey = ["sdd", "md", "stt"].find(
      (_, index) => baseParameters[index].invalid,
    )!;
    return invalidBaseContext(selection, rawParameters, invalidKey);
  }

  const baseDayParameter = baseParameters[0].parameter;
  const baseDay = baseDayParameter
    ? parseBaseDay(baseDayParameter.value)
    : { kind: "numeric" as const, value: 1 };
  if (!baseDay) {
    return invalidBaseContext(selection, rawParameters, "sdd");
  }
  const baseMonthParameter = baseParameters[1].parameter;
  const baseMonth = baseMonthParameter?.value ?? "th";
  if (baseMonth !== "th" && baseMonth !== "ne") {
    return invalidBaseContext(selection, rawParameters, "md");
  }
  const baseTimeParameter = baseParameters[2].parameter;
  const baseTime = baseTimeParameter?.value ?? "00:00";
  if (!isValidBaseTime(baseTime)) {
    return invalidBaseContext(selection, rawParameters, "stt");
  }
  if (baseTime !== "00:00") {
    return contextResult({
      status: "missing-context",
      selection,
      sourceGroup,
      baseDay,
      baseMonth,
      baseTime,
      rawParameters,
      evidenceId: "schedule:calendar:missing-context:stt",
    });
  }
  const resolvedCalendarGroups = resolveCalendarGroups(groups);
  if (resolvedCalendarGroups.invalidKey) {
    return invalidBaseContext(
      selection,
      rawParameters,
      resolvedCalendarGroups.invalidKey,
    );
  }
  return contextResult({
    status: "supported",
    selection,
    sourceGroup,
    baseDay,
    baseMonth,
    baseTime,
    rawParameters,
    evidenceId: "schedule:calendar:resolved",
    calendarGroups: resolvedCalendarGroups.groups,
  });
};

const daysInMonth = (year: number, month: number): number => {
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
    month - 1
  ];
};

const createDate = (year: number, month: number, day: number): Date => {
  const date = new Date(Date.UTC(1970, 0, 1));
  date.setUTCFullYear(year, month - 1, day);
  return date;
};

const baseDayNumber = (
  year: number,
  month: number,
  baseDay: SemanticDiffScheduleBaseDay,
): number | undefined => {
  const days = daysInMonth(year, month);
  if (baseDay.kind === "numeric") {
    return baseDay.value <= days ? baseDay.value : undefined;
  }
  const target = ["su", "mo", "tu", "we", "th", "fr", "sa"].indexOf(
    baseDay.weekday,
  );
  const first = createDate(year, month, 1).getUTCDay();
  const day = 1 + ((target - first + 7) % 7) + (baseDay.occurrence - 1) * 7;
  return day <= days ? day : undefined;
};

export type SemanticDiffOperationalMonth = {
  start: Date;
  endExclusive: Date;
};

/** Build one definition-backed operational month without host calendar data. */
export const resolveOperationalMonth = (
  context: SemanticDiffScheduleCalendarContext,
  year: number,
  month: number,
): SemanticDiffOperationalMonth | undefined => {
  if (
    context.status !== "supported" ||
    !context.baseDay ||
    !context.baseMonth ||
    month < 1 ||
    month > 12
  ) {
    return undefined;
  }
  const previous =
    month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
  const next =
    month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
  const startBoundary = context.baseMonth === "th" ? { year, month } : previous;
  const endBoundary = context.baseMonth === "th" ? next : { year, month };
  const startDay = baseDayNumber(
    startBoundary.year,
    startBoundary.month,
    context.baseDay,
  );
  const endDay = baseDayNumber(
    endBoundary.year,
    endBoundary.month,
    context.baseDay,
  );
  if (startDay === undefined || endDay === undefined) {
    return undefined;
  }
  return {
    start: createDate(startBoundary.year, startBoundary.month, startDay),
    endExclusive: createDate(endBoundary.year, endBoundary.month, endDay),
  };
};

export const isWithinOperationalMonth = (
  date: Date,
  month: SemanticDiffOperationalMonth,
): boolean => date >= month.start && date < month.endExclusive;

export const operationalMonthLength = (
  month: SemanticDiffOperationalMonth,
): number =>
  Math.floor(
    (month.endExclusive.getTime() - month.start.getTime()) / 86_400_000,
  );

export const operationalMonthDate = (
  month: SemanticDiffOperationalMonth,
  offset: number,
): Date => new Date(month.start.getTime() + offset * 86_400_000);

export type SemanticDiffScheduleCalendarDayResult =
  | {
      status: SemanticDiffScheduleCalendarDayClassification;
    }
  | {
      status: "missing-context" | "invalid";
      evidenceId: string;
    };

const selectorMatchesDate = (
  selector: SemanticDiffScheduleCalendarSelector,
  date: Date,
): boolean =>
  selector.kind === "exact"
    ? selector.month === date.getUTCMonth() + 1 &&
      selector.day === date.getUTCDate() &&
      (selector.year === undefined || selector.year === date.getUTCFullYear())
    : selector.weekday ===
      (["su", "mo", "tu", "we", "th", "fr", "sa"][
        date.getUTCDay()
      ] as ScheduleDateWeekday);

const classifyCalendarSelector = (
  context: SemanticDiffScheduleCalendarContext,
  date: Date,
  kind: "exact" | "weekday",
): SemanticDiffScheduleCalendarDayResult | undefined => {
  for (const group of context.calendarGroups ?? []) {
    const matches = group.entries.filter(
      (entry) =>
        entry.selector.kind === kind &&
        selectorMatchesDate(entry.selector, date),
    );
    if (matches.length === 0) {
      continue;
    }
    const classifications = new Set(
      matches.map((entry) => entry.classification),
    );
    if (classifications.size > 1) {
      return {
        status: "invalid",
        evidenceId: `schedule:calendar:invalid-base-or-conflict:${matches[0].parameter.key}`,
      };
    }
    return { status: matches[0].classification };
  }
  return undefined;
};

/** Resolve one operational-calendar day with exact-date precedence. */
export const classifyScheduleCalendarDay = (
  context: SemanticDiffScheduleCalendarContext,
  date: Date,
): SemanticDiffScheduleCalendarDayResult => {
  if (context.status !== "supported") {
    return {
      status: context.status,
      evidenceId: context.evidenceId,
    };
  }
  return (
    classifyCalendarSelector(context, date, "exact") ??
    classifyCalendarSelector(context, date, "weekday") ?? {
      status: "missing-context",
      evidenceId: "schedule:calendar:missing-context:calendar",
    }
  );
};

export const relativeScheduleDateRequiresContext = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  parsed.day.kind === "relative" ||
  parsed.day.kind === "open" ||
  parsed.day.kind === "closed" ||
  (parsed.day.kind === "backward" &&
    (parsed.day.prefix === "+" ||
      parsed.day.prefix === "*" ||
      parsed.day.prefix === "@")) ||
  (parsed.day.kind === "weekday" && parsed.day.prefix === "+");

export const isSyntacticallyInvalidRelativeScheduleDate = (
  parsed: ScheduleDateInterpretation,
): boolean => {
  if (!relativeScheduleDateRequiresContext(parsed)) {
    return false;
  }
  if (parsed.month !== undefined && (parsed.month < 1 || parsed.month > 12)) {
    return true;
  }
  if (parsed.day.kind === "relative") {
    return parsed.day.value < 1 || parsed.day.value > 31;
  }
  if (parsed.day.kind === "open" || parsed.day.kind === "closed") {
    return parsed.day.value < 1 || parsed.day.value > 35;
  }
  if (parsed.day.kind === "backward" && parsed.day.prefix === "+") {
    return (
      parsed.day.offset !== undefined &&
      (parsed.day.offset < 0 || parsed.day.offset > 30)
    );
  }
  if (
    parsed.day.kind === "backward" &&
    (parsed.day.prefix === "*" || parsed.day.prefix === "@")
  ) {
    return (
      parsed.day.offset !== undefined &&
      (parsed.day.offset < 0 || parsed.day.offset > 34)
    );
  }
  if (parsed.day.kind === "weekday" && parsed.day.prefix === "+") {
    return (
      typeof parsed.day.occurrence === "number" &&
      (parsed.day.occurrence < 1 || parsed.day.occurrence > 5)
    );
  }
  return false;
};

export const isFullyQualifiedRelativeScheduleDate = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  parsed.year !== undefined &&
  parsed.month !== undefined &&
  parsed.month >= 1 &&
  parsed.month <= 12 &&
  relativeScheduleDateRequiresContext(parsed) &&
  !isSyntacticallyInvalidRelativeScheduleDate(parsed);
