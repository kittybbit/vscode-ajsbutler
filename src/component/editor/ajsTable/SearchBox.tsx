import React, { FocusEvent, KeyboardEvent, useEffect, useMemo, useRef } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useMyAppContext } from '../MyContexts';
import { localeMap } from '../../../domain/services/i18n/nls';
import { Typography } from '@mui/material';
import { UnitEntity } from '../../../domain/models/UnitEntities';
import { Table } from '@tanstack/table-core';

const SearchBox = (props: { table: Table<UnitEntity> }) => {

    console.log('render SearchBox.');

    const { lang, os } = useMyAppContext();
    const isMac = () => os === 'darwin';

    const ref = useRef<HTMLInputElement>();

    const handleShortcut = (event: globalThis.KeyboardEvent) => {
        ((isMac() ? event.metaKey : event.ctrlKey) && event.key === 'f') && ref.current && ref.current.focus();
    };

    useEffect(() => {
        document.addEventListener('keydown', handleShortcut);
        return () => document.removeEventListener('keydown', handleShortcut);
    }, []);

    const { table } = props;
    const globalFilter = table.getState().globalFilter;
    const setGlobalFilter = table.setGlobalFilter

    const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            const newValue = (e.target as HTMLInputElement).value;
            globalFilter !== newValue && setGlobalFilter(() => newValue);
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        globalFilter !== newValue && setGlobalFilter(() => newValue);
    };

    return <>
        <TextField
            id='search'
            placeholder='Search...'
            helperText={useMemo(() => localeMap('search.helperText', lang), [lang])}
            InputProps={{
                startAdornment: <SearchIcon sx={{ marginRight: '0.5rem' }} />,
                endAdornment: <><kbd>{isMac() ? '\u2318' : 'CTRL'}</kbd><Typography sx={{ fontSize: '0.8em' }}>+</Typography><kbd>F</kbd></>,
            }}
            variant='standard'
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            sx={{ width: '30em' }}
            inputRef={ref}
        />
    </>;
};
export default SearchBox;