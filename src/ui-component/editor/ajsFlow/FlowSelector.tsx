import React, { FC, memo, useEffect, useRef } from 'react';
import { Accordion as MuiAccordion, AccordionActions as MuiAccordionActions, AccordionSummary as MuiAccordionSummary, Drawer, IconButton, Toolbar, useTheme, AccordionProps, styled, AccordionSummaryProps, AccordionActionsProps } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { UnitEntity } from '../../../domain/models/units/UnitEntities';
import { N } from '../../../domain/models/units/N';
import { CurrentUnitEntityStateType, DrawerWidthStateType, FlowMenuStateType } from './FlowContents';

type FlowSelectorProps = {
    unitEntites: UnitEntity[],
    flowMenuState: FlowMenuStateType,
    currentUnitEndityState: CurrentUnitEntityStateType,
    drawerWidthState: DrawerWidthStateType,
};

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion
        disableGutters
        square
        slotProps={{
            heading: { component: 'div' }
        }}
        {...props} />
))(() => ({
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon fontSize='inherit' />}
        sx={{ minHeight: '2em' }}
        {...props}
    />
))(({ theme }) => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginTop: theme.spacing(0),
        marginBottom: theme.spacing(0),
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
}));

const AccordionActions = styled((props: AccordionActionsProps) => (
    <MuiAccordionActions {...props} />
))(() => ({
    justifyContent: 'flex-start',
}));

const FlowSelector: FC<FlowSelectorProps> = ({ unitEntites, currentUnitEndityState, flowMenuState, drawerWidthState }) => {

    console.log('render FlowSelector.');

    const { menuStatus, setMenuStatus } = flowMenuState;
    const { currentUnitEntity, setCurrentUnitEntity } = currentUnitEndityState;
    const { setDrawerWidth } = drawerWidthState;

    const theme = useTheme();

    const handleClose = () => {
        setDrawerWidth(() => 0);
        setMenuStatus((prev) => { return { ...prev, ...{ menuItem1: false } } });
    };

    const isAncestorOf = (currentUnitEntity?: UnitEntity, unitEntity?: UnitEntity): boolean => {
        if (!(currentUnitEntity && unitEntity)) {
            return false;
        }
        if (currentUnitEntity === unitEntity) {
            return true;
        }
        return isAncestorOf(currentUnitEntity.parent, unitEntity);
    };

    const createContents = (unitEntites: UnitEntity[]) => {
        return unitEntites
            .map(unitEntity => {
                if (unitEntity.ty.value() === 'g') {
                    return <Accordion
                        key={unitEntity.id}
                        sx={{
                            marginLeft: `${unitEntity.depth}em`
                        }}
                    >
                        <AccordionSummary>
                            {unitEntity.name}
                        </AccordionSummary>
                        {createContents(unitEntity.children)}
                    </Accordion>;
                }
                if (unitEntity.ty.value() === 'n' && (unitEntity as N).isRootJobnet) {
                    return <AccordionActions
                        key={unitEntity.id}
                        disableSpacing
                        onClick={() => setCurrentUnitEntity(() => unitEntity)}
                        sx={{
                            marginLeft: `${unitEntity.depth}em`
                        }}
                    >
                        {
                            isAncestorOf(currentUnitEntity, unitEntity) && <CheckCircleOutlineIcon
                                fontSize='inherit'
                                sx={{ marginRight: '0.25em' }} />
                        }
                        {unitEntity.name}
                    </AccordionActions>;
                }
                return null;
            });
    };

    const drawerRef = useRef<HTMLDivElement>(null);
    useEffect(() => setDrawerWidth(() => drawerRef.current ? drawerRef.current.offsetWidth : 0));

    return <>
        <Drawer
            anchor='left'
            variant='persistent'
            open={menuStatus.menuItem1}
            onClose={handleClose}
        >
            <Toolbar
                ref={drawerRef}
                sx={{
                    position: 'sticky',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                }}>
                <IconButton onClick={handleClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </Toolbar>
            {createContents(unitEntites)}
        </Drawer>
    </>;
}

export default memo(FlowSelector);