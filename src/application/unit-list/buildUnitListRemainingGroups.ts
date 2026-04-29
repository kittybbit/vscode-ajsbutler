import {
  AjsUnit,
  findAjsUnitParameterValue,
} from "../../domain/models/ajs/AjsDocument";
import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import type { ParamSymbol } from "../../domain/values/AjsType";
import type {
  UnitListGroup1View,
  UnitListGroup2View,
  UnitListGroup3View,
  UnitListGroup4View,
  UnitListGroup5View,
  UnitListGroup8View,
  UnitListGroup9View,
  UnitListGroup12View,
  UnitListGroup13View,
  UnitListGroup14View,
  UnitListGroup15View,
  UnitListGroup16View,
  UnitListGroup17View,
  UnitListGroup18View,
  UnitListGroup19View,
  UnitListLinkedUnitView,
} from "./buildUnitListView";

const isEventSendingJob = (unit: AjsUnit): boolean =>
  unit.unitType === "evsj" || unit.unitType === "revsj";

const findEventSendingJobDefaultAwareParameterValue = (
  unit: AjsUnit,
  key: ParamSymbol,
  defaultValue: string,
): string | undefined =>
  isEventSendingJob(unit)
    ? (findAjsUnitParameterValue(unit, key) ?? defaultValue)
    : findAjsUnitParameterValue(unit, key);

export const buildUnitListRemainingGroups = (
  unit: AjsUnit,
  previousUnits: UnitListLinkedUnitView[],
  nextUnits: UnitListLinkedUnitView[],
): {
  group1: UnitListGroup1View;
  group2: UnitListGroup2View;
  group3: UnitListGroup3View;
  group4: UnitListGroup4View;
  group5: UnitListGroup5View;
  group8: UnitListGroup8View;
  group9: UnitListGroup9View;
  group12: UnitListGroup12View;
  group13: UnitListGroup13View;
  group14: UnitListGroup14View;
  group15: UnitListGroup15View;
  group16: UnitListGroup16View;
  group17: UnitListGroup17View;
  group18: UnitListGroup18View;
  group19: UnitListGroup19View;
} => ({
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
    layoutHv: unit.depth > 0 ? `+${unit.layout.h}+${unit.layout.v}` : undefined,
    size: findAjsUnitParameterValue(unit, "sz"),
  },
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
      unit.unitType === "g" ? findAjsUnitParameterValue(unit, "md") : undefined,
    startTimeType:
      unit.unitType === "g"
        ? findAjsUnitParameterValue(unit, "stt")
        : undefined,
    jobGroupType: unit.unitType === "g" ? unit.groupType : undefined,
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
    actionSeverity: findEventSendingJobDefaultAwareParameterValue(
      unit,
      "evssv",
      DEFAULTS.Evssv,
    ),
    actionStartType: findEventSendingJobDefaultAwareParameterValue(
      unit,
      "evsrt",
      DEFAULTS.Evsrt,
    ),
    actionInterval: findEventSendingJobDefaultAwareParameterValue(
      unit,
      "evspl",
      DEFAULTS.Evspl,
    ),
    actionCount: findEventSendingJobDefaultAwareParameterValue(
      unit,
      "evsrc",
      DEFAULTS.Evsrc,
    ),
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
});
