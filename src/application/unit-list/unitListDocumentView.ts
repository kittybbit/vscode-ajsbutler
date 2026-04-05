import { UnitEntity } from "../../domain/models/units/UnitEntity";
import { flattenChildren, tyFactory } from "../../domain/utils/TyUtils";
import {
  toAjsDocument,
  UnitListDocumentDto,
  toRootUnits,
} from "./unitListDocument";

export const toRootUnitEntity = (document: UnitListDocumentDto): UnitEntity[] =>
  toRootUnits(document).map((rootUnit) => tyFactory(rootUnit));

export const toUnitEntity = (document: UnitListDocumentDto): UnitEntity[] =>
  toRootUnitEntity(document).flatMap((rootUnitEntity) =>
    flattenChildren([rootUnitEntity]),
  );

export { toAjsDocument };
