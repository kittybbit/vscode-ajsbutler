import {
  AjsUnit,
  AjsUnitType,
  findAjsUnitParameterValue,
} from "../../domain/models/ajs/AjsDocument";
import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import type { ParamSymbol } from "../../domain/values/AjsType";

const isEventSendingJob = (unit: AjsUnit): boolean =>
  unit.unitType === "evsj" || unit.unitType === "revsj";

const isFileMonitoringJob = (unit: AjsUnit): boolean =>
  unit.unitType === "flwj" || unit.unitType === "rflwj";

const isExecutionIntervalControlJob = (unit: AjsUnit): boolean =>
  unit.unitType === "tmwj" || unit.unitType === "rtmwj";

const waitJobTypesWithGroup13TimeoutAction: readonly AjsUnitType[] = [
  "flwj",
  "rflwj",
  "tmwj",
  "rtmwj",
  "lfwj",
  "rlfwj",
  "mlwj",
  "rmlwj",
  "mqwj",
  "rmqwj",
  "mswj",
  "rmswj",
  "ntwj",
  "rntwj",
];

const isWaitJobWithGroup13TimeoutAction = (unit: AjsUnit): boolean =>
  waitJobTypesWithGroup13TimeoutAction.includes(unit.unitType);

const isQueueJob = (unit: AjsUnit): boolean =>
  unit.unitType === "qj" || unit.unitType === "rq";

const findDefaultAwareParameterValue = (
  unit: AjsUnit,
  key: ParamSymbol,
  defaultValue: string,
  isDefaultAwareUnit: boolean,
): string | undefined =>
  isDefaultAwareUnit
    ? (findAjsUnitParameterValue(unit, key) ?? defaultValue)
    : findAjsUnitParameterValue(unit, key);

export const findEventSendingJobDefaultAwareParameterValue = (
  unit: AjsUnit,
  key: ParamSymbol,
  defaultValue: string,
): string | undefined =>
  findDefaultAwareParameterValue(
    unit,
    key,
    defaultValue,
    isEventSendingJob(unit),
  );

export const findFileMonitoringJobDefaultAwareParameterValue = (
  unit: AjsUnit,
  key: ParamSymbol,
  defaultValue: string,
): string | undefined =>
  findDefaultAwareParameterValue(
    unit,
    key,
    defaultValue,
    isFileMonitoringJob(unit),
  );

export const findExecutionIntervalControlJobDefaultAwareParameterValue = (
  unit: AjsUnit,
  key: ParamSymbol,
  defaultValue: string,
): string | undefined =>
  findDefaultAwareParameterValue(
    unit,
    key,
    defaultValue,
    isExecutionIntervalControlJob(unit),
  );

export const findGroup13EventTimeoutAction = (
  unit: AjsUnit,
): string | undefined =>
  findDefaultAwareParameterValue(
    unit,
    "ets",
    DEFAULTS.Ets,
    isWaitJobWithGroup13TimeoutAction(unit),
  );

export const findGroup15TransferOperation = (
  unit: AjsUnit,
  key: "top1" | "top2" | "top3" | "top4",
): string | undefined =>
  isQueueJob(unit) ? undefined : findAjsUnitParameterValue(unit, key);
