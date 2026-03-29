import { UnitEntity } from "../../domain/models/units/UnitEntities";
import { flattenChildren, tyFactory } from "../../domain/utils/TyUtils";
import {
  toAjsDocument,
  UnitListDocumentDto,
  toRootUnits,
} from "./unitListDocument";

export const toRootUnitEntities = (
  document: UnitListDocumentDto,
): UnitEntity[] => toRootUnits(document).map((rootUnit) => tyFactory(rootUnit));

export const toUnitEntities = (document: UnitListDocumentDto): UnitEntity[] =>
  toRootUnitEntities(document).flatMap((rootUnitEntity) =>
    flattenChildren([rootUnitEntity]),
  );

export { toAjsDocument };
