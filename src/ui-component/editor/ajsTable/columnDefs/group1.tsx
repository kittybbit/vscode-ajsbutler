import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import * as ty from "@resource/i18n/ty";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import Link from "@mui/material/Link";
import React from "react";

const group1 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  tyDefinition: typeof ty.en,
  handleJump: (id: string) => void,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> =>
  columnHelper.group({
    id: "group1", //Unit definition information
    header: ajsTableColumnHeader["group1"],
    columns: [
      {
        id: "group1.col1",
        header: ajsTableColumnHeader["group1.col1"],
        accessorFn: (row) => rowViewByPath.get(row.absolutePath)?.group1.name,
      },
      {
        id: "group1.col2",
        header: ajsTableColumnHeader["group1.col2"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group1.parentAbsolutePath ?? "/",
        cell: (props) => {
          const group1 = rowViewByPath.get(
            props.row.original.absolutePath,
          )?.group1;
          return group1?.parentId ? (
            <Link
              key={0}
              sx={{
                display: "block",
                cursor: "pointer",
              }}
              onClick={() => handleJump(group1.parentId!)}
            >
              {group1.parentAbsolutePath}
            </Link>
          ) : (
            "/"
          );
        },
      },
      {
        id: "group1.col3",
        header: ajsTableColumnHeader["group1.col3"],
        accessorFn: (row) => {
          const group1 = rowViewByPath.get(row.absolutePath)?.group1;
          if (!group1) {
            return undefined;
          }
          if (group1.unitType === "g") {
            return group1.groupType === "p"
              ? tyDefinition["g"]["gty"]["p"]
              : tyDefinition["g"]["gty"]["n"];
          }
          return tyDefinition[group1.unitType].name;
        },
      },
      {
        id: "group1.col4",
        header: ajsTableColumnHeader["group1.col4"],
        accessorFn: (row) => rowViewByPath.get(row.absolutePath)?.group1.cty,
      },
      {
        id: "group1.col5",
        header: ajsTableColumnHeader["group1.col5"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group1.layoutHv,
      },
      {
        id: "group1.col6",
        header: ajsTableColumnHeader["group1.col6"],
        accessorFn: (row) => rowViewByPath.get(row.absolutePath)?.group1.size,
      },
    ],
  });

export default group1;
