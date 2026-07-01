import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";
import { nestedColumnGroup } from "./common";

const group9 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> =>
  nestedColumnGroup({
    columnHelper,
    id: "group9", //Start-condition definition information
    labels,
    rowViewByPath,
    selectors: [(rowView) => rowView?.group9.startCondition],
  });

export default group9;
