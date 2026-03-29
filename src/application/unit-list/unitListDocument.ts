import { AjsUnit } from "../../domain/models/ajs/AjsDocument";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { Unit } from "../../domain/values/Unit";

export type UnitListRootDto = {
  unitAttribute: string;
  parameters: Array<{ key: string; value: string }>;
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

const toUnit = (rootUnit: UnitListRootDto, parent?: Unit): Unit => {
  const unit = new Unit(rootUnit.unitAttribute, parent);
  unit.parameters = rootUnit.parameters.map((parameter) => ({ ...parameter }));
  unit.children = rootUnit.children.map((child) => toUnit(child, unit));
  return unit;
};

export const toRootUnits = (document: UnitListDocumentDto): Unit[] =>
  document.rootUnits.map((rootUnit) => toUnit(rootUnit));

export const toAjsDocument = (document: UnitListDocumentDto) =>
  normalizeAjsDocument(toRootUnits(document));
