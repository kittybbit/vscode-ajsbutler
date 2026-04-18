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
import { useTheme } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import { UnitListRowView } from "../../../application/unit-list/buildUnitListView";
import TableHeader from "./TableHeader";
import type { MyAppResource } from "../../../shared/MyAppResource";

type VirtualizedTableProps = {
  headerGroups: HeaderGroup<UnitListRowView>[];
  rows: Row<UnitListRowView>[];
  scrollType: MyAppResource["scrollType"];
  rowIndex?: number;
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

const createTableComponents = (scrollType: string, rowIndex?: number) => ({
  Scroller:
    scrollType === "table"
      ? React.forwardRef<HTMLDivElement>(function scroller(props, ref) {
          return (
            <TableContainer
              {...props}
              ref={ref}
              component={Paper}
              elevation={3}
            />
          );
        })
      : React.forwardRef<HTMLDivElement>(function scroller(props, ref) {
          return <TableContainer {...props} ref={ref} />;
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
  TableRow: (props: ItemProps<Row<UnitListRowView>>) => (
    <TableRow
      {...props}
      hover={true}
      selected={props["data-index"] === rowIndex}
    />
  ),
});

const VirtualizedTable: FC<VirtualizedTableProps> = ({
  headerGroups,
  rows,
  scrollType,
  rowIndex,
}) => {
  console.log("render VirtualizedTable.");

  const theme = useTheme();

  const tableComponents = useMemo(
    () => createTableComponents(scrollType, rowIndex),
    [scrollType, rowIndex],
  );

  const virtuosoRef = useRef<TableVirtuosoHandle>(null);

  const itemContent = useCallback(
    (index: number, data: Row<UnitListRowView>) =>
      data.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} sx={styleTableCell}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      )),
    [styleTableCell],
  );

  const fixedHeaderContent = useCallback(
    () =>
      headerGroups.map((headerGroup) => (
        <TableHeader key={headerGroup.id} headerGroup={headerGroup} />
      )),
    [headerGroups],
  );

  const toolbarHeight = theme.mixins.toolbar.minHeight;

  const virtuosoStyle = useMemo(
    () =>
      scrollType === "table"
        ? {
            width: "100%",
            minWidth: 0,
            height: `calc(100vh - ${toolbarHeight}px - 2em)`,
            maxHeight: `calc(100vh - ${toolbarHeight}px - 2em)`,
            boxSizing: "border-box" as const,
          }
        : {
            width: "100%",
            minWidth: 0,
            height: "auto",
            maxHeight: "none",
            overflow: "visible",
            boxSizing: "border-box" as const,
          },
    [scrollType, toolbarHeight],
  );

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
        useWindowScroll={scrollType === "window"}
        data={rows}
        components={tableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={itemContent}
      />
    </>
  );
};
export default memo(VirtualizedTable);
