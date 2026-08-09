import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import type { UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";
import { toUnitDefinitionByPath } from "../../../../application/unit-definition/unitDefinitionDocument";
import type { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import {
  toUnitListTableData,
  type UnitListTableDataDto,
} from "../../../../application/unit-list/unitListDocument";

type TableUnitType = string;
type TableGroupType = string;
type TableRelationType = string;

type TableGroup1View = {
  name: string;
  parentAbsolutePath: string;
  parentId?: string;
  unitType: TableUnitType;
  groupType?: TableGroupType;
  cty?: string;
  layoutHv?: string;
  size?: string;
};

type TableLinkedUnitView = {
  id: string;
  name: string;
  absolutePath: string;
  relationType: TableRelationType;
};

type TableGroup2View = {
  comment?: string;
  previousUnits: TableLinkedUnitView[];
  nextUnits: TableLinkedUnitView[];
  executionAgent?: string;
  nestedConnectionLimit?: string;
  nestedConnectionName?: string;
  nestedConnectionService?: string;
  nestedConnectionEnabled?: string;
  nestedConnectionExternal?: string;
  nestedConnectionHost?: string;
};

type TableGroup3View = {
  hardAttribute?: string;
  isRecovery?: boolean;
  jp1Username?: string;
  jp1ResourceGroup?: string;
};

type TableGroup4View = {
  managerHost?: string;
  managerUnit?: string;
};

type TableGroup5View = {
  startDeadlineDate?: string;
  maximumDuration?: string;
  startTimeType?: string;
  jobGroupType?: TableGroupType;
};

type TableGroup6View = {
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

type TableGroup7View = {
  concurrentExecution?: string;
  retainedGenerationCount?: string;
  targetManager?: string;
  priority?: number;
  timeoutPeriod?: string;
  scheduleOption?: string;
  requiredExecutionTime?: string;
};

type TableGroup8View = {
  nestedConnectorRelease?: string;
};

type TableGroup9View = {
  startCondition?: string;
};

type TableGroup10View = {
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

type TableGroup11View = {
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

type TableGroup12View = {
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

type TableGroup13View = {
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

type TableGroup14View = {
  actionEventId?: string;
  actionHostName?: string;
  actionMessage?: string;
  actionSeverity?: string;
  actionStartType?: string;
  actionInterval?: string;
  actionCount?: string;
  platformMethod?: string;
};

type TableGroup15View = {
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

type TableGroup16View = {
  endWaitUnitName?: string;
  waitMode?: string;
  nestedMessageGeneration?: string;
  unitEndMonitoring?: string;
  executionGenerationAction?: string;
};

type TableGroup17View = {
  toolParameters?: string;
  toolEnvironment?: string;
};

type TableGroup18View = {
  destinationAgent?: string;
  flexibleJobGroup?: string;
  executionAgent?: string;
};

type TableGroup19View = {
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

export type TableRowView = {
  id: string;
  absolutePath: string;
  group1: TableGroup1View;
  group2: TableGroup2View;
  group3: TableGroup3View;
  group4: TableGroup4View;
  group5: TableGroup5View;
  group6: TableGroup6View;
  group7: TableGroup7View;
  group8: TableGroup8View;
  group9: TableGroup9View;
  group10: TableGroup10View;
  group11: TableGroup11View;
  group12: TableGroup12View;
  group13: TableGroup13View;
  group14: TableGroup14View;
  group15: TableGroup15View;
  group16: TableGroup16View;
  group17: TableGroup17View;
  group18: TableGroup18View;
  group19: TableGroup19View;
};

export type TableUnitMetadata = {
  id: string;
  name: string;
  absolutePath: string;
  parentId?: string;
  unitType: TableUnitType;
  isRootJobnet: boolean;
  parameterSearchValues: string[];
};

export type TablePresentationData = {
  rows: TableRowView[];
  units: TableUnitMetadata[];
  rootUnits: FlowGraphUnitDto[];
};

export type TableViewerData = {
  tableData: TablePresentationData | undefined;
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>;
  rowViewByPath: ReadonlyMap<string, TableRowView>;
  rootUnits: FlowGraphUnitDto[];
  unitById: ReadonlyMap<string, TableUnitMetadata>;
  unitByAbsolutePath: ReadonlyMap<string, TableUnitMetadata>;
  parameterSearchValuesByPath: ReadonlyMap<string, readonly string[]>;
};

const toTableRowView = (rowView: UnitListRowView): TableRowView => ({
  ...rowView,
});

const toTableUnitMetadata = (unit: {
  id: string;
  name: string;
  absolutePath: string;
  parentId?: string;
  unitType: string;
  isRootJobnet: boolean;
  parameterSearchValues: string[];
}): TableUnitMetadata => ({
  ...unit,
  parameterSearchValues: [...unit.parameterSearchValues],
});

const toTablePresentationData = (
  tableData: UnitListTableDataDto | undefined,
): TablePresentationData | undefined =>
  tableData === undefined
    ? undefined
    : {
        rows: tableData.rows.map(toTableRowView),
        units: tableData.units.map(toTableUnitMetadata),
        rootUnits: tableData.rootUnits,
      };

const createRowViewByPath = (
  rowViews: readonly TableRowView[],
): ReadonlyMap<string, TableRowView> =>
  new Map(rowViews.map((rowView) => [rowView.absolutePath, rowView]));

const createUnitById = (
  units: readonly TableUnitMetadata[],
): ReadonlyMap<string, TableUnitMetadata> =>
  new Map(units.map((unit) => [unit.id, unit]));

const createUnitByAbsolutePath = (
  units: readonly TableUnitMetadata[],
): ReadonlyMap<string, TableUnitMetadata> =>
  new Map(units.map((unit) => [unit.absolutePath, unit]));

const createParameterSearchValuesByPath = (
  units: readonly TableUnitMetadata[],
): ReadonlyMap<string, readonly string[]> =>
  new Map(units.map((unit) => [unit.absolutePath, unit.parameterSearchValues]));

export const createTableViewerData = (
  tableData: UnitListTableDataDto | undefined,
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>,
): TableViewerData => {
  const presentationData = toTablePresentationData(tableData);
  const rows = presentationData?.rows ?? [];
  const units = presentationData?.units ?? [];
  return {
    tableData: presentationData,
    unitDefinitionByPath,
    rowViewByPath: createRowViewByPath(rows),
    rootUnits: presentationData?.rootUnits ?? [],
    unitById: createUnitById(units),
    unitByAbsolutePath: createUnitByAbsolutePath(units),
    parameterSearchValuesByPath: createParameterSearchValuesByPath(units),
  };
};

export const parseTableViewerData = (data: unknown): TableViewerData =>
  createTableViewerData(
    toUnitListTableData(data),
    toUnitDefinitionByPath(data),
  );

export const findSelectedUnitId = (
  selectedAbsolutePath: string | undefined,
  unitByAbsolutePath: ReadonlyMap<string, TableUnitMetadata>,
): string | undefined =>
  selectedAbsolutePath
    ? unitByAbsolutePath.get(selectedAbsolutePath)?.id
    : undefined;
