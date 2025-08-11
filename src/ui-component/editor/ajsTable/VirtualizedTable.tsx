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
import {
  Paper,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  useTheme,
} from "@mui/material";
import TableHeader from "./TableHeader";
import { UnitEntity } from "../../../domain/models/units/UnitEntities";
import { MyAppResource } from "../MyContexts";

type VirtualizedTableProps = {
  headerGroups: HeaderGroup<UnitEntity>[];
  rows: Row<UnitEntity>[];
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
  TableRow: (props: ItemProps<Row<UnitEntity>>) => (
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
    (index: number, data: Row<UnitEntity>) =>
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
            width: `calc(100vw - 2em)`,
            height: `calc(100vh - ${toolbarHeight}px - 2em)`,
            maxHeight: `calc(100vh - ${toolbarHeight}px - 2em)`,
          }
        : {
            width: `calc(100vw - 2em)`,
            height: "auto",
            maxHeight: "none",
            overflow: "visible",
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
