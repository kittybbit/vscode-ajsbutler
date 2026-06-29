import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";
import { nestedColumnGroup } from "./common";

const group17 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  const passingInformationLabels = labels.subgroup(1);

  return columnHelper.group({
    id: "group17", //Tool unit definition information
    header: labels.label,
    columns: [
      nestedColumnGroup({
        columnHelper,
        id: "group17.group1",
        labels: passingInformationLabels,
        rowViewByPath,
        selectors: [
          (view) => view?.group17.toolParameters,
          (view) => view?.group17.toolEnvironment,
        ],
      }),
    ],
  });
};

export default group17;
