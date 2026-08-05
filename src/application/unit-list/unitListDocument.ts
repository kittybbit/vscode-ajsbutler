import type {
  AjsNormalizationWarning,
  AjsDocument,
} from "../../domain/models/ajs/AjsDocument";
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
} from "./buildUnitListView";
import { validateUnitListTableData } from "./unitListDocumentValidation";
import { hasMatchingProjectionIdentity } from "./unitListProjectionIdentity";

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

export const toUnitListTableData = (
  document: unknown,
): UnitListTableDataDto | undefined => {
  const candidate = validateUnitListTableData(document);
  if (candidate === undefined) {
    return undefined;
  }

  if (
    !hasMatchingProjectionIdentity(
      candidate.rootUnits,
      candidate.rows,
      candidate.units,
    )
  ) {
    return undefined;
  }
  return candidate;
};
