import {
  AjsDocument,
  AjsGroupType,
  AjsRelationType,
  AjsUnitType,
  flattenAjsUnits,
} from "../../domain/models/ajs/AjsDocument";
import { buildUnitListGroup6View } from "./buildUnitListGroup6View";
import { buildUnitListGroup10View } from "./buildUnitListGroup10View";
import { buildUnitListLinkedUnits } from "./buildUnitListLinkedUnits";
import { buildUnitListRemainingGroups } from "./buildUnitListRemainingGroups";
import {
  buildUnitListGroup11View,
  buildUnitListGroup7View,
} from "./buildUnitListPriorityViews";

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
    const { previousUnits, nextUnits } = buildUnitListLinkedUnits(
      document,
      unit,
      unitById,
    );

    const remainingGroups = buildUnitListRemainingGroups(
      unit,
      previousUnits,
      nextUnits,
    );

    return {
      id: unit.id,
      absolutePath: unit.absolutePath,
      ...remainingGroups,
      group6: buildUnitListGroup6View(unit),
      group7: buildUnitListGroup7View(document, unit, group7PriorityById),
      group10: buildUnitListGroup10View(unit),
      group11: buildUnitListGroup11View(document, unit, group11PriorityById),
    };
  });
};
