import { MutableRefObject, useCallback } from "react";
import type { Row } from "@tanstack/table-core";
import type { TableRowView } from "./tableViewerData";
import { parseNavigationRequest } from "../../../../application/navigation/resolveNavigationTarget";

export type TableRowRevealState = {
  handleJump: (id: string) => void;
  revealPath: (absolutePath: string) => void;
  revealUnit: (data: unknown) => boolean;
};

type TableRowRevealContext = {
  rows: ReadonlyArray<Row<TableRowView>>;
  selectRow: (absolutePath: string) => void;
  requestFocus?: (absolutePath: string) => void;
};

const buildRowByIdentity = (
  rows: ReadonlyArray<Row<TableRowView>>,
): Map<string, Row<TableRowView>> => {
  const map = new Map<string, Row<TableRowView>>();
  rows.forEach((row) => {
    map.set(row.original.id, row);
    map.set(row.original.absolutePath, row);
  });
  return map;
};

const buildRowIndexByIdentity = (
  rows: ReadonlyArray<Row<TableRowView>>,
): Map<string, number> => {
  const map = new Map<string, number>();
  rows.forEach((row, index) => {
    map.set(row.original.id, index);
    map.set(row.original.absolutePath, index);
  });
  return map;
};

export const findRowIndexByIdentity = (
  rows: ReadonlyArray<Row<TableRowView>>,
  identity: string | undefined,
): number | undefined => {
  return identity ? buildRowIndexByIdentity(rows).get(identity) : undefined;
};

const selectResolvedRow = (
  identity: string,
  { rows, selectRow, requestFocus }: TableRowRevealContext,
): boolean => {
  const row = buildRowByIdentity(rows).get(identity);
  if (row) {
    selectRow(row.original.absolutePath);
    requestFocus?.(row.original.absolutePath);
    return true;
  }
  return false;
};

export const revealTableRow = (
  data: unknown,
  context: TableRowRevealContext,
): boolean => {
  const result = parseNavigationRequest(data);
  return result.status === "available"
    ? selectResolvedRow(result.request.absolutePath, context)
    : false;
};

export const useTableRowRevealState = (
  selectRow: (absolutePath: string) => void,
  rowsRef: MutableRefObject<ReadonlyArray<Row<TableRowView>>>,
  requestFocus?: (absolutePath: string) => void,
): TableRowRevealState => {
  const handleJump = useCallback(
    (id: string) => {
      selectResolvedRow(id, {
        rows: rowsRef.current,
        selectRow,
        requestFocus,
      });
    },
    [requestFocus, rowsRef, selectRow],
  );
  const revealPath = useCallback(
    (absolutePath: string) => {
      selectResolvedRow(absolutePath, {
        rows: rowsRef.current,
        selectRow,
        requestFocus,
      });
    },
    [requestFocus, rowsRef, selectRow],
  );

  const revealUnit = useCallback(
    (data: unknown): boolean =>
      revealTableRow(data, {
        rows: rowsRef.current,
        selectRow,
        requestFocus,
      }),
    [requestFocus, rowsRef, selectRow],
  );

  return { handleJump, revealPath, revealUnit };
};
