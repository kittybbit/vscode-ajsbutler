import React, { FC, FocusEvent, KeyboardEvent, memo, useEffect, useMemo, useRef } from 'react';
import { Typography, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Updater } from '@tanstack/table-core';
import { useMyAppContext } from '../MyContexts';
import { localeMap } from '../../../domain/services/i18n/nls';

type SearchBoxProps = {
    globalFilter: unknown,
    setGlobalFilter: (updator: Updater<unknown>) => void,
};

const SearchBox: FC<SearchBoxProps> = ({ globalFilter, setGlobalFilter }) => {

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

    return (
        <>
            <TextField
                id='search'
                placeholder='Search...'
                helperText={useMemo(() => localeMap('table.search.helperText', lang), [lang])}
                slotProps={{
                    input: {
                        startAdornment: <SearchIcon sx={{ marginRight: '0.5em' }} />,
                        endAdornment: <><kbd>{isMac() ? '\u2318' : 'CTRL'}</kbd><Typography sx={{ fontSize: '0.5em' }}>+</Typography><kbd>F</kbd></>,
                    }
                }}
                variant='standard'
                onKeyUp={handleKeyUp}
                onBlur={handleBlur}
                sx={
                    {
                        width: '20em',
                    }
                }
                inputRef={ref}
            />
        </>
    );
};
export default memo(SearchBox);