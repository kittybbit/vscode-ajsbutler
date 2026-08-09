import { isTySymbol } from "../../domain/values/AjsType";
import type { FlowGraphUnitDto } from "../flow-graph/flowGraphDocument";
import type {
  UnitListRowView,
  UnitListUnitMetadataDto,
} from "./buildUnitListView";
import {
  allValid,
  hasValidFields,
  isOptionalBoolean,
  isOptionalNumber,
  isOptionalString,
  isRecord,
  isStringArray,
  isUnitListRowView,
} from "./unitListRowValidation";

export type UnitListTableDataCandidate = {
  rootUnits: FlowGraphUnitDto[];
  rows: UnitListRowView[];
  units: UnitListUnitMetadataDto[];
};

const isAjsParameter = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }
  return allValid([
    () => typeof value.key === "string",
    () => typeof value.value === "string",
    () =>
      hasValidFields(
        value,
        ["position", "line", "column", "length"],
        isOptionalNumber,
      ),
  ]);
};

const isAjsRelation = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }
  return allValid([
    () => typeof value.sourceUnitId === "string",
    () => typeof value.targetUnitId === "string",
    () => value.type === "seq" || value.type === "con",
  ]);
};

const isArrayOf = (
  value: unknown,
  validator: (item: unknown) => boolean,
): boolean => Array.isArray(value) && value.every(validator);

const isRootIdentityFields = (value: Record<string, unknown>): boolean =>
  allValid([
    () => typeof value.id === "string",
    () => typeof value.name === "string",
    () => typeof value.unitAttribute === "string",
    () =>
      hasValidFields(
        value,
        [
          "permission",
          "jp1Username",
          "jp1ResourceGroup",
          "comment",
          "parentId",
        ],
        isOptionalString,
      ),
    () => typeof value.unitType === "string" && isTySymbol(value.unitType),
    () =>
      value.groupType === undefined ||
      value.groupType === "n" ||
      value.groupType === "p",
    () => typeof value.absolutePath === "string",
  ]);

const isRootStateFields = (value: Record<string, unknown>): boolean =>
  allValid([
    () => typeof value.depth === "number",
    () => typeof value.isRoot === "boolean",
    () => isOptionalBoolean(value.isRecovery),
    () => typeof value.isRootJobnet === "boolean",
    () => typeof value.hasSchedule === "boolean",
    () => typeof value.hasWaitedFor === "boolean",
  ]);

const isRootLayout = (value: Record<string, unknown>): boolean => {
  const layout = value.layout;
  if (!isRecord(layout)) {
    return false;
  }
  return allValid([
    () => typeof layout.h === "number",
    () => typeof layout.v === "number",
  ]);
};

const isRootCollections = (value: Record<string, unknown>): boolean =>
  allValid([
    () => isArrayOf(value.parameters, isAjsParameter),
    () => isArrayOf(value.relations, isAjsRelation),
    () => isArrayOf(value.children, isUnitListRootDto),
  ]);

export const isUnitListRootDto = (
  value: unknown,
): value is FlowGraphUnitDto => {
  if (!isRecord(value)) {
    return false;
  }
  return allValid([
    () => isRootIdentityFields(value),
    () => isRootStateFields(value),
    () => isRootLayout(value),
    () => isRootCollections(value),
  ]);
};

export const isUnitListUnitMetadata = (
  value: unknown,
): value is UnitListUnitMetadataDto => {
  if (!isRecord(value)) {
    return false;
  }
  return allValid([
    () => typeof value.id === "string",
    () => typeof value.name === "string",
    () => typeof value.absolutePath === "string",
    () => value.parentId === undefined || typeof value.parentId === "string",
    () => typeof value.unitType === "string" && isTySymbol(value.unitType),
    () => typeof value.isRootJobnet === "boolean",
    () => isStringArray(value.parameterSearchValues),
  ]);
};

type UnitListProjectionRecord = {
  rows: UnitListRowView[];
  units: UnitListUnitMetadataDto[];
};

type UnitListDocumentRecord = {
  rootUnits: FlowGraphUnitDto[];
  unitList: UnitListProjectionRecord;
};

const isUnitListProjectionRecord = (
  value: unknown,
): value is UnitListProjectionRecord => {
  if (!isRecord(value)) {
    return false;
  }
  return allValid([
    () => isArrayOf(value.rows, isUnitListRowView),
    () => isArrayOf(value.units, isUnitListUnitMetadata),
  ]);
};

const isUnitListDocumentRecord = (
  value: unknown,
): value is UnitListDocumentRecord => {
  if (!isRecord(value)) {
    return false;
  }
  return allValid([
    () => isArrayOf(value.rootUnits, isUnitListRootDto),
    () => isUnitListProjectionRecord(value.unitList),
  ]);
};

export const validateUnitListTableData = (
  document: unknown,
): UnitListTableDataCandidate | undefined => {
  if (!isUnitListDocumentRecord(document)) {
    return undefined;
  }

  return {
    rootUnits: document.rootUnits,
    rows: document.unitList.rows,
    units: document.unitList.units,
  };
};
