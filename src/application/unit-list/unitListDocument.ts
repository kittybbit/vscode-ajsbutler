import type {
  AjsNormalizationWarning,
  AjsDocument,
  AjsParameter,
  AjsRelation,
} from "../../domain/models/ajs/AjsDocument";
import { isTySymbol } from "../../domain/values/AjsType";
import {
  type FlowGraphUnitDto,
  toFlowGraphUnitDto,
} from "../flow-graph/flowGraphDocument";
import {
  buildUnitDefinitions,
  type UnitDefinitionDialogDto,
} from "../unit-definition/buildUnitDefinition";
import {
  buildUnitListProjection,
  type UnitListProjectionDto,
  type UnitListRowView,
  type UnitListUnitMetadataDto,
} from "./buildUnitListView";

export type UnitListRootDto = FlowGraphUnitDto;

export type UnitListDocumentDto = {
  rootUnits: UnitListRootDto[];
  warnings: AjsNormalizationWarning[];
  unitDefinitions: UnitDefinitionDialogDto[];
  unitList: UnitListProjectionDto;
};

export type UnitListTableDataDto = UnitListProjectionDto & {
  rootUnits: UnitListRootDto[];
};

const copyWarning = (
  warning: AjsNormalizationWarning,
): AjsNormalizationWarning => ({
  ...warning,
});

export const toUnitListRootDto = toFlowGraphUnitDto;

