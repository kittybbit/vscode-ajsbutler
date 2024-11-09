import React, { Dispatch, FC, memo, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Box, Stack, ThemeProvider, createTheme } from '@mui/material';
import { useMyAppContext } from '../MyContexts';
import { Background, BackgroundVariant, Controls, Edge, MiniMap, Node, NodeTypes, ReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { UnitEntity } from '../../../domain/models/units/UnitEntities';
import UnitEntityDialog from '../UnitEntityDialog';
import JobNode from './nodes/JobNode';
import JobNetNode from './nodes/JobNetNode';
import JobGroupNode from './nodes/JobGroupNode';
import ConditionNode from './nodes/ConditionNode';
import Header from './Header';
import { parse } from 'flatted';
import { Unit } from '../../../domain/values/Unit';
import { tyFactory } from '../../../domain/utils/TyUtils';
import FlowSelector from './FlowSelector';
import { createReactFlowData } from './ReactFlowUtils';

const defaultViewport = { x: 0, y: 0, zoom: 1.0 };

const nodeTypes: NodeTypes = {
    job: JobNode,
    jobnet: JobNetNode,
    jobgroup: JobGroupNode,
    condition: ConditionNode,
};

export type DialogDataStateType = {
    dialogData?: UnitEntity,
    setDialogData: Dispatch<SetStateAction<UnitEntity | undefined>>,
};

type FlowMenuStatusType = {
    menuItem1: boolean,
}
export type FlowMenuStateType = {
    menuStatus: FlowMenuStatusType,
    setMenuStatus: Dispatch<SetStateAction<FlowMenuStatusType>>,
}
export type DrawerWidthStateType = {
    drawerWidth: number,
    setDrawerWidth: Dispatch<SetStateAction<number>>,
};
export type CurrentUnitEntityStateType = {
    currentUnitEntity?: UnitEntity,
    setCurrentUnitEntity: Dispatch<SetStateAction<UnitEntity | undefined>>,
}

const FlowContents: FC = () => {

    console.log('render FlowContents.');

    const { isDarkMode } = useMyAppContext();

    const [menuStatus, setMenuStatus] = useState<FlowMenuStatusType>({ menuItem1: true });
    const [drawerWidth, setDrawerWidth] = useState<number>(0);

    const [unitEntities, setUnitEntities] = useState<UnitEntity[]>([]);
    const [currentUnitEntity, setCurrentUnitEntity] = useState<UnitEntity>();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [dialogData, setDialogData] = useState<UnitEntity | undefined>();

    const changeDodumentFn = (type: string, data: unknown) => {
        const unitEntities: UnitEntity[] = parse(data as string)
            .map((rootUnitOfJSON: Unit) => Unit.createFromJSON(rootUnitOfJSON))
            .map((unit: Unit) => tyFactory(unit));
        setUnitEntities(() => unitEntities);
        setCurrentUnitEntity(() => undefined);
    };
    useEffect(() => {
        window.EventBridge.addCallback('changeDocument', changeDodumentFn);
        window.vscode.postMessage({ type: 'ready' });
        return () => {
            window.EventBridge.removeCallback('changeDocument', changeDodumentFn);
        }
    }, []); // fire this when mount.

    const theme = useMemo(() => createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light'
        }
    }), [isDarkMode]);

    const flowMenuState = {
        menuStatus: menuStatus,
        setMenuStatus: setMenuStatus,
    };
    const drawerWidthState = {
        drawerWidth: drawerWidth,
        setDrawerWidth: setDrawerWidth,
    };
    const currentUnitEndityState = {
        currentUnitEntity: currentUnitEntity,
        setCurrentUnitEntity: setCurrentUnitEntity,
    };
    const dialogDataState = {
        dialogData: dialogData,
        setDialogData: setDialogData,
    };

    const createNodesAndEdges = (unitEntity?: UnitEntity) => {
        if (!unitEntity) {
            setNodes(() => []);
            setEdges(() => []);
            return;
        }
        const { nodes, edges } = createReactFlowData(unitEntity, theme);
        nodes.forEach(node => {
            node.data = { ...node.data, ...dialogDataState, ...currentUnitEndityState };
        });
        setNodes(() => nodes);
        setEdges(() => edges);
    }
    useEffect(
        () => createNodesAndEdges(currentUnitEntity)
        , [currentUnitEntity]
    );

    return <>
        <ThemeProvider theme={theme}>
            <ReactFlowProvider>
                <Stack direction='row' spacing={0}>
                    {menuStatus.menuItem1 && <FlowSelector
                        unitEntites={unitEntities}
                        currentUnitEndityState={currentUnitEndityState}
                        flowMenuState={flowMenuState}
                        drawerWidthState={drawerWidthState}
                    />}
                    <Stack
                        direction='column'
                        sx={{
                            marginLeft: `${drawerWidth}px`,
                        }}
                    >
                        <Header
                            flowMenuState={flowMenuState}
                            currentUnitEntityState={currentUnitEndityState}
                            drawerWidthState={drawerWidthState}
                        />
                        <Box
                            sx={{
                                width: '100vw',
                                height: (theme) => `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
                            }}
                        >
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                defaultViewport={defaultViewport}
                                colorMode={theme.palette.mode}
                                nodeTypes={nodeTypes}
                            >
                                <Background
                                    variant={BackgroundVariant.Dots}
                                />
                                <Controls
                                    position="bottom-left"
                                    showInteractive={false}
                                />
                                <MiniMap
                                    pannable
                                    zoomable
                                />
                            </ReactFlow>
                            {dialogData
                                && <UnitEntityDialog dialogData={dialogData} onClose={() => setDialogData(undefined)} />}
                        </Box>
                    </Stack>
                </Stack>
            </ReactFlowProvider>
        </ThemeProvider>
    </>;
};
export default memo(FlowContents);