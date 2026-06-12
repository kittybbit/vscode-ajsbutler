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
import {
  buildGroup1View,
  buildGroup2View,
  buildGroup3View,
  buildGroup4View,
  buildGroup5View,
} from "./buildUnitListGroup1To5View";
import {
  buildGroup8View,
  buildGroup9View,
} from "./buildUnitListGroup8And9View";
import {
  findEventSendingJobDefaultAwareParameterValue,
  findFileMonitoringJobDefaultAwareParameterValue,
  findExecutionIntervalControlJobDefaultAwareParameterValue,
  findGroup13EventTimeoutAction,
  findGroup15TransferOperation,
} from "./unitListDefaultAwareHelpers";

type UnitListRemainingGroupsView = {
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
};

const isCustomJob = (unit: AjsUnit): boolean =>
  unit.unitType === "cpj" || unit.unitType === "rcpj";

const isFlexibleJob = (unit: AjsUnit): boolean =>
  unit.unitType === "fxj" || unit.unitType === "rfxj";

const buildGroup12View = (unit: AjsUnit): UnitListGroup12View => ({
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
});

const buildGroup13View = (unit: AjsUnit): UnitListGroup13View => ({
  timeoutInterval: findExecutionIntervalControlJobDefaultAwareParameterValue(
    unit,
    "tmitv",
    DEFAULTS.Tmitv,
  ),
  eventTimeout: findExecutionIntervalControlJobDefaultAwareParameterValue(
    unit,
    "etn",
    DEFAULTS.Etn,
  ),
  monitoredFileName: findAjsUnitParameterValue(unit, "flwf"),
  monitoredFileCondition: findFileMonitoringJobDefaultAwareParameterValue(
    unit,
    "flwc",
    DEFAULTS.Flwc,
  ),
  monitoredFileCloseMode: findFileMonitoringJobDefaultAwareParameterValue(
    unit,
    "flco",
    DEFAULTS.Flco,
  ),
  monitoringInterval: findFileMonitoringJobDefaultAwareParameterValue(
    unit,
    "flwi",
    DEFAULTS.Flwi,
  ),
  waitEventId: findAjsUnitParameterValue(unit, "evwid"),
  waitHostName: findAjsUnitParameterValue(unit, "evhst"),
  waitMessage: findAjsUnitParameterValue(unit, "evwms"),
  eventTimeoutAction: findGroup13EventTimeoutAction(unit),
});

const buildGroup14View = (unit: AjsUnit): UnitListGroup14View => ({
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
});

const buildGroup15View = (unit: AjsUnit): UnitListGroup15View => ({
  executionUser: findAjsUnitParameterValue(unit, "eu"),
  executionTimeMonitor: findAjsUnitParameterValue(unit, "etm"),
  fileDescriptor: findAjsUnitParameterValue(unit, "fd"),
  jobType: findAjsUnitParameterValue(unit, "jty"),
  terminationStatus1: findAjsUnitParameterValue(unit, "ts1"),
  terminationDelay1: findAjsUnitParameterValue(unit, "td1"),
  terminationOperation1: findGroup15TransferOperation(unit, "top1"),
  terminationStatus2: findAjsUnitParameterValue(unit, "ts2"),
  terminationDelay2: findAjsUnitParameterValue(unit, "td2"),
  terminationOperation2: findGroup15TransferOperation(unit, "top2"),
  terminationStatus3: findAjsUnitParameterValue(unit, "ts3"),
  terminationDelay3: findAjsUnitParameterValue(unit, "td3"),
  terminationOperation3: findGroup15TransferOperation(unit, "top3"),
  terminationStatus4: findAjsUnitParameterValue(unit, "ts4"),
  terminationDelay4: findAjsUnitParameterValue(unit, "td4"),
  terminationOperation4: findGroup15TransferOperation(unit, "top4"),
});

const buildGroup16View = (unit: AjsUnit): UnitListGroup16View => ({
  endWaitUnitName: findAjsUnitParameterValue(unit, "eun"),
  waitMode: findAjsUnitParameterValue(unit, "mm"),
  nestedMessageGeneration: findAjsUnitParameterValue(unit, "nmg"),
  unitEndMonitoring: findAjsUnitParameterValue(unit, "uem"),
  executionGenerationAction: findAjsUnitParameterValue(unit, "ega"),
});

const buildGroup17View = (unit: AjsUnit): UnitListGroup17View => ({
  toolParameters: isCustomJob(unit)
    ? findAjsUnitParameterValue(unit, "prm")
    : undefined,
  toolEnvironment: isCustomJob(unit)
    ? findAjsUnitParameterValue(unit, "env")
    : undefined,
});

const buildGroup18View = (unit: AjsUnit): UnitListGroup18View => ({
  destinationAgent: findAjsUnitParameterValue(unit, "da"),
  flexibleJobGroup: findAjsUnitParameterValue(unit, "fxg"),
  executionAgent: isFlexibleJob(unit)
    ? findAjsUnitParameterValue(unit, "ex")
    : undefined,
});

const buildGroup19View = (unit: AjsUnit): UnitListGroup19View => ({
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
});

export const buildUnitListRemainingGroups = (
  unit: AjsUnit,
  previousUnits: UnitListLinkedUnitView[],
  nextUnits: UnitListLinkedUnitView[],
): UnitListRemainingGroupsView => ({
  group1: buildGroup1View(unit),
  group2: buildGroup2View(unit, previousUnits, nextUnits),
  group3: buildGroup3View(unit),
  group4: buildGroup4View(unit),
  group5: buildGroup5View(unit),
  group8: buildGroup8View(unit),
  group9: buildGroup9View(unit),
  group12: buildGroup12View(unit),
  group13: buildGroup13View(unit),
  group14: buildGroup14View(unit),
  group15: buildGroup15View(unit),
  group16: buildGroup16View(unit),
  group17: buildGroup17View(unit),
  group18: buildGroup18View(unit),
  group19: buildGroup19View(unit),
});