export const toUnitListDocumentDto = (
  document: AjsDocument,
): UnitListDocumentDto => ({
  rootUnits: document.rootUnits.map(toUnitListRootDto),
  warnings: document.warnings.map(copyWarning),
  unitDefinitions: buildUnitDefinitions(document),
  unitList: buildUnitListProjection(document),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const unitListRowGroupKeys = [
  "group1",
  "group2",
  "group3",
  "group4",
  "group5",
  "group6",
  "group7",
  "group8",
  "group9",
  "group10",
  "group11",
  "group12",
  "group13",
  "group14",
  "group15",
  "group16",
  "group17",
  "group18",
  "group19",
] as const;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isOptionalString = (value: unknown): boolean =>
  value === undefined || typeof value === "string";

const isOptionalNumber = (value: unknown): boolean =>
  value === undefined || typeof value === "number";

const isOptionalBoolean = (value: unknown): boolean =>
  value === undefined || typeof value === "boolean";

const hasValidFields = (
  value: Record<string, unknown>,
  keys: readonly string[],
  validator: (field: unknown) => boolean,
): boolean => keys.every((key) => validator(value[key]));

const isUnitListRowView = (value: unknown): value is UnitListRowView =>
  isRecord(value) && isUnitListRowRecord(value);

const isLinkedUnit = (value: unknown): boolean =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.name === "string" &&
  typeof value.absolutePath === "string" &&
  (value.relationType === "seq" || value.relationType === "con");

const unitListGroupStringKeys = {
  group1: ["cty", "layoutHv", "size"],
  group2: [
    "comment",
    "executionAgent",
    "nestedConnectionLimit",
    "nestedConnectionName",
    "nestedConnectionService",
    "nestedConnectionEnabled",
    "nestedConnectionExternal",
    "nestedConnectionHost",
  ],
  group3: ["hardAttribute", "jp1Username", "jp1ResourceGroup"],
  group4: ["managerHost", "managerUnit"],
  group5: ["startDeadlineDate", "maximumDuration", "startTimeType"],
  group7: [
    "concurrentExecution",
    "retainedGenerationCount",
    "targetManager",
    "timeoutPeriod",
    "scheduleOption",
    "requiredExecutionTime",
  ],
  group8: ["nestedConnectorRelease"],
  group9: ["startCondition"],
  group10: [
    "deleteAfterExecution",
    "executionDate",
    "jobGroupPath",
    "exclusiveJobnetName",
  ],
  group11: [
    "commandText",
    "scriptFileName",
    "parameters",
    "environmentVariable",
    "environmentVariableFile",
    "workPathName",
    "standardInputFile",
    "standardOutputFile",
    "standardOutputAction",
    "standardErrorFile",
    "standardErrorAction",
    "queueManager",
    "queueName",
    "requestJobName",
    "endJudgment",
    "waitThreshold",
    "timeoutHold",
    "judgmentFile",
    "automaticRetryEnabled",
    "retryStart",
    "retryEnd",
    "retryCount",
    "retryInterval",
    "targetUserName",
  ],
  group12: [
    "endJudgment",
    "judgmentReturnCode",
    "lowerReturnCode",
    "lowerJudgmentValue",
    "upperComparison",
    "upperReturnCode",
    "upperJudgmentValue",
    "lowerComparison",
    "judgmentValueString",
    "judgmentValueNumeric",
    "variableName",
    "judgmentFileName",
  ],
  group13: [
    "timeoutInterval",
    "eventTimeout",
    "monitoredFileName",
    "monitoredFileCondition",
    "monitoredFileCloseMode",
    "monitoringInterval",
    "waitEventId",
    "waitHostName",
    "waitMessage",
    "eventTimeoutAction",
  ],
  group14: [
    "actionEventId",
    "actionHostName",
    "actionMessage",
    "actionSeverity",
    "actionStartType",
    "actionInterval",
    "actionCount",
    "platformMethod",
  ],
  group15: [
    "executionUser",
    "executionTimeMonitor",
    "fileDescriptor",
    "jobType",
    "terminationStatus1",
    "terminationDelay1",
    "terminationOperation1",
    "terminationStatus2",
    "terminationDelay2",
    "terminationOperation2",
    "terminationStatus3",
    "terminationDelay3",
    "terminationOperation3",
    "terminationStatus4",
    "terminationDelay4",
    "terminationOperation4",
  ],
  group16: [
    "endWaitUnitName",
    "waitMode",
    "nestedMessageGeneration",
    "unitEndMonitoring",
    "executionGenerationAction",
  ],
  group17: ["toolParameters", "toolEnvironment"],
  group18: ["destinationAgent", "flexibleJobGroup", "executionAgent"],
  group19: [
    "httpConnectionConfig",
    "httpKind",
    "httpExecutionMode",
    "httpRequestFile",
    "httpRequestEncoding",
    "httpRequestMethod",
    "httpStatusFile",
    "httpStatusPoint",
    "httpResponseHeaderFile",
    "httpResponseBodyFile",
    "httpCodeMap",
  ],
} as const;

const unitListGroup10ArrayKeys = [
  "parentRules",
  "scheduleDateTypes",
  "scheduleDateYearMonths",
  "scheduleDateDays",
  "startTimes",
  "cycles",
  "substitutes",
  "shiftDays",
  "scheduleByDaysFromStart",
  "maxShiftableDays",
  "startRangeTimes",
  "endRangeTimes",
  "waitCounts",
  "waitTimes",
] as const;

function isUnitListRowRecord(value: Record<string, unknown>): boolean {
  if (
    typeof value.id !== "string" ||
    typeof value.absolutePath !== "string" ||
    !unitListRowGroupKeys.every((key) => isRecord(value[key]))
  ) {
    return false;
  }
  const group1 = value.group1 as Record<string, unknown>;
  const group2 = value.group2 as Record<string, unknown>;
  const group6 = value.group6 as Record<string, unknown>;
  const group10 = value.group10 as Record<string, unknown>;
  const groups = Object.fromEntries(
    unitListRowGroupKeys.map((key) => [
      key,
      value[key] as Record<string, unknown>,
    ]),
  ) as Record<(typeof unitListRowGroupKeys)[number], Record<string, unknown>>;
  return (
    typeof group1.name === "string" &&
    typeof group1.parentAbsolutePath === "string" &&
    isOptionalString(group1.parentId) &&
    typeof group1.unitType === "string" &&
    isTySymbol(group1.unitType) &&
    (group1.groupType === undefined ||
      group1.groupType === "n" ||
      group1.groupType === "p") &&
    hasValidFields(group1, unitListGroupStringKeys.group1, isOptionalString) &&
    Array.isArray(group2.previousUnits) &&
    group2.previousUnits.every(isLinkedUnit) &&
    Array.isArray(group2.nextUnits) &&
    group2.nextUnits.every(isLinkedUnit) &&
    hasValidFields(group2, unitListGroupStringKeys.group2, isOptionalString) &&
    hasValidFields(
      groups.group3,
      unitListGroupStringKeys.group3,
      isOptionalString,
    ) &&
    isOptionalBoolean(groups.group3.isRecovery) &&
    hasValidFields(
      groups.group4,
      unitListGroupStringKeys.group4,
      isOptionalString,
    ) &&
    hasValidFields(
      groups.group5,
      unitListGroupStringKeys.group5,
      isOptionalString,
    ) &&
    (groups.group5.jobGroupType === undefined ||
      groups.group5.jobGroupType === "n" ||
      groups.group5.jobGroupType === "p") &&
    hasValidFields(
      group6,
      ["su", "mo", "tu", "we", "th", "fr", "sa"],
      isOptionalBoolean,
    ) &&
    isStringArray(group6.openDates) &&
    isStringArray(group6.closeDates) &&
    hasValidFields(
      groups.group7,
      unitListGroupStringKeys.group7,
      isOptionalString,
    ) &&
    isOptionalNumber(groups.group7.priority) &&
    hasValidFields(
      groups.group8,
      unitListGroupStringKeys.group8,
      isOptionalString,
    ) &&
    hasValidFields(
      groups.group9,
      unitListGroupStringKeys.group9,
      isOptionalString,
    ) &&
    hasValidFields(
      group10,
      unitListGroupStringKeys.group10,
      isOptionalString,
    ) &&
    unitListGroup10ArrayKeys.every((key) => isStringArray(group10[key])) &&
    hasValidFields(
      groups.group11,
      unitListGroupStringKeys.group11,
      isOptionalString,
    ) &&
    isOptionalNumber(groups.group11.priority) &&
    hasValidFields(
      groups.group12,
      unitListGroupStringKeys.group12,
      isOptionalString,
    ) &&
    hasValidFields(
      groups.group13,
      unitListGroupStringKeys.group13,
      isOptionalString,
    ) &&
    hasValidFields(
      groups.group14,
      unitListGroupStringKeys.group14,
      isOptionalString,
    ) &&
    hasValidFields(
      groups.group15,
      unitListGroupStringKeys.group15,
      isOptionalString,
    ) &&
    hasValidFields(
      groups.group16,
      unitListGroupStringKeys.group16,
      isOptionalString,
    ) &&
    hasValidFields(
      groups.group17,
      unitListGroupStringKeys.group17,
      isOptionalString,
    ) &&
    hasValidFields(
      groups.group18,
      unitListGroupStringKeys.group18,
      isOptionalString,
    ) &&
    hasValidFields(
      groups.group19,
      unitListGroupStringKeys.group19,
      isOptionalString,
    )
  );
}

const isUnitListUnitMetadata = (
  value: unknown,
): value is UnitListUnitMetadataDto =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.name === "string" &&
  typeof value.absolutePath === "string" &&
  (value.parentId === undefined || typeof value.parentId === "string") &&
  typeof value.unitType === "string" &&
  isTySymbol(value.unitType) &&
  typeof value.isRootJobnet === "boolean" &&
  isStringArray(value.parameterSearchValues);

const isAjsParameter = (value: unknown): value is AjsParameter =>
  isRecord(value) &&
  typeof value.key === "string" &&
  typeof value.value === "string" &&
  hasValidFields(
    value,
    ["position", "line", "column", "length"],
    isOptionalNumber,
  );

const isAjsRelation = (value: unknown): value is AjsRelation =>
  isRecord(value) &&
  typeof value.sourceUnitId === "string" &&
  typeof value.targetUnitId === "string" &&
  (value.type === "seq" || value.type === "con");

const isUnitListRootDto = (value: unknown): value is UnitListRootDto =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.name === "string" &&
  typeof value.unitAttribute === "string" &&
  hasValidFields(
    value,
    ["permission", "jp1Username", "jp1ResourceGroup", "comment", "parentId"],
    isOptionalString,
  ) &&
  typeof value.unitType === "string" &&
  isTySymbol(value.unitType) &&
  (value.groupType === undefined ||
    value.groupType === "n" ||
    value.groupType === "p") &&
  typeof value.absolutePath === "string" &&
  typeof value.depth === "number" &&
  typeof value.isRoot === "boolean" &&
  isOptionalBoolean(value.isRecovery) &&
  typeof value.isRootJobnet === "boolean" &&
  typeof value.hasSchedule === "boolean" &&
  typeof value.hasWaitedFor === "boolean" &&
  isRecord(value.layout) &&
  typeof value.layout.h === "number" &&
  typeof value.layout.v === "number" &&
  Array.isArray(value.parameters) &&
  value.parameters.every(isAjsParameter) &&
  Array.isArray(value.relations) &&
  value.relations.every(isAjsRelation) &&
  Array.isArray(value.children) &&
  value.children.every(isUnitListRootDto);

const flattenUnitListRootDtos = (
  rootUnits: readonly UnitListRootDto[],
): UnitListRootDto[] =>
  rootUnits.flatMap((unit) => [
    unit,
    ...flattenUnitListRootDtos(unit.children),
  ]);

const hasConsistentTreeParentage = (
  units: readonly UnitListRootDto[],
  expectedParentId?: string,
): boolean =>
  units.every(
    (unit) =>
      unit.parentId === expectedParentId &&
      hasConsistentTreeParentage(unit.children, unit.id),
  );

const hasMatchingProjectionIdentity = (
  rootUnits: readonly UnitListRootDto[],
  rows: readonly UnitListRowView[],
  units: readonly UnitListUnitMetadataDto[],
): boolean => {
  const treeUnits = flattenUnitListRootDtos(rootUnits);
  if (
    !hasConsistentTreeParentage(rootUnits) ||
    treeUnits.length !== rows.length ||
    rows.length !== units.length
  ) {
    return false;
  }
  const unitIds = new Set(units.map((unit) => unit.id));
  const absolutePaths = new Set(units.map((unit) => unit.absolutePath));
  const treeUnitById = new Map(treeUnits.map((unit) => [unit.id, unit]));
  return (
    unitIds.size === units.length &&
    absolutePaths.size === units.length &&
    units.every(
      (unit, index) =>
        unit.id === rows[index]?.id &&
        unit.absolutePath === rows[index]?.absolutePath &&
        unit.id === treeUnits[index]?.id &&
        unit.absolutePath === treeUnits[index]?.absolutePath &&
        unit.name === treeUnits[index]?.name &&
        unit.name === rows[index]?.group1.name &&
        unit.parentId === treeUnits[index]?.parentId &&
        unit.parentId === rows[index]?.group1.parentId &&
        rows[index]?.group1.parentAbsolutePath ===
          (unit.parentId === undefined
            ? "/"
            : treeUnitById.get(unit.parentId)?.absolutePath) &&
        unit.unitType === treeUnits[index]?.unitType &&
        unit.unitType === rows[index]?.group1.unitType &&
        unit.isRootJobnet === treeUnits[index]?.isRootJobnet &&
        treeUnits[index]?.groupType === rows[index]?.group1.groupType &&
        treeUnits[index]?.comment === rows[index]?.group2.comment &&
        treeUnits[index]?.isRecovery === rows[index]?.group3.isRecovery &&
        treeUnits[index]?.jp1Username === rows[index]?.group3.jp1Username &&
        treeUnits[index]?.jp1ResourceGroup ===
          rows[index]?.group3.jp1ResourceGroup,
    )
  );
};

export const toUnitListTableData = (
  document: unknown,
): UnitListTableDataDto | undefined => {
  if (
    !isRecord(document) ||
    !Array.isArray(document.rootUnits) ||
    !document.rootUnits.every(isUnitListRootDto) ||
    !isRecord(document.unitList) ||
    !Array.isArray(document.unitList.rows) ||
    !document.unitList.rows.every(isUnitListRowView) ||
    !Array.isArray(document.unitList.units) ||
    !document.unitList.units.every(isUnitListUnitMetadata)
  ) {
    return undefined;
  }

  const rootUnits = document.rootUnits;
  const rows = document.unitList.rows;
  const units = document.unitList.units;
  if (!hasMatchingProjectionIdentity(rootUnits, rows, units)) {
    return undefined;
  }
  return { rootUnits, rows, units };
};
