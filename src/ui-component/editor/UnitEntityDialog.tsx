import React, { FC, memo, MouseEvent, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { UnitEntity } from '../../domain/models/units/UnitEntities';

type UnitEntityDialogProps = {
    dialogData: UnitEntity | undefined,
    onClose: VoidFunction,
};
const UnitEntityDialog: FC<UnitEntityDialogProps> = ({ dialogData, onClose }) => {

    console.log('render UnitEntityDialog.');

    const handleClose = () => {
        onClose();
    };

    const [tabIndex, setTabIndex] = useState(0);

    return <Dialog
        scroll='paper'
        open={dialogData !== undefined}
        onClose={handleClose}
        fullWidth={true}
    >
        <DialogTitle sx={{ paddingBottom: '0em' }}>
            <Stack direction='row' justifyContent='space-between'>
                <Tabs
                    value={tabIndex}
                // onChange={handleChange}
                >
                    <Tab label='Raw data' onClick={() => setTabIndex(() => 0)} />
                    <Tab label='Command' onClick={() => setTabIndex(() => 1)} />
                    {/* <Tab label='API' /> */}
                </Tabs>
                <IconButton
                    aria-label='close'
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </Stack>
            <Typography variant='caption'>{dialogData ? dialogData.absolutePath : ''}</Typography>
        </DialogTitle>
        <Tab1 dialogData={dialogData} show={tabIndex === 0} />
        <Tab2 dialogData={dialogData} show={tabIndex === 1} />
    </Dialog>;
}

type TabPanelProps = {
    dialogData: UnitEntity | undefined,
    show: boolean,
};

const Tab1 = (params: TabPanelProps) => {

    console.log('render Tab1.');

    const { dialogData, show } = params;
    const [tooltipMsg, setTooltipMsg] = useState<string>('');
    const handleCopy = (event: MouseEvent<HTMLDivElement>) => {
        event.currentTarget.textContent && navigator.clipboard.writeText(event.currentTarget.textContent);
        setTooltipMsg(() => 'Copied');
    };
    const handleMouseEnter = () => setTooltipMsg(() => 'Click to copy');

    return <DialogContent key={dialogData?.id} sx={{ display: show ? 'block' : 'none' }} dividers>
        <Tooltip placement='top' title={tooltipMsg}>
            <TextField
                id='rawdata'
                multiline={true}
                variant='outlined'
                fullWidth={true}
                value={
                    dialogData && dialogData.parameters
                        .map((p) => `${p.key}=${p.value}`)
                        .join('\n')
                }
                onClick={handleCopy}
                onMouseEnter={handleMouseEnter}
            />
        </Tooltip>
    </DialogContent>;
};

const Tab2 = (params: TabPanelProps) => {

    console.log('render Tab2.');

    const { dialogData, show } = params;

    const [tooltipMsg, setTooltipMsg] = useState<string>('');
    const handleCopy = (event: MouseEvent<HTMLDivElement>) => {
        event.currentTarget.textContent && navigator.clipboard.writeText(event.currentTarget.textContent);
        setTooltipMsg(() => 'Copied');
    };
    const handleMouseEnter = () => setTooltipMsg(() => 'Click to copy');

    return <DialogContent key={dialogData?.id} sx={{ display: show ? 'block' : 'none' }} dividers>
        <Tooltip placement='top' title={tooltipMsg}>
            <TextField
                label='ajsshow'
                id='ajsshow'
                multiline={true}
                variant='outlined'
                fullWidth={true}
                sx={{ marginBottom: '1em' }}
                value={`ajsshow -R ${dialogData?.absolutePath}`}
                onClick={handleCopy}
                onMouseEnter={handleMouseEnter}
            />
        </Tooltip>
        <Tooltip placement='top' title={tooltipMsg}>
            <TextField
                label='ajsprint'
                id='ajsprint'
                multiline={true}
                variant='outlined'
                fullWidth={true}
                sx={{ marginBottom: '1em' }}
                value={`ajsprint -a -R ${dialogData?.absolutePath}`}
                onClick={handleCopy}
                onMouseEnter={handleMouseEnter}
            />
        </Tooltip>
    </DialogContent>;
};

export default memo(UnitEntityDialog);