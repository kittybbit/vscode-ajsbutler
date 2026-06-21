import { Dispatch, SetStateAction } from "react";
import { UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";

export type DialogDataStateType = {
  dialogData?: UnitDefinitionDialogDto;
  setDialogData: Dispatch<SetStateAction<UnitDefinitionDialogDto | undefined>>;
};

export type CurrentUnitIdStateType = {
  currentUnitId?: string;
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>;
};

export type NestedExpansionStateType = {
  expandedUnitIds: ReadonlySet<string>;
  toggleExpandedUnitId: (unitId: string) => void;
};
