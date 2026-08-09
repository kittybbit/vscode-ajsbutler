import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { UnitInformationColumnGroupLabels } from "../../unitInformationLocalization";
import type { TableRowView } from "../tableViewerData";
import { nestedColumnGroup } from "./common";

const group9 = (
  columnHelper: ColumnHelper<TableRowView>,
  labels: UnitInformationColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, TableRowView>,
): GroupColumnDef<TableRowView, unknown> =>
  nestedColumnGroup({
    columnHelper,
    id: "group9", //Start-condition definition information
    labels,
    rowViewByPath,
    selectors: [(rowView) => rowView?.group9.startCondition],
  });

export default group9;
