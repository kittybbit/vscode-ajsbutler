import React, { Fragment } from 'react';
import { UnitEntity } from '../../../domain/models/UnitEntities';
import { Column, Table as ReactTable } from '@tanstack/table-core';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Drawer, FormControlLabel, IconButton, List, ListItem, Stack, Switch, Tooltip, Typography } from '@mui/material';
import { ToggleOff, ToggleOn, ExpandMore } from '@mui/icons-material';
import { useMyAppContext } from '../MyContexts';
import { localeMap } from '../../../domain/services/i18n/nls';
import { MenuType } from './Header';

export default function DisplayColumnSelector(props: { table: ReactTable<UnitEntity> } & MenuType) {

    console.log('render DisplayColumnSelector.');

    const { lang } = useMyAppContext();
    const { menuStatus, setMenuStatus } = props;
    const { table } = props;

    const toggleDrawer = (open: boolean) =>
        (e: React.KeyboardEvent | React.MouseEvent) => {
            if (e.type === 'keydown' &&
                ((e as React.KeyboardEvent).key === 'Tab' ||
                    (e as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }
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

    return <>
        <Drawer
            anchor='left'
            open={menuStatus ? menuStatus.menuItem1 : false}
            onClose={toggleDrawer(false)}
        >
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
    </>;
}