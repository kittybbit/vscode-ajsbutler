import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
} from "react";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import type { SxProps, Theme } from "@mui/material/styles";
import { useMyAppContext } from "../MyContexts";
import { unitInformationMessage } from "../unitInformationLocalization";
import {
  focusHeaderSearchFromShortcut,
  formatHeaderSearchPlaceholder,
  isMacBrowserPlatform,
  type HeaderSearchInputRef,
} from "./headerSearchControlModel";

type HeaderSearchFieldProps = {
  id?: string;
  value: string;
  placeholderLabel: string;
  helperText: ReactNode;
  inputRef: RefObject<HTMLInputElement | null>;
  endAdornment?: ReactNode;
  clearDisabled: boolean;
  onValueChange: (value: string) => void;
  onEnter: (shiftKey: boolean) => void;
  onBlur: () => void;
  onClear: () => void;
  sx?: SxProps<Theme>;
};

const getBrowserPlatform = (): string | undefined =>
  typeof navigator === "undefined" ? undefined : navigator.platform;

const useHeaderSearchShortcut = (
  inputRef: HeaderSearchInputRef,
  isMac: boolean,
): void => {
  const handleShortcut = useCallback(
    (event: globalThis.KeyboardEvent) =>
      focusHeaderSearchFromShortcut(event, isMac, inputRef),
    [inputRef, isMac],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [handleShortcut]);
};

export const HeaderSearchField: FC<HeaderSearchFieldProps> = ({
  id,
  value,
  placeholderLabel,
  helperText,
  inputRef,
  endAdornment,
  clearDisabled,
  onValueChange,
  onEnter,
  onBlur,
  onClear,
  sx,
}) => {
  const isMac = isMacBrowserPlatform(getBrowserPlatform());
  const { lang = "en" } = useMyAppContext();
  const clearLabel = unitInformationMessage("a11y.search.clear", lang);
  useHeaderSearchShortcut(inputRef, isMac);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onValueChange(event.target.value),
    [onValueChange],
  );
  const handleKeyUp = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Enter") {
        return;
      }
      event.preventDefault();
      onEnter(event.shiftKey);
    },
    [onEnter],
  );

  return (
    <TextField
      id={id}
      size="small"
      variant="standard"
      placeholder={formatHeaderSearchPlaceholder(placeholderLabel, isMac)}
      helperText={helperText}
      value={value}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      onBlur={onBlur}
      inputRef={inputRef}
      sx={sx}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.25}
                onMouseDown={(event) => event.preventDefault()}
              >
                {endAdornment}
                <Tooltip title={clearLabel}>
                  <span>
                    <IconButton
                      size="small"
                      aria-label={clearLabel}
                      onClick={onClear}
                      disabled={clearDisabled}
                    >
                      <ClearAllIcon fontSize="inherit" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default HeaderSearchField;
