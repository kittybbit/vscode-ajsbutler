import React, { FC, Fragment, memo, useMemo } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {
  Column,
  Table as ReactTable,
  VisibilityState,
} from "@tanstack/table-core";
import CloseIcon from "@mui/icons-material/Close";
import ToggleOff from "@mui/icons-material/ToggleOff";
import ToggleOn from "@mui/icons-material/ToggleOn";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Switch from "@mui/material/Switch";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import { useMyAppContext } from "../MyContexts";
import { localeMap } from "../../../../domain/services/i18n/nls";

type DisplayColumnSelectorProps = {
  table: ReactTable<UnitListRowView>;
  columnVisibility: VisibilityState;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: VoidFunction;
};

export const getVisibleColumnSelectorColumns = (
  table: ReactTable<UnitListRowView>,
): Column<UnitListRowView, unknown>[] =>
  table.getAllColumns().filter((col) => col.columnDef.enableHiding);

const ColumnSwitch: FC<{
  column: Column<UnitListRowView, unknown>;
  label: string;
}> = ({ column, label }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    column
      .getLeafColumns()
      .forEach((col) => col.getToggleVisibilityHandler()(event));
  };

  const isChecked = column.getLeafColumns().some((col) => col.getIsVisible());

  return (
    <FormControlLabel
      control={
        <Switch size="small" onChange={handleChange} checked={isChecked} />
      }
      label={<Typography variant="body2">{label}</Typography>}
      sx={{ width: "100%" }}
    />
  );
};

const ColumnDetail: FC<{ column: Column<UnitListRowView, unknown> }> = ({
  column,
}) => {
  const subColumns = column.columns.filter((col) => col.columnDef.enableHiding);

  if (!subColumns.length) return null;

  return (
    <List sx={{ marginLeft: "0.5em" }}>
      {subColumns.map((subColumn) => (
        <Fragment key={subColumn.id}>
          {subColumn.columns.length > 1 ? (
            <>
              <Divider sx={{ marginTop: "0.5em" }}>
                <Typography variant="body2">
                  {subColumn.columnDef.header as string}
                </Typography>
              </Divider>
              <List sx={{ marginLeft: "0.5em" }}>
                {subColumn.columns
                  .filter((col) => col.columnDef.enableHiding)
                  .map((leafColumn) => (
                    <ListItem key={leafColumn.id} dense>
                      <ColumnSwitch
                        column={leafColumn}
                        label={leafColumn.columnDef.header as string}
                      />
                    </ListItem>
                  ))}
              </List>
            </>
          ) : (
            <ListItem dense>
              <ColumnSwitch
                column={subColumn}
                label={subColumn.columnDef.header as string}
              />
            </ListItem>
          )}
        </Fragment>
      ))}
    </List>
  );
};

const ColumnAccordion: FC<{ column: Column<UnitListRowView, unknown> }> = ({
  column,
}) => (
  <Accordion disableGutters>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Switch
        size="small"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) =>
          column
            .getLeafColumns()
            .forEach((col) => col.getToggleVisibilityHandler()(e))
        }
        checked={column.getLeafColumns().some((col) => col.getIsVisible())}
      />
      <Divider
        orientation="vertical"
        flexItem
        sx={{ marginLeft: "0.5em", marginRight: "0.5em" }}
      />
      <Typography variant="body2">
        {column.columnDef.header as string}
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <ColumnDetail column={column} />
    </AccordionDetails>
  </Accordion>
);

const DisplayColumnSelector: FC<DisplayColumnSelectorProps> = ({
  table,
  columnVisibility,
  anchorEl,
  open,
  onClose,
}) => {
  console.log("render DisplayColumnSelector.");
  const { lang } = useMyAppContext();

  const visibleColumns = useMemo(
    () => getVisibleColumnSelectorColumns(table),
    [columnVisibility, table],
  );

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      transformOrigin={{ horizontal: "left", vertical: "top" }}
      slotProps={{
        paper: {
          sx: {
            width: 380,
            maxWidth: "calc(100vw - 2rem)",
            maxHeight: "calc(100vh - 5rem)",
            overflow: "hidden",
            borderRadius: 3,
          },
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          paddingX: 1.5,
          paddingY: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, letterSpacing: "0.08em", marginRight: "auto" }}
        >
          COLUMNS
        </Typography>
        <Tooltip
          arrow
          title={localeMap("table.columnSelectSidebar.invisibleAll", lang)}
        >
          <IconButton
            aria-label={localeMap(
              "table.columnSelectSidebar.invisibleAll",
              lang,
            )}
            size="small"
            onClick={() => table.toggleAllColumnsVisible(false)}
          >
            <ToggleOff fontSize="small" color="disabled" />
          </IconButton>
        </Tooltip>
        <Tooltip
          arrow
          title={localeMap("table.columnSelectSidebar.visibleAll", lang)}
        >
          <IconButton
            aria-label={localeMap("table.columnSelectSidebar.visibleAll", lang)}
            size="small"
            onClick={() => table.toggleAllColumnsVisible(true)}
          >
            <ToggleOn fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
        <IconButton
          aria-label="Close column selector"
          size="small"
          onClick={onClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Box sx={{ maxHeight: "calc(100vh - 9rem)", overflow: "auto" }}>
        {visibleColumns.map((column) => (
          <ColumnAccordion key={column.id} column={column} />
        ))}
      </Box>
    </Popover>
  );
};

export default memo(DisplayColumnSelector);
