import {
  AjsUnit,
  findAjsUnitParameterValue,
} from "../../domain/models/ajs/AjsDocument";
import type {
  UnitListGroup8View,
  UnitListGroup9View,
} from "./buildUnitListView";

const isNestedConnector = (unit: AjsUnit): boolean => unit.unitType === "nc";

const isStartCondition = (unit: AjsUnit): boolean => unit.unitType === "rc";

export const buildGroup8View = (unit: AjsUnit): UnitListGroup8View => ({
  nestedConnectorRelease: isNestedConnector(unit)
    ? findAjsUnitParameterValue(unit, "ncr")
    : undefined,
});

export const buildGroup9View = (unit: AjsUnit): UnitListGroup9View => ({
  startCondition: isStartCondition(unit)
    ? findAjsUnitParameterValue(unit, "cond")
    : undefined,
});
