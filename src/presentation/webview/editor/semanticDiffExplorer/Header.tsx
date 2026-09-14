import React, { useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import type { SemanticDiffExplorerViewModel } from "../../../../application/semantic-diff/semanticDiffExplorer";
import type { SemanticDiffExplorerLabels } from "../../semantic-diff/semanticDiffExplorerLocalization";
import { semanticDiffExplorerFocusSx } from "../../shared/muiTheme";

const calendarActionLabel = (language: string): string =>
  language.toLowerCase().startsWith("ja")
    ? "スケジュール影響"
    : "Schedule impact";

export type SemanticDiffExplorerHeaderProps = Readonly<{
  labels: SemanticDiffExplorerLabels;
  language: string;
  filter: SemanticDiffExplorerViewModel["filter"];
  setFilter: (value: SemanticDiffExplorerViewModel["filter"]) => void;
  setAnnouncement: (value: string) => void;
  outputAction?: (element?: HTMLElement) => void;
  calendarAction?: (element?: HTMLElement) => void;
}>;

export const SemanticDiffExplorerHeader = ({
  labels,
  filter,
  setFilter,
  setAnnouncement,
  outputAction,
  calendarAction,
  language,
}: SemanticDiffExplorerHeaderProps): React.ReactElement => {
  const filterRef = useRef<HTMLSelectElement>(null);
  const handleFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    const next = event.target.value as SemanticDiffExplorerViewModel["filter"];
    setFilter(next);
    filterRef.current?.focus();
    setAnnouncement(next === "all" ? labels.all : labels.confirmationRequired);
  };

  return (
    <AppBar
      component="header"
      position="sticky"
      color="transparent"
      elevation={0}
      data-semantic-diff-explorer-header="true"
      sx={{ mb: 2, top: 0, zIndex: (theme) => theme.zIndex.appBar }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: "auto",
          py: 1,
          alignItems: "flex-start",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          id="semantic-diff-explorer-title"
        >
          {labels.title}
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          useFlexGap
          sx={{ width: "100%", flexWrap: "wrap", alignItems: { sm: "center" } }}
        >
          <Button
            type="button"
            variant="contained"
            startIcon={<OpenInNewIcon aria-hidden="true" />}
            onClick={(event) => outputAction?.(event.currentTarget)}
            sx={semanticDiffExplorerFocusSx}
          >
            {labels.output}
          </Button>
          {calendarAction && (
            <Button
              type="button"
              variant="outlined"
              onClick={(event) => calendarAction(event.currentTarget)}
              sx={semanticDiffExplorerFocusSx}
            >
              {calendarActionLabel(language)}
            </Button>
          )}
          <FormControl sx={{ minWidth: 14 * 16, maxWidth: "100%" }}>
            <InputLabel htmlFor="semantic-diff-explorer-filter">
              {labels.filter}
            </InputLabel>
            <NativeSelect
              id="semantic-diff-explorer-filter"
              value={filter}
              inputProps={{ "aria-label": labels.filter }}
              ref={filterRef}
              onChange={handleFilterChange}
              sx={{
                minWidth: 0,
                maxWidth: "100%",
                ...semanticDiffExplorerFocusSx,
              }}
            >
              <option value="all">{labels.all}</option>
              <option value="confirmation-required">
                {labels.confirmationRequired}
              </option>
            </NativeSelect>
          </FormControl>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default SemanticDiffExplorerHeader;
