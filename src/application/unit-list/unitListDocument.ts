import {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { Unit } from "../../domain/values/Unit";

export type UnitListRootDto = {
  unitAttribute: string;
  parameters: AjsParameter[];
  children: UnitListRootDto[];
};

export type UnitListDocumentDto = {
  rootUnits: UnitListRootDto[];
};

export const toUnitListRootDto = (unit: AjsUnit): UnitListRootDto => ({
  unitAttribute: unit.unitAttribute,
  parameters: unit.parameters.map((parameter) => ({ ...parameter })),
  children: unit.children.map(toUnitListRootDto),
});

export const toUnitListDocumentDto = (
  document: AjsDocument,
): UnitListDocumentDto => ({
  rootUnits: document.rootUnits.map(toUnitListRootDto),
});

const toUnit = (rootUnit: UnitListRootDto, parent?: Unit): Unit => {
  const unit = new Unit(rootUnit.unitAttribute, parent);
  unit.parameters = rootUnit.parameters.map((parameter) => ({ ...parameter }));
  unit.children = rootUnit.children.map((child) => toUnit(child, unit));
  return unit;
};

const toRootUnits = (document: UnitListDocumentDto): Unit[] =>
  document.rootUnits.map((rootUnit) => toUnit(rootUnit));

/**
 * Restores the normalized model after its plain DTO crosses the webview
 * serialization boundary.
 */
export const toAjsDocument = (document: UnitListDocumentDto): AjsDocument =>
  normalizeAjsDocument(toRootUnits(document));
