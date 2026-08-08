import React, { Fragment, type ReactNode } from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { HeaderSearchField } from "./HeaderSearchField";
import {
  resolveHeaderSearchHelperText,
  type HeaderSearchControlProps,
  type HeaderSearchDirection,
  type HeaderSearchNavigationLabels,
  type HeaderSearchResultPosition,
} from "./headerSearchControlModel";
import { useHeaderSearchControlState } from "./useHeaderSearchControlState";

type HeaderSearchNavigationAdornmentProps<
  TDirection extends HeaderSearchDirection = HeaderSearchDirection,
> = {
  canNavigate: boolean;
  resultPosition?: HeaderSearchResultPosition;
  labels: HeaderSearchNavigationLabels;
  onNavigate: (direction: TDirection) => void;
};

const HeaderSearchNavigationAdornment = <
  TDirection extends HeaderSearchDirection,
>({
  canNavigate,
  resultPosition,
  labels,
  onNavigate,
}: HeaderSearchNavigationAdornmentProps<TDirection>): ReactNode => (
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
