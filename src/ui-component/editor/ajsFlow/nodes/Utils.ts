import { AjsNode } from "./AjsNode";

export const handleClickDialogOpen = (data: AjsNode) => () => {
  const { unitDefinition, setDialogData } = data;
  setDialogData(() => unitDefinition);
};

export const handleKeyDownDialogOpen =
  (data: AjsNode) => (event: React.KeyboardEvent<HTMLElement>) => {
    const { unitDefinition, setDialogData } = data;
    event.key === "Enter" && setDialogData(() => unitDefinition);
  };

export const handleClickChildOpen = (data: AjsNode) => () => {
  const { unitEntity, setCurrentUnitEntity } = data;
  setCurrentUnitEntity(() => unitEntity);
};

export const handleKeyDownChildOpen =
  (data: AjsNode) => (event: React.KeyboardEvent<HTMLElement>) => {
    const { unitEntity, setCurrentUnitEntity } = data;
    event.key === "Enter" && setCurrentUnitEntity(() => unitEntity);
  };
