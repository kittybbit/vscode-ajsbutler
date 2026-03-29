import {
  AjsDependencyType,
  AjsDocument,
  AjsGroupType,
  AjsUnitType,
  flattenAjsUnits,
} from "../../domain/models/ajs/AjsDocument";
import { WeekSymbol, isWeekSymbol } from "../../domain/values/AjsType";

export type UnitListGroup1View = {
  name: string;
  parentAbsolutePath: string;
  parentId?: string;
  unitType: AjsUnitType;
  groupType?: AjsGroupType;
  cty?: string;
  layoutHv?: string;
  size?: string;
};

export type UnitListGroup3View = {
  hardAttribute?: string;
  isRecovery?: boolean;
  jp1Username?: string;
  jp1ResourceGroup?: string;
};

export type UnitListLinkedUnitView = {
  id: string;
  name: string;
  absolutePath: string;
  relationType: AjsDependencyType;
};

export type UnitListGroup2View = {
  comment?: string;
  previousUnits: UnitListLinkedUnitView[];
  nextUnits: UnitListLinkedUnitView[];
  executionAgent?: string;
  nestedConnectionLimit?: string;
  nestedConnectionName?: string;
  nestedConnectionService?: string;
  nestedConnectionEnabled?: string;
  nestedConnectionExternal?: string;
  nestedConnectionHost?: string;
};

export type UnitListGroup4View = {
  managerHost?: string;
  managerUnit?: string;
};

export type UnitListGroup5View = {
  startDeadlineDate?: string;
  maximumDuration?: string;
  startTimeType?: string;
  jobGroupType?: AjsGroupType;
};

export type UnitListGroup6View = {
  su?: boolean;
  mo?: boolean;
  tu?: boolean;
  we?: boolean;
  th?: boolean;
  fr?: boolean;
  sa?: boolean;
  openDates: string[];
  closeDates: string[];
};

export type UnitListGroup7View = {
  concurrentExecution?: string;
  retainedGenerationCount?: string;
  targetManager?: string;
  priority?: number;
  timeoutPeriod?: string;
  scheduleOption?: string;
  requiredExecutionTime?: string;
};

export type UnitListGroup10View = {
  deleteAfterExecution?: string;
  executionDate?: string;
  jobGroupPath?: string;
  exclusiveJobnetName?: string;
  parentRules: string[];
  scheduleDateTypes: string[];
  scheduleDateYearMonths: string[];
  scheduleDateDays: string[];
  startTimes: string[];
  cycles: string[];
  substitutes: string[];
  shiftDays: string[];
  scheduleByDaysFromStart: string[];
  maxShiftableDays: string[];
  startRangeTimes: string[];
  endRangeTimes: string[];
  waitCounts: string[];
  waitTimes: string[];
};

export type UnitListGroup8View = {
  nestedConnectorRelease?: string;
};

export type UnitListGroup9View = {
  startCondition?: string;
};

export type UnitListRowView = {
  absolutePath: string;
  group2: UnitListGroup2View;
  group1: UnitListGroup1View;
  group3: UnitListGroup3View;
  group4: UnitListGroup4View;
  group5: UnitListGroup5View;
  group6: UnitListGroup6View;
  group7: UnitListGroup7View;
  group10: UnitListGroup10View;
  group8: UnitListGroup8View;
  group9: UnitListGroup9View;
};

const weekSymbols: WeekSymbol[] = ["su", "mo", "tu", "we", "th", "fr", "sa"];

type UnitParameterView = { key: string; value: string; position?: number };

const findParameterValue = (
  parameters: UnitParameterView[],
  key: string,
): string | undefined =>
  parameters.find((parameter) => parameter.key === key)?.value;

const findParameterValues = (
  parameters: UnitParameterView[],
  key: string,
): string[] =>
  parameters
    .filter((parameter) => parameter.key === key)
    .map((parameter) => parameter.value);

const findFirstParameter = (
  parameters: UnitParameterView[],
  key: string,
): UnitParameterView | undefined =>
  parameters.find((parameter) => parameter.key === key);

const getCalendarWeekSymbol = (value: string): WeekSymbol | undefined => {
  const parsedValue = value.split(":")[0];
  return isWeekSymbol(parsedValue) ? parsedValue : undefined;
};

