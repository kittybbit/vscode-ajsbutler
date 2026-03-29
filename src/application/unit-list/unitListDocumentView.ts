import { UnitEntity } from "../../domain/models/units/UnitEntities";
import { flattenChildren, tyFactory } from "../../domain/utils/TyUtils";
import { UnitListDocumentDto, toRootUnits } from "./unitListDocument";

export const toUnitEntities = (document: UnitListDocumentDto): UnitEntity[] =>
  toRootUnits(document)
    .map((rootUnit) => tyFactory(rootUnit))
    .flatMap((rootUnitEntity) => flattenChildren([rootUnitEntity]));
