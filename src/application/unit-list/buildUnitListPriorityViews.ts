import {
  AjsDocument,
  AjsUnit,
  AjsUnitType,
  findAjsUnitParameterValue,
} from "../../domain/models/ajs/AjsDocument";
import type {
  UnitListGroup11View,
  UnitListGroup7View,
} from "./buildUnitListView";
import { getPriorityForUnitTypes } from "./unitListViewHelpers";

const group7FieldUnitTypes: readonly AjsUnitType[] = ["n", "rn", "rm", "rr"];
const group7PriorityUnitTypes: readonly AjsUnitType[] = ["n", "rn"];
const group11PriorityUnitTypes: readonly AjsUnitType[] = [
  "j",
  "rj",
  "pj",
  "rp",
  "qj",
  "rq",
];

const supportsGroup7Fields = (unit: AjsUnit): boolean =>
  group7FieldUnitTypes.includes(unit.unitType);

export const buildUnitListGroup7View = (
  document: AjsDocument,
  unit: AjsUnit,
  priorityById: Map<string, number>,
): UnitListGroup7View => ({
  concurrentExecution: supportsGroup7Fields(unit)
    ? findAjsUnitParameterValue(unit, "mp")
    : undefined,
  retainedGenerationCount: supportsGroup7Fields(unit)
    ? findAjsUnitParameterValue(unit, "rg")
    : undefined,
  targetManager: supportsGroup7Fields(unit)
    ? findAjsUnitParameterValue(unit, "rh")
    : undefined,
  priority: getPriorityForUnitTypes(
    document,
    unit,
    priorityById,
    group7PriorityUnitTypes,
  ),
  timeoutPeriod: supportsGroup7Fields(unit)
    ? findAjsUnitParameterValue(unit, "cd")
    : undefined,
  scheduleOption: supportsGroup7Fields(unit)
    ? findAjsUnitParameterValue(unit, "ms")
    : undefined,
  requiredExecutionTime: supportsGroup7Fields(unit)
    ? findAjsUnitParameterValue(unit, "fd")
    : undefined,
});

export const buildUnitListGroup11View = (
  document: AjsDocument,
  unit: AjsUnit,
  priorityById: Map<string, number>,
): UnitListGroup11View => ({
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
  priority: getPriorityForUnitTypes(
    document,
    unit,
    priorityById,
    group11PriorityUnitTypes,
  ),
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
});
