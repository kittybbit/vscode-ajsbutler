import React, { FC, memo, MouseEvent, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Tab, Tabs, TextField, Tooltip, Typography, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { UnitEntity } from '../../domain/models/units/UnitEntities';

type UnitEntityDialogProps = {
    dialogData: UnitEntity | undefined;
    onClose: VoidFunction;
};

const useCopyHandler = () => {
    const [tooltipMsg, setTooltipMsg] = useState<string>('');

    const handleCopy = (event: MouseEvent<HTMLDivElement>) => {
        const text = event.currentTarget.textContent;
        if (text) {
            navigator.clipboard.writeText(text);
            setTooltipMsg('Copied');
        }
    };

    const handleMouseEnter = () => setTooltipMsg('Click to copy');

    return { tooltipMsg, handleCopy, handleMouseEnter };
};

type CopyableTextFieldProps = {
    id: string;
    label?: string;
    value: string;
};

const CopyableTextField: FC<CopyableTextFieldProps> = ({ id, label, value }) => {
    const { tooltipMsg, handleCopy, handleMouseEnter } = useCopyHandler();

    return (
        <Tooltip placement="top" title={tooltipMsg}>
            <TextField
                id={id}
                label={label}
                multiline
                variant="outlined"
                fullWidth
                value={value}
                onClick={handleCopy}
                onMouseEnter={handleMouseEnter}
                sx={{ marginBottom: '1em' }}
            />
        </Tooltip>
    );
};

const UnitEntityDialog: FC<UnitEntityDialogProps> = ({ dialogData, onClose }) => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Dialog
            scroll="paper"
            open={!!dialogData}
            onClose={onClose}
            fullWidth
        >
            <DialogTitle sx={{ paddingBottom: '0em' }}>
                <Stack direction="row" justifyContent="space-between">
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label="Raw data" />
                        <Tab label="Command" />
                    </Tabs>
                    <IconButton aria-label="close" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <Typography variant="caption">{dialogData?.absolutePath}</Typography>
            </DialogTitle>
            <TabPanel value={tabIndex} index={0}>
                <Tab1 dialogData={dialogData} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <Tab2 dialogData={dialogData} />
            </TabPanel>
        </Dialog>
    );
};

type TabPanelProps = {
    value: number;
    index: number;
    children: React.ReactNode;
};

const TabPanel: FC<TabPanelProps> = ({ value, index, children }) => {
    return (
        <DialogContent sx={{ display: value === index ? 'block' : 'none' }} dividers>
            {children}
        </DialogContent>
    );
};

const Tab1: FC<{ dialogData: UnitEntity | undefined }> = ({ dialogData }) => {
    if (!dialogData) return null;

    const rawData = dialogData.parameters
        .map((p) => `${p.key}=${p.value}`)
        .join('\n');

    return <CopyableTextField id="rawdata" value={rawData} />;
};

const Tab2: FC<{ dialogData: UnitEntity | undefined }> = ({ dialogData }) => {
    if (!dialogData) return null;

    const commands = [
        { id: 'ajsshow', label: 'ajsshow', value: `ajsshow -R ${dialogData.absolutePath}` },
        { id: 'ajsprint', label: 'ajsprint', value: `ajsprint -a -R ${dialogData.absolutePath}` },
    ];

    return (
        <>
            {commands.map((cmd) => (
                <CopyableTextField key={cmd.id} id={cmd.id} label={cmd.label} value={cmd.value} />
            ))}
        </>
    );
};

export default memo(UnitEntityDialog);