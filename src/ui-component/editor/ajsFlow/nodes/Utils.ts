import { AjsNode } from "./AjsNode";

export const handleClickDialogOpen = (data: AjsNode) => () => {
    const { unitEntity, setDialogData } = data;
    setDialogData(() => unitEntity);
};

export const handleKeyDownDialogOpen = (data: AjsNode) => (event: React.KeyboardEvent<HTMLElement>) => {
    const { unitEntity, setDialogData } = data;
    event.key === 'Enter' && setDialogData(() => unitEntity);
}

export const handleClickChildOpen = (data: AjsNode) => () => {
    const { unitEntity, setCurrentUnitEntity } = data;
    setCurrentUnitEntity(() => unitEntity);
};

export const handleKeyDownChildOpen = (data: AjsNode) => (event: React.KeyboardEvent<HTMLElement>) => {
    const { unitEntity, setCurrentUnitEntity } = data;
    event.key === 'Enter' && setCurrentUnitEntity(() => unitEntity);
}