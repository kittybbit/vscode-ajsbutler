import React, { FC, Fragment, memo, useEffect, useRef } from 'react';
import {
    Accordion, AccordionDetails, AccordionSummary, Divider, Drawer,
    FormControlLabel, IconButton, List, ListItem, Stack,
    Switch, Toolbar, Tooltip, Typography, useTheme,
} from '@mui/material';
import { Column, Table as ReactTable } from '@tanstack/table-core';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ToggleOff from '@mui/icons-material/ToggleOff';
import ToggleOn from '@mui/icons-material/ToggleOn';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { UnitEntity } from '../../../domain/models/units/UnitEntities';
import { useMyAppContext } from '../MyContexts';
import { localeMap } from '../../../domain/services/i18n/nls';
import { DrawerWidthStateType, TableMenuStateType } from './TableContents';

type DisplayColumnSelectorProps = {
    table: ReactTable<UnitEntity>;
    tableMenuState: TableMenuStateType;
    drawerWidthState: DrawerWidthStateType;
};

const ColumnSwitch: FC<{
    column: Column<UnitEntity, unknown>;
    label: string;
}> = ({ column, label }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        column.getLeafColumns().forEach((col) => col.getToggleVisibilityHandler()(event));
    };

    const isChecked = column
        .getLeafColumns()
        .some((col) => col.getIsVisible());

    return (
        <FormControlLabel
            control={
                <Switch
                    size="small"
                    onChange={handleChange}
                    checked={isChecked}
                />
            }
            label={<Typography variant="body2">{label}</Typography>}
            sx={{ width: '100%' }}
        />
    );
};

const ColumnDetail: FC<{ column: Column<UnitEntity, unknown> }> = ({ column }) => {
    const subColumns = column.columns.filter((col) => col.columnDef.enableHiding);

    if (!subColumns.length) return null;

    return (
        <List sx={{ marginLeft: '0.5em' }}>
            {subColumns.map((subColumn) => (
                <Fragment key={subColumn.id}>
                    {subColumn.columns.length > 1 ? (
                        <>
                            <Divider sx={{ marginTop: '0.5em' }}>
                                <Typography variant="body2">{subColumn.columnDef.header as string}</Typography>
                            </Divider>
                            <List sx={{ marginLeft: '0.5em' }}>
                                {subColumn.columns
                                    .filter((col) => col.columnDef.enableHiding)
                                    .map((leafColumn) => (
                                        <ListItem key={leafColumn.id} dense>
                                            <ColumnSwitch
                                                column={leafColumn}
                                                label={leafColumn.columnDef.header as string}
                                            />
                                        </ListItem>
                                    ))}
                            </List>
                        </>
                    ) : (
                        <ListItem dense>
                            <ColumnSwitch
                                column={subColumn}
                                label={subColumn.columnDef.header as string}
                            />
                        </ListItem>
                    )}
                </Fragment>
            ))}
        </List>
    );
};

const ColumnAccordion: FC<{ column: Column<UnitEntity, unknown> }> = ({ column }) => (
    <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
            <Switch
                size="small"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                    column
                        .getLeafColumns()
                        .forEach((col) => col.getToggleVisibilityHandler()(e))
                }
                checked={column.getLeafColumns().some((col) => col.getIsVisible())}
            />
            <Divider
                orientation="vertical"
                flexItem
                sx={{ marginLeft: '0.5em', marginRight: '0.5em' }}
            />
            <Typography variant="body2">{column.columnDef.header as string}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <ColumnDetail column={column} />
        </AccordionDetails>
    </Accordion>
);

const DisplayColumnSelector: FC<DisplayColumnSelectorProps> = ({
    table,
    tableMenuState,
    drawerWidthState,
}) => {
    const { lang } = useMyAppContext();
    const { menuStatus, setMenuStatus } = tableMenuState;
    const { setDrawerWidth } = drawerWidthState;

    const theme = useTheme();
    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (drawerRef.current) {
            setDrawerWidth(drawerRef.current.offsetWidth);
        }
    }, [setDrawerWidth]);

    const toggleDrawer = (open: boolean) => () => {
        setDrawerWidth(0);
        setMenuStatus((prev) => ({ ...prev, menuItem1: open }));
    };

    const visibleColumns = table
        .getAllColumns()
        .filter((col) => col.columnDef.enableHiding);

    return (
        <Drawer
            anchor="left"
            variant="persistent"
            open={menuStatus?.menuItem1 ?? false}
            onClose={toggleDrawer(false)}
            sx={{ flexShrink: 0 }}
        >
            <Toolbar
                ref={drawerRef}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: theme.spacing(0, 1),
                    ...theme.mixins.toolbar,
                    justifyContent: 'flex-end',
                }}
            >
                <IconButton onClick={toggleDrawer(false)}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </Toolbar>
            <Stack direction="row" spacing={2} justifyContent="center">
                <Tooltip
                    arrow
                    title={localeMap('table.columnSelectSidebar.invisibleAll', lang)}
                >
                    <IconButton
                        aria-label={localeMap('table.columnSelectSidebar.invisibleAll', lang)}
                        size="small"
                        onClick={() => table.toggleAllColumnsVisible(false)}
                    >
                        <ToggleOff fontSize="large" color="disabled" />
                    </IconButton>
                </Tooltip>
                <Tooltip
                    arrow
                    title={localeMap('table.columnSelectSidebar.visibleAll', lang)}
                >
                    <IconButton
                        aria-label={localeMap('table.columnSelectSidebar.visibleAll', lang)}
                        size="small"
                        onClick={() => table.toggleAllColumnsVisible(true)}
                    >
                        <ToggleOn fontSize="large" color="primary" />
                    </IconButton>
                </Tooltip>
            </Stack>
            {visibleColumns.map((column) => (
                <ColumnAccordion key={column.id} column={column} />
            ))}
        </Drawer>
    );
};

export default memo(DisplayColumnSelector);