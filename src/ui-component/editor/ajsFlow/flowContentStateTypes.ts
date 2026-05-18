import { Dispatch, SetStateAction } from "react";
import { UnitDefinitionDialogDto } from "../../../application/unit-definition/buildUnitDefinition";

export type DialogDataStateType = {
  dialogData?: UnitDefinitionDialogDto;
  setDialogData: Dispatch<SetStateAction<UnitDefinitionDialogDto | undefined>>;
};

type FlowMenuStatusType = {
  menuItem1: boolean;
};

export type FlowMenuStateType = {
  menuStatus: FlowMenuStatusType;
  setMenuStatus: Dispatch<SetStateAction<FlowMenuStatusType>>;
};

export type DrawerWidthStateType = {
  drawerWidth: number;
  setDrawerWidth: Dispatch<SetStateAction<number>>;
};

export type CurrentUnitIdStateType = {
  currentUnitId?: string;
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>;
};

export type NestedExpansionStateType = {
  expandedUnitIds: ReadonlySet<string>;
  toggleExpandedUnitId: (unitId: string) => void;
};
