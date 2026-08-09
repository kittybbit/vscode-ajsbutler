import { isTySymbol } from "../../domain/values/AjsType";
import type { UnitListRowView } from "./buildUnitListView";

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

export const isOptionalString = (value: unknown): boolean =>
  value === undefined || typeof value === "string";

export const isOptionalNumber = (value: unknown): boolean =>
  value === undefined || typeof value === "number";

export const isOptionalBoolean = (value: unknown): boolean =>
  value === undefined || typeof value === "boolean";

export const hasValidFields = (
  value: Record<string, unknown>,
  keys: readonly string[],
  validator: (field: unknown) => boolean,
): boolean => keys.every((key) => validator(value[key]));

export const allValid = (validators: readonly (() => boolean)[]): boolean =>
  validators.every((validator) => validator());

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

const isLinkedUnit = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }
  return allValid([
    () => typeof value.id === "string",
    () => typeof value.name === "string",
    () => typeof value.absolutePath === "string",
    () => value.relationType === "seq" || value.relationType === "con",
  ]);
};

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

const isOptionalUnitGroupType = (value: unknown): boolean =>
  value === undefined || value === "n" || value === "p";

const isLinkedUnitArray = (value: unknown): boolean =>
  Array.isArray(value) && value.every(isLinkedUnit);

const isUnitListGroup1 = (group: Record<string, unknown>): boolean =>
  allValid([
    () => typeof group.name === "string",
    () => typeof group.parentAbsolutePath === "string",
    () => isOptionalString(group.parentId),
    () => typeof group.unitType === "string" && isTySymbol(group.unitType),
    () => isOptionalUnitGroupType(group.groupType),
    () =>
      hasValidFields(group, unitListGroupStringKeys.group1, isOptionalString),
  ]);

const isUnitListGroup2 = (group: Record<string, unknown>): boolean =>
  allValid([
    () => isLinkedUnitArray(group.previousUnits),
    () => isLinkedUnitArray(group.nextUnits),
    () =>
      hasValidFields(group, unitListGroupStringKeys.group2, isOptionalString),
  ]);

const isUnitListGroup3 = (group: Record<string, unknown>): boolean =>
  allValid([
    () =>
      hasValidFields(group, unitListGroupStringKeys.group3, isOptionalString),
    () => isOptionalBoolean(group.isRecovery),
  ]);

const isUnitListGroup4 = (group: Record<string, unknown>): boolean =>
  hasValidFields(group, unitListGroupStringKeys.group4, isOptionalString);

const isUnitListGroup5 = (group: Record<string, unknown>): boolean =>
  allValid([
    () =>
      hasValidFields(group, unitListGroupStringKeys.group5, isOptionalString),
    () => isOptionalUnitGroupType(group.jobGroupType),
  ]);

const isUnitListGroup6 = (group: Record<string, unknown>): boolean =>
  allValid([
    () =>
      hasValidFields(
        group,
        ["su", "mo", "tu", "we", "th", "fr", "sa"],
        isOptionalBoolean,
      ),
    () => isStringArray(group.openDates),
    () => isStringArray(group.closeDates),
  ]);

const isUnitListGroup7 = (group: Record<string, unknown>): boolean =>
  allValid([
    () =>
      hasValidFields(group, unitListGroupStringKeys.group7, isOptionalString),
    () => isOptionalNumber(group.priority),
  ]);

const isUnitListGroup8 = (group: Record<string, unknown>): boolean =>
  hasValidFields(group, unitListGroupStringKeys.group8, isOptionalString);

const isUnitListGroup9 = (group: Record<string, unknown>): boolean =>
  hasValidFields(group, unitListGroupStringKeys.group9, isOptionalString);

const isUnitListGroup10 = (group: Record<string, unknown>): boolean =>
  allValid([
    () =>
      hasValidFields(group, unitListGroupStringKeys.group10, isOptionalString),
    () => unitListGroup10ArrayKeys.every((key) => isStringArray(group[key])),
  ]);

const isUnitListGroup11 = (group: Record<string, unknown>): boolean =>
  allValid([
    () =>
      hasValidFields(group, unitListGroupStringKeys.group11, isOptionalString),
    () => isOptionalNumber(group.priority),
  ]);

