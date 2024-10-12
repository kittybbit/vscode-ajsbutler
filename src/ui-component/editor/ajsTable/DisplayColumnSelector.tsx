import React, { Dispatch, FC, Fragment, memo, SetStateAction, useEffect, useRef } from 'react';
import { UnitEntity } from '../../../domain/models/units/UnitEntities';
import { Column, Table as ReactTable } from '@tanstack/table-core';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Drawer, FormControlLabel, IconButton, List, ListItem, Stack, Switch, Toolbar, Tooltip, Typography, useTheme } from '@mui/material';
import ToggleOff from '@mui/icons-material/ToggleOff';
import ToggleOn from '@mui/icons-material/ToggleOn';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useMyAppContext } from '../MyContexts';
import { localeMap } from '../../../domain/services/i18n/nls';
import { TableMenuStateType } from './TableContents';

type DisplayColumnSelectorProps = {
    table: ReactTable<UnitEntity>,
    tableMenuState: TableMenuStateType,
    setDrawerWidth: Dispatch<SetStateAction<number | null>>,
};

const DisplayColumnSelector: FC<DisplayColumnSelectorProps> = ({ table, tableMenuState, setDrawerWidth }) => {

    console.log('render DisplayColumnSelector.');

    const { lang } = useMyAppContext();
    const { menuStatus, setMenuStatus } = tableMenuState;

    const theme = useTheme();

    const toggleDrawer = (open: boolean) =>
        (e: React.KeyboardEvent | React.MouseEvent) => {
            if (e.type === 'keydown' &&
                ((e as React.KeyboardEvent).key === 'Tab' ||
                    (e as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }
            setDrawerWidth(() => 0);
            setMenuStatus((prev) => ({ ...prev, menuItem1: open }));
        };

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    const handleChangeHeader = (column: Column<UnitEntity, unknown>) => (event: React.ChangeEvent) => {
        column.getLeafColumns()
            .forEach(column => column.getToggleVisibilityHandler()(event));
    };

    const handlCheckedHeader = (column: Column<UnitEntity, unknown>) => {
        return column.getLeafColumns()
            .reduce((accumurator, currentValue) => accumurator || currentValue.getIsVisible(), false);
    };

    const drawerRef = useRef<HTMLDivElement>(null);
    useEffect(
        () => setDrawerWidth(() => drawerRef.current ? drawerRef.current.offsetWidth : 0)
        , []
    );

    return (
        <>
            <Drawer
                anchor='left'
                variant="persistent"
                open={menuStatus ? menuStatus.menuItem1 : false}
                onClose={toggleDrawer(false)}
                sx={{
                    flexShrink: 0,
                }}
            >
                <Toolbar
                    ref={drawerRef}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: theme.spacing(0, 1),
                        ...theme.mixins.toolbar,
                        justifyContent: 'flex-end',
                    }}>
                    <IconButton onClick={toggleDrawer(false)}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </Toolbar>
                <Stack direction='row' spacing={2} justifyContent='center'>
                    <Tooltip arrow title={localeMap('columnSelectSidebar.invisibleAll', lang)}>
                        <IconButton
                            aria-label={localeMap('columnSelectSidebar.invisibleAll', lang)}
                            size='small'
                            onClick={() => {
                                table.toggleAllColumnsVisible(false);
                            }}
                        >
                            <ToggleOff fontSize='large' color='disabled' />
                        </IconButton>
                    </Tooltip>
                    <Tooltip arrow title={localeMap('columnSelectSidebar.visibleAll', lang)}>
                        <IconButton
                            aria-label={localeMap('columnSelectSidebar.visibleAll', lang)}
                            size='small'
                            onClick={() => {
                                table.toggleAllColumnsVisible(true);
                            }}
                        >
                            <ToggleOn fontSize='large' color='primary' />
                        </IconButton>
                    </Tooltip>
                </Stack>
                {table.getAllColumns()
                    .filter(column1 => column1.columnDef.enableHiding)
                    .map(column1 => {
                        return <Accordion key={column1.id}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                            >
                                <Switch
                                    size='small'
                                    onClick={handleClick}
                                    onChange={handleChangeHeader(column1)}
                                    checked={handlCheckedHeader(column1)}
                                />
                                <Divider orientation='vertical' flexItem sx={{
                                    marginLeft: '0.5em',
                                    marginRight: '0.5em',
                                }} />
                                <Typography>{column1.columnDef.header as string}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List sx={{ marginLeft: '0.5em' }}>
                                    {
                                        column1.columns
                                            .filter(column2 => column2.columnDef.enableHiding)
                                            .map((column2, index) => {
                                                const header = column2.getLeafColumns()
                                                    .filter(column3 => column3.columnDef.enableHiding)
                                                    .map(column3 => <ListItem key={column3.id} dense>
                                                        <FormControlLabel
                                                            control={<Switch
                                                                size='small'
                                                                onChange={handleChangeHeader(column3)}
                                                                checked={handlCheckedHeader(column3)}
                                                            />}
                                                            label={column3.columnDef.header as string}
                                                            sx={{
                                                                width: '100%'
                                                            }}
                                                        />
                                                    </ListItem>);
                                                if (column2.columns.length > 1) {
                                                    return <Fragment key={column2.id}>
                                                        <Divider sx={{ marginTop: index > 0 ? '0.5em' : null }}>{column2.columnDef.header as string}</Divider>
                                                        <List sx={{ marginLeft: '0.5em' }}>
                                                            {header}
                                                        </List>
                                                    </Fragment>
                                                }
                                                return header;
                                            })
                                    }
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    })
                }
            </Drawer>
        </>
    );
}
export default memo(DisplayColumnSelector);