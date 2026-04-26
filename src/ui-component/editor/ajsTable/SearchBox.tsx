import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AbcIcon from "@mui/icons-material/Abc";
import KeyIcon from "@mui/icons-material/Key";
import SearchIcon from "@mui/icons-material/Search";
import { Updater } from "@tanstack/table-core";
import { useMyAppContext } from "../MyContexts";
import { localeMap } from "../../../domain/services/i18n/nls";
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

  const { lang, os } = useMyAppContext();
  const isMac = () => os === "darwin";

  const ref = useRef<HTMLInputElement>(null);
  const handleShortcut = (event: globalThis.KeyboardEvent) => {
    (isMac() ? event.metaKey : event.ctrlKey) &&
      event.key === "f" &&
      ref.current &&
      ref.current.focus();
  };
  useEffect(() => {
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const [value, setValue] = useState<string>("");
  useEffect(() => {
    setValue(() => String(globalFilter ?? ""));
  }, [globalFilter]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(() => e.target.value);
  const commitSearch = () => {
    const nextValue = ref.current?.value ?? value;
    const currentValue = String(globalFilter ?? "");
    if (currentValue !== nextValue || nextValue.length === 0) {
      setValue(() => nextValue);
      setGlobalFilter(() => nextValue);
    }
  };
  const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      commitSearch();
    }
  };
  const handleBlur = () => {
    commitSearch();
  };
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
    <TextField
      id="search"
      placeholder={`Search...(${isMac() ? "\u2318" : "CTRL+"}F)`}
      helperText={localeMap("table.search.helperText", lang)}
      slotProps={{
        input: {
          startAdornment: <SearchIcon sx={{ marginRight: "0.5em" }} />,
          endAdornment: (
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
          ),
        },
      }}
      variant="standard"
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      sx={{
        width: "28em",
      }}
      inputRef={ref}
      value={value ?? ""}
    />
  );
};
export default memo(SearchBox);