const buildCalendarWeekView = (
  openValues: string[],
  closeValues: string[],
): Record<WeekSymbol, boolean | undefined> =>
  Object.fromEntries(
    weekSymbols.map((weekSymbol) => [
      weekSymbol,
      openValues.some((value) => getCalendarWeekSymbol(value) === weekSymbol)
        ? true
        : closeValues.some(
              (value) => getCalendarWeekSymbol(value) === weekSymbol,
            )
          ? false
          : undefined,
    ]),
  ) as Record<WeekSymbol, boolean | undefined>;

const isNonWeekCalendarValue = (value: string): boolean =>
  getCalendarWeekSymbol(value) === undefined;

const toNiPriority = (value: string): number => {
  const nice = Number(value);
  if (nice > 10) {
    return 5;
  }
  if (nice > 0) {
    return 4;
  }
  if (nice === 0) {
    return 3;
  }
  if (nice > -11) {
    return 2;
  }
  return 1;
};

type Group7PriorityUnit = {
  id: string;
  unitType: AjsUnitType;
  parentId?: string;
  parameters: UnitParameterView[];
};

const getGroup7Priority = (
  unit: Group7PriorityUnit,
  unitById: ReadonlyMap<string, Group7PriorityUnit>,
  priorityById: Map<string, number>,
): number | undefined => {
  const cachedPriority = priorityById.get(unit.id);
  if (cachedPriority !== undefined) {
    return cachedPriority;
  }
  if (unit.unitType !== "n" && unit.unitType !== "rn") {
    return undefined;
  }

  const pr = findFirstParameter(unit.parameters, "pr");
  const ni = findFirstParameter(unit.parameters, "ni");

  const prPriority =
    pr && pr.value !== undefined && pr.value !== ""
      ? Number(pr.value)
      : undefined;
  const niPriority = ni ? toNiPriority(ni.value) : undefined;

  if (prPriority !== undefined && niPriority !== undefined) {
    const priority =
      (pr.position ?? -1) > (ni.position ?? -1) ? prPriority : niPriority;
    priorityById.set(unit.id, priority);
    return priority;
  }
  if (prPriority !== undefined) {
    priorityById.set(unit.id, prPriority);
    return prPriority;
  }
  if (niPriority !== undefined) {
    priorityById.set(unit.id, niPriority);
    return niPriority;
  }

  const parent = unit.parentId ? unitById.get(unit.parentId) : undefined;
  if (parent && (parent.unitType === "n" || parent.unitType === "rn")) {
    const parentPriority = getGroup7Priority(parent, unitById, priorityById);
    if (parentPriority !== undefined) {
      priorityById.set(unit.id, parentPriority);
      return parentPriority;
    }
  }
  priorityById.set(unit.id, 1);
  return 1;
};

const parseRulePrefix = (value: string): { rule?: string; body: string } => {
  const matched = /^(\d{1,3}),(.*)$/.exec(value);
  return matched ? { rule: matched[1], body: matched[2] } : { body: value };
};

const parseLnParentRule = (value: string): string =>
  parseRulePrefix(value).body;

