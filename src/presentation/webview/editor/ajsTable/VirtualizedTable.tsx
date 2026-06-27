import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { flexRender, HeaderGroup, Row } from "@tanstack/react-table";
import { ItemProps, TableVirtuoso, TableVirtuosoHandle } from "react-virtuoso";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { SxProps, Theme } from "@mui/material/styles";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import TableHeader from "./TableHeader";
import type { AjsTableSearchState } from "./TableContents";
import { AccessorType } from "./columnDefs/common";
import { isAjsTableSearchHit } from "./globalFilter";
import {
  handleSelectTableRow,
  handleSelectTableRowKeyDown,
  isTableRowSelected,
} from "./navigation";

type VirtualizedTableProps = {
  headerGroups: HeaderGroup<UnitListRowView>[];
  rows: Row<UnitListRowView>[];
  rowIndex?: number;
  searchState: AjsTableSearchState;
  selectedAbsolutePath?: string;
  selectRow: (absolutePath: string) => void;
};

const styleTableCell: SxProps<Theme> = {
  whiteSpace: "nowrap",
  verticalAlign: "top",
  "&:first-child": {
    position: "sticky",
    left: 0,
    backgroundColor: (theme) => theme.palette.background.default,
  },
};

export const getFixedTableVirtuosoStyle = () => ({
  width: "100%",
  minWidth: 0,
  height: "100%",
  maxHeight: "100%",
  boxSizing: "border-box" as const,
});

const createTableComponents = (
  selectRow: (absolutePath: string) => void,
  selectedAbsolutePath?: string,
  rowIndex?: number,
) => ({
  Scroller: React.forwardRef<HTMLDivElement>(function scroller(props, ref) {
    return (
      <TableContainer {...props} ref={ref} component={Paper} elevation={3} />
    );
  }),
  Table: (props: object) => <Table {...props} size="small" stickyHeader />,
  TableHead: React.forwardRef<HTMLTableSectionElement>(
    function tableHead(props, ref) {
      return <TableHead {...props} ref={ref} />;
    },
  ),
  TableBody: React.forwardRef<HTMLTableSectionElement>(
    function tableBody(props, ref) {
      return <TableBody {...props} ref={ref} />;
    },
  ),
  TableRow: (props: ItemProps<Row<UnitListRowView>>) => {
    const absolutePath = props.item.original.absolutePath;
    return (
      <TableRow
        {...props}
        hover={true}
        tabIndex={0}
        selected={isTableRowSelected(
          absolutePath,
          selectedAbsolutePath,
          props["data-index"],
          rowIndex,
        )}
        onClick={handleSelectTableRow(absolutePath, selectRow)}
        onKeyDown={handleSelectTableRowKeyDown(absolutePath, selectRow)}
      />
    );
  },
});

const VirtualizedTable: FC<VirtualizedTableProps> = ({
  headerGroups,
  rows,
  rowIndex,
  searchState,
  selectedAbsolutePath,
  selectRow,
}) => {
  console.log("render VirtualizedTable.");

  const tableComponents = useMemo(
    () => createTableComponents(selectRow, selectedAbsolutePath, rowIndex),
    [selectRow, selectedAbsolutePath, rowIndex],
  );

  const virtuosoRef = useRef<TableVirtuosoHandle>(null);

  const itemContent = useCallback(
    (index: number, data: Row<UnitListRowView>) =>
      data.getVisibleCells().map((cell) => {
        const parameters =
          searchState.parameterSearchValuesByPath.get(
            data.original.absolutePath,
          ) ?? [];
        const isSearchHit = isAjsTableSearchHit(
          cell.getValue<AccessorType | undefined>(),
          parameters,
          searchState.query,
        );
        return (
          <TableCell
            key={cell.id}
            sx={[
              styleTableCell,
              isSearchHit && {
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 214, 102, 0.24)"
                    : "rgba(255, 214, 102, 0.36)",
              },
            ]}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      }),
    [searchState],
  );

  const fixedHeaderContent = useCallback(
    () =>
      headerGroups.map((headerGroup) => (
        <TableHeader key={headerGroup.id} headerGroup={headerGroup} />
      )),
    [headerGroups],
  );

  const virtuosoStyle = useMemo(() => getFixedTableVirtuosoStyle(), []);

  useEffect(() => {
    if (rowIndex !== undefined) {
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: rowIndex,
          align: "center", // 'start' | 'center' | 'end'
          behavior: "smooth", // 'auto' | 'smooth'
        });
      }, 0);
    }
  }, [rowIndex]);

  return (
    <>
      <TableVirtuoso
        ref={virtuosoRef}
        style={virtuosoStyle}
        data={rows}
        components={tableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={itemContent}
      />
    </>
  );
};
export default memo(VirtualizedTable);
