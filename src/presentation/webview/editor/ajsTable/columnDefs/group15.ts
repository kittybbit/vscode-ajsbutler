import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";
import { labeledRowViewColumns, nestedColumnGroup } from "./common";

const group15 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  const termination1Labels = labels.subgroup(1);
  const termination2Labels = labels.subgroup(2);
  const termination3Labels = labels.subgroup(3);
  const termination4Labels = labels.subgroup(4);

  return columnHelper.group({
    id: "group15", //Job common attribute information
    header: labels.label,
    columns: [
      ...labeledRowViewColumns({
        idPrefix: "group15",
        labels,
        rowViewByPath,
        selectors: [
          (view) => view?.group15.executionUser,
          (view) => view?.group15.executionTimeMonitor,
          (view) => view?.group15.fileDescriptor,
          (view) => view?.group15.jobType,
        ],
      }),
      nestedColumnGroup({
        columnHelper,
        id: "group15.group1",
        labels: termination1Labels,
        rowViewByPath,
        selectors: [
          (view) => view?.group15.terminationStatus1,
          (view) => view?.group15.terminationDelay1,
          (view) => view?.group15.terminationOperation1,
        ],
      }),
      nestedColumnGroup({
        columnHelper,
        id: "group15.group2",
        labels: termination2Labels,
        rowViewByPath,
        selectors: [
          (view) => view?.group15.terminationStatus2,
          (view) => view?.group15.terminationDelay2,
          (view) => view?.group15.terminationOperation2,
        ],
      }),
      nestedColumnGroup({
        columnHelper,
        id: "group15.group3",
        labels: termination3Labels,
        rowViewByPath,
        selectors: [
          (view) => view?.group15.terminationStatus3,
          (view) => view?.group15.terminationDelay3,
          (view) => view?.group15.terminationOperation3,
        ],
      }),
      nestedColumnGroup({
        columnHelper,
        id: "group15.group4",
        labels: termination4Labels,
        rowViewByPath,
        selectors: [
          (view) => view?.group15.terminationStatus4,
          (view) => view?.group15.terminationDelay4,
          (view) => view?.group15.terminationOperation4,
        ],
      }),
    ],
  });
};

export default group15;
