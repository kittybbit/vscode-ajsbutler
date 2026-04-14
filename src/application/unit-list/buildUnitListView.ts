import {
  AjsDocument,
  AjsGroupType,
  AjsRelationType,
  AjsUnit,
  AjsUnitType,
  findAjsUnitParameterValue,
  findAjsUnitParameterValues,
  findParentAjsUnit,
  flattenAjsUnits,
} from "../../domain/models/ajs/AjsDocument";
import { buildUnitListGroup6View } from "./buildUnitListGroup6View";
import { buildUnitListGroup10View } from "./buildUnitListGroup10View";
import {
  buildUnitListGroup11View,
  buildUnitListGroup7View,
} from "./buildUnitListPriorityViews";
import {
  parseLnParentRule,
  parseTimeValue,
  parseWc,
} from "./unitListViewHelpers";

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
  relationType: AjsRelationType;
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

export const buildUnitListView = (document: AjsDocument): UnitListRowView[] => {
  const units = flattenAjsUnits(document.rootUnits);
  const unitById = new Map(units.map((unit) => [unit.id, unit]));
  const group7PriorityById = new Map<string, number>();
  const group11PriorityById = new Map<string, number>();

  return units.map((unit) => {
    const parent = findParentAjsUnit(document, unit);
    const previousUnits =
      parent?.relations
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
      parent?.relations
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
      group6: buildUnitListGroup6View(unit),
      group7: buildUnitListGroup7View(document, unit, group7PriorityById),
      group10: buildUnitListGroup10View(unit),
      group11: buildUnitListGroup11View(document, unit, group11PriorityById),
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
