import {
  AjsDependencyType,
  AjsDocument,
  AjsGroupType,
  AjsUnit,
  AjsUnitType,
  findAjsUnitParameter,
  findAjsUnitParameterValue,
  findAjsUnitParameterValues,
  findParentAjsUnit,
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

export type UnitListGroup11View = {
  commandText?: string;
  scriptFileName?: string;
  parameters?: string;
  environmentVariable?: string;
  environmentVariableFile?: string;
  workPathName?: string;
  standardInputFile?: string;
  standardOutputFile?: string;
  standardOutputAction?: string;
  standardErrorFile?: string;
  standardErrorAction?: string;
  queueManager?: string;
  queueName?: string;
  requestJobName?: string;
  priority?: number;
  endJudgment?: string;
  waitThreshold?: string;
  timeoutHold?: string;
  judgmentFile?: string;
  automaticRetryEnabled?: string;
  retryStart?: string;
  retryEnd?: string;
  retryCount?: string;
  retryInterval?: string;
  targetUserName?: string;
};

export type UnitListGroup12View = {
  endJudgment?: string;
  judgmentReturnCode?: string;
  lowerReturnCode?: string;
  lowerJudgmentValue?: string;
  upperComparison?: string;
  upperReturnCode?: string;
  upperJudgmentValue?: string;
  lowerComparison?: string;
  judgmentValueString?: string;
  judgmentValueNumeric?: string;
  variableName?: string;
  judgmentFileName?: string;
};

export type UnitListGroup13View = {
  timeoutInterval?: string;
  eventTimeout?: string;
  monitoredFileName?: string;
  monitoredFileCondition?: string;
  monitoredFileCloseMode?: string;
  monitoringInterval?: string;
  waitEventId?: string;
  waitHostName?: string;
  waitMessage?: string;
  eventTimeoutAction?: string;
};

export type UnitListGroup14View = {
  actionEventId?: string;
  actionHostName?: string;
  actionMessage?: string;
  actionSeverity?: string;
  actionStartType?: string;
  actionInterval?: string;
  actionCount?: string;
  platformMethod?: string;
};

export type UnitListGroup15View = {
  executionUser?: string;
  executionTimeMonitor?: string;
  fileDescriptor?: string;
  jobType?: string;
  terminationStatus1?: string;
  terminationDelay1?: string;
  terminationOperation1?: string;
  terminationStatus2?: string;
  terminationDelay2?: string;
  terminationOperation2?: string;
  terminationStatus3?: string;
  terminationDelay3?: string;
  terminationOperation3?: string;
  terminationStatus4?: string;
  terminationDelay4?: string;
  terminationOperation4?: string;
};

export type UnitListGroup16View = {
  endWaitUnitName?: string;
  waitMode?: string;
  nestedMessageGeneration?: string;
  unitEndMonitoring?: string;
  executionGenerationAction?: string;
};

export type UnitListGroup17View = {
  toolParameters?: string;
  toolEnvironment?: string;
};

export type UnitListGroup18View = {
  destinationAgent?: string;
  flexibleJobGroup?: string;
  executionAgent?: string;
};

export type UnitListGroup19View = {
  httpConnectionConfig?: string;
  httpKind?: string;
  httpExecutionMode?: string;
  httpRequestFile?: string;
  httpRequestEncoding?: string;
  httpRequestMethod?: string;
  httpStatusFile?: string;
  httpStatusPoint?: string;
  httpResponseHeaderFile?: string;
  httpResponseBodyFile?: string;
  httpCodeMap?: string;
};

export type UnitListGroup8View = {
  nestedConnectorRelease?: string;
};

export type UnitListGroup9View = {
  startCondition?: string;
};

export type UnitListRowView = {
  id: string;
  absolutePath: string;
  group2: UnitListGroup2View;
  group1: UnitListGroup1View;
  group3: UnitListGroup3View;
  group4: UnitListGroup4View;
  group5: UnitListGroup5View;
  group6: UnitListGroup6View;
  group7: UnitListGroup7View;
  group10: UnitListGroup10View;
  group11: UnitListGroup11View;
  group12: UnitListGroup12View;
  group13: UnitListGroup13View;
  group14: UnitListGroup14View;
  group15: UnitListGroup15View;
  group16: UnitListGroup16View;
  group17: UnitListGroup17View;
  group18: UnitListGroup18View;
  group19: UnitListGroup19View;
  group8: UnitListGroup8View;
  group9: UnitListGroup9View;
};

const weekSymbols: WeekSymbol[] = ["su", "mo", "tu", "we", "th", "fr", "sa"];

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

const getPriorityForUnitTypes = (
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

  const pr = findAjsUnitParameter(unit, "pr");
  const ni = findAjsUnitParameter(unit, "ni");

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

  const parent = findParentAjsUnit(document, unit);
  if (parent && (parent.unitType === "n" || parent.unitType === "rn")) {
    const parentPriority = getPriorityForUnitTypes(
      document,
      parent,
      priorityById,
      ["n", "rn"],
    );
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
  const group11PriorityById = new Map<string, number>();

  return units.map((unit) => {
    const parent = findParentAjsUnit(document, unit);
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
      id: unit.id,
      absolutePath: unit.absolutePath,
      group2: {
        comment: unit.comment,
        previousUnits,
        nextUnits,
        executionAgent: findAjsUnitParameterValue(unit, "ex"),
        nestedConnectionLimit: findAjsUnitParameterValue(unit, "ncl"),
        nestedConnectionName: findAjsUnitParameterValue(unit, "ncn"),
        nestedConnectionService: findAjsUnitParameterValue(unit, "ncsv"),
        nestedConnectionEnabled: findAjsUnitParameterValue(unit, "ncs"),
        nestedConnectionExternal: findAjsUnitParameterValue(unit, "ncex"),
        nestedConnectionHost: findAjsUnitParameterValue(unit, "nchn"),
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
        cty: findAjsUnitParameterValue(unit, "cty"),
        layoutHv:
          unit.depth > 0 ? `+${unit.layout.h}+${unit.layout.v}` : undefined,
        size: findAjsUnitParameterValue(unit, "sz"),
      },
      group3: {
        hardAttribute: findAjsUnitParameterValue(unit, "ha"),
        isRecovery: unit.isRecovery,
        jp1Username: unit.jp1Username,
        jp1ResourceGroup: unit.jp1ResourceGroup,
      },
      group4: {
        managerHost:
          unit.unitType === "mg" || unit.unitType === "mn"
            ? findAjsUnitParameterValue(unit, "mh")
            : undefined,
        managerUnit:
          unit.unitType === "mg" || unit.unitType === "mn"
            ? findAjsUnitParameterValue(unit, "mu")
            : undefined,
      },
      group5: {
        startDeadlineDate:
          unit.unitType === "g"
            ? findAjsUnitParameterValue(unit, "sdd")
            : undefined,
        maximumDuration:
          unit.unitType === "g"
            ? findAjsUnitParameterValue(unit, "md")
            : undefined,
        startTimeType:
          unit.unitType === "g"
            ? findAjsUnitParameterValue(unit, "stt")
            : undefined,
        jobGroupType: unit.unitType === "g" ? unit.groupType : undefined,
      },
      group6:
        unit.unitType === "g"
          ? {
              ...buildCalendarWeekView(
                findAjsUnitParameterValues(unit, "op"),
                findAjsUnitParameterValues(unit, "cl"),
              ),
              openDates: findAjsUnitParameterValues(unit, "op").filter(
                isNonWeekCalendarValue,
              ),
              closeDates: findAjsUnitParameterValues(unit, "cl").filter(
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
            ? findAjsUnitParameterValue(unit, "mp")
            : undefined,
        retainedGenerationCount:
          unit.unitType === "n" ||
          unit.unitType === "rn" ||
          unit.unitType === "rm" ||
          unit.unitType === "rr"
            ? findAjsUnitParameterValue(unit, "rg")
            : undefined,
        targetManager:
          unit.unitType === "n" ||
          unit.unitType === "rn" ||
          unit.unitType === "rm" ||
          unit.unitType === "rr"
            ? findAjsUnitParameterValue(unit, "rh")
            : undefined,
        priority: getPriorityForUnitTypes(document, unit, group7PriorityById, [
          "n",
          "rn",
        ]),
        timeoutPeriod:
          unit.unitType === "n" ||
          unit.unitType === "rn" ||
          unit.unitType === "rm" ||
          unit.unitType === "rr"
            ? findAjsUnitParameterValue(unit, "cd")
            : undefined,
        scheduleOption:
          unit.unitType === "n" ||
          unit.unitType === "rn" ||
          unit.unitType === "rm" ||
          unit.unitType === "rr"
            ? findAjsUnitParameterValue(unit, "ms")
            : undefined,
        requiredExecutionTime:
          unit.unitType === "n" ||
          unit.unitType === "rn" ||
          unit.unitType === "rm" ||
          unit.unitType === "rr"
            ? findAjsUnitParameterValue(unit, "fd")
            : undefined,
      },
      group10: {
        deleteAfterExecution: findAjsUnitParameterValue(unit, "de"),
        executionDate: findAjsUnitParameterValue(unit, "ed"),
        jobGroupPath: findAjsUnitParameterValue(unit, "jc"),
        exclusiveJobnetName: findAjsUnitParameterValue(unit, "ejn"),
        parentRules: findAjsUnitParameterValues(unit, "ln").map(
          parseLnParentRule,
        ),
        scheduleDateTypes: findAjsUnitParameterValues(unit, "sd").map(
          (value) => parseSd(value).type,
        ),
        scheduleDateYearMonths: findAjsUnitParameterValues(unit, "sd").map(
          (value) => parseSd(value).yearMonth,
        ),
        scheduleDateDays: findAjsUnitParameterValues(unit, "sd").map(
          (value) => parseSd(value).day,
        ),
        startTimes: findAjsUnitParameterValues(unit, "st").map((value) =>
          parseTimeValue(value, "+00:00"),
        ),
        cycles: findAjsUnitParameterValues(unit, "cy").map(parseCy),
        substitutes: findAjsUnitParameterValues(unit, "sh").map(parseSh),
        shiftDays: findAjsUnitParameterValues(unit, "shd").map(parseShd),
        scheduleByDaysFromStart: findAjsUnitParameterValues(unit, "cftd").map(
          (value) => parseCftd(value).scheduleByDaysFromStart,
        ),
        maxShiftableDays: findAjsUnitParameterValues(unit, "cftd").map(
          (value) => parseCftd(value).maxShiftableDays,
        ),
        startRangeTimes: findAjsUnitParameterValues(unit, "sy").map((value) =>
          parseTimeValue(value),
        ),
        endRangeTimes: findAjsUnitParameterValues(unit, "ey").map((value) =>
          parseTimeValue(value),
        ),
        waitCounts: findAjsUnitParameterValues(unit, "wc").map(parseWc),
        waitTimes: findAjsUnitParameterValues(unit, "wt").map((value) =>
          parseTimeValue(value),
        ),
      },
      group11: {
        commandText: findAjsUnitParameterValue(unit, "te"),
        scriptFileName: findAjsUnitParameterValue(unit, "sc"),
        parameters: findAjsUnitParameterValue(unit, "prm"),
        environmentVariable: findAjsUnitParameterValue(unit, "env"),
        environmentVariableFile: findAjsUnitParameterValue(unit, "ev"),
        workPathName: findAjsUnitParameterValue(unit, "wkp"),
        standardInputFile: findAjsUnitParameterValue(unit, "si"),
        standardOutputFile: findAjsUnitParameterValue(unit, "so"),
        standardOutputAction: findAjsUnitParameterValue(unit, "soa"),
        standardErrorFile: findAjsUnitParameterValue(unit, "se"),
        standardErrorAction: findAjsUnitParameterValue(unit, "sea"),
        queueManager: findAjsUnitParameterValue(unit, "qm"),
        queueName: findAjsUnitParameterValue(unit, "qu"),
        requestJobName: findAjsUnitParameterValue(unit, "req"),
        priority: getPriorityForUnitTypes(document, unit, group11PriorityById, [
          "j",
          "rj",
          "pj",
          "rp",
          "qj",
          "rq",
        ]),
        endJudgment: findAjsUnitParameterValue(unit, "jd"),
        waitThreshold: findAjsUnitParameterValue(unit, "wth"),
        timeoutHold: findAjsUnitParameterValue(unit, "tho"),
        judgmentFile: findAjsUnitParameterValue(unit, "jdf"),
        automaticRetryEnabled: findAjsUnitParameterValue(unit, "abr"),
        retryStart: findAjsUnitParameterValue(unit, "rjs"),
        retryEnd: findAjsUnitParameterValue(unit, "rje"),
        retryCount: findAjsUnitParameterValue(unit, "rec"),
        retryInterval: findAjsUnitParameterValue(unit, "rei"),
        targetUserName: findAjsUnitParameterValue(unit, "un"),
      },
      group12: {
        endJudgment: findAjsUnitParameterValue(unit, "ej"),
        judgmentReturnCode: findAjsUnitParameterValue(unit, "ejc"),
        lowerReturnCode: findAjsUnitParameterValue(unit, "ejl"),
        lowerJudgmentValue: findAjsUnitParameterValue(unit, "ejs"),
        upperComparison: findAjsUnitParameterValue(unit, "ejm"),
        upperReturnCode: findAjsUnitParameterValue(unit, "ejh"),
        upperJudgmentValue: findAjsUnitParameterValue(unit, "ejg"),
        lowerComparison: findAjsUnitParameterValue(unit, "eju"),
        judgmentValueString: findAjsUnitParameterValue(unit, "ejt"),
        judgmentValueNumeric: findAjsUnitParameterValue(unit, "eji"),
        variableName: findAjsUnitParameterValue(unit, "ejv"),
        judgmentFileName: findAjsUnitParameterValue(unit, "ejf"),
      },
      group13: {
        timeoutInterval: findAjsUnitParameterValue(unit, "tmitv"),
        eventTimeout: findAjsUnitParameterValue(unit, "etn"),
        monitoredFileName: findAjsUnitParameterValue(unit, "flwf"),
        monitoredFileCondition: findAjsUnitParameterValue(unit, "flwc"),
        monitoredFileCloseMode: findAjsUnitParameterValue(unit, "flco"),
        monitoringInterval: findAjsUnitParameterValue(unit, "flwi"),
        waitEventId: findAjsUnitParameterValue(unit, "evwid"),
        waitHostName: findAjsUnitParameterValue(unit, "evhst"),
        waitMessage: findAjsUnitParameterValue(unit, "evwms"),
        eventTimeoutAction: findAjsUnitParameterValue(unit, "ets"),
      },
      group14: {
        actionEventId: findAjsUnitParameterValue(unit, "evsid"),
        actionHostName: findAjsUnitParameterValue(unit, "evhst"),
        actionMessage: findAjsUnitParameterValue(unit, "evsms"),
        actionSeverity: findAjsUnitParameterValue(unit, "evssv"),
        actionStartType: findAjsUnitParameterValue(unit, "evsrt"),
        actionInterval: findAjsUnitParameterValue(unit, "evspl"),
        actionCount: findAjsUnitParameterValue(unit, "evsrc"),
        platformMethod: findAjsUnitParameterValue(unit, "pfm"),
      },
      group15: {
        executionUser: findAjsUnitParameterValue(unit, "eu"),
        executionTimeMonitor: findAjsUnitParameterValue(unit, "etm"),
        fileDescriptor: findAjsUnitParameterValue(unit, "fd"),
        jobType: findAjsUnitParameterValue(unit, "jty"),
        terminationStatus1: findAjsUnitParameterValue(unit, "ts1"),
        terminationDelay1: findAjsUnitParameterValue(unit, "td1"),
        terminationOperation1: findAjsUnitParameterValue(unit, "top1"),
        terminationStatus2: findAjsUnitParameterValue(unit, "ts2"),
        terminationDelay2: findAjsUnitParameterValue(unit, "td2"),
        terminationOperation2: findAjsUnitParameterValue(unit, "top2"),
        terminationStatus3: findAjsUnitParameterValue(unit, "ts3"),
        terminationDelay3: findAjsUnitParameterValue(unit, "td3"),
        terminationOperation3: findAjsUnitParameterValue(unit, "top3"),
        terminationStatus4: findAjsUnitParameterValue(unit, "ts4"),
        terminationDelay4: findAjsUnitParameterValue(unit, "td4"),
        terminationOperation4: findAjsUnitParameterValue(unit, "top4"),
      },
      group16: {
        endWaitUnitName: findAjsUnitParameterValue(unit, "eun"),
        waitMode: findAjsUnitParameterValue(unit, "mm"),
        nestedMessageGeneration: findAjsUnitParameterValue(unit, "nmg"),
        unitEndMonitoring: findAjsUnitParameterValue(unit, "uem"),
        executionGenerationAction: findAjsUnitParameterValue(unit, "ega"),
      },
      group17: {
        toolParameters:
          unit.unitType === "cpj" || unit.unitType === "rcpj"
            ? findAjsUnitParameterValue(unit, "prm")
            : undefined,
        toolEnvironment:
          unit.unitType === "cpj" || unit.unitType === "rcpj"
            ? findAjsUnitParameterValue(unit, "env")
            : undefined,
      },
      group18: {
        destinationAgent: findAjsUnitParameterValue(unit, "da"),
        flexibleJobGroup: findAjsUnitParameterValue(unit, "fxg"),
        executionAgent:
          unit.unitType === "fxj" || unit.unitType === "rfxj"
            ? findAjsUnitParameterValue(unit, "ex")
            : undefined,
      },
      group19: {
        httpConnectionConfig: findAjsUnitParameterValue(unit, "htcfl"),
        httpKind: findAjsUnitParameterValue(unit, "htknd"),
        httpExecutionMode: findAjsUnitParameterValue(unit, "htexm"),
        httpRequestFile: findAjsUnitParameterValue(unit, "htrqf"),
        httpRequestEncoding: findAjsUnitParameterValue(unit, "htrqu"),
        httpRequestMethod: findAjsUnitParameterValue(unit, "htrqm"),
        httpStatusFile: findAjsUnitParameterValue(unit, "htstf"),
        httpStatusPoint: findAjsUnitParameterValue(unit, "htspt"),
        httpResponseHeaderFile: findAjsUnitParameterValue(unit, "htrhf"),
        httpResponseBodyFile: findAjsUnitParameterValue(unit, "htrbf"),
        httpCodeMap: findAjsUnitParameterValue(unit, "htcdm"),
      },
      group8: {
        nestedConnectorRelease:
          unit.unitType === "nc"
            ? findAjsUnitParameterValue(unit, "ncr")
            : undefined,
      },
      group9: {
        startCondition:
          unit.unitType === "rc"
            ? findAjsUnitParameterValue(unit, "cond")
            : undefined,
      },
    };
  });
};