const isUnitListGroup12 = (group: Record<string, unknown>): boolean =>
  hasValidFields(group, unitListGroupStringKeys.group12, isOptionalString);

const isUnitListGroup13 = (group: Record<string, unknown>): boolean =>
  hasValidFields(group, unitListGroupStringKeys.group13, isOptionalString);

const isUnitListGroup14 = (group: Record<string, unknown>): boolean =>
  hasValidFields(group, unitListGroupStringKeys.group14, isOptionalString);

const isUnitListGroup15 = (group: Record<string, unknown>): boolean =>
  hasValidFields(group, unitListGroupStringKeys.group15, isOptionalString);

const isUnitListGroup16 = (group: Record<string, unknown>): boolean =>
  hasValidFields(group, unitListGroupStringKeys.group16, isOptionalString);

const isUnitListGroup17 = (group: Record<string, unknown>): boolean =>
  hasValidFields(group, unitListGroupStringKeys.group17, isOptionalString);

const isUnitListGroup18 = (group: Record<string, unknown>): boolean =>
  hasValidFields(group, unitListGroupStringKeys.group18, isOptionalString);

const isUnitListGroup19 = (group: Record<string, unknown>): boolean =>
  hasValidFields(group, unitListGroupStringKeys.group19, isOptionalString);

const isUnitListRowGroups1To6 = (
  groups: Record<
    (typeof unitListRowGroupKeys)[number],
    Record<string, unknown>
  >,
): boolean =>
  allValid([
    () => isUnitListGroup1(groups.group1),
    () => isUnitListGroup2(groups.group2),
    () => isUnitListGroup3(groups.group3),
    () => isUnitListGroup4(groups.group4),
    () => isUnitListGroup5(groups.group5),
    () => isUnitListGroup6(groups.group6),
  ]);

const isUnitListRowGroups7To12 = (
  groups: Record<
    (typeof unitListRowGroupKeys)[number],
    Record<string, unknown>
  >,
): boolean =>
  allValid([
    () => isUnitListGroup7(groups.group7),
    () => isUnitListGroup8(groups.group8),
    () => isUnitListGroup9(groups.group9),
    () => isUnitListGroup10(groups.group10),
    () => isUnitListGroup11(groups.group11),
    () => isUnitListGroup12(groups.group12),
  ]);

const isUnitListRowGroups13To19 = (
  groups: Record<
    (typeof unitListRowGroupKeys)[number],
    Record<string, unknown>
  >,
): boolean =>
  allValid([
    () => isUnitListGroup13(groups.group13),
    () => isUnitListGroup14(groups.group14),
    () => isUnitListGroup15(groups.group15),
    () => isUnitListGroup16(groups.group16),
    () => isUnitListGroup17(groups.group17),
    () => isUnitListGroup18(groups.group18),
    () => isUnitListGroup19(groups.group19),
  ]);

type UnitListRowGroups = Record<
  (typeof unitListRowGroupKeys)[number],
  Record<string, unknown>
>;

const hasUnitListRowIdentity = (value: Record<string, unknown>): boolean =>
  typeof value.id === "string" && typeof value.absolutePath === "string";

const hasUnitListRowGroups = (value: Record<string, unknown>): boolean =>
  unitListRowGroupKeys.every((key) => isRecord(value[key]));

const getUnitListRowGroups = (
  value: Record<string, unknown>,
): UnitListRowGroups =>
  Object.fromEntries(
    unitListRowGroupKeys.map((key) => [
      key,
      value[key] as Record<string, unknown>,
    ]),
  ) as UnitListRowGroups;

const isUnitListRowGroupSetValid = (
  value: Record<string, unknown>,
): boolean => {
  if (!hasUnitListRowGroups(value)) {
    return false;
  }
  const groups = getUnitListRowGroups(value);
  return allValid([
    () => isUnitListRowGroups1To6(groups),
    () => isUnitListRowGroups7To12(groups),
    () => isUnitListRowGroups13To19(groups),
  ]);
};

const isUnitListRowRecord = (value: Record<string, unknown>): boolean =>
  hasUnitListRowIdentity(value) && isUnitListRowGroupSetValid(value);

export const isUnitListRowView = (value: unknown): value is UnitListRowView =>
  isRecord(value) && isUnitListRowRecord(value);
