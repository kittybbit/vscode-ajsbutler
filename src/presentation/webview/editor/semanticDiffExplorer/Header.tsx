import React, { useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import type { SemanticDiffExplorerViewModel } from "../../../../application/semantic-diff/semanticDiffExplorer";
import type { SemanticDiffExplorerLabels } from "./semanticDiffExplorerLocalization";
import ViewerFilterSelect from "../shared/ViewerFilterSelect";
import { viewerFocusSx, viewerOpaqueSurfaceSx } from "../../shared/viewerTheme";

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
  const filterRef = useRef<HTMLDivElement>(null);
  const handleFilterChange = (value: string): void => {
    const next = value as SemanticDiffExplorerViewModel["filter"];
    setFilter(next);
    filterRef.current?.focus();
    setAnnouncement(next === "all" ? labels.all : labels.confirmationRequired);
  };

  return (
    <AppBar
      component="header"
      position="sticky"
      color="default"
      elevation={1}
      data-semantic-diff-explorer-header="true"
      sx={{
        ...viewerOpaqueSurfaceSx,
        mb: 2,
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
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
            sx={viewerFocusSx}
          >
            {labels.output}
          </Button>
          {calendarAction && (
            <Button
              type="button"
              variant="outlined"
              onClick={(event) => calendarAction(event.currentTarget)}
              sx={viewerFocusSx}
            >
              {calendarActionLabel(language)}
            </Button>
          )}
          <ViewerFilterSelect
            id="semantic-diff-explorer-filter"
            label={labels.filter}
            value={filter}
            options={[
              { value: "all", label: labels.all },
              {
                value: "confirmation-required",
                label: labels.confirmationRequired,
              },
            ]}
            menuHeading={labels.filter}
            triggerRef={filterRef}
            onChange={handleFilterChange}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default SemanticDiffExplorerHeader;
