import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AbcIcon from "@mui/icons-material/Abc";
import KeyIcon from "@mui/icons-material/Key";
import { Updater } from "@tanstack/table-core";
import { useMyAppContext } from "../MyContexts";
import HeaderSearchField from "../shared/HeaderSearchField";
import { localeMap } from "../../../../domain/services/i18n/nls";
import { AjsTableSearchMode } from "./globalFilter";

type SearchBoxProps = {
  globalFilter: unknown;
  setGlobalFilter: (updator: Updater<unknown>) => void;
  searchMode: AjsTableSearchMode;
  setSearchMode: (mode: AjsTableSearchMode) => void;
};

const SearchBox: FC<SearchBoxProps> = ({
  globalFilter,
  setGlobalFilter,
  searchMode,
  setSearchMode,
}) => {
  console.log("render SearchBox.");

  const { lang } = useMyAppContext();

  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");
  useEffect(() => {
    setValue(() => String(globalFilter ?? ""));
  }, [globalFilter]);

  const handleValueChange = useCallback((nextValue: string) => {
    setValue(nextValue);
  }, []);
  const commitSearch = useCallback(() => {
    const nextValue = ref.current?.value ?? value;
    const currentValue = String(globalFilter ?? "");
    if (currentValue !== nextValue || nextValue.length === 0) {
      setValue(nextValue);
      setGlobalFilter(() => nextValue);
    }
  }, [globalFilter, setGlobalFilter, value]);
  const handleEnter = useCallback(() => {
    commitSearch();
  }, [commitSearch]);
  const handleClear = useCallback(() => {
    setValue("");
    setGlobalFilter(() => "");
    ref.current?.focus();
  }, [setGlobalFilter]);
  const handleSearchModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextMode: AjsTableSearchMode | null,
  ) => {
    if (nextMode) {
      setSearchMode(nextMode);
      setValue(() => "");
      setGlobalFilter(() => "");
      ref.current?.focus();
    }
  };

  return (
    <HeaderSearchField
      id="search"
      placeholderLabel="Search"
      helperText={localeMap("table.search.helperText", lang)}
      inputRef={ref}
      value={value}
      onValueChange={handleValueChange}
      onEnter={handleEnter}
      onBlur={commitSearch}
      onClear={handleClear}
      clearDisabled={
        value.length === 0 && String(globalFilter ?? "").length === 0
      }
      sx={{ width: "28em" }}
      endAdornment={
        <ToggleButtonGroup
          exclusive
          size="small"
          value={searchMode}
          onChange={handleSearchModeChange}
          aria-label={localeMap("table.search.mode", lang)}
          sx={{
            marginLeft: 1,
            "& .MuiToggleButton-root": {
              height: 28,
              width: 34,
              padding: 0,
            },
          }}
        >
          <Tooltip title={localeMap("table.search.mode.value", lang)}>
            <ToggleButton
              value="value"
              aria-label={localeMap("table.search.mode.value", lang)}
            >
              <AbcIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>
          <Tooltip title={localeMap("table.search.mode.keyValue", lang)}>
            <ToggleButton
              value="keyValue"
              aria-label={localeMap("table.search.mode.keyValue", lang)}
            >
              <KeyIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      }
    />
  );
};
export default memo(SearchBox);
