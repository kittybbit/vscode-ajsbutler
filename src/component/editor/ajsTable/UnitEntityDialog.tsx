import React, { useCallback, useRef, useState } from 'react'
import { Alert, Dialog, DialogContent, DialogTitle, IconButton, Snackbar, Stack, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ContentCopy } from '@mui/icons-material';
import { UnitEntity } from '../../../domain/models/UnitEntities';

export const useUnitEntityDialog = () => {

    console.log('render UnitEntityDialog.');

    const [dialogData, setDialogDataInternal] = useState<UnitEntity | undefined>(undefined);
    const setDialogData = useCallback((data: UnitEntity | undefined) => setDialogDataInternal(data), []);

    const handleClose = () => {
        setDialogData(undefined);
    };

    const [tabIndex, setTabIndex] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const UnitEntityDialog = () => <Dialog
        scroll='paper'
        open={dialogData != undefined}
        onClose={handleClose}
        fullWidth={true}
    >
        <DialogTitle sx={{ paddingBottom: '0em' }}>
            <Stack direction='row' justifyContent='space-between'>
                <Tabs
                    value={tabIndex}
                    onChange={handleChange}
                >
                    <Tab label='Raw data' />
                    <Tab label='Command' />
                    {/* <Tab label='API' /> */}
                </Tabs>
                <IconButton
                    aria-label='close'
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </Stack>
            <Typography variant='caption'>{dialogData?.absolutePath()}</Typography>
        </DialogTitle>
        {tabIndex === 0 && <Tab1 dialogData={dialogData} />}
        {tabIndex === 1 && <Tab2 dialogData={dialogData} />}
    </Dialog>;

    return {
        setDialogData,
        UnitEntityDialog
    }
}

const Tab1 = (params: { dialogData: UnitEntity | undefined }) => {

    console.log('render Tabl1.');

    const [open, setOpen] = useState(false);

    const ref = useRef<HTMLDivElement>();
    const handleCopy = () => {
        ref.current?.textContent && navigator.clipboard.writeText(ref.current.textContent);
        setOpen(true);
    };

    const { dialogData } = params;

    return <>
        <Stack direction='row' justifyContent='flex-end' sx={{ marginLeft: '2em', marginRight: '2em' }}>
            <Tooltip title='Copy the contents'>
                <IconButton aria-label='Copy the contents to clipbord' size='small' onClick={handleCopy}>
                    <ContentCopyIcon fontSize='inherit' />
                </IconButton>
            </Tooltip>
        </Stack>
        <DialogContent dividers={true} ref={ref}>
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
            />
        </DialogContent>
        <Snackbar
            sx={{ position: 'absolute' }}
            open={open}
            autoHideDuration={2500}
            onClose={() => setOpen(false)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            <Alert severity='info'>Copied</Alert>
        </Snackbar>
    </>;
};

const Tab2 = (params: { dialogData: UnitEntity | undefined }) => {

    console.log('render Tab2.');

    const { dialogData } = params;

    const [open, setOpen] = useState(false);

    const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.parentNode?.textContent && navigator.clipboard.writeText(e.currentTarget.parentNode?.textContent);
        setOpen(true);
    };

    return <>
        <DialogContent dividers={true}>
            <TextField
                label='ajsshow'
                id='ajsshow'
                InputProps={{
                    endAdornment: <IconButton onClick={handleCopy}><ContentCopy fontSize='small' /></IconButton>,
                }}
                multiline={true}
                variant='outlined'
                fullWidth={true}
                sx={{ marginBottom: '1em' }}
                value={`ajsshow -R ${dialogData?.absolutePath()}`}
            />
            <TextField
                label='ajsprint'
                id='ajsprint'
                InputProps={{
                    endAdornment: <IconButton onClick={handleCopy}><ContentCopy fontSize='small' /></IconButton>,
                }}
                multiline={true}
                variant='outlined'
                fullWidth={true}
                sx={{ marginBottom: '1em' }}
                value={`ajsprint -a -R ${dialogData?.absolutePath()}`}
            />
        </DialogContent>
        <Snackbar
            sx={{ position: 'absolute' }}
            open={open}
            autoHideDuration={2500}
            onClose={() => setOpen(false)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            <Alert severity='info'>Copied</Alert>
        </Snackbar>
    </>
};