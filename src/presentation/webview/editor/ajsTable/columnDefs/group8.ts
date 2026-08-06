import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { UnitInformationColumnGroupLabels } from "../../unitInformationLocalization";
import type { TableRowView } from "../tableViewerData";
import { nestedColumnGroup } from "./common";

const group8 = (
  columnHelper: ColumnHelper<TableRowView>,
  labels: UnitInformationColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, TableRowView>,
): GroupColumnDef<TableRowView, unknown> =>
  nestedColumnGroup({
    columnHelper,
    id: "group8", //Jobnet connector definition information
    labels,
    rowViewByPath,
    selectors: [(rowView) => rowView?.group8.nestedConnectorRelease],
  });

export default group8;
