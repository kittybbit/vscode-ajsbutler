import React, { ChangeEvent, FC, KeyboardEvent, memo, useEffect, useRef, useState } from 'react';
import { TextField, IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';
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

    const [value, setValue] = useState<string>('');
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setValue(() => e.target.value);
    const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            globalFilter !== value && setGlobalFilter(() => value);
        }
    };
    const handleBlur = () => {
        globalFilter !== value && setGlobalFilter(() => value);
    };
    const handleClearClick = () => {
        setValue(() => '');
        setGlobalFilter(() => '');
        ref.current?.focus();
    };

    return (
        <>
            <TextField
                id='search'
                placeholder={`Search...(${isMac() ? '\u2318' : 'CTRL+'}F)`}
                helperText={localeMap('table.search.helperText', lang)}
                slotProps={{
                    input: {
                        startAdornment: <SearchIcon sx={{ marginRight: '0.5em' }} />,
                        endAdornment: <Tooltip title={localeMap('table.search.clear', lang)}>
                            <IconButton
                                size='small'
                                aria-label={localeMap('table.search.clear', lang)}
                                onClick={handleClearClick}
                            >
                                <ClearAllIcon fontSize='inherit' />
                            </IconButton>
                        </Tooltip>,
                    }
                }}
                variant='standard'
                onChange={handleChange}
                onKeyUp={handleKeyUp}
                onBlur={handleBlur}
                sx={
                    {
                        width: '20em',
                    }
                }
                inputRef={ref}
                value={value ?? ''}
            />
        </>
    );
};
export default memo(SearchBox);