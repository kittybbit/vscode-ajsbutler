import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import type { Row } from "@tanstack/table-core";
import type { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import { getRevealUnitAbsolutePath } from "../revealUnit";

export type TableRowRevealState = {
  rowIndex: number | undefined;
  handleJump: (id: string) => void;
  revealPath: (absolutePath: string) => void;
  revealUnit: (data: unknown) => void;
};

type TableRowRevealContext = {
  rows: ReadonlyArray<Row<UnitListRowView>>;
  setRowIndex: Dispatch<SetStateAction<number | undefined>>;
  selectRow: (absolutePath: string) => void;
};

const buildRowIndexMap = (
  rows: ReadonlyArray<Row<UnitListRowView>>,
): Map<string, number> => {
  const map = new Map<string, number>();
  rows.forEach((row, index) => {
    map.set(row.original.id, index);
    map.set(row.original.absolutePath, index);
  });
  return map;
};

const jumpToIndexedRow = (
  id: string,
  { rows, setRowIndex }: Pick<TableRowRevealContext, "rows" | "setRowIndex">,
) => {
  const index = buildRowIndexMap(rows).get(id);
  if (index !== undefined) {
    setRowIndex(index);
  }
};

const revealTableRow = (data: unknown, context: TableRowRevealContext) => {
  const absolutePath = getRevealUnitAbsolutePath(data);
  if (absolutePath) {
    jumpToIndexedRow(absolutePath, context);
    context.selectRow(absolutePath);
  }
};

export const useTableRowRevealState = (
  selectRow: (absolutePath: string) => void,
  rowsRef: MutableRefObject<ReadonlyArray<Row<UnitListRowView>>>,
): TableRowRevealState => {
  const [rowIndex, setRowIndex] = useState<number | undefined>(undefined);

  const handleJump = useCallback(
    (id: string) => {
      jumpToIndexedRow(id, { rows: rowsRef.current, setRowIndex });
    },
    [rowsRef],
  );
  const revealPath = useCallback(
    (absolutePath: string) => {
      jumpToIndexedRow(absolutePath, { rows: rowsRef.current, setRowIndex });
      selectRow(absolutePath);
    },
    [rowsRef, selectRow],
  );

  const revealUnit = useCallback(
    (data: unknown) => {
      revealTableRow(data, {
        rows: rowsRef.current,
        selectRow,
        setRowIndex,
      });
    },
    [rowsRef, selectRow],
  );

  return { rowIndex, handleJump, revealPath, revealUnit };
};
