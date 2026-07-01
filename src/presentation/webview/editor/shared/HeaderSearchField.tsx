import React, {
  ChangeEvent,
  FC,
  Fragment,
  KeyboardEvent,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { useMyAppContext } from "../MyContexts";

type SearchShortcutEvent = Pick<
  globalThis.KeyboardEvent,
  "ctrlKey" | "key" | "metaKey"
>;

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

export type HeaderSearchDirection = "previous" | "next";

export type HeaderSearchResultPosition = {
  current: number;
  total: number;
};

export type HeaderSearchHelperTextLabels = {
  noResults: string;
  matched: string;
  idle: string;
};

export type HeaderSearchNavigationLabels = {
  resultAriaLabel: (position: HeaderSearchResultPosition) => string;
  previousTooltip: string;
  previousAriaLabel: string;
  nextTooltip: string;
  nextAriaLabel: string;
};

export type HeaderSearchControlLabels = {
  helperText: HeaderSearchHelperTextLabels;
  navigation: HeaderSearchNavigationLabels;
};

type HeaderSearchControlProps<
  TDirection extends HeaderSearchDirection = HeaderSearchDirection,
> = {
  matchedTargetId?: string;
  resultPosition?: HeaderSearchResultPosition;
  placeholderLabel: string;
  labels: HeaderSearchControlLabels;
  onSearchNavigate: (query: string, direction: TDirection) => void;
  onSearchSubmit: (query: string) => void;
  onSearchClear: () => void;
};

type HeaderSearchNavigationAdornmentProps<
  TDirection extends HeaderSearchDirection = HeaderSearchDirection,
> = {
  canNavigate: boolean;
  resultPosition?: HeaderSearchResultPosition;
  labels: HeaderSearchNavigationLabels;
  onNavigate: (direction: TDirection) => void;
};

type HeaderSearchControlStateParams<TDirection extends HeaderSearchDirection> =
  Pick<
    HeaderSearchControlProps<TDirection>,
    "onSearchClear" | "onSearchNavigate" | "onSearchSubmit"
  >;

export const isHeaderSearchShortcut = (
  event: SearchShortcutEvent,
  isMac: boolean,
): boolean => (isMac ? event.metaKey : event.ctrlKey) && event.key === "f";

export const formatHeaderSearchPlaceholder = (
  label: string,
  isMac: boolean,
): string => `${label}...(${isMac ? "\u2318" : "CTRL+"}F)`;

export const focusHeaderSearchFromShortcut = (
  event: globalThis.KeyboardEvent,
  isMac: boolean,
  inputRef: RefObject<HTMLInputElement | null>,
): boolean => {
  if (!isHeaderSearchShortcut(event, isMac)) {
    return false;
  }
  event.preventDefault();
  inputRef.current?.focus();
  return true;
};

export const resolveHeaderSearchHelperText = (
  matchedTargetId: string | undefined,
  resultPosition: HeaderSearchResultPosition | undefined,
  labels: HeaderSearchHelperTextLabels,
): string => {
  if (resultPosition?.total === 0) {
    return labels.noResults;
  }
  return matchedTargetId ? labels.matched : labels.idle;
};

const useHeaderSearchShortcut = (
  inputRef: RefObject<HTMLInputElement | null>,
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

const useHeaderSearchControlState = <TDirection extends HeaderSearchDirection>({
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
}: HeaderSearchControlStateParams<TDirection>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");

  const handleSubmit = useCallback(() => {
    onSearchSubmit(value);
  }, [onSearchSubmit, value]);
  const handleEnter = useCallback(
    (shiftKey: boolean) =>
      onSearchNavigate(value, (shiftKey ? "previous" : "next") as TDirection),
    [onSearchNavigate, value],
  );
  const handleClear = useCallback(() => {
    setValue("");
    onSearchClear();
    inputRef.current?.focus();
  }, [onSearchClear]);
  const handleNavigate = useCallback(
    (direction: TDirection) => onSearchNavigate(value, direction),
    [onSearchNavigate, value],
  );

  return {
    handleClear,
    handleEnter,
    handleNavigate,
    handleSubmit,
    inputRef,
    setValue,
    value,
  };
};

const HeaderSearchNavigationAdornment = <
  TDirection extends HeaderSearchDirection,
>({
  canNavigate,
  resultPosition,
  labels,
  onNavigate,
}: HeaderSearchNavigationAdornmentProps<TDirection>) => (
  <Fragment>
    {resultPosition && (
      <Typography
        variant="caption"
        component="span"
        aria-label={labels.resultAriaLabel(resultPosition)}
        sx={{ minWidth: "2.75rem", textAlign: "center" }}
      >
        {resultPosition.current}/{resultPosition.total}
      </Typography>
    )}
    <Tooltip title={labels.previousTooltip}>
      <span>
        <IconButton
          size="small"
          aria-label={labels.previousAriaLabel}
          onClick={() => onNavigate("previous" as TDirection)}
          disabled={!canNavigate}
        >
          <NavigateBeforeIcon fontSize="inherit" />
        </IconButton>
      </span>
    </Tooltip>
    <Tooltip title={labels.nextTooltip}>
      <span>
        <IconButton
          size="small"
          aria-label={labels.nextAriaLabel}
          onClick={() => onNavigate("next" as TDirection)}
          disabled={!canNavigate}
        >
          <NavigateNextIcon fontSize="inherit" />
        </IconButton>
      </span>
    </Tooltip>
  </Fragment>
);

const HeaderSearchField: FC<HeaderSearchFieldProps> = ({
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
  const { os } = useMyAppContext();
  const isMac = os === "darwin";
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
                <Tooltip title="Clear search.">
                  <span>
                    <IconButton
                      size="small"
                      aria-label="Clear search."
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

export const HeaderSearchControl = <
  TDirection extends HeaderSearchDirection = HeaderSearchDirection,
>({
  matchedTargetId,
  resultPosition,
  placeholderLabel,
  labels,
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
}: HeaderSearchControlProps<TDirection>) => {
  const {
    handleClear,
    handleEnter,
    handleNavigate,
    handleSubmit,
    inputRef,
    setValue,
    value,
  } = useHeaderSearchControlState({
    onSearchNavigate,
    onSearchSubmit,
    onSearchClear,
  });

  return (
    <HeaderSearchField
      placeholderLabel={placeholderLabel}
      helperText={resolveHeaderSearchHelperText(
        matchedTargetId,
        resultPosition,
        labels.helperText,
      )}
      value={value}
      onValueChange={setValue}
      onEnter={handleEnter}
      onBlur={handleSubmit}
      onClear={handleClear}
      clearDisabled={value.length === 0 && !matchedTargetId}
      inputRef={inputRef}
      sx={{ width: "20rem", maxWidth: "32vw", flexShrink: 0 }}
      endAdornment={
        <HeaderSearchNavigationAdornment
          resultPosition={resultPosition}
          canNavigate={(resultPosition?.total ?? 0) > 0}
          labels={labels.navigation}
          onNavigate={handleNavigate}
        />
      }
    />
  );
};

export default HeaderSearchField;
