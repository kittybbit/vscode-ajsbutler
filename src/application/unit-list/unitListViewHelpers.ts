import {
  AjsDocument,
  AjsUnit,
  AjsUnitType,
  findAjsUnitParameter,
  findParentAjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import {
  parseAnyScheduleTimeValue,
  parseClosedDaySubstitutionValue,
  parseCycleValue,
  parseParentScheduleRuleValue,
  parseScheduleByDaysFromStartValue,
  parseScheduleDateValue,
  parseShiftDaysValue,
  parseWaitCountValue,
  resolveEffectiveStartConditionMonitoringPair,
  type ParsedScheduleByDaysFromStartValue,
} from "../../domain/models/parameters/scheduleRuleHelpers";
import { WeekSymbol, isWeekSymbol } from "../../domain/values/AjsType";

const weekSymbols: WeekSymbol[] = ["su", "mo", "tu", "we", "th", "fr", "sa"];

const getCalendarWeekSymbol = (value: string): WeekSymbol | undefined => {
  const parsedValue = value.split(":")[0];
  return isWeekSymbol(parsedValue) ? parsedValue : undefined;
};

const includesCalendarWeekSymbol = (
  values: string[],
  weekSymbol: WeekSymbol,
): boolean =>
  values.some((value) => getCalendarWeekSymbol(value) === weekSymbol);

const calendarWeekState = (
  weekSymbol: WeekSymbol,
  openValues: string[],
  closeValues: string[],
): boolean | undefined => {
  if (includesCalendarWeekSymbol(openValues, weekSymbol)) return true;
  if (includesCalendarWeekSymbol(closeValues, weekSymbol)) return false;
  return undefined;
};

export const buildCalendarWeekView = (
  openValues: string[],
  closeValues: string[],
): Record<WeekSymbol, boolean | undefined> =>
  Object.fromEntries(
    weekSymbols.map((weekSymbol) => [
      weekSymbol,
      calendarWeekState(weekSymbol, openValues, closeValues),
    ]),
  ) as Record<WeekSymbol, boolean | undefined>;

export const isNonWeekCalendarValue = (value: string): boolean =>
  getCalendarWeekSymbol(value) === undefined;

const niPriorityThresholds: readonly {
  matches: (nice: number) => boolean;
  priority: number;
}[] = [
  { matches: (nice) => nice > 10, priority: 5 },
  { matches: (nice) => nice > 0, priority: 4 },
  { matches: (nice) => nice === 0, priority: 3 },
  { matches: (nice) => nice > -11, priority: 2 },
];

const toNiPriority = (value: string): number => {
  const nice = Number(value);
  return (
    niPriorityThresholds.find(({ matches }) => matches(nice))?.priority ?? 1
  );
};

const parentPriorityUnitTypes: readonly AjsUnitType[] = ["n", "rn"];

type ExplicitPriority = {
  priority: number;
  position: number;
};

type ParentPriorityInput = {
  document: AjsDocument;
  unit: AjsUnit;
  priorityById: Map<string, number>;
};

const cachePriority = (
  priorityById: Map<string, number>,
  unitId: string,
  priority: number,
) => {
  priorityById.set(unitId, priority);
  return priority;
};

const explicitPrPriority = (unit: AjsUnit): ExplicitPriority | undefined => {
  const pr = findAjsUnitParameter(unit, "pr");
  return pr?.value !== undefined && pr.value !== ""
    ? { priority: Number(pr.value), position: pr.position ?? -1 }
    : undefined;
};

const explicitNiPriority = (unit: AjsUnit): ExplicitPriority | undefined => {
  const ni = findAjsUnitParameter(unit, "ni");
  return ni
    ? { priority: toNiPriority(ni.value), position: ni.position ?? -1 }
    : undefined;
};

const laterExplicitPriority = (
  pr: ExplicitPriority,
  ni: ExplicitPriority,
): number => (pr.position > ni.position ? pr.priority : ni.priority);

const resolveExplicitPriority = (unit: AjsUnit): number | undefined => {
  const pr = explicitPrPriority(unit);
  const ni = explicitNiPriority(unit);

  return pr && ni
    ? laterExplicitPriority(pr, ni)
    : (pr?.priority ?? ni?.priority);
};

const isParentPrioritySource = (unit: AjsUnit): boolean =>
  parentPriorityUnitTypes.includes(unit.unitType);

const resolveParentPriority = ({
  document,
  unit,
  priorityById,
}: ParentPriorityInput): number | undefined => {
  const parent = findParentAjsUnit(document, unit);
  return parent && isParentPrioritySource(parent)
    ? getPriorityForUnitTypes(
        document,
        parent,
        priorityById,
        parentPriorityUnitTypes,
      )
    : undefined;
};

const resolveUncachedPriority = (input: ParentPriorityInput): number =>
  resolveExplicitPriority(input.unit) ?? resolveParentPriority(input) ?? 1;

export const getPriorityForUnitTypes = (
  document: AjsDocument,
  unit: AjsUnit,
  priorityById: Map<string, number>,
  targetUnitTypes: readonly AjsUnitType[],
): number | undefined => {
  const cachedPriority = priorityById.get(unit.id);
  if (cachedPriority !== undefined) {
    return cachedPriority;
  }
  if (!targetUnitTypes.includes(unit.unitType)) {
    return undefined;
  }

  return cachePriority(
    priorityById,
    unit.id,
    resolveUncachedPriority({ document, unit, priorityById }),
  );
};

export const parseLnParentRule = (value: string): string =>
  parseParentScheduleRuleValue(value)?.value ?? "";

export const parseSd = (
  value: string,
): { type: string; yearMonth: string; day: string } => {
  const parsed = parseScheduleDateValue(value);
  const yearMonth = parsed?.yearMonth?.slice(0, -1) ?? "";
  const dayValue = parsed?.day ?? "";
  const type =
    dayValue === "en" || dayValue === "ud"
      ? dayValue
      : dayValue.startsWith("+")
        ? "+"
        : dayValue.startsWith("*")
          ? "*"
          : dayValue.startsWith("@")
            ? "@"
            : "";
  const day =
    dayValue && dayValue !== "en" && dayValue !== "ud"
      ? dayValue.replace(/^[+*@]/, "")
      : "";
  return { type, yearMonth, day };
};

export const parseTimeValue = (value: string, fallback = ""): string =>
  parseAnyScheduleTimeValue(value)?.value ?? fallback;

export const parseCy = (value: string): string =>
  parseCycleValue(value)?.value.slice(1, -1) ?? "";

export const parseSh = (value: string): string =>
  parseClosedDaySubstitutionValue(value)?.value ?? "";

export const parseShd = (value: string): string =>
  parseShiftDaysValue(value)?.value ?? "2";

const cftdTypesWithoutMaxShiftableDays: readonly ParsedScheduleByDaysFromStartValue["type"][] =
  ["no", "db", "da"];

const cftdScheduleByDaysFromStart = (
  type: ParsedScheduleByDaysFromStartValue["type"],
  scheduleByDaysFromStart: string | undefined,
): string =>
  type === "no" ? "no" : `${type},${scheduleByDaysFromStart ?? "1"}`;

const cftdMaxShiftableDays = (
  type: ParsedScheduleByDaysFromStartValue["type"],
  maxShiftableDays: string | undefined,
): string =>
  cftdTypesWithoutMaxShiftableDays.includes(type)
    ? ""
    : (maxShiftableDays ?? "10");

export const parseCftd = (
  value: string,
): { scheduleByDaysFromStart: string; maxShiftableDays: string } => {
  const parsed = parseScheduleByDaysFromStartValue(value);
  const type = parsed?.type ?? "no";
  return {
    scheduleByDaysFromStart: cftdScheduleByDaysFromStart(
      type,
      parsed?.scheduleByDaysFromStart,
    ),
    maxShiftableDays: cftdMaxShiftableDays(type, parsed?.maxShiftableDays),
  };
};

export const parseWc = (value: string): string =>
  parseWaitCountValue(value)?.value ?? "1";

export const buildEffectiveStartConditionMonitoringViews = (
  waitCountValues: string[],
  waitTimeValues: string[],
): { waitCounts: string[]; waitTimes: string[] } => {
  const pairCount = Math.max(waitCountValues.length, waitTimeValues.length);
  const waitCounts: string[] = [];
  const waitTimes: string[] = [];

  for (let index = 0; index < pairCount; index += 1) {
    const effectivePair = resolveEffectiveStartConditionMonitoringPair(
      waitCountValues[index],
      waitTimeValues[index],
    );

    waitCounts.push(effectivePair.numberOfTimes ?? "");
    waitTimes.push(effectivePair.time ?? "");
  }

  return { waitCounts, waitTimes };
};
