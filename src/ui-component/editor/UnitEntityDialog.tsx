import React, { FC, memo, useRef, useState } from 'react'
import { Alert, Box, Dialog, DialogContent, DialogTitle, IconButton, Snackbar, Stack, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCopy from '@mui/icons-material/ContentCopy';
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
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(() => newValue);
    };

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
            <Typography variant='caption'>{dialogData ? dialogData.absolutePath : ''}</Typography>
        </DialogTitle>
        <Tab1 dialogData={dialogData} tabIndex={tabIndex} index={0} />
        <Tab2 dialogData={dialogData} tabIndex={tabIndex} index={1} />
    </Dialog>;
}

type TabPanelProps = {
    dialogData: UnitEntity | undefined,
    tabIndex: number,
    index: number
};

const Tab1 = (params: TabPanelProps) => {

    console.log('render Tab1.');

    const { dialogData, tabIndex, index } = params;

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>();
    const handleCopy = () => {
        ref.current?.textContent && navigator.clipboard.writeText(ref.current.textContent);
        setOpen(() => true);
    };

    return <Box key={index} sx={{ display: index === tabIndex ? 'block' : 'none' }}>
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
    </Box>;
};

const Tab2 = (params: TabPanelProps) => {

    console.log('render Tab2.');

    const { dialogData, tabIndex, index } = params;

    const [open, setOpen] = useState(false);
    const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.parentNode?.textContent && navigator.clipboard.writeText(e.currentTarget.parentNode?.textContent);
        setOpen(() => true);
    };

    return <Box key={index} sx={{ display: index === tabIndex ? 'block' : 'none' }}>
        <DialogContent dividers={true}>
            <TextField
                label='ajsshow'
                id='ajsshow'
                slotProps={{
                    input: {
                        endAdornment: <IconButton onClick={handleCopy}><ContentCopy fontSize='small' /></IconButton>,
                    }
                }}
                multiline={true}
                variant='outlined'
                fullWidth={true}
                sx={{ marginBottom: '1em' }}
                value={`ajsshow -R ${dialogData?.absolutePath}`}
            />
            <TextField
                label='ajsprint'
                id='ajsprint'
                slotProps={{
                    input: {
                        endAdornment: <IconButton onClick={handleCopy}><ContentCopy fontSize='small' /></IconButton>,
                    }
                }}
                multiline={true}
                variant='outlined'
                fullWidth={true}
                sx={{ marginBottom: '1em' }}
                value={`ajsprint -a -R ${dialogData?.absolutePath}`}
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
    </Box>
};

export default memo(UnitEntityDialog);