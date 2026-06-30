import { MutableRefObject, useCallback } from "react";
import type { Row } from "@tanstack/table-core";
import type { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import { getRevealUnitAbsolutePath } from "../revealUnit";

export type TableRowRevealState = {
  handleJump: (id: string) => void;
  revealPath: (absolutePath: string) => void;
  revealUnit: (data: unknown) => void;
};

type TableRowRevealContext = {
  rows: ReadonlyArray<Row<UnitListRowView>>;
  selectRow: (absolutePath: string) => void;
};

const buildRowByIdentity = (
  rows: ReadonlyArray<Row<UnitListRowView>>,
): Map<string, Row<UnitListRowView>> => {
  const map = new Map<string, Row<UnitListRowView>>();
  rows.forEach((row) => {
    map.set(row.original.id, row);
    map.set(row.original.absolutePath, row);
  });
  return map;
};

const buildRowIndexByIdentity = (
  rows: ReadonlyArray<Row<UnitListRowView>>,
): Map<string, number> => {
  const map = new Map<string, number>();
  rows.forEach((row, index) => {
    map.set(row.original.id, index);
    map.set(row.original.absolutePath, index);
  });
  return map;
};

export const findRowIndexByIdentity = (
  rows: ReadonlyArray<Row<UnitListRowView>>,
  identity: string | undefined,
): number | undefined => {
  return identity ? buildRowIndexByIdentity(rows).get(identity) : undefined;
};

const selectResolvedRow = (
  identity: string,
  { rows, selectRow }: TableRowRevealContext,
) => {
  const row = buildRowByIdentity(rows).get(identity);
  if (row) {
    selectRow(row.original.absolutePath);
  }
};

const revealTableRow = (data: unknown, context: TableRowRevealContext) => {
  const absolutePath = getRevealUnitAbsolutePath(data);
  if (absolutePath) {
    selectResolvedRow(absolutePath, context);
  }
};

export const useTableRowRevealState = (
  selectRow: (absolutePath: string) => void,
  rowsRef: MutableRefObject<ReadonlyArray<Row<UnitListRowView>>>,
): TableRowRevealState => {
  const handleJump = useCallback(
    (id: string) => {
      selectResolvedRow(id, { rows: rowsRef.current, selectRow });
    },
    [rowsRef, selectRow],
  );
  const revealPath = useCallback(
    (absolutePath: string) => {
      selectResolvedRow(absolutePath, { rows: rowsRef.current, selectRow });
    },
    [rowsRef, selectRow],
  );

  const revealUnit = useCallback(
    (data: unknown) => {
      revealTableRow(data, {
        rows: rowsRef.current,
        selectRow,
      });
    },
    [rowsRef, selectRow],
  );

  return { handleJump, revealPath, revealUnit };
};
