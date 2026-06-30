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

type UnitListColumn = Column<UnitListRowView, unknown>;
type ToggleColumnVisibilityParams = {
  column: UnitListColumn;
  table: ReactTable<UnitListRowView>;
  visible: boolean;
};

export const getVisibleColumnSelectorColumns = (
  table: ReactTable<UnitListRowView>,
): UnitListColumn[] =>
  table.getAllColumns().filter((col) => col.columnDef.enableHiding);

const getColumnLabel = (column: UnitListColumn): string =>
  column.columnDef.header as string;

const getHideableSubColumns = (column: UnitListColumn): UnitListColumn[] =>
  column.columns.filter((col) => col.columnDef.enableHiding);

const hasNestedColumnGroup = (column: UnitListColumn): boolean =>
  column.columns.length > 1;

const getLeafColumnIds = (column: UnitListColumn): string[] =>
  column.getLeafColumns().map((leafColumn) => leafColumn.id);

export const createColumnVisibilityUpdate = (
  columnIds: readonly string[],
  visible: boolean,
): VisibilityState =>
  Object.fromEntries(columnIds.map((columnId) => [columnId, visible]));

const toggleColumnVisibility = ({
  column,
  table,
  visible,
}: ToggleColumnVisibilityParams) => {
  const nextVisibility = createColumnVisibilityUpdate(
    getLeafColumnIds(column),
    visible,
  );
  table.setColumnVisibility((current) => ({
    ...current,
    ...nextVisibility,
  }));
};

const isAnyLeafColumnVisible = (column: UnitListColumn): boolean =>
  column.getLeafColumns().some((col) => col.getIsVisible());

const ColumnSwitch: FC<{
  column: UnitListColumn;
  label: string;
  table: ReactTable<UnitListRowView>;
}> = ({ column, label, table }) => {
  const handleChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    toggleColumnVisibility({ column, table, visible: checked });
  };

  return (
    <FormControlLabel
      control={
        <Switch
          size="small"
          onChange={handleChange}
          checked={isAnyLeafColumnVisible(column)}
        />
      }
      label={<Typography variant="body2">{label}</Typography>}
      sx={{ width: "100%" }}
    />
  );
};

const ColumnSwitchItem: FC<{
  column: UnitListColumn;
  table: ReactTable<UnitListRowView>;
}> = ({ column, table }) => (
  <ListItem dense>
    <ColumnSwitch
      column={column}
      label={getColumnLabel(column)}
      table={table}
    />
  </ListItem>
);

const NestedColumnGroup: FC<{
  column: UnitListColumn;
  table: ReactTable<UnitListRowView>;
}> = ({ column, table }) => (
  <>
    <Divider sx={{ marginTop: "0.5em" }}>
      <Typography variant="body2">{getColumnLabel(column)}</Typography>
    </Divider>
    <List sx={{ marginLeft: "0.5em" }}>
      {getHideableSubColumns(column).map((leafColumn) => (
        <ColumnSwitchItem
          key={leafColumn.id}
          column={leafColumn}
          table={table}
        />
      ))}
    </List>
  </>
);

const ColumnDetailItem: FC<{
  column: UnitListColumn;
  table: ReactTable<UnitListRowView>;
}> = ({ column, table }) =>
  hasNestedColumnGroup(column) ? (
    <NestedColumnGroup column={column} table={table} />
  ) : (
    <ColumnSwitchItem column={column} table={table} />
  );

const ColumnDetail: FC<{
  column: UnitListColumn;
  table: ReactTable<UnitListRowView>;
}> = ({ column, table }) => {
  const subColumns = getHideableSubColumns(column);

  if (!subColumns.length) return null;

  return (
    <List sx={{ marginLeft: "0.5em" }}>
      {subColumns.map((subColumn) => (
        <Fragment key={subColumn.id}>
          <ColumnDetailItem column={subColumn} table={table} />
        </Fragment>
      ))}
    </List>
  );
};

const ColumnAccordion: FC<{
  column: UnitListColumn;
  table: ReactTable<UnitListRowView>;
}> = ({ column, table }) => (
  <Accordion disableGutters>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Switch
        size="small"
        onClick={(e) => e.stopPropagation()}
        onChange={(_event, checked) =>
          toggleColumnVisibility({ column, table, visible: checked })
        }
        checked={isAnyLeafColumnVisible(column)}
      />
      <Divider
        orientation="vertical"
        flexItem
        sx={{ marginLeft: "0.5em", marginRight: "0.5em" }}
      />
      <Typography variant="body2">{getColumnLabel(column)}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <ColumnDetail column={column} table={table} />
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
          <ColumnAccordion key={column.id} column={column} table={table} />
        ))}
      </Box>
    </Popover>
  );
};

export default memo(DisplayColumnSelector);