const parseSd = (
  value: string,
): { type: string; yearMonth: string; day: string } => {
  const matched =
    /^((\d{1,3}),)?((\d{4}\/)?\d{2}\/)?(([+*@])?\d{2}|([+*@])?b(-\d{2})?|\+?(su|mo|tu|we|th|fr|sa)(:(\d|b))?|en|ud)/.exec(
      value,
    );
  const yearMonth = matched?.[3]?.slice(0, -1) ?? "";
  const dayValue = matched?.[5] ?? "";
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

const parseTimeValue = (value: string, fallback = ""): string =>
  /^((\d{1,3}),)?(no|([+]?)\d{2}:\d{2}|([MCU])?\d{1,4}|un)?/.exec(value)?.[3] ??
  fallback;

const parseCy = (value: string): string =>
  /^((\d{1,3}),)?\(((\d{1,3}),([ymwd]))\)/.exec(value)?.[3] ?? "";

const parseSh = (value: string): string =>
  /^((\d{1,3}),)?(be|af|ca|no)/.exec(value)?.[3] ?? "";

const parseShd = (value: string): string =>
  /^((\d{1,3}),)?(\d{1,3})/.exec(value)?.[3] ?? "2";

const parseCftd = (
  value: string,
): { scheduleByDaysFromStart: string; maxShiftableDays: string } => {
  const matched =
    /^((\d{1,3}),)?(no|be|af|db|da)((,(\d{1,2}))(,(\d{1,2}))?)?/.exec(value);
  const type = matched?.[3] ?? "no";
  return {
    scheduleByDaysFromStart:
      type === "no" ? "no" : `${type},${matched?.[6] ?? "1"}`,
    maxShiftableDays:
      type && ["no", "db", "da"].includes(type) ? "" : (matched?.[8] ?? "10"),
  };
};

const parseWc = (value: string): string =>
  /^((\d{1,3}),)?(.+)/.exec(value)?.[3] ?? "1";

export const buildUnitListView = (document: AjsDocument): UnitListRowView[] => {
  const units = flattenAjsUnits(document.rootUnits);
  const unitById = new Map(units.map((unit) => [unit.id, unit]));
  const group7PriorityById = new Map<string, number>();

  return units.map((unit) => {
    const parent = unit.parentId ? unitById.get(unit.parentId) : undefined;
    const previousUnits =
      parent?.dependencies
        .filter((dependency) => dependency.targetUnitId === unit.id)
        .flatMap((dependency) => {
          const sourceUnit = unitById.get(dependency.sourceUnitId);
          return sourceUnit
            ? [
                {
                  id: sourceUnit.id,
                  name: sourceUnit.name,
                  absolutePath: sourceUnit.absolutePath,
                  relationType: dependency.type,
                },
              ]
            : [];
        }) ?? [];
    const nextUnits =
      parent?.dependencies
        .filter((dependency) => dependency.sourceUnitId === unit.id)
        .flatMap((dependency) => {
          const targetUnit = unitById.get(dependency.targetUnitId);
          return targetUnit
            ? [
                {
                  id: targetUnit.id,
                  name: targetUnit.name,
                  absolutePath: targetUnit.absolutePath,
                  relationType: dependency.type,
                },
              ]
            : [];
        }) ?? [];

    return {
      absolutePath: unit.absolutePath,
      group2: {
        comment: unit.comment,
        previousUnits,
        nextUnits,
        executionAgent: findParameterValue(unit.parameters, "ex"),
        nestedConnectionLimit: findParameterValue(unit.parameters, "ncl"),
        nestedConnectionName: findParameterValue(unit.parameters, "ncn"),
        nestedConnectionService: findParameterValue(unit.parameters, "ncsv"),
        nestedConnectionEnabled: findParameterValue(unit.parameters, "ncs"),
        nestedConnectionExternal: findParameterValue(unit.parameters, "ncex"),
        nestedConnectionHost: findParameterValue(unit.parameters, "nchn"),
      },
      group1: {
        name: unit.name,
        parentAbsolutePath:
          unit.depth > 0
            ? unit.absolutePath.split("/").slice(0, -1).join("/") || "/"
            : "/",
        parentId: unit.parentId,
        unitType: unit.unitType,
        groupType: unit.groupType,
        cty: findParameterValue(unit.parameters, "cty"),
        layoutHv:
          unit.depth > 0 ? `+${unit.layout.h}+${unit.layout.v}` : undefined,
        size: findParameterValue(unit.parameters, "sz"),
      },
      group3: {
        hardAttribute: findParameterValue(unit.parameters, "ha"),
        isRecovery: unit.isRecovery,
        jp1Username: unit.jp1Username,
        jp1ResourceGroup: unit.jp1ResourceGroup,
      },
      group4: {
        managerHost:
          unit.unitType === "mg" || unit.unitType === "mn"
            ? findParameterValue(unit.parameters, "mh")
            : undefined,
        managerUnit:
          unit.unitType === "mg" || unit.unitType === "mn"
            ? findParameterValue(unit.parameters, "mu")
            : undefined,
      },
      group5: {
        startDeadlineDate:
          unit.unitType === "g"
            ? findParameterValue(unit.parameters, "sdd")
            : undefined,
        maximumDuration:
          unit.unitType === "g"
            ? findParameterValue(unit.parameters, "md")
            : undefined,
        startTimeType:
          unit.unitType === "g"
            ? findParameterValue(unit.parameters, "stt")
            : undefined,
        jobGroupType: unit.unitType === "g" ? unit.groupType : undefined,
      },
      group6:
        unit.unitType === "g"
          ? {
              ...buildCalendarWeekView(
                findParameterValues(unit.parameters, "op"),
                findParameterValues(unit.parameters, "cl"),
              ),
              openDates: findParameterValues(unit.parameters, "op").filter(
                isNonWeekCalendarValue,
              ),
              closeDates: findParameterValues(unit.parameters, "cl").filter(
                isNonWeekCalendarValue,
              ),
            }
          : {
              openDates: [],
              closeDates: [],
            },
      group7: {
        concurrentExecution:
          unit.unitType === "n" ||
          unit.unitType === "rn" ||
          unit.unitType === "rm" ||
          unit.unitType === "rr"
            ? findParameterValue(unit.parameters, "mp")
            : undefined,
        retainedGenerationCount:
          unit.unitType === "n" ||
          unit.unitType === "rn" ||
          unit.unitType === "rm" ||
          unit.unitType === "rr"
            ? findParameterValue(unit.parameters, "rg")
            : undefined,
        targetManager:
          unit.unitType === "n" ||
          unit.unitType === "rn" ||
          unit.unitType === "rm" ||
          unit.unitType === "rr"
            ? findParameterValue(unit.parameters, "rh")
            : undefined,
        priority: getGroup7Priority(unit, unitById, group7PriorityById),
        timeoutPeriod:
          unit.unitType === "n" ||
          unit.unitType === "rn" ||
          unit.unitType === "rm" ||
          unit.unitType === "rr"
            ? findParameterValue(unit.parameters, "cd")
            : undefined,
        scheduleOption:
          unit.unitType === "n" ||
          unit.unitType === "rn" ||
          unit.unitType === "rm" ||
          unit.unitType === "rr"
            ? findParameterValue(unit.parameters, "ms")
            : undefined,
        requiredExecutionTime:
          unit.unitType === "n" ||
          unit.unitType === "rn" ||
          unit.unitType === "rm" ||
          unit.unitType === "rr"
            ? findParameterValue(unit.parameters, "fd")
            : undefined,
      },
      group10: {
        deleteAfterExecution: findParameterValue(unit.parameters, "de"),
        executionDate: findParameterValue(unit.parameters, "ed"),
        jobGroupPath: findParameterValue(unit.parameters, "jc"),
        exclusiveJobnetName: findParameterValue(unit.parameters, "ejn"),
        parentRules: findParameterValues(unit.parameters, "ln").map(
          parseLnParentRule,
        ),
        scheduleDateTypes: findParameterValues(unit.parameters, "sd").map(
          (value) => parseSd(value).type,
        ),
        scheduleDateYearMonths: findParameterValues(unit.parameters, "sd").map(
          (value) => parseSd(value).yearMonth,
        ),
        scheduleDateDays: findParameterValues(unit.parameters, "sd").map(
          (value) => parseSd(value).day,
        ),
        startTimes: findParameterValues(unit.parameters, "st").map((value) =>
          parseTimeValue(value, "+00:00"),
        ),
        cycles: findParameterValues(unit.parameters, "cy").map(parseCy),
        substitutes: findParameterValues(unit.parameters, "sh").map(parseSh),
        shiftDays: findParameterValues(unit.parameters, "shd").map(parseShd),
        scheduleByDaysFromStart: findParameterValues(
          unit.parameters,
          "cftd",
        ).map((value) => parseCftd(value).scheduleByDaysFromStart),
        maxShiftableDays: findParameterValues(unit.parameters, "cftd").map(
          (value) => parseCftd(value).maxShiftableDays,
        ),
        startRangeTimes: findParameterValues(unit.parameters, "sy").map(
          (value) => parseTimeValue(value),
        ),
        endRangeTimes: findParameterValues(unit.parameters, "ey").map((value) =>
          parseTimeValue(value),
        ),
        waitCounts: findParameterValues(unit.parameters, "wc").map(parseWc),
        waitTimes: findParameterValues(unit.parameters, "wt").map((value) =>
          parseTimeValue(value),
        ),
      },
      group8: {
        nestedConnectorRelease:
          unit.unitType === "nc"
            ? findParameterValue(unit.parameters, "ncr")
            : undefined,
      },
      group9: {
        startCondition:
          unit.unitType === "rc"
            ? findParameterValue(unit.parameters, "cond")
            : undefined,
      },
    };
  });
};
